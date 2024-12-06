
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
from configparser import ConfigParser
import logging
from kafka.admin import KafkaAdminClient, NewTopic
import time

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_kafka_topic_exists(bootstrap_servers, topic_name):
    admin_client = KafkaAdminClient(bootstrap_servers=bootstrap_servers)
    topic_list = admin_client.list_topics()
    admin_client.close()
    return topic_name in topic_list

def save_to_postgres_table(current_df, epoch_id, postgres_table_name):
    print("Inside save_to_postgres_table function")
    print(f"Printing epoch_id: {epoch_id}")
    print(f"Printing postgres_table_name: {postgres_table_name}")
    
    # Handle NULL values in columns that cannot be NULL
    if "card_type" in current_df.columns:
        current_df = current_df.na.fill({"card_type": "Unknown"})
    
    if "country" in current_df.columns:
        current_df = current_df.na.fill({"country": "Unknown"})
    
    # Adding batch number column
    current_df = current_df.withColumn("batch_no", lit(epoch_id))
    
    # Write to PostgreSQL
    current_df.write.jdbc(
        url=postgres_jdbc_url, 
        table=postgres_table_name, 
        mode='append', 
        properties=db_properties
    )
    print("Exit out of save_to_postgres_table function")
try:
    # Loading Kafka Cluster/Server details from configuration file
    conf_file_path = "host_spark_config.conf"
    config_obj = ConfigParser()
    config_obj.read(conf_file_path)

    # Kafka Cluster/Server Details
    kafka_host_name = config_obj.get('kafka', 'host')
    kafka_port_no = config_obj.get('kafka', 'port_no')
    input_kafka_topic_name = config_obj.get('kafka', 'input_topic_name')
    output_kafka_topic_name = config_obj.get('kafka', 'output_topic_name')
    kafka_bootstrap_servers = kafka_host_name + ':' + kafka_port_no

    # PostgreSQL Database Server Details
    postgres_host_name = config_obj.get('postgres', 'host')
    postgres_port_no = config_obj.get('postgres', 'port_no')
    postgres_user_name = config_obj.get('postgres', 'username')
    postgres_password = config_obj.get('postgres', 'password')
    postgres_database_name = config_obj.get('postgres', 'db_name')
    postgres_driver = config_obj.get('postgres', 'driver')

    postgres_salesbycardtype_table_name = config_obj.get('postgres', 'postgres_salesbycardtype_tabel')
    postgres_salesbycountry_table_name = config_obj.get('postgres', 'postgres_salesbycountry_table')

    postgres_jdbc_url = f"jdbc:postgresql://{postgres_host_name}:{postgres_port_no}/{postgres_database_name}"

    db_properties = {
        'user': postgres_user_name,
        'password': postgres_password,
        'driver': postgres_driver
    }

    if __name__ == "__main__":
        print("Welcome to mydatastream !!!")
        print("RealTime Data Processing Application Started ...")
        print(time.strftime("%Y-%m-%d %H:%M:%S"))

        # Check if input Kafka topic exists
        if not check_kafka_topic_exists(kafka_bootstrap_servers, input_kafka_topic_name):
            logger.error(f"Kafka topic '{input_kafka_topic_name}' not found. Stopping the application.")
            exit(1)
        
        spark = SparkSession.builder \
            .appName("Real-Time Data Processing with Kafka Source and Message Format as JSON") \
            .getOrCreate()
            # .config("spark.driver.extraClassPath", "/opt/spark/jars/postgresql-42.2.28.jar") \

        spark.sparkContext.setLogLevel("ERROR")

        # Construct a streaming DataFrame that reads from Kafka
        orders_df = spark.readStream \
            .format("kafka") \
            .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
            .option("subscribe", input_kafka_topic_name) \
            .option("startingOffsets", "latest") \
            .load()

        orders_df1 = orders_df.selectExpr("CAST(value AS STRING)", "timestamp")

        orders_schema = StructType() \
            .add("order_id", StringType()) \
            .add("order_product_name", StringType()) \
            .add("order_card_type", StringType()) \
            .add("order_amount", StringType()) \
            .add("order_datetime", StringType()) \
            .add("order_country_name", StringType()) \
            .add("order_city_name", StringType()) \
            .add("order_ecommerce_website_name", StringType())
        
        orders_df2 = orders_df1.select(from_json(col("value"), orders_schema).alias("orders"), "timestamp")
        orders_df3 = orders_df2.select("orders.*", "timestamp")

        orders_df3 = orders_df3.withColumn("partition_date", to_date("order_datetime"))
        orders_df3 = orders_df3.withColumn("partition_hour", hour(to_timestamp("order_datetime", 'yyyy-MM-dd HH:mm:ss')))
        
        # Write raw data to HDFS
        orders_agg_write_stream_pre_hdfs = orders_df3.writeStream \
            .trigger(processingTime='10 seconds') \
            .format("parquet") \
            .option("path", "/tmp/data/ecom_data/raw") \
            .option("checkpointLocation", "orders-agg-write-stream-pre-checkpoint") \
            .partitionBy("partition_date", "partition_hour") \
            .start()

        # Aggregate by card type
        orders_df4 = orders_df3.groupBy("order_card_type") \
            .agg({'order_amount': 'sum'}) \
            .select("order_card_type", col("sum(order_amount)").alias("total_sales"))

        orders_df4 = orders_df4.withColumnRenamed("order_card_type", "card_type")
        orders_df4.writeStream \
            .trigger(processingTime='10 seconds') \
            .outputMode("update") \
            .foreachBatch(lambda current_df, epoch_id: save_to_postgres_table(current_df, epoch_id, postgres_salesbycardtype_table_name)) \
            .start()

        # Aggregate by country
        orders_df5 = orders_df3.groupBy("order_country_name") \
            .agg({'order_amount': 'sum'}) \
            .select("order_country_name", col("sum(order_amount)").alias("total_sales"))

        orders_df5 = orders_df5.withColumnRenamed("order_country_name", "country")
        orders_df5.writeStream \
            .trigger(processingTime='10 seconds') \
            .outputMode("update") \
            .foreachBatch(lambda current_df, epoch_id: save_to_postgres_table(current_df, epoch_id, postgres_salesbycountry_table_name)) \
            .start()

        # Write aggregated data to console
        orders_agg_write_stream = orders_df4.writeStream \
            .trigger(processingTime='5 seconds') \
            .outputMode("update") \
            .option("truncate", "false") \
            .format("console") \
            .start()

        orders_agg_write_stream.awaitTermination()
        print("RealTime Data Processing Application Completed.")

except Exception as e:
    logger.error("Error in processing Kafka stream", exc_info=True)
finally:
    if 'spark' in locals():
        spark.stop()


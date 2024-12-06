#!/bin/bash

SPARK_WORKLOAD=$1
/etc/init.d/ssh start
echo "SPARK_WORKLOAD: $SPARK_WORKLOAD"

# Start Spark Master
if [ "$SPARK_WORKLOAD" == "spark-master" ]; then
    echo "Starting Spark Master"
    echo "###################################################################"
    nohup spark-class org.apache.spark.deploy.master.Master --ip $SPARK_MASTER_HOST --port $SPARK_MASTER_PORT --webui-port $SPARK_MASTER_WEBUI_PORT >> output_master_sever.log 2>&1 &
    echo "waiting 10 seconds to start spark class"
    for i in {10..1}
    do
        echo "$i seconds remaining"
        sleep 1
    done 
    cat output_master_sever.log
    # nohup start-master.sh > output_master_sever.log 2>&1 &
    # start-history-server.sh
    spark-submit --packages  org.postgresql:postgresql:42.2.28,org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1,org.apache.kafka:kafka-clients:3.5.1,org.apache.spark:spark-token-provider-kafka-0-10_2.12:3.5.1 dataprocessing.py
    # tail -f /dev/null
    echo "spark is success started "
    
fi

# Start Spark Worker
if [ "$SPARK_WORKLOAD" == "spark-worker" ]; then
    # spark-class org.apache.spark.deploy.worker.Worker --webui-port $SPARK_WORKER_WEBUI_PORT $SPARK_MASTER >> $SPARK_WORKER_LOG
    echo "Starting Spark Worker"
    # $SPARK_HOME/sbin/start-worker.sh $SPARK_MASTER
    start-worker.sh $SPARK_MASTER
    # spark-submit --packages  org.postgresql:postgresql:42.2.28,org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1,org.apache.kafka:kafka-clients:3.5.1,org.apache.spark:spark-token-provider-kafka-0-10_2.12:3.5.1 test.py
    tail -f /dev/null

fi

# Start Spark History Server
# if [ "$SPARK_WORKLOAD" == "spark-history" ]; then
#     echo "Starting Spark History Server"
#     start-history-server.sh
#     tail -f /dev/null
# fi
# elif [ "$SPARK_WORKLOAD" == "submit" ];then
#     echo "SPARK SUBMIT"
# else
#     echo "Undefined Workload Type $SPARK_WORKLOAD, must specify: master, worker, submit"
# fi
# If no matching service type, exit with error
echo "Unknown service type: $SPARK_WORKLOAD"
exit 1



# HADOOP_WORKLOAD=$1

# echo "SPARK_WORKLOAD: $SPARK_WORKLOAD"

# /etc/init.d/ssh start

# if [ "$SPARK_WORKLOAD" == "master" ];
# then
#   echo "pyspark is checking "
#   pyspark --version
#   echo "pyspark is  spark-submit "
#   spark-submit --version
#   echo "pyspark is spark-shell "
#   spark-shell --version  # # create required directories
#   while ! pyspark ;
#   do
#     echo "Failed creating pyspark "
#   done
#   # echo "Created spark setup "
#   # hdfs dfs -mkdir -p /opt/hadoop/data
#   # hdfs dfs  -ls 
#   # echo "Created /opt/spark/data hdfs dir"


#   # copy the data to the data HDFS directory
#   # hdfs dfs -copyFromLocal /opt/hadoop/data/* /opt/hadoop/data
#   # hdfs dfs -ls /opt/hadoop/data

# elif [ "$SPARK_WORKLOAD" == "worker" ];
# then
#   pyspark --version


# elif [ "$SPARK_WORKLOAD" == "history" ];
# then

#   while ! pyspark;
#   do
#     echo "spark-logs doesn't exist yet... retrying"
#   done
#   # echo ""

#   # start the spark history server
#   start-history-server.sh
# fi

# tail -f /dev/null

# SalesStream dashboards

## Project Overview

<<<<<<< HEAD
The SalesStream dashboards is an application for monitoring and analyzing revenue data in real time. By leveragin the power of  Spark and  Kafka, this system ensure that financial data is processed efficiently and in a timely manner, providing companies with update insights into their revenue streams.

### Key features:

Real-time data processing:Utilizes Apache Kafka for streaming data ingestion and Apache Spark for real-time analytics.

Data integration:Supports integration with multiple data sources, including SQL databases and other data warehouses.
=======
The SalesStream dashboards is an application for monitoring and analyzing revenue data in real time. By leveraging the power of Apache Spark and Apache Kafka, this system ensures that financial data is processed efficiently and in a timely manner, providing companies with up-to-date insights into their revenue streams.

### Key features:

#### Real-time data processing:

Utilizes Apache Kafka for streaming data ingestion and Apache Spark for real-time analytics.

Data integration: Supports integration with multiple data sources, including SQL databases and other data warehouses.
>>>>>>> origin/main

Scalability: Designed for big data processing to ensure it scales as your business grows.

Visualization: Provides real-time dashboards to visualize sales trends and key financial metrics.

<<<<<<< HEAD
## Components
=======
Alerting system: Sends alerts based on pre-defined thresholds so organizations can respond quickly to anomalies or significant changes in revenue.

Components
>>>>>>> origin/main

#### Data ingestion:

Apache Kafka: Manages the ingestion of streaming data.

Kafka Connect: Facilitates data transfer from various data sources to Kafka.

#### Data Processing:

Apache Spark: Processes streaming data in real time.

Spark Structured Streaming: Provides low-latency processing and advanced analytics.

#### Data Storage:

HDFS: Stores raw and processed data reliably.

PostgreSQL: Stores aggregated and summarized data for fast access and queries.

### Visualization:

django: Provides real-time dashboards and visualizations.

Alerting: Integrates with django to set up alerts based on financial metrics.

#### Setup and installation

##### Prerequisites:

docker-compose

Java 11

Apache Kafka

Apache Spark

Hadoop HDFS, Yarn

PostgreSQL

django

pgadmin

#### Configure Kafka:

Set up Kafka topics for data ingestion.

Update the Kafka configurations according to your requirements.

#### Configure Spark:

Modify the Spark submit scripts and configurations in host_spark_config.conf.

Start services:

Start Kafka and Zookeeper.

Deploy Spark applications with spark-submit.

#### Setup HDFS, Yarn:

Make sure HDFS and Yarn is running and accessible.

#### Database setup:

Initialize the PostgreSQL database and tables.

Update the database connection settings in your application.

#### Start the application:

<<<<<<< HEAD
Run docker compose to start all containers

Run kafka producer, consumer to 
=======
Run docker compose to start all containers 
>>>>>>> origin/main

Run Spark jobs to start processing data.

Access django dashboards to visualize sales metrics.

#### Usage:

Data ingestion: Stream data into Kafka topics using Kafka producers.

Data processing: Spark applications consume Kafka streams, process data and store the results in HDFS and PostgreSQL.

<<<<<<< HEAD
Visualization: Use django to create dashboards and monitor sales in real time.
=======
Visualization: Use django to create dashboards and monitor sales in real time.
>>>>>>> origin/main

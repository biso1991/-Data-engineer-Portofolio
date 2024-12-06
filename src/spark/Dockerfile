# Dockerfile
FROM python:3.10-bullseye as spark-base

ARG SPARK_VERSION=3.5.3
ARG HADOOP_VERSION=3.3.6
ARG SBT_VERSION=1.9.9
ARG SCALA_VERSION=2.12.8

# Install tools required by the OS
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      sudo \
      curl \
      vim \
      netcat \
      unzip \
      rsync \
      openjdk-11-jdk \
      build-essential \
      software-properties-common \
      ssh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Setup directories
ENV SPARK_HOME=${SPARK_HOME:-"/opt/spark"}
ENV SBT_HOME=${SBT_HOME:-"/opt/sbt"}
ENV SCALA_HOME=${SCALA_HOME:-"/opt/scala"}

RUN mkdir -p ${SPARK_HOME} && mkdir -p ${SBT_HOME} && mkdir -p ${SCALA_HOME} 
WORKDIR ${SPARK_HOME}

# Download and install Spark
RUN curl -L https://dlcdn.apache.org/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz -o spark-${SPARK_VERSION}-bin-hadoop3.tgz \
    && tar xvzf spark-${SPARK_VERSION}-bin-hadoop3.tgz --directory /opt/spark --strip-components 1 \
    && rm -rf spark-${SPARK_VERSION}-bin-hadoop3.tgz

# Download and install SBT
RUN curl -LO https://github.com/sbt/sbt/releases/download/v${SBT_VERSION}/sbt-${SBT_VERSION}.tgz \
    && tar xf sbt-${SBT_VERSION}.tgz --directory /opt/sbt --strip-components 1 \
    && rm sbt-${SBT_VERSION}.tgz

# Download and install Scala
RUN curl -LO https://downloads.lightbend.com/scala/${SCALA_VERSION}/scala-${SCALA_VERSION}.tgz \
    && tar xvzf scala-${SCALA_VERSION}.tgz --directory /opt/scala --strip-components=1 \
    && rm scala-${SCALA_VERSION}.tgz

# Download additional libraries
# RUN mkdir -p $SPARK_HOME/jars && \
#     curl -L https://repo1.maven.org/maven2/org/apache/spark/spark-sql-kafka-0-10_2.12/3.5.1/spark-sql-kafka-0-10_2.12-3.5.1.jar -o $SPARK_HOME/jars/spark-sql-kafka-0-10_2.12-3.5.1.jar && \
#     curl -L https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/2.8.1/kafka-clients-2.8.1.jar -o $SPARK_HOME/jars/kafka-clients-2.8.1.jar && \
#     curl -L https://jdbc.postgresql.org/download/postgresql-42.7.3.jar -o $SPARK_HOME/jars/postgresql-42.7.3.jar

COPY requirements/requirements.txt .
RUN pip3 install -r requirements.txt


FROM spark-base as pyspark


# Install Python dependencies


 

# Set environment variables
ENV JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

ENV PATH="$SPARK_HOME/sbin:$SPARK_HOME/bin:$SBT_HOME/bin:$SCALA_HOME/bin:$JAVA_HOME/bin:$PATH"
ENV SPARK_MASTER="spark://spark-master:7077"
ENV SPARK_MASTER_HOST=spark-master
ENV SPARK_WORKER_WEBUI_PORT=8081
ENV SPARK_MASTER_WEBUI_PORT=8080
ENV SPARK_MASTER_PORT=7077
ENV PYSPARK_PYTHON=python3
# ENV SPARK_HISTORY_OPTS="-Dspark.history.fs.logDirectory=hdfs://spark-master:9000/spark-logs"
ENV PYTHONPATH=$SPARK_HOME/python/:$PYTHONPATH
ENV SPARK_LOG_DIR=/opt/spark/logs 
ENV SPARK_MASTER_LOG=/opt/spark/logs/spark-master.out 
ENV SPARK_WORKER_LOG=/opt/spark/logs/spark-worker.out 
ENV SPARK_WORKER_PORT=7000
# Make Spark binaries and scripts executable
RUN chmod u+x $SPARK_HOME/sbin/* && \
    chmod u+x $SPARK_HOME/bin/*

# Copy entrypoint script
COPY spark_entrypoint.sh .
RUN chmod +x spark_entrypoint.sh
# RUN mkdir -p log/dir && mkdir -p /tmp/spark-events  && \
#     spark-shell \
#         --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1,org.apache.spark:spark-token-provider-kafka-0-10_2.12:3.5.1,org.apache.kafka:kafka-clients:3.4.1 \
#         --conf spark.eventLog.dir=/opt/spark/tmp/spark-events \
#         --conf spark.master=spark://spark-master:7077 \
# #         -i /dev/null

RUN mkdir -p $SPARK_LOG_DIR && \
    touch $SPARK_MASTER_LOG && \
    touch $SPARK_WORKER_LOG && \
    ln -sf /dev/stdout $SPARK_MASTER_LOG && \
    ln -sf /dev/stdout $SPARK_WORKER_LOG && \ 
    mkdir -p log/dir

# COPY maven_driver/* jars 
COPY test.java .
RUN mkdir -p /opt/spark/spark-events 


# Copy Spark application files
COPY spark_apps/ spark_apps/
COPY conf/spark-defaults.conf "$SPARK_HOME/conf"
COPY spark_apps/dataprocessing.py spark_apps/host_spark_config.conf  spark_apps/test.py .

RUN ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa && \
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys && \
  chmod 600 ~/.ssh/authorized_keys
  
COPY ssh_config ~/.ssh/config

# Expose ports (if needed)
EXPOSE 22

# Set entrypoint
ENTRYPOINT ["./spark_entrypoint.sh"]



# FROM python:3.10-bullseye as spark-base

# ARG SPARK_VERSION=3.5.1
# ARG HADOOP_VERSION=3.3.6
# ARG SBT_VERSION=1.9.9
# ARG SCALA_VERSION=2.12.8

# # Install tools required by the OS
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#       sudo \
#       curl \
#       vim \
#     #   htop \ 
#       netcat \
#       unzip \
#       rsync \
#       openjdk-11-jdk \
#       build-essential \
#       software-properties-common \
#       ssh && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*


# # Setup the directories for our Spark and Hadoop installations
# ENV SPARK_HOME=${SPARK_HOME:-"/opt/spark"}
# ENV SBT_HOME=${SBT_HOME:-"/opt/sbt"}
# ENV SCALA_HOME=${SCALA_HOME:-"/opt/scala"}

# RUN  mkdir -p ${SPARK_HOME} && mkdir -p ${SBT_HOME} && mkdir -p ${SCALA_HOME}
# WORKDIR ${SPARK_HOME}

# # RUN curl https://jdbc.postgresql.org/download/postgresql-42.7.3.jar -O postgresql-42.7.3.jar 

# # download jars files to connect 
# RUN wget https://repo1.maven.org/maven2/org/apache/spark/spark-sql-kafka-0-10_2.12/3.5.1/spark-sql-kafka-0-10_2.12-3.5.1.jar -P $SPARK_HOME/jars/ && \ 
#     wget https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/2.8.1/kafka-clients-2.8.1.jar -P $SPARK_HOME/jars/ && \
#     wget https://jdbc.postgresql.org/download/postgresql-42.7.3.jar -P $SPARK_HOME/jars/
# # Download and install Spark
# RUN curl https://dlcdn.apache.org/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz -o spark-${SPARK_VERSION}-bin-hadoop3.tgz \
#  && tar xvzf spark-${SPARK_VERSION}-bin-hadoop3.tgz --directory /opt/spark --strip-components 1 \
#  && rm -rf spark-${SPARK_VERSION}-bin-hadoop3.tgz

# #Download and install sbt
# RUN curl -LO https://github.com/sbt/sbt/releases/download/v${SBT_VERSION}/sbt-${SBT_VERSION}.tgz \
#     && tar xf sbt-${SBT_VERSION}.tgz --directory /opt/sbt --strip-components 1 \
#     && ls -la /opt/sbt \
#     && rm sbt-${SBT_VERSION}.tgz

# #Download and install scala        
# RUN curl -LO  https://scala-lang.org/files/archive/scala-${SCALA_VERSION}.tgz \
#     && tar xvzf scala-${SCALA_VERSION}.tgz --directory /opt/scala --strip-components=1 \
#     && ls -la /opt/scala \
#     && rm scala-${SCALA_VERSION}.tgz
 

# FROM spark-base as pyspark

# # Install python deps
# COPY requirements/requirements.txt .
# RUN pip3 install -r requirements.txt

# # Set JAVA_HOME environment variable
# ENV JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

# # Add the Spark and Hadoop sbt scala  bin and sbin to the PATH variable.
# # Also add $JAVA_HOME/bin to the PATH
# ENV PATH="$SPARK_HOME/sbin:/opt/spark/bin:${PATH}"
# ENV PATH="${PATH}:${JAVA_HOME}/bin"
# ENV PATH="$SBT_HOME/bin:${PATH}"
# ENV PATH="$SCALA_HOME/bin:${PATH}"

# # # Setup Spark related environment variables
# ENV SPARK_MASTER="spark://spark-master:7077"
# ENV SPARK_MASTER_HOST spark-master
# ENV SPARK_WORKER_WEBUI_PORT 8081
# ENV SPARK_MASTER_WEBUI_PORT 8080
# ENV SPARK_MASTER_PORT 7077
# ENV PYSPARK_PYTHON python3

# ENV SPARK_HISTORY_OPTS "-Dspark.history.fs.logDirectory=hdfs://spark-master:9000/spark-logs"

# # Make the binaries and scripts executable and set the PYTHONPATH environment variable
# RUN chmod u+x /opt/spark/sbin/* && \
#     chmod u+x /opt/spark/bin/*

# # Copy appropriate entrypoint script
# COPY spark_entrypoint.sh .
# RUN chmod +x spark_entrypoint.sh


# ENV PYTHONPATH=$SPARK_HOME/python/:$PYTHONPATH
# #ENV PYTHONPATH=$SPARK_HOME/python/lib/py4j-0.10.9.5-src.zip:$PYTHONPATH

  
# # Copy appropriate entrypoint script
# # RUN pwd 
# # COPY entrypoint_yarn.sh .
# # RUN ll entrypoint.sh
# # RUN chmod +x entrypoint_yarn.sh

# COPY spark_apps/dataprocessing.py spark_apps/host_spark_config.conf  spark_apps/test.py .



# # ENTRYPOINT ["./entrypoint_yarn.sh"]


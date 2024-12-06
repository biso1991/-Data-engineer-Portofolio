# Start with the base image
FROM python:3.10-bullseye as hadoop-base

ARG HADOOP_VERSION=3.3.6

# Install necessary packages
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
ENV HADOOP_HOME=${HADOOP_HOME:-"/opt/hadoop"}
RUN mkdir -p ${HADOOP_HOME}
WORKDIR ${HADOOP_HOME}

# Download and install Hadoop
RUN curl https://dlcdn.apache.org/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz -o hadoop-${HADOOP_VERSION}-bin.tar.gz \
    && tar xfz hadoop-${HADOOP_VERSION}-bin.tar.gz --directory /opt/hadoop --strip-components 1 \
    && rm -rf hadoop-${HADOOP_VERSION}-bin.tar.gz

FROM hadoop-base as  hadoop 

# Set JAVA_HOME environment variable
ENV JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"
ENV PATH="$HADOOP_HOME/bin:$HADOOP_HOME/sbin:${PATH}"
ENV PATH="${PATH}:${JAVA_HOME}/bin"
ENV HADOOP_MAPRED_HOME=$HADOOP_HOME
ENV HADOOP_COMMON_HOME=$HADOOP_HOME
ENV HADOOP_HDFS_HOME=$HADOOP_HOME
ENV YARN_HOME=$HADOOP_HOME
ENV HADOOP_CONF_DIR="$HADOOP_HOME/etc/hadoop"
ENV LD_LIBRARY_PATH="$HADOOP_HOME/lib/native:${LD_LIBRARY_PATH}"

# Set user for HDFS and Yarn
ENV HDFS_NAMENODE_USER="root"
ENV HDFS_DATANODE_USER="root"
ENV HDFS_SECONDARYNAMENODE_USER="root"
ENV YARN_RESOURCEMANAGER_USER="root"
ENV YARN_NODEMANAGER_USER="root"

# Add Hadoop native library path to the dynamic link library path
RUN echo "export JAVA_HOME=${JAVA_HOME}" >> "$HADOOP_HOME/etc/hadoop/hadoop-env.sh"

# Copy configuration files
COPY yarn/*.xml "$HADOOP_HOME/etc/hadoop/"

# Make the entrypoint script executable
COPY hadoop_entrypoint.sh .
RUN chmod +x hadoop_entrypoint.sh

# SSH setup
RUN ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa && \
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys && \
  chmod 600 ~/.ssh/authorized_keys
  
COPY ssh_config ~/.ssh/config

# Expose ports (if needed)
EXPOSE 22

# Set the entrypoint script
ENTRYPOINT ["./hadoop_entrypoint.sh"]


#!/bin/bash


HADOOP_WORKLOAD=$1
/etc/init.d/ssh start
echo "HADOOP_WORKLOAD: $HADOOP_WORKLOAD"

/etc/init.d/ssh start

# Namenode service setup
if [ "$HADOOP_WORKLOAD" == "namenode" ]; then
    if [ ! -d /opt/hadoop/data/nameNode ]; then
        echo "Namenode directory not found: /opt/hadoop/data/nameNode"
        exit 2
    fi

    if [ -z "$CLUSTER_NAME" ]; then
        echo "Cluster name not specified"
        exit 2
    fi

    # echo "Removing lost+found from /opt/hadoop/data/nameNode"
    # rm -r /opt/hadoop/data/nameNode/lost+found

    if [ "`ls -A /opt/hadoop/data/nameNode`" == "" ]; then
        echo "Formatting namenode directory: /opt/hadoop/data/nameNode"
        $HADOOP_HOME/bin/hdfs namenode -format $CLUSTER_NAME
    fi

    echo "Starting Namenode"
    $HADOOP_HOME/bin/hdfs namenode
    exit 0
fi

# Datanode service setup
if [ "$HADOOP_WORKLOAD" == "datanode" ]; then
    if [ ! -d /opt/hadoop/data/dataNode ]; then
        echo "Datanode data directory not found: /opt/hadoop/data/dataNode"
        exit 2
    fi

    echo "Starting Datanode"
    $HADOOP_HOME/bin/hdfs datanode
    exit 0
fi

# ResourceManager service setup
if [ "$HADOOP_WORKLOAD" == "resourcemanager" ]; then
    echo "Starting ResourceManager"
    $HADOOP_HOME/bin/yarn resourcemanager
    exit 0
fi

# NodeManager service setup
if [ "$HADOOP_WORKLOAD" == "nodemanager" ]; then
    echo "Starting NodeManager"
    $HADOOP_HOME/bin/yarn nodemanager
    exit 0
fi
# HistoryServer service setup
if [ "$HADOOP_WORKLOAD" == "historyserver" ]; then
    echo "Starting HistoryServer"
    $HADOOP_HOME/bin/mapred historyserver
    exit 0
fi

# If no matching service type, exit with error
echo "Unknown service type: $HADOOP_WORKLOAD"
exit 1
tail -f /dev/null
# HADOOP_WORKLOAD=$1

# echo "HADOOP_WORKLOAD: $HADOOP_WORKLOAD"

# /etc/init.d/ssh start

# if [ "$HADOOP_WORKLOAD" == "hadoop_master" ];
# then
#   hdfs namenode -format

#   # start the master node processes
   
#   hdfs --daemon start namenode
#   hdfs --daemon start secondarynamenode
#   yarn --daemon start resourcemanager
#   jps
#   # create required directories
#   while ! hdfs dfs -mkdir -p /hadoop-logs;
#   do
#     echo "Failed creating /hadoop-logs hdfs dir"
#   done
#   echo "Created /hadoop-logs hdfs dir"
#   hdfs dfs -mkdir -p /opt/hadoop/hadoop_data
#   # hdfs dfs  -ls 
#   echo "Created /opt/hadoop/hadoop_data hdfs dir"


#   # copy the data to the data HDFS directory
#   hdfs dfs -copyFromLocal /opt/hadoop/hadoop_data/* /opt/hadoop/hadoop_data
#   hdfs dfs -ls /opt/hadoop/hadoop_data

# elif [ "$HADOOP_WORKLOAD" == "hadoop_worker" ];
# then
#   hdfs namenode -format

#   # start the worker node processes
#   hdfs --daemon start datanode
#   yarn --daemon start nodemanager
#   jps

# elif [ "$HADOOP_WORKLOAD" == "hadoop_history" ];
# then

#   while ! hdfs dfs -test -d /hadoop-logs;
#   do
#     echo "hadoop-logs doesn't exist yet... retrying"
#     sleep 1 ;
#   done
#   echo "Exit loop"

#   # start the spark history server
#   start-history-server.sh
# fi

# tail -f /dev/null

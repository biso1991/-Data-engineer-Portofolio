

# from configparser import ConfigParser




# # Loading Kafka Cluster/Server details from configuration file

# conf_file_name = "hostkafka_config.conf"
# config_obj = ConfigParser()
# print(config_obj)
# print(config_obj.sections())
# config_read_obj = config_obj.read(conf_file_name)
# print(type(config_read_obj))
# print(config_read_obj)
# print(config_obj.sections())

# # Kafka Cluster/Server Details
# kafka_host_name = config_obj.get('kafka', 'host')
# kafka_port_no = config_obj.get('kafka', 'port_no')
# kafka_topic_name = config_obj.get('kafka', 'input_topic_name')

# KAFKA_TOPIC_NAME_CONS = kafka_topic_name
# KAFKA_BOOTSTRAP_SERVERS_CONS = kafka_host_name + ':' + kafka_port_no
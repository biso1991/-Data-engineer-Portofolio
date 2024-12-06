FROM confluentinc/cp-kafka:latest as kafka

# pip3 upgrade
RUN pip3 install --upgrade pip
RUN pip3 install kafka-python scipy==1.13.0 \
    pandas==2.2.0 beautifulsoup4 nltk==3.6.3 regex==2024.5.10\
    seaborn==0.12.1 matplotlib==3.8.3

FROM kafka as kf
RUN pip3 install pyarrow lxml
COPY .  code 

WORKDIR code 





# FROM confluentinc/cp-kafka:latest as kafka

# RUN pip3 install kafka-python
# COPY .  code 

# RUN ls -l code/

# # COPY start_kafka_topic.sh .
# # RUN ["chmod", "+x", "start_kafka_topic.sh"]
# RUN ls -l 
# RUN echo "#########################################" 
# FROM kafka as kf


# WORKDIR code 

# CMD ["./start_kafka_topic.sh"]

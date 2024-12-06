FROM python:3.8 as  py2-base
ENV PYTHONUNBUFFERED 1

# Allows docker to cache installed dependencies between builds
RUN  apt-get update
RUN pip  install --upgrade pip 
COPY ./requirements.txt  requirements.txt
RUN pip install -r requirements.txt


FROM py2-base as webdj
# Adds our application code to the image
# RUN python  wait_for_postgres.py

#RUN django-admin startproject mysite/myproject;  \
 #                ls -l /
              
# copy myproject from conatainer into local 
#RUN cp -r myproject /home/bilel/Desktop/

RUN  pip install numpy scipy pandas beautifulsoup4 nltk==3.6.3 regex==2024.5.10 seaborn==0.12.1 matplotlib 
# RUN  pip install requests # RUN python3 -m spacy download en_core_web_sm ! layer (pyarrow)
COPY . mysite 
WORKDIR mysite 
RUN wget --help 
RUN ls -l ; pwd 



EXPOSE 8003


# Run the production server
# CMD newrelic-admin run-program gunicorn --bind 0.0.0.0:$PORT --access-logfile - api.wsgi:application

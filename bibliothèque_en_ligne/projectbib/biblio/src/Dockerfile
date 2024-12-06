FROM python:3.8
ENV PYTHONUNBUFFERED 1

# Allows docker to cache installed dependencies between builds
RUN  apt-get update
RUN pip  install --upgrade pip 
COPY ./requirements.txt  requirements.txt
RUN pip install -r requirements.txt

COPY . mysite 
WORKDIR mysite 





EXPOSE 8000


# Run the production server
# CMD newrelic-admin run-program gunicorn --bind 0.0.0.0:$PORT --access-logfile - api.wsgi:application
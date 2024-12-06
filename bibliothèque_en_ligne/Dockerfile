FROM python:3.8
ENV PYTHONUNBUFFERED 1

RUN apt-get update
# RUN apt-get install libmagic1 libsndfile1 ffmpeg -y

RUN pip install --upgrade pip


RUN apt-get update




COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt 


# RUN pip install -r requirements.txt --ignore-installed nose-progressive



# Adds our application code to the image
COPY . code
WORKDIR code

EXPOSE 8000

# Run the production server
# CMD newrelic-admin run-program gunicorn --bind 0.0.0.0:$PORT --s-logfile - api.wsgi:application

import os
import logging
from time import time, sleep
import psycopg2

key = [
    "POSTGRES_CHECK_TIMEOUT",
    "POSTGRES_CHECK_INTERVAL",    
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_HOST",
]
check_timeout = os.getenv(key[0], 30)
check_interval = os.getenv(key[1], 1)
interval_unit = "second" if check_interval == 1 else "seconds"
config = {
    "dbname": os.getenv(key[2], "ecom_db"),
    "user": os.getenv(key[3], "dbuser"),
    "password": os.getenv(key[4], "dbpassword"),
    "host": os.getenv(key[5], "postgres"),
}

start_time = time()
logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())


def pg_isready(host, user, password, dbname):
    while time() - start_time < check_timeout:
        try:
            conn = psycopg2.connect(**vars())
            logger.info("Postgres is ready! ✨ 💅")
            conn.close()
            return True
        except psycopg2.OperationalError:
            logger.info(
                f"Postgres isn't ready. Waiting for {check_interval} {interval_unit}..."
            )
            sleep(check_interval)

    logger.error(f"We could not connect to Postgres within {check_timeout} seconds.")
    return False


pg_isready(**config)

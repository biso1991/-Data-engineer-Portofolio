import os
from .common import Common

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Local(Common):
    DEBUG = True
    INSTALLED_APPS = Common.INSTALLED_APPS
    INSTALLED_APPS += ("django_nose",)
    TEST_RUNNER = "django_nose.NoseTestSuiteRunner"
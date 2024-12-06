from rest_framework import serializers
from .models import Book, Borrow

class Books(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    isbn = serializers.SerializerMethodField()
    summary = serializers.SerializerMethodField()
    genre = serializers.SerializerMethodField()
    genre = serializers.SerializerMethodField()  
    def get_bool_serializers():
    
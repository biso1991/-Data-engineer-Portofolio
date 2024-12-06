from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    isbn = models.CharField(max_length=13)
    summary = models.TextField()
    genre = models.CharField(max_length=100)
    available = models.BooleanField("files_ready", default=True)


class Borrow(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.CharField(max_length=100)
    borrow_date = models.DateField()
    return_date = models.DateField()


# User :
# • Utilisez le modèle d'utilisateur par défaut de Django pour gérer l'authentification.
# 2. Book :
# • title: CharField, jusqu'à 255 caractères.
# • author: CharField, jusqu'à 255 caractères.
# • isbn: CharField, unique, 13 caractères.
# • summary: TextField, facultatif.
# • genre: CharField, jusqu'à 100 caractères.
# • available: BooleanField, indique si le livre est disponible pour emprunt.
# 3. Borrow :
# • book: ForeignKey vers Book.
# • user: ForeignKey vers User.
# • borrow_date: DateTimeField, auto_now_add=True.
# • return_date: DateTimeField, facultatif.
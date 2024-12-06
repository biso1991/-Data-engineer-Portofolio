import uuid
from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail

# User Model
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.username
# User Satic Model

# class UserStaic:
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     first_name = models.CharField(_("first name"), max_length=150, blank=True)
#     last_name = models.CharField(_("last name"), max_length=150, blank=True)
#     username = models.CharField(
#         ("username"),
#         max_length=150,
#         unique=True)
#     def __str__(self):
#         return self.username
    
    

# Run create_auth_token after user is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


# Run password_reset_token_created after receiving reset_password_token_created signal
@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):

    email_plaintext_message = "http://localhost:4200/reset-password/{}".format(
        reset_password_token.key
    )

    send_mail(
        # title:
        "Password Reset for {title}".format(title="Project"),
        # message:
        email_plaintext_message,
        # from:
        settings.EMAIL_HOST_USER,
        # to:
        [reset_password_token.user.email],
    )

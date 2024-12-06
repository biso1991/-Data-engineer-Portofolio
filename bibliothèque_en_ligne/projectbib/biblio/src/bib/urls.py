"""
URL configuration for bib project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.views.generic.base import RedirectView
from django.conf.urls.static import static
from django.urls import path, re_path, include, reverse_lazy
from django.conf import settings
from .user.views import UserViewSet, UserCreateViewSet, UserAuthToken
# from .bib_models.consumers import Consumer 

router = DefaultRouter()
router.register(r"user", UserViewSet)
router.register(r"user", UserCreateViewSet)

urlpatterns = (
[
    path("admin/", admin.site.urls),
    path("bib-token-auth/", UserAuthToken.as_view()),
    path("bib/v1/", include(router.urls)),
    # path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    # the 'api-root' from django rest-frameworks default router
        # http://www.django-rest-framework.org/api-guide/routers/#defaultrouter
    path(
            "bib/password_reset/",
            include("django_rest_passwordreset.urls", namespace="password_reset"),
        ),
        
    re_path(
            r"^$", RedirectView.as_view(url=reverse_lazy("api-root"), permanent=False)
        )

]
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
)
# websocket_urlpatterns = [
#     path("bib/version1/monitoring/", consumers.TasksConsumer.as_asgi()),
# ]

# from api.qa import consumers

# from api.qa.views import ListProjectAPIView



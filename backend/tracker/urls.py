from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (RegisterView, CompanyViewSet, ApplicationViewSet,
                    InterviewViewSet, DashboardView)

router = DefaultRouter()
router.register('companies', CompanyViewSet, basename='company')
router.register('applications', ApplicationViewSet, basename='application')
router.register('interviews', InterviewViewSet, basename='interview')

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('', include(router.urls)),
]
from django.db.models import Count
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import viewsets, generics, filters
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Company, Application, Interview
from .serializers import (RegisterSerializer, CompanySerializer,
                          ApplicationSerializer, InterviewSerializer)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location']

    def get_queryset(self):
        return Company.objects.filter(user=self.request.user).order_by('name')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['role', 'company__name']
    ordering_fields = ['applied_date', 'status']

    def get_queryset(self):
        qs = Application.objects.filter(user=self.request.user).select_related('company')
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs.order_by('-applied_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer

    def get_queryset(self):
        return (Interview.objects.filter(application__user=self.request.user)
                .select_related('application__company').order_by('scheduled_at'))


class DashboardView(APIView):
    def get(self, request):
        apps = Application.objects.filter(user=request.user)
        by_status = {row['status']: row['count']
                     for row in apps.values('status').annotate(count=Count('id'))}
        upcoming = Interview.objects.filter(
            application__user=request.user,
            scheduled_at__gte=timezone.now()).count()
        return Response({
            'total_applications': apps.count(),
            'total_companies': Company.objects.filter(user=request.user).count(),
            'by_status': {
                'applied': by_status.get('applied', 0),
                'interview': by_status.get('interview', 0),
                'offer': by_status.get('offer', 0),
                'rejected': by_status.get('rejected', 0),
            },
            'upcoming_interviews': upcoming,
        })
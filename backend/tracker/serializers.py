from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Company, Application, Interview


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'website', 'location', 'notes']


class ApplicationSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'company', 'company_name', 'role', 'status',
                  'applied_date', 'job_link', 'notes']

    def validate_company(self, company):
        if company.user != self.context['request'].user:
            raise serializers.ValidationError("Invalid company.")
        return company


class InterviewSerializer(serializers.ModelSerializer):
    application_title = serializers.CharField(source='application.__str__', read_only=True)

    class Meta:
        model = Interview
        fields = ['id', 'application', 'application_title', 'scheduled_at',
                  'round_name', 'mode', 'notes']

    def validate_application(self, application):
        if application.user != self.context['request'].user:
            raise serializers.ValidationError("Invalid application.")
        return application
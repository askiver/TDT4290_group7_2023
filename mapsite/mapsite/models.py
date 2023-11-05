from django.db import models


class WasteReport(models.Model):
    report = models.JSONField()


class GeneratedWasteReport(models.Model):
    report = models.JSONField()
    # Attach a user to the report
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)


class ReusabilityReport(models.Model):
    report = models.JSONField()

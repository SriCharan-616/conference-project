from django.db import models

class Paper(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    conference = models.CharField(max_length=200)
    file = models.FileField(upload_to='papers/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

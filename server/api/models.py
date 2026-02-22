from django.db import models

class WeatherInfo(models.Model):
    cityName = models.CharField(max_length = 300)
    temperature = models.FloatField(null = False, blank = False)

    def __str__(self):
        return self.cityName
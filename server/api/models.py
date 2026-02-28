from django.db import models

class WeatherInfo(models.Model):
    cityName = models.CharField(max_length = 300)
    temperature = models.FloatField(null = True, blank = True)
    humidity = models.IntegerField(null = True, blank = True)
    description = models.CharField(max_length = 300, null = True, blank = True)

    def __str__(self):
        return self.cityName
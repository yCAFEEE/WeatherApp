import requests
import os
from dotenv import load_dotenv
from django.http import JsonResponse
from .models import WeatherInfo
from django.views.decorators.csrf import csrf_exempt

load_dotenv()
API_KEY = os.getenv('API_KEY')

@csrf_exempt
def getWeather(request):
    weather = None
    error = None

    if request.method == "POST":
        city = request.POST.get("city", '').strip()

        if city:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
            try:
                resp = requests.get(url, timeout = 5)
                data = resp.json()

                if resp.status_code == 200:
                    weather = {
                        'city': f"{data['name']}, {data['sys']['country']}",
                        'temperature': data['main']['temp'],
                        'humidity': data['main']['humidity'],
                        'feelsLike': data['main']['feels_like'],
                        'tempMin': data['main']['temp_min'],
                        'tempMax': data['main']['temp_max'],
                        'pressure': data['main']['pressure'],
                        'visibility': data['visibility'],
                        'windSpeed': data['wind']['speed'],
                        'description': data['weather'][0]['description'].title(),
                        'icon': data['weather'][0]['icon'],
                    }

                    WeatherInfo.objects.create(
                        cityName = data['name'],
                        temperature = data['main']['temp'],
                        humidity = data['main']['humidity'],
                        feelsLike = data['main']['feels_like'],
                        tempMin = data['main']['temp_min'],
                        tempMax = data['main']['temp_max'],
                        pressure = data['main']['pressure'],
                        visibility = data['visibility'],
                        windSpeed = data['wind']['speed'],
                        description = data['weather'][0]['description'].title()
                    )
                    return JsonResponse({'weather': weather})
                else:
                    return JsonResponse({'error': data.get("message", 'Could not fetch weather data')}, status = 404)
            except requests.RequestException:
                return JsonResponse({'error': "Network error."}, status = 500)
        else:
            return JsonResponse({'error': "City name is empty."}, status = 400)
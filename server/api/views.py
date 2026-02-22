import requests
from django.http import JsonResponse
from .models import WeatherInfo
from django.views.decorators.csrf import csrf_exempt

API = "94df3ed88579a382f629117fdb563072"

@csrf_exempt
def getWeather(request):
    weather = None
    error = None

    if request.method == "POST":
        city = request.POST.get("city", '').strip()

        if city:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API}&units=metric"
            try:
                resp = requests.get(url, timeout = 5)
                data = resp.json()

                if resp.status_code == 200:
                    weather = {
                        'city': f"{data['name']}, {data['sys']['country']}",
                        'temperature': data['main']['temp'],
                    }

                    WeatherInfo.objects.create(
                        cityName = data['name'],
                        temperature = data['main']['temp']
                    )
                else:
                    error = data.get("message", 'Could not fetch weather data')
            except requests.RequestException:
                error = "Network error."
        else:
            error = "City name is empty."

    return JsonResponse({
        'weather': weather,
        'error': error
    })
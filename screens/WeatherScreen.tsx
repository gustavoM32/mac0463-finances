import * as React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { WEATHER_API_KEY } from 'react-native-dotenv';
import { getData, setData } from '../store/Store';
import { Title } from 'react-native-paper';

const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/forecast?";

export default function WeatherScreen({ navigation }: RootTabScreenProps<'Weather'>) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [weatherInfo, setWeatherInfo] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [forecastViews, setForecastViews] = React.useState<any[] | null>(null);

  const load = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status != 'granted') {
        throw Error("Location permission denied")
      }

      let gpsServiceStatus = await Location.hasServicesEnabledAsync();

      if (!gpsServiceStatus) {
        throw Error("No location service available");
      }

      const location = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;

      const requestUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

      const response = await fetch(requestUrl);

      const result = await response.json();
      
      if (response.ok) {
        console.log("Weather info was read successfully")
        setErrorMessage(null);
        setIsLoading(false);
        setWeatherInfo(result);
      } else {
        throw Error("Error fetching weather data")
      }

    } catch (error : any) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading forecast data...</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.title}>Please wait.</Text>
      </View>
    );
  }

  if (weatherInfo == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.title}>{errorMessage}</Text>
      </View>
    );
  }

  const genForecastViews = async () => {
    const cityId = weatherInfo.city.id;
    const forecast = weatherInfo.list;
    let storedData : any = await getData('weatherData', {});

    if (!(cityId in storedData)) {
      storedData[cityId] = {};
    }
    
    for (let data of forecast) {
      let time = data.dt;
      let dataToStore = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        precipitation: data.pop,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      }
      storedData[cityId][time] = dataToStore;
    }
  
    setData('weatherData', storedData);

    const cityData = storedData[cityId];

    const infoBit = (name, data) => {
      return (
        <View style={styles.bitsContainer}>
          <Text>{name}</Text>
          <Text>{data}</Text>
        </View>
      );
    }

    let generatedViews = Object.keys(cityData).reverse().map((time) => {
      let iconUrl = `https://openweathermap.org/img/wn/${cityData[time].icon}@4x.png`;
  
      return (
        <View key={time} style={styles.weatherInfo}>
          <View style={{width: '25%'}}>
            <Image style={styles.icon} source={{ uri: iconUrl }}/>
            <Text>{cityData[time].description}</Text>
          </View>
          <View style={{width: '65%'}}>
            <Text>{(new Date(time * 1000)).toLocaleString()}</Text>
            {infoBit("Temperature", `${cityData[time].temperature} °C`)}
            {infoBit("Precipitation", `${cityData[time].precipitation}%`)}
            {infoBit("Wind speed", `${cityData[time].windSpeed} km/h`)}
            {infoBit("Humidity", `${cityData[time].humidity}%`)}
          </View>
        </View>
      );
    });
    
    setForecastViews(generatedViews);
  }

  if (forecastViews == null) {
    genForecastViews();
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Title>Weather forecast for {weatherInfo.city.name}, {weatherInfo.city.country}</Title>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={styles.mainContainer}>
          {forecastViews}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%'
  },
  weatherInfo: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginVertical: 18
  },
  bitsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  icon: {
    width: 50,
    height: 50
  }
});

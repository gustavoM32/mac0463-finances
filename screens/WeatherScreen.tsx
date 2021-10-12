import * as React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { WEATHER_API_KEY } from 'react-native-dotenv';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      const location = await Location.getCurrentPositionAsync();

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

      console.log(result);
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
        <Text style={styles.title}>Loading weather data...</Text>
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

  const storeData = async (value: any) => {
    try {
      if (value == null) return;
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('weatherData', jsonValue)
    } catch (e) {
      console.log("Error saving weather data");
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('weatherData');
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch(e) {
      console.log("Error reading weather data");
      return {};
    }
  }

  const genForecastViews = async () => {
    const cityId = weatherInfo.city.id;
    const forecast = weatherInfo.list;
    let storedData : any = await getData();

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
  
    storeData(storedData);

    const cityData = storedData[cityId];

    let generatedViews = Object.keys(cityData).reverse().map((time) => {
      let iconUrl = `https://openweathermap.org/img/wn/${cityData[time].icon}@4x.png`;
  
      return (
        <View key={time}>
          <Text>{(new Date(time * 1000)).toLocaleString()}</Text>
          <Image style={styles.icon} source={{ uri: iconUrl }}/>
          <Text>{cityData[time].description}</Text>
          <Text>Temperature: {cityData[time].temperature} °C</Text>
          <Text>Precipitation: {cityData[time].precipitation}%</Text>
          <Text>Wind speed: {cityData[time].windSpeed} km/h</Text>
          <Text>Humidity: {cityData[time].humidity}%</Text>
          <br></br>
        </View>
      );
    });
    
    setForecastViews(generatedViews);
  }

  if (forecastViews == null) {
    genForecastViews();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather for {weatherInfo.city.name}, {weatherInfo.city.country}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ScrollView>
        {forecastViews}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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

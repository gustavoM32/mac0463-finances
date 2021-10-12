import * as React from 'react';
import { StyleSheet } from 'react-native';
import * as Location from 'expo-location';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { WEATHER_API_KEY } from 'react-native-dotenv';

const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/forecast?";

export default function WeatherScreen({ navigation }: RootTabScreenProps<'Weather'>) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [weatherInfo, setWeatherInfo] = React.useState<Object | null>(null);

  const load = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status != 'granted') {
        setErrorMessage("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      const requestUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`;

      const response = await fetch(requestUrl);

      const result = await response.json();

      if (response.ok) {
        console.log("Weather info was read successfully")
        setWeatherInfo(result);
      } else {
        setErrorMessage("Error fetching weather data");
      }

    } catch (error : any) {
      setErrorMessage(error.message);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  if (weatherInfo != null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.title}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>{JSON.stringify(weatherInfo)}</Text>
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
});

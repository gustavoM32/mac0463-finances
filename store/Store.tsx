import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setData(key: string, value: any) {
  try {
    if (value == null) {
      throw new Error('Trying to set null value to store');
    }
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.error(e);
  }
}

export async function getData(key: string, defaultValue: any = null) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue == null ? defaultValue : JSON.parse(jsonValue);
  } catch(e) {
    console.error("Error reading weather data");
    console.log(e);
    return null;
  }
}

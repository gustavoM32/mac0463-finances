/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import WeatherScreen from '../screens/WeatherScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import * as SecureStore from 'expo-secure-store';
import { AuthContext, UserInfoContext } from '../constants/Contexts';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [userToken, setUserToken] = React.useState<string | null>(null);
  const [userInfo, setUserInfo] = React.useState<any>(null);

  const fetchUserInfo = async (token: string) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
  
    return await response.json();
  }

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let token : string | null;

      try {
        token = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.log("Token not found");
        token = null;
      }

      
      if (token != null) {
        const user = await fetchUserInfo(token);
        setUserInfo(user);
      }
      setUserToken(token);
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (token: string) => {
      try {
        await SecureStore.setItemAsync('userToken', token);
      } catch (e) {
        console.log("Couldn't store token")
      }

      const user = await fetchUserInfo(token);
      
      setUserInfo(user);
      setUserToken(token);
    }
  }
  
  const userInfoContext = {
    userInfo: userInfo
  }

  return (
    <AuthContext.Provider value={authContext}>
      <UserInfoContext.Provider value={userInfoContext}>
        <Stack.Navigator>
          {userToken == null ? (
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Modal" component={ModalScreen} />
              </Stack.Group>
            </>
        )}
        </Stack.Navigator>
      </UserInfoContext.Provider>
    </AuthContext.Provider>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        })}
      />
      <BottomTab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={({ navigation }: RootTabScreenProps<'Statistics'>) => ({
          title: 'Statistics',
          tabBarIcon: ({ color }) => <TabBarIcon name="chart-bar" color={color} />
        })}
      />
      <BottomTab.Screen
        name="Weather"
        component={WeatherScreen}
        options={({ navigation }: RootTabScreenProps<'Weather'>) => ({
          title: 'Weather',
          tabBarIcon: ({ color }) => <TabBarIcon name="weather-partly-cloudy" color={color} />
        })}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }: RootTabScreenProps<'Profile'>) => ({
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="account" color={color} />
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}


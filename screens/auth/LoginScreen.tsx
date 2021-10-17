import * as React from 'react';
import { StyleSheet, Image } from 'react-native';

import { Text, View } from '../../components/Themed';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Button } from 'react-native-paper';
import { AuthContext } from '../../constants/Contexts';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '895356139006-jg0j9kpstj99ldbdn2beunhjpmt4hiub.apps.googleusercontent.com',
    androidClientId: '895356139006-4fp2l04ihnnvq3nfhn7dujs834a0ea8k.apps.googleusercontent.com',
    webClientId: '895356139006-27d1q71elpk0hrv59v96j3scif4l47cd.apps.googleusercontent.com',
    scopes: ["profile", "email"]
  });

  const [loginFailed, setLoginFailed] = React.useState(false);

  const { signIn } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication != null) {
        let token = authentication.accessToken;
        signIn(token);
      }
    } else if (response != null) {
      console.error(response);
      setLoginFailed(true);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finances</Text>
      <Image source={require('../../assets/background.png')} style={styles.logo}></Image>
      <View style={styles.separator} lightColor="#04f" darkColor="rgba(255,255,255,0.1)" />
      <Button
        disabled={!request}
        icon="google" mode="contained"
        onPress={() => {
          promptAsync();
        }}>
          Login with Google
      </Button>
      {loginFailed ? (
        <Text>Login failed! Please try again.</Text>
      ) : null}
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
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: 'sans-serif'
  },
  logo: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderRadius: 200,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

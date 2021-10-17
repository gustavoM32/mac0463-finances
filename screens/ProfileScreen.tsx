import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Subheading } from 'react-native-paper';

import { Text, View } from '../components/Themed';
import { UserInfoContext } from '../constants/Contexts';
import { RootTabScreenProps } from '../types';

export default function ProfileScreen({ navigation }: RootTabScreenProps<'Profile'>) {
  const { userInfo } = React.useContext(UserInfoContext);

  return (
    <View style={styles.container}>
      <Image source={{uri: userInfo.picture}} style={styles.userImage}/>
      <Subheading>{userInfo.name}</Subheading>
      <Subheading>{userInfo.email}</Subheading>
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
  userImage: {
    borderRadius: 200,
    width: 150,
    height: 150,
  }
});

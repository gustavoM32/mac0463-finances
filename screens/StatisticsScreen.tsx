import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function StatisticsScreen({ navigation }: RootTabScreenProps<'Statistics'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>This is the statistics screen</Text>
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

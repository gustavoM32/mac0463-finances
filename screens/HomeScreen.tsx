import * as React from 'react';
import { StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import { Title, List } from 'react-native-paper';

import { Text, View } from '../components/Themed';
import { spentColor, earnedColor } from '../constants/Colors';
import { UserInfoContext } from '../constants/Contexts';
import { RootTabScreenProps } from '../types';

const userData = {
  transactions: [
    {
      id: 3,
      name: "Getbox Plan",
      type: "Subscription",
      value: -144.00,
      date: "18 Sept 2020",
      icon: "dropbox"
    },
    {
      id: 2,
      name: "Spotipay",
      type: "Subscription",
      value: -24.00,
      date: "12 Sept 2020",
      icon: "spotify"
    },
    {
      id: 1,
      name: "Mytube Ads.",
      type: "Income",
      value: 32.00,
      date: "10 Sept 2020",
      icon: "youtube"
    },
    {
      id: 0,
      name: "Freelance Work",
      type: "Income",
      value: 4.21,
      date: "06 Sept 2020",
      icon: "briefcase"
    }
  ]
}

function CardList() {
  return (
    <ScrollView style={{width: '100%'}}
      horizontal>
      <View style={styles.rowContainer}>
        <Image source={require("../assets/card1.png")} style={{ width: 305, height: 180 }} />
        <Image source={require("../assets/card2.png")} style={{ width: 305, height: 180 }} />
      </View>
    </ScrollView>
  );
}

function Transaction(props: any) {
  const formattedValue = `${props.value < 0 ? "-" : ""}$${Math.abs(props.value).toFixed(2)}`;
  const right = (
    <View style={styles.container}>
      <Text>{props.date}</Text>
      <Text style={{color: props.value < 0 ? spentColor : earnedColor }}>{formattedValue}</Text>
    </View>
  );
  return (
    <List.Item
      style={styles.transaction}
      title={props.name}
      description={props.type}
      left={p => <List.Icon {...p} icon={props.icon} />}
      right={() => right}
    />
  );
}

function TransactionList() {
  let transactions = userData.transactions.map((t) => {
    return (
      <Transaction
        key={t.id}
        name={t.name}
        type={t.type}
        value={t.value}
        date={t.date}
        icon={t.icon}
        >
      </Transaction>
    );
  })
  return (
    <>
      {transactions}
    </>
  );
}


export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const { userInfo } = React.useContext(UserInfoContext);
  const name = userInfo?.given_name;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Title>Hello, {name}!</Title>
        <CardList />
        <Title>Transactions</Title>
        <TransactionList></TransactionList>
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
  rowContainer: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
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
  transaction: {
    width: '80%'
  }
});

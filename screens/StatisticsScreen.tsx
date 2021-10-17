import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { BarChart, Grid, PieChart, XAxis, YAxis } from 'react-native-svg-charts'
import { Card, List, Title } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

import * as scale from 'd3-scale'
import { earnedColor, spentColor } from '../constants/Colors';

function Balance(props) {
  const formattedValue = `${props.value < 0 ? "-" : ""}$${Math.abs(props.value).toFixed(2)}`;
  const value = (
    <Text style={{fontWeight: 'bold', color: props.color}}>{formattedValue}</Text>
  );
  return (
    <Card.Title
      style={styles.balance}
      title={value}
      subtitle={props.name}
      left={p => <List.Icon {...p} color={props.color} icon={props.icon} />}
    />
  );
}

const userData = {
  revenue: [
    {
      date: "10/10/2020",
      earned: 302.00,
      spent: 150.00,
    },
    {
      date: "09/10/2020",
      earned: 120.00,
      spent: 405.00,
    },
    {
      date: "08/10/2020",
      earned: 240.00,
      spent: 201.00,
    },
    {
      date: "07/10/2020",
      earned: 211.00,
      spent: 453.00,
    },
    {
      date: "06/10/2020",
      earned: 453.00,
      spent: 120.00,
    },
    {
      date: "05/10/2020",
      earned: 435.00,
      spent: 795.00,
    },
    {
      date: "04/10/2020",
      earned: 452.00,
      spent: 120.00,
    }
  ]
}

function RevenueChart(props) {
  const pieData = [
    {
      value: props.earned,
      key: `pie-earned`,
      svg: { fill: earnedColor }
    },
    {
      value: props.spent,
      key: `pie-spent`,
      svg: { fill: spentColor }
    }
  ]

  return (
    <View style={styles.mainContainer}>
      <Title>Today</Title>
      <PieChart
        style={{ height: 150, width: '100%' }}
        data={pieData}
        valueAccessor={({ item }) => item.value}
        >
      </PieChart>
    </View>
  );
}

function ExpenseReport(props) {
  const dates = props.revenue.map((x) => x.date);
  const earned = props.revenue.map((x) => x.earned);
  const spent = props.revenue.map((x) => x.spent);

  const barData = [
    {
        data: earned,
        svg: {
            fill: earnedColor,
        },
    },
    {
        data: spent,
        svg: {
            fill: spentColor,
        },
    },
  ]

  return (
    <View style={styles.mainContainer}>
      <Title>Week</Title>
      <View style={{ flexDirection: 'row', height: 200, width: '100%', paddingVertical: 16 }}>
      <YAxis
          data={dates}
          yAccessor={({ index }) => index}
          scale={scale.scaleBand}
          contentInset={{ top: 10, bottom: 10 }}
          // spacing={0.2}
          formatLabel={(_, index) => dates[ index ]}
      />
      <BarChart
          style={{ flex: 1, marginLeft: 8 }}
          data={barData}
          horizontal={true}
          svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
          contentInset={{ top: 10, bottom: 10 }}
          spacing={0.2}
          gridMin={0}
      >
          <Grid direction={Grid.Direction.VERTICAL}/>
      </BarChart>
      </View>
    </View>
  )
}

export default function StatisticsScreen({ navigation }: RootTabScreenProps<'Statistics'>) {
  const todayRevenue = userData.revenue[0];
  const weekRevenue = userData.revenue.slice(0, 7);
  return (
    <ScrollView> 
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Balance
            value={todayRevenue.earned}
            name="Earned"
            icon="arrow-up-drop-circle-outline"
            color={earnedColor} />
          <Balance
            value={todayRevenue.spent}
            name="Spent"
            icon="arrow-down-drop-circle-outline"
            color={spentColor} />
        </View>
        <RevenueChart earned={todayRevenue.earned} spent={todayRevenue.spent} />
        <ExpenseReport revenue={weekRevenue} />
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
    width: '80%',
    paddingBottom: 100
  },
  rowContainer: {
    flex: 1,
    width: '100%',
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
  balance: {
    width: '50%',
  },
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {createStackNavigator, StackNavigator} from 'react-navigation';

import CardSetsView from './app/CardSetsView';
import CardsView from './app/CardsView';

const Application = StackNavigator(
  {
    Home: {
      screen: CardSetsView,
    },
    CardsView: {
      screen: CardsView,
    },
  },
  {
    navigationOptions: {
      header: null,
    }
  }
);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
        <Application/>
    );
  }
}

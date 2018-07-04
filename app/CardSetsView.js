import React, {Component} from 'react';
import {
  View,
  Button,
} from 'react-native';

import Controller from './Controller';

export default class CardSetsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cardSets: [],
    }

  }

  render() {
    return(
      <View>
        <Button
          title={"New"}
          onPress={() => {Controller.createCardSet('a')}}
        />
      </View>
    );
  }
}
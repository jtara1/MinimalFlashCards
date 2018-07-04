import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import Controller from './Controller';
import CardSet from './CardSet';
import Card from './Card';

export default class CardSetsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cardSets: [],
    }

  }

  createCardSet = () => {
    // alert('startin');
    // let set = Controller.createCardSet('123');
    // let set = CardSet.create((new Date()).toDateString());
    let set = CardSet.create('987kj');
    alert(JSON.stringify(set));
    this.setState({
      cardSets: this.state.cardSets.concat([set])
    });
    // alert(this.state.cardSets);
  };

  render() {
    return(
      <View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={
              () => {
                // alert('pressed');
                this.createCardSet()
              }
            }
          >
            <Text>New</Text>
          </TouchableOpacity>
        </View>

        {
          this.state.cardSets.forEach((cardSet) => {
            return(
              <View style={styles.cardSet}>
                <Text>{cardSet.name}</Text>
              </View>
            );
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f03',
    height: 200,
    borderWidth: 1,
    padding: 40,
  },

  cardSet: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#b29',
  }
});

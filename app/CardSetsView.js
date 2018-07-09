import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {StackNavigator} from 'react-navigation';

import Controller from './Controller';
import CardSet from './CardSet';
import Example from './Test';

export default class CardSetsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cardSets: [],
    };
    // AsyncStorage.clear();
  }

  componentDidMount() {
    // return;
    Controller.getAllSets()
      .then(sets => {
        if (sets) {
          this.setState({
            cardSets: sets,
          })
        }
      })
      .catch(err => console.error(err))
  }

  createCardSet = () => {
    let set = new CardSet((new Date()).toDateString());
    this.setState(prevState => {
      return {
        cardSets: prevState.cardSets.concat([set])
      }
    });
  };

  render() {
    return(
      <View>
        <Example/>
        <TouchableOpacity
          style={styles.button}
          onPress={
            () => {
              this.createCardSet();
            }
          }
        >
          <Text>New</Text>
        </TouchableOpacity>

        {
            this.state.cardSets.map((cardSet) => {
              return(
                <TouchableOpacity
                  key={cardSet.id}
                  onPress={() => this.props.navigation.navigate('CardsView', {cardSetId: cardSet.id})}
                >
                  <Text style={styles.cardSet}>{cardSet.name}</Text>
                </TouchableOpacity>
              )
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
    width: 150,
    height: 250,
    borderWidth: 2,
    backgroundColor: '#ff2',
    padding: 20,
  }
});

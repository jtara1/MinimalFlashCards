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
import {List, ListItem} from 'react-native-elements';

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
        {/*<Example/>*/}
        <TouchableOpacity
          onPress={
            () => {
              this.createCardSet();
            }
          }
        >
          <Text>New Card Set</Text>
        </TouchableOpacity>
        <List containerStyle={{marginBottom: 20}}>
          {
            this.state.cardSets.map((cardSet) => (
              <ListItem
                // avatar={{uri:l.avatar_url}}
                key={cardSet.id}
                title={cardSet.name}
                onPress={() => this.props.navigation.navigate('CardsView', {cardSetId: cardSet.id})}
              />
            ))
          }
        </List>
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

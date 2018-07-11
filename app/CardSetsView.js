import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {
  List,
  ListItem,
  Button,
} from 'react-native-elements';

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
    // let set = new CardSet((new Date()).toDateString());
    let name = `Card Set ${CardSet.setIds.length + 1}`;
    let set = new CardSet(name);

    this.setState(prevState => {
      return {
        cardSets: prevState.cardSets.concat([set])
      }
    });
  };

  render() {
    return(
      <View>
        <Button
          title={'Create a Card Set'}
          raised
          rightIcon={{name: 'add', color: 'green'}}
          onPress={this.createCardSet}
          backgroundColor={'rgb(255, 255, 255)'}
          color={'green'}
        />
        <List containerStyle={{marginBottom: 20}}>
          {
            this.state.cardSets.map((cardSet) => (
              <ListItem
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

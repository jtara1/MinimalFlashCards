import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from 'react-native';

import {StackNavigator} from 'react-navigation';

import {
  List,
  ListItem,
  Button,
} from 'react-native-elements';

const uuid = require('react-native-uuid');

import Controller from './Controller';
import CardSet from './CardSet';
import Example from './Test';

export default class CardSetsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cardSets: [],
    };
  }

  componentDidMount() {
    this.updateSets();
  }

  updateSets = () => {
    Controller.getAllSets()
      .then(sets => {
        if (sets) {

          this.setState({
            cardSets: sets,
          })
        }
      })
      .catch(err => console.error(err))
  };

  createCardSet = () => {
    // let set = new CardSet((new Date()).toDateString());
    let name = `Card Set ${CardSet.setIds.length + 1}`;
    let set = new CardSet(name);

    this.setState(prevState => {
      return {
        cardSets: prevState.cardSets.concat([set]),
      }
    });
  };

  navigateToCardView = (set) => {
    if (set.id == null) {
      alert('Warning: there is no such such. Restart the app. Report as a bug if it persists.');
    } else {
      this.props.navigation.navigate('CardsView', {cardSetId: set.id});
    }
  };

  showCardSetOptions = (setId, setName, cardCount) => {
    Alert.alert(
      'Options',
      setName,
      [
        {text: 'Rename', onPress: () => alert('rename')},
        {text: 'Delete', onPress:
          () => {
            Alert.alert(
              '',
              `Delete ${setName} and the ${cardCount} cards with it?`,
              [
                {text: 'Cancel', onPress: () => {}},
                {text: 'Confirm', onPress:
                  () => {
                    Controller.deleteCardSet(setId).catch(err => console.error(err));
                    this.removeCardSet(setId);
                  }
                },
              ]
            );
          }},
        {text: 'Cancel', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: true }
    )
  };

  removeCardSet = (setId) => {
    let { cardSets } = this.state;
    let index = cardSets.findIndex(element => element.id === setId);
    let sets = cardSets.slice(0, index);
    sets.concat(cardSets.slice(index + 1, cardSets.length));

    this.setState({cardSets: sets});
  };

  render() {
    return(
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: .15,
            flexDirection: 'row',
            // borderWidth: 1,
          }}
        >
          <Button
            title={'Create'}
            raised
            rightIcon={{name: 'add', color: 'green'}}
            onPress={this.createCardSet}
            backgroundColor={'rgb(255, 255, 255)'}
            color={'green'}
            containerViewStyle={{
              flex: 1,
            }}
            buttonStyle={{
              flex: 1,
            }}
          />
          <Button
            title={'Delete All'}
            raised
            rightIcon={{name: 'cancel', color: 'white'}}
            onPress={() => {
              Alert.alert(
                'Deletion Confirmation',
                'Are you sure wish to delete all card sets and cards?',
                [
                  {text: 'Cancel', onPress: () => {}},
                  {text: 'Ok', onPress: () => {AsyncStorage.clear(); this.updateSets();}}
                ]
              );
              this.setState(prevState => {
                return {
                  cardSets: [],
                }
              });
            }}
            backgroundColor={'red'}
            color={'white'}
            containerViewStyle={{
              flex: 1,
            }}
            buttonStyle={{
              flex: 1
            }}
          />
        </View>
        <List
          containerStyle={{
            marginBottom: 20,
            flex: 1,
          }}
        >
          {
            this.state.cardSets.map((cardSet) => (
              cardSet.name ?
                <ListItem
                  key={cardSet.id}
                  title={cardSet.name}
                  onPress={() => this.navigateToCardView(cardSet)}
                  component={TouchableOpacity}
                  onLongPress={
                    () => this.showCardSetOptions(
                      cardSet.id, cardSet.name, cardSet.cardIds.length)
                  }
                />
                :
                <View key={uuid.v1()}></View>
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

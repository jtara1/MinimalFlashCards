import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  // Text,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';

import {StackNavigator} from 'react-navigation';

import {
  List,
  ListItem,
  Button,
  Text,
} from 'react-native-elements';

const uuid = require('react-native-uuid');

import Controller from './Controller';
import CardSet from './CardSet';
// import Example from './Test';

export default class CardSetsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cardSets: [],
      modalVisible: false,
      currentCardSet: null,
      newCardSetName: '',
    };

    // AsyncStorage.clear();
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

  updateCurrentSet = () => {
    if (!this.state.currentCardSet) {
      console.warn('update current set called, but there is no current set');
      return;
    }

    Controller.getCardSet(this.state.currentCardSet.id)
      .then(cardSet => {
        this.setState({
          currentCardSet: cardSet,
        })
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

  removeCardSet = (setId) => {
    let { cardSets } = this.state;
    let index = cardSets.findIndex(element => element.id === setId);
    let sets = cardSets.slice(0, index);
    sets.concat(cardSets.slice(index + 1, cardSets.length));

    this.setState({cardSets: sets});
  };

  getCardCount() {
    if (this.state.currentCardSet) {
      Controller.getCard(this.state.currentCardSet.id)
        .then(card => {
          return Promise.resolve(card.cardIds.length);
        })
        .catch(Promise.reject);
    }
    return Promise.resolve('');
  }

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
                  {text: 'Ok', onPress:
                    () => {
                      AsyncStorage.clear();
                      this.updateSets();}
                  }
                ]
              );
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

        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onShow={this.updateCurrentSet}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{fontSize: 30}}
            >
              {'Name: ' + (this.state.currentCardSet ? this.state.currentCardSet.name : '')}
            </Text>

            <Text
              style={{fontSize: 24}}
            >
              {
                `Card Count: ${this.state.currentCardSet ? this.state.currentCardSet.cardIds.length : ''}`
              }
            </Text>

            <TextInput
              style={{flex: 2}}
              multiline
              onChangeText={
                text => {
                  this.setState({newCardSetName: text});
                }
              }
            />
            <Button
              title={'Rename'}
              large
              backgroundColor={'rgb(60, 90, 224)'}
              containerStyle={styles.button2}
              onPress={
                () => {
                  Controller.setCardSetName(
                    this.state.currentCardSet.id, this.state.newCardSetName);
                  this.setState({modalVisible: false});
                  this.updateSets();
                }
              }
            />
            <Button
              title={'Delete'}
              backgroundColor={'red'}
              containerStyle={styles.button2}
              onPress={
                () => {
                  Controller.deleteCardSet(this.state.currentCardSet.id).catch(err => console.error(err));
                  this.setState({modalVisible: false});
                  this.removeCardSet(this.state.currentCardSet.id);
                }
              }
            />
            <Button
              title={'Close'}
              large
              containerStyle={styles.button2}
              onPress={
                () => {
                  this.setState({modalVisible: false});
                }
              }
            />
          </View>
        </Modal>

        <ScrollView>
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
                    rightIcon={{name: 'navicon', type: 'font-awesome'}}
                    onPressRightIcon={
                      () => {
                        this.setState({
                          currentCardSet: cardSet,
                          modalVisible: true,
                        });
                      }
                    }
                    onPress={() => this.navigateToCardView(cardSet)}
                    component={TouchableOpacity}
                    onLongPress={
                      () => {
                        this.setState({
                          currentCardSet: cardSet,
                          modalVisible: true,
                        });
                        // this.showCardSetOptions(cardSet.id, cardSet.name, cardSet.cardIds.length)

                      }
                    }

                  />
                  :
                  <View key={uuid.v1()}></View>
              ))
            }
          </List>
        </ScrollView>
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

  button2: {
    paddingTop: 20,
  },

  cardSet: {
    width: 150,
    height: 250,
    borderWidth: 2,
    backgroundColor: '#ff2',
    padding: 20,
  }
});

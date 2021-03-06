import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  // Button,
  Modal,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import {
  Button,
  Icon,
  List,
  ListItem,
} from 'react-native-elements';

import Orientation from 'react-native-orientation';

// local imports
import Controller from './Controller';
import HorizontalRule from './HorizontalRule';
import NewCardModal from "./NewCardModal";

const uuid = require('react-native-uuid');
// const flipImage = require('./assets/return.png');
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/EvilIcons';
// import flipImage from './assets/return.png';

export default class CardsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      cardsIndex: 0,
      cardName: 'default-name',
      cardDescription: 'default-description',
      showName: true, // show the name of the card instead of the description
      modalVisible: false,
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      buttonBackgroundColor: 'rgb(60, 90, 224)',
      optionsVisible: false,
      newCardNameOrDescription: '',
    };

    this.cardSetId = this.props.navigation.getParam('cardSetId');
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    this.updateCards();
    Orientation.addOrientationListener(this.orientationDidChange);

    // debug
    // this.createCard('run', 'to walk quickly');
    // this.createCard('prefix operator', 'an op that comes before the operand');
    // this.createCard('postfix operator', 'an op that comes after the operand');
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationDidChange);
    Orientation.unlockAllOrientations();
  }

  orientationDidChange = (orientation) => {
    // update the width used for spacing between a few buttons
    // alert('orient change');
    this.setState({
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height
    });
  };

  updateCards = () => {
    Controller.getAllCardsForASet(this.cardSetId)
      .then(cards => {
        // alert(`updateCards ${JSON.stringify(cards)}`);
        this.setState({
          cards,
        });
      })
      .catch(err => console.error(err));
  };

  createCard = (name, description) => {
    Controller.createCard(this.cardSetId, name, description)
      .then((card) => {
        this.setState(prevState => {
          return {
            cards: prevState.cards.concat([card]),
            modalVisible: false,
          }
        })
      })
      .catch(err => console.error(err))
  };

  nextIndex = () => {
    this.setState(prevState => {
      let index = (this.state.cardsIndex + 1) % this.state.cards.length;
      return {
        cardsIndex: index,
        showName: true,
        modalVisible: false,
      }
    });
  };

  previousIndex = () => {
    let index = (this.state.cardsIndex - 1) % this.state.cards.length;
    if (index < 0) {
      index = this.state.cards.length - 1;
    }
    this.setState(prevState => {
      return {
        cardsIndex: index,
        showName: true,
        modalVisible: false,
      }
    })
  };

  flipCurrentCard = () => {
    this.setState(prevState => {
      return {
        showName: !prevState.showName,
        modalVisible: false,
      }
    });
  };

  toggleOptions = () => {
    this.setState(
      prevState => {
        return {
          optionsVisible: !prevState.optionsVisible,
        };
      }
    );
  };

  deleteCurrentCard = () => {
    let {cards, cardsIndex} = this.state;
    try {
      Controller.deleteCard(this.cardSetId, cards[cardsIndex].id)
        .catch(err => console.error(err));
    } catch (err) {
      console.error(err);
    }

    this.setState({optionsVisible: false});
    this.decrementCardIndex();
    this.updateCards();
  };

  decrementCardIndex = () => {
    let {cards, cardsIndex} = this.state;
    let index = cardsIndex - 1;
    this.setState({
      cardsIndex: index < 0 ? 0 : index,
    });
  };

  renameCard = () => {
    let {cards, cardsIndex, newCardNameOrDescription} = this.state;
    let card = cards[cardsIndex];

    if (!newCardNameOrDescription) {
      newCardNameOrDescription = 'undefined';
    }

    if (this.state.showName) {
      Controller.setCardName(card.id, newCardNameOrDescription);
    } else {
      Controller.setCardDescription(card.id, newCardNameOrDescription);
    }

    this.setState({
      newCardNameOrDescription: '',
      showOptions: false,
    });

    this.updateCards();
  };

  render() {
    let newCardView =
      <NewCardModal
        onSubmit={this.createCard}
        visible={this.state.modalVisible}
      />;

    return(
      <View style={
        {
          flex: 1,
          margin: 0,
          padding: 0,
        }}
      >
        {newCardView}

        {/*top row view, includes flip and hamburger menu*/}
        <View
          style={{
            flex: 1,
            margin: 0,
            padding: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // borderWidth: 1,
          }}
        >
          <Button
            large
            title={'flip'}
            style={[
              // styles.button,
              {
                flex: 1,
                margin: 0,
              },
            ]}
            rightIcon={{name: 'replay'}}
            backgroundColor={this.state.buttonBackgroundColor}
            onPress={this.flipCurrentCard}
          />
          {
            this.state.cards.length !== 0 ?
              <Button
                large
                title={'options'}
                style={[
                  {
                    flex: 1,
                    margin: 0,
                  },
                ]}
                backgroundColor={this.state.buttonBackgroundColor}
                rightIcon={{name: 'navicon', type: 'font-awesome'}}
                onPress={this.toggleOptions}
              />
              :
              <View></View>
          }

        </View>
          {
            this.state.optionsVisible ?
              <ScrollView
                style={{
                  flex: 1
                }}
              >
                <List
                  containerStyle={{
                    flex: 2,
                  }}
                >
                  <ListItem
                    title={'Rename'}
                    style={{flex: 1}}
                    onPress={() => this.renameCard()}
                    component={TouchableOpacity}
                    rightIcon={{name: 'font', type: 'font-awesome'}}
                    textStyle={{borderWidth: 3}}
                    textInput={true}
                    textInputValue={this.state.newCardNameOrDescription}
                    textInputOnChangeText={
                      (newCardNameOrDescription) =>
                        this.setState({newCardNameOrDescription})
                    }
                    textInputReturnKeyType={'done'}
                    textInputContainerStyle={{
                      flex: 2,
                      zIndex: 2,
                    }}
                    textInputStyle={{
                      zIndex: 2,
                    }}
                  />
                  <ListItem
                    style={{flex: 1}}
                    title={'Delete'}
                    rightIcon={{name: 'clear'}}
                    onPress={this.deleteCurrentCard}
                    component={TouchableOpacity}
                  />
                </List>
              </ScrollView>
            :
            <View key={uuid.v1()}></View>
          }

        {/*the view of a single card (either it's name or description*/}
        {
          this.state.cards.length === 0 ?
            <Text style={styles.cardText}>no cards added yet</Text> :
            <View style={styles.textContainer}>
              <Text
                style={styles.cardHeader}
              >
                {this.state.showName ? 'Name' : 'Description'}
              </Text>
              <HorizontalRule/>
              <Text style={
                [
                  styles.cardText,
                  {
                    fontSize: this.state.showName ? 56 : 30,
                  },
                ]}
              >
                {
                  this.state.showName ?
                    this.state.cards[this.state.cardsIndex].name :
                    this.state.cards[this.state.cardsIndex].description
                }
              </Text>
            </View>
        }

        {/*the next and previous buttons*/}
        <View
          style={{
            position: 'absolute',
            top: this.state.screenHeight / 3,
            height: 120,
            padding: 0,
            alignSelf: 'center',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: this.state.screenWidth,
            // borderWidth: 2,
          }}
        >
          <Icon
            raised
            size={36}
            name={'arrow-back'}
            color={'rgba(0, 0, 0, 1)'}
            underlayColor={this.state.buttonBackgroundColor}
            containerStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}
            onPress={this.previousIndex}
          />
          <Icon
            raised
            size={36}
            name={'arrow-forward'}
            color={'rgba(0, 0, 0, 1)'}
            underlayColor={this.state.buttonBackgroundColor}
            containerStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}
            onPress={this.nextIndex}
          />

        </View>

        <Icon
          name={'add'}
          raised
          size={36}
          color={'green'}
          onPress={() => this.setState({modalVisible: true})}
          underlayColor={'rgba(255, 255, 255, 0.5)'}
          containerStyle={{
            alignSelf: 'flex-end',
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 4,
  },

  cardHeader: {
    alignSelf: 'center',
    textAlignVertical: 'top',
    fontSize: 22,
  },

  cardText: {
    alignSelf: 'center',
    fontSize: 36,
    flex: 1,
    textAlignVertical: 'top',
  },

  cardDescription: {
    alignContent: 'center',
    fontSize: 22,
  },

  button: {
    flex: 1,
    backgroundColor: 'rgb(60, 90, 224)',
  }
});
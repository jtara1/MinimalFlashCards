import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  // Button,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';

import {
  Button,
  Icon
} from 'react-native-elements';

import Orientation from 'react-native-orientation';

// local imports
import Controller from './Controller';
import HorizontalRule from './HorizontalRule';
import NewCardView from "./NewCardView";
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
      buttonBackgroundColor: 'rgb(60, 90, 224)',
    };

    this.cardSetId = this.props.navigation.getParam('cardSetId');
  }

  componentDidMount() {
    this.updateCards();
    Orientation.addOrientationListener(this.orientationDidChange);

    // debug
    // this.createCard('run', 'to walk quickly');
    // this.createCard('prefix operator', 'an op that comes before the operand');
    // this.createCard('postfix operator', 'an op that comes after the operand');
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationDidChange);
  }

  orientationDidChange = (orientation) => {
    // update the width used for spacing between a few buttons
    this.setState({screenWidth: Dimensions.get('window').width});
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

  render() {
    let newCardView =
      <NewCardView
        onSubmit={this.createCard}
        visible={this.state.modalVisible}
      />;

    return(
      <View style={{flex: 1}}>
        {newCardView}

        {/*top row view, includes flip and hamburger menu*/}
        <View
          style={{
            flex: 1,
            margin: 0,
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
              {flex: 0.5},
            ]}
            rightIcon={{name: 'replay'}}
            backgroundColor={this.state.buttonBackgroundColor}
            onPress={this.flipCurrentCard}
          />
          {/*<Button*/}
            {/*large*/}
            {/*title={'options'}*/}
            {/*style={[*/}
              {/*// styles.button,*/}
              {/*{flex: 0.5},*/}
            {/*]}*/}
            {/*backgroundColor={this.state.buttonBackgroundColor}*/}
            {/*rightIcon={{name: 'navicon', type: 'font-awesome'}}*/}
          {/*/>*/}
        </View>

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
            top: 300,
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
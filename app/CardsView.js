import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  // Button,
  Modal,
  TextInput,
} from 'react-native';

import {
  Button,
} from 'react-native-elements';

import Controller from './Controller';
import HorizontalRule from './HorizontalRule';
import NewCardView from "./NewCardView";

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
    };

    this.cardSetId = this.props.navigation.getParam('cardSetId');
  }

  componentDidMount() {
    this.updateCards();
    // debug
    // this.createCard('run', 'to walk quickly');
    // this.createCard('prefix operator', 'an op that comes before the operand');
    // this.createCard('postfix operator', 'an op that comes after the operand');
  }

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

        <Button
          title={'flip'}
          style={styles.button}
          onPress={this.flipCurrentCard}
          />
        <Button
          title={'new'}
          style={styles.button}
          onPress={
            () => {
              this.setState({modalVisible: true})
            }
          }
          />

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

        <Button
          title={'next'}
          style={styles.button}
          onPress={this.nextIndex}
          />
        <Button
          title={'prev'}
          style={styles.button}
          onPress={this.previousIndex}
          />
        <Button
          title={'modal'}
          style={styles.button}
          onPress={() => this.setState({modalVisible: true})}
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
    flex: 3,
  }
});
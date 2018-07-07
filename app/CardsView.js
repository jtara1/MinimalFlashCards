import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Modal,
  TextInput
} from 'react-native';

import Controller from './Controller';
import HorizontalRule from './HorizontalRule';

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
    this.createCard('run', 'to walk quickly');
    // this.createCard('prefix operator', 'an op that comes before the operand');
    // this.createCard('postfix operator', 'an op that comes after the operand');
  }

  updateCards() {
    Controller.getAllCardsForASet(this.cardSetId)
      .then(cards => {
        // alert(`updateCards ${JSON.stringify(cards)}`);
        this.setState({
          cards
        });
      })
      .catch(err => console.error(err));
  }

  createCard(name, description) {
    Controller.createCard(this.cardSetId, name, description)
      .then((card) => {
        this.setState(prevState => {
          return {
            cards: prevState.cards.concat([card])
          }
        })
      })
      .catch(err => console.error(err))
  }

  nextIndex = () => {
    this.setState(prevState => {
      // alert(`length: ${prevState.cards.length}`);
      // alert(`index ${prevState.cardsIndex}`);
      // alert(`length ${prevState.cards.length}`)
      // let index = prevState.cardIndex + 1 % prevState.cards.length;
      let index = (this.state.cardsIndex + 1) % this.state.cards.length;
      // alert(`next index: ${index}`);
      return {
        cardsIndex: index,
        showName: true,
      }
    });
  };

  previousIndex = () => {
    let index = (this.state.cardsIndex - 1) % this.state.cards.length;
    if (index < 0) {
      index = this.state.cards.length - 1;
    }
    this.setState(prevState => {
      // alert(`index ${prevState.cardsIndex}`);
      // alert(`length ${prevState.cards.length}`);
      return {
        cardsIndex: index,
        showName: true,
      }
    })
  };

  flipCurrentCard = () => {
    // let card = this.state.cards[this.state.cardsIndex];
    // let name = card.name;
    // card.name = card.description;
    // card.description = name;
    // this.setState({cardText: 'default-name'});
    this.setState(prevState => {
      return {
        showName: !prevState.showName,
      }
    });
  };

  render() {
    let nameInput =
      <TextInput
        style={{
          flex: 1,
        }}
        onChangeText={
          text => {
            if (!text) text = 'default-name';
            this.setState({cardName: text})
          }}
      />;

    let descriptionInput =
      <TextInput
        multiline={true}
        style={{
          flex: 1,
        }}
        onChangeText={
          text => {
            if (text === '') text = 'default-description';
            this.setState({cardDescription: text});
          }}
      />;

    let clearText = () => {
      nameInput.clear();
      descriptionInput.clear();
    };

    return(
      <View style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}
        >
          <Text>Name</Text>
          {nameInput}

          <Text>Description</Text>
          {descriptionInput}

          <Button
            title={'save'}
            onPress={
              () => {
                this.createCard(this.state.cardName, this.state.cardDescription)
                this.setState({modalVisible: false});
              }}
          />
          <Button
            title={'close'}
            onPress={
              () => {
                this.setState({
                  modalVisible: false
                })
              }}
          />
        </Modal>

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
              // this.createCard();
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
          style={styles.button}
          title={'next'}
          onPress={this.nextIndex}
          />
        <Button
          style={styles.button}
          title={'prev'}
          onPress={this.previousIndex}
          />
        <Button
          style={styles.button}
          title={'modal'}
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
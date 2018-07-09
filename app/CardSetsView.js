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
import Card from './Card';
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
    // alert('startin');
    // let set = Controller.createCardSet('123');
    // let set = CardSet.create((new Date()).toDateString());
    // let set = CardSet.create('987kj');
    let set = new CardSet((new Date()).toDateString());
    // alert(JSON.stringify(set));
    // alert(`${JSON.stringify(set)}`);
    this.setState(prevState => {
      return {
        cardSets: prevState.cardSets.concat([set])
      }
    });
    // alert(this.state.cardSets);
  };

  render() {
    // alert(`${JSON.stringify(this.state.cardSets)}`);
    return(
      <View>
        <Example/>
        <TouchableOpacity
          style={styles.button}
          onPress={
            () => {
              alert('pressed');
              this.createCardSet();
            }
          }
        >
          <Text>New</Text>
        </TouchableOpacity>

        {
          // this.state.cardSets ?
            this.state.cardSets.map((cardSet) => {
              // alert('mapped');
              // alert(`${JSON.stringify(this.props.navigator)}`);
              return(
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('CardsView', {cardSetId: cardSet.id})}
                >
                  <Text style={styles.cardSet}>{cardSet.name}</Text>
                </TouchableOpacity>
              )
            })
            // :
            // <Text style={{size: 20}}>No card sets yet</Text>
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

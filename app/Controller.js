import React from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';

import CardSet from './CardSet';
import Card from "./Card";

export default class Controller {
  constructor(props) {
    // super(props);
  }

  // static createCardSet(name) {
  //   let set = CardSet.create(name);
  //   alert(set);
  //   return set;
  // }

  static async getAllSets() {
    let cardSets = [];
    for (id of CardSet.setIds) {
      alert(id);
      try {
        let set = await CardSet.get(id);
        cardSets.push(set);
      } catch (err) {
        console.error(err);
      }
    }

    return cardSets;
  }

  static async getAllCardsForASet(setId) {
    var cardIds;

    try {
      cardIds = await CardSet.getCardIds(setId);
      alert(`got ${JSON.stringify(cardIds)}`);
    } catch (err) {
      console.error(err);
    }
    let cards = [];

    for (id of cardIds) {
      alert(`iter card id, ${id}`);
      Card.get(id)
        .then(card => {
          cards.push(card);
        })
        .catch(err => console.error(err))
    }

    return cards;
  }

  static async createCard(setId, name, description) {
    // let set = CardSet.get(set);
    return CardSet.createCard(setId, name, description);
  }
}
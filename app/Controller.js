import React from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';

import CardSet from './CardSet';
import Card from "./Card";

export default class Controller extends React.Component {
  constructor(props) {
    super(props);
  }

  static createCardSet(name) {
    return CardSet.create(name);
  }

  static getAllSets() {
    let cardSets = [];
    for (id of CardSet.getIds()) {
      cardSets.push({
        id,
        name
      });
    }

    return cardSets;
  }

  static async getAllCardsForASet(setId) {
    let storageKey = `CardSet.this${setId}.cardIds`;
    let cardIds = CardSet.parseIds(await AsyncStorage(storageKey));
    let cards = [];

    for (id of cardIds) {
      cards.push(Card.get(id));
    }

    return cards;
  }
}
import React from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';

import CardSet from './CardSet';
import Card from "./Card";

export default class Controller {

  static async getAllSets() {
    let cardSets = [];

    if (CardSet.setIds == null) {
      try {
        await CardSet.defineCardSetIds()
      } catch (err) {
        console.error(err);
        return;
      }
    }

    for (id of CardSet.setIds) {
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
    } catch (err) {
      console.error(err);
    }
    let cards = [];

    for (id of cardIds) {
      Card.get(id)
        .then(card => {
          cards.push(card);
        })
        .catch(err => console.error(err))
    }

    return cards;
  }

  static async createCard(setId, name, description) {
    return CardSet.createCard(setId, name, description);
  }
}
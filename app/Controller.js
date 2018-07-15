import React from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';

import CardSet from './CardSet';
import Card from "./Card";

/**
 * Central controller for defining static methods for: get, create, delete
 * of cards or card sets
 */
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
    let cardIds;

    try {
      cardIds = await CardSet.getCardIds(setId);
    } catch (err) {
      console.error(err);
    }
    let cards = [];

    for (id of cardIds) {
      try {
        let card = await Card.get(id);
        if (card) {
          cards.push(card);
        }
      } catch (err) {
        console.error(err);
      }
    }

    return cards;
  }

  static async createCard(setId, name, description) {
    return CardSet.createCard(setId, name, description);
  }

  static async deleteCard(setId, cardId) {
    return CardSet.deleteCard(setId, cardId);
  }
}
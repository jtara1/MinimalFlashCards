import React from 'react';
import {
  View,
  AsyncStorage
} from 'react-native';

import Card from './Card';

export default class CardSet {
  static _ids;
  static get ids() {
    if (!CardSet._ids) {
      CardSet._defineCardSetIds();
    }

    return this._ids;
  };

  static parseIds = (idsStr) => {
    let indices = idsStr.split(',');
    return Number.apply(null, indices);
  };

  /**
   *
   * @private
   */
  static _defineCardSetIds() {
    // get the number of sets created
    // eg: "1,4,5,6,10,402"
    try {
      AsyncStorage.getItem('CardSet.ids').then((setIndices) => {
        if (setIndices === null) {
          CardSet.ids = [];
        } else {
          CardSet.ids = CardSet.parseIds(setIndices);
        }
      });
    } catch (error) {
      alert(error);
    }

    return CardSet.ids;
  }


  static create(name) {
    let id;
    // first set we're adding
    if (CardSet.ids.length === 0) {
      id = 0;
    } else {
      // next id is the largest incremented by 1
      id = CardSet.ids[CardSet.ids.length - 1] + 1;
    }

    AsyncStorage.setItem(`CardSet.this${id}.name`, name);
    CardSet._addIdAndSaveCardSetIds(id);

    return {
      id,
      name,
    }
  }

  /**
   * Helper function for creating a new card set. Adds to the static attr and
   * saves all the ids
   * @param newIndex
   * @private
   */
  static _addIdAndSaveCardSetIds(newIndex) {
    CardSet.ids.push(newIndex);
    let str = CardSet.ids.join(',');
    AsyncStorage.setItem('CardSet.ids', str);
  }

  /**
   * Add a card id to the array of card ids for a given card set
   * @param setId
   * @param cardId
   * @returns {Promise<void>}
   */
  static async addCard(setId, cardId) {
    let storageKey = `CardSet.this${setId}.cardIds`;

    // get the array of card ids for this set
    let cardIdsStr = await AsyncStorage.getItem(storageKey);
    let cardIds = CardSet.parseIds(cardIdsStr);

    // add the new card id to this array
    cardIds.push(cardId);

    // save it
    cardIdsStr = cardIds.join(',');
    AsyncStorage.setItem(storageKey, cardIdsStr);
  }

    static getAllSets() {
    let cardSets = [];
    for (id of CardSet.ids) {
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
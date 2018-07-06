import React from 'react';
import {
  View,
  AsyncStorage
} from 'react-native';

import Card from './Card';
import CommonCard from './CommonCard';

export default class CardSet extends CommonCard {
  static setIds;

  static getCardSetIds() {
    var ids = [];
    // get the number of sets created
    // eg: "1,4,5,6,10,402"
    try {
      AsyncStorage.getItem('CardSet.ids', (setIds) => {
        if (setIds !== null) {
          ids = CardSet.parseIds(setIds);
        }
      });
    } catch (error) {
      alert(error);
    }

    return ids;
  }

  static async get(setId) {
    let name = await AsyncStorage.getItem(`CardSet.this${setId}.name`);
    return {
      id: setId,
      name,
    }
  }

  /**
   * Get all the card ids of a given set.
   * @param setId
   * @returns {Promise<*>}
   */
  static async getCardIds(setId) {
    let ids = await AsyncStorage.getItem(`CardSet.this${setId}.cardIds`);

    // there were no card yet added to this set
    if (ids == null) {
      return [];
    }
    return CardSet.parseIds(ids);
  }

  constructor(name) {
    super();
    // ids of all sets
    this.name = name;
    this.cardIds = [];

    this._createSetId();
    AsyncStorage.setItem(`CardSet.this${this.id}.name`, name);
  }

  _createSetId() {
    var id;
    // first set we're adding
    if (CardSet.setIds.length === 0) {
      id = 0;
    } else {
      // next id is the largest incremented by 1
      id = CardSet.setIds[CardSet.setIds.length - 1] + 1;
    }
    this.id = id;

    this._addIdAndSaveCardSetIds(id);
  }

  _addIdAndSaveCardSetIds(id) {
    CardSet.setIds.push(id);
    let str = CardSet.setIds.join(',');
    // alert(str);
    AsyncStorage.setItem('CardSet.ids', str);
  }

  /**
   * Creates a new card for a given set, and save the
   * id of the card in the card ids for this set.
   * @param setId
   * @param name
   * @param description
   */
  static async createCard(setId, name, description) {
    let card = new Card(name, description);
    var cardIds;
    try {
      cardIds = await CardSet.getCardIds(setId);
    } catch (err) {
      console.log(err);
    }

    if (cardIds != null) {
      cardIds.push(card.id);

      let str = cardIds.join(',');
      AsyncStorage.setItem(`CardSet.this${setId}.cardIds`, str);
    } else {
      alert('not gucci');
    }

    return card;
  }
}

(function defineSetIds() {
  CardSet.setIds = CardSet.getCardSetIds();
})();
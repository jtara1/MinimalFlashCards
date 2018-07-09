import React from 'react';
import {
  View,
  AsyncStorage
} from 'react-native';

import Card from './Card';
import CommonCard from './CommonCard';

export default class CardSet extends CommonCard {
  static setIds;

  static async defineCardSetIds() {
    let ids = [];
    // get the number of sets created
    // eg: "1,4,5,6,10,402"
    try {
      let setIds = await AsyncStorage.getItem('CardSet.ids');
      if (setIds != null) {
        ids = CardSet.parseIds(setIds);
      }
      CardSet.setIds = ids;
    } catch (error) {
      console.error(error);
    }
  }

  static async get(setId) {
    let name;
    try {
      name = await AsyncStorage.getItem(`CardSet.this${setId}.name`);
    } catch (err) {
      console.error(err);
    }

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
    let ids;
    try {
      ids = await AsyncStorage.getItem(`CardSet.this${setId}.cardIds`);
    } catch (err) {
      console.error(err);
    }

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
    try {
      AsyncStorage.setItem(`CardSet.this${this.id}.name`, name);
    } catch (err) {
      console.error(err);
    }
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

    try {
      AsyncStorage.setItem('CardSet.ids', str);
    } catch (err) {
      console.error(err);
    }
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
    let cardIds;
    try {
      cardIds = await CardSet.getCardIds(setId);
    } catch (err) {
      console.error(err);
    }

    if (cardIds != null) {
      cardIds.push(card.id);

      let str = cardIds.join(',');

      try {
        AsyncStorage.setItem(`CardSet.this${setId}.cardIds`, str);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error('cardIds is null');
    }

    return card;
  }
}

(async function defineSetIds() {
  try {
    await CardSet.defineCardSetIds();
  } catch (err) {
    console.error(err);
  }
})();
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
    let name, cardIds;
    try {
      name = await AsyncStorage.getItem(`CardSet.this${setId}.name`);
      cardIds = await AsyncStorage.getItem(`CardSet.this${setId}.cardIds`);
    } catch (err) {
      console.error(err);
    }

    return {
      id: setId,
      name,
      cardIds,
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

  /**
   * Delete a card by removing it from the set that it is in, and calling
   * the delete static method for the card to delete it completely
   * @param setId
   * @param cardId
   * @returns {Promise<void>}
   */
  static async deleteCard(setId, cardId) {
    let cardIds;
    try {
      cardIds = await AsyncStorage.getItem(`CardSet.this${setId}.cardIds`);
    } catch (err) {
      console.error(`Failed to get card ids of a set.\n${err}`);
    }

    if (cardIds) {
      // str -> array
      cardIds = cardIds.split(',');

      // remove the cardId that is being removed
      let idIndex = cardIds.findIndex(element => element === cardId);
      let ids = cardIds.slice(0, idIndex);
      ids.concat(cardIds.slice(idIndex + 1, cardIds.length));

      let str = cardIds.join(',');
      AsyncStorage.setItem(`CardSet.this${setId}.cardIds`, str);

      Card.delete(cardId);
    }
  }

  static async delete(id) {
    id = Number(id);
    let cardIds;
    try {
      cardIds = await AsyncStorage.getItem(`CardSet.this${id}.cardIds`);
      cardIds = cardIds.split(',');

      AsyncStorage.removeItem(`CardSet.this${id}.name`);
      AsyncStorage.removeItem(`CardSet.this${id}.cardIds`);
    } catch (err) {
      console.error(`Failed to remove name or of a card set.\n${err}`);
    }

    // remove the ids from the array
    let idIndex = CardSet.setIds.findIndex(element => element === id);
    let ids = CardSet.setIds.slice(0, idIndex);
    ids.concat(CardSet.setIds.slice(idIndex + 1, CardSet.setIds.length));

    // update the serialization for this
    CardSet.setIds = ids;
    let str = CardSet.setIds.join(',');

    try {
      AsyncStorage.setItem(`CardSet.ids`, str);
    } catch (err) {
      console.error(`Failed to update setIds.\n${err}`);
    }

    // delete each individual card created for this card set
    if (cardIds) {
      for (let cardId of cardIds) {
        if (cardId) {
          Card.delete(cardId);
        }
      }
    } else {
      // a card set with with no cards made for it might have been deleted or
      // console.warn('cardIds undef, can not delete each individual card for the set');
    }

  }
}

(async function defineSetIds() {
  try {
    await CardSet.defineCardSetIds();
  } catch (err) {
    console.error(err);
  }
})();
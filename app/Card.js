import React from 'react';
import {
  View,
  AsyncStorage,
} from 'react-native';

import CommonCard from './CommonCard';
import CardSet from "./CardSet";

export default class Card extends CommonCard {
  static cardIds;

  static async defineCardIds() {
    let ids = [];
    // get the ids of all cards created
    // eg: "1,4,5,6,10,402"
    try {
      let cardIds = await AsyncStorage.getItem('Card.ids');

      if (cardIds !== null) {
        ids = Card.parseIds(cardIds);
      }

      Card.cardIds = ids;
    } catch (error) {
      console.error(error);
    }
  }

  constructor(name, description) {
    super();
    this.name = name;
    this.description = description;

    this.id = null;

    this._createCardId()
      .then(() => {
        if (this.id == null) {
          console.error('id attr undef in Card obj');
        } else {
          try {
            AsyncStorage.setItem(`Card.this${this.id}.name`, name);
            AsyncStorage.setItem(`Card.this${this.id}.description`, description);
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      })
  }

  async _createCardId() {
    this.id = null;

    if (Card.cardIds != null) {
      // first card we're adding
      if (Card.cardIds.length === 0) {
        this.id = 0;
      } else {
        this.id = Card.cardIds[Card.cardIds.length - 1] + 1;
      }
    } else {
      console.error('Card.cardIds is undef')
    }
    this._addIdAndSaveCardIds(this.id);
  }

  _addIdAndSaveCardIds(id) {
    Card.cardIds.push(id);
    let str = Card.cardIds.join(',');

    try {
      AsyncStorage.setItem('Card.ids', str);
    } catch (err) {
      console.error(err);
    }
  }

  static async get(id) {
    let name, description;
    try {
      name = await AsyncStorage.getItem(`Card.this${id}.name`);
      description = await AsyncStorage.getItem(`Card.this${id}.description`);
    } catch (err) {
      console.error(err);
    }

    if (name == null && description == null) {
      let msg = 'invalid card id given or name & description were never defined';
      alert(msg)
    }

    return {
      id,
      name,
      description
    }
  }
}

(async function defineSetIds() {
  try {
    await Card.defineCardIds();
  } catch (err) {
    console.error(err);
  }
})();
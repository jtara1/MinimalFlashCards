import React from 'react';
import {
  View,
  AsyncStorage,
} from 'react-native';

import CommonCard from './CommonCard';
import CardSet from "./CardSet";

export default class Card extends CommonCard {
  static cardIds;

  static defineCardIds() {
    var ids = [];
    // get the ids of all cards created
    // eg: "1,4,5,6,10,402"
    try {
      AsyncStorage.getItem('Card.ids', (cardIds) => {
        // alert('setIds ', setIds);
        if (cardIds !== null) {
          ids = Card.parseIds(cardIds);
        } else {
          // alert('Card.cardIds hasn\'t been defined');
        }
        Card.cardIds = ids;
      });
    } catch (error) {
      alert(error);
    }

    return ids;
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
          AsyncStorage.setItem(`Card.this${this.id}.name`, name);
          AsyncStorage.setItem(`Card.this${this.id}.description`, description);
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
        alert(`Card.cardIds length is 0, ${JSON.stringify(Card.cardIds)}`);
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
    AsyncStorage.setItem('Card.ids', str);
  }

  static async get(id) {
    let name = await AsyncStorage.getItem(`Card.this${id}.name`);
    let description = await AsyncStorage.getItem(`Card.this${id}.description`);

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

(function defineSetIds() {
  Card.defineCardIds();
})();
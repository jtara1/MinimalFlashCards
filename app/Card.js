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
    this.name = name || 'undefined name';
    this.description = description || 'undefined description';

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
      // let msg = 'invalid card id given or name & description were never defined';
      // alert(msg)
      // console.warn(msg);
      return;
    }

    return {
      id,
      name,
      description
    }
  }

  static setName(id, name) {
    id = Number(id);

    try {
      AsyncStorage.setItem(`Card.this${id}.name`, name);
    } catch (err) {
      console.error(`Failed rename card name, id = ${id}`);
    }
  }

  static setDescription(id, description) {
    id = Number(id);

    try {
      AsyncStorage.setItem(`Card.this${id}.description`, description);
    } catch (err) {
      console.error(`Failed rename card description, id = ${id}`);
    }
  }

  static delete(id) {
    id = Number(id);

    try {
      AsyncStorage.removeItem(`Card.this${id}.name`);
      AsyncStorage.removeItem(`Card.this${id}.description`);
    } catch (err) {
      console.error(`Failed to remove name or description of a card.\n${err}`);
    }

    // remove the ids from the array
    let idIndex = Card.cardIds.findIndex(element => element === id);
    let ids = Card.cardIds.slice(0, idIndex);
    ids.concat(Card.cardIds.slice(idIndex + 1, Card.cardIds.length));

    // update the serialization for this
    Card.cardIds = ids;
    let str = Card.cardIds.join(',');

    try {
      AsyncStorage.setItem(`Card.ids`, str);
    } catch (err) {
      console.error(`Failed to update cardIds.\n${err}`);
    }
  }

}

(async function defineCardIds() {
  try {
    await Card.defineCardIds();
  } catch (err) {
    console.error(err);
  }
})();
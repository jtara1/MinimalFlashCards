import React from 'react';
import {
  View,
  AsyncStorage,
} from 'react-native';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  create(name, description) {
    AsyncStorage.setItem(`Card.this${id}.name`, name);
    AsyncStorage.setItem(`Card.this${id}.description`, description);
  }

  static async get(id) {
    let name = await AsyncStorage.getItem(`Card.this${id}.name`);
    let description = await AsyncStorage.getItem(`Card.this${id}.description`);

    if (name === null && description === null) {
      throw new Exception('invalid id given or name & description were never defined');
    }

    return {
      id,
      name,
      description
    }
  }
}
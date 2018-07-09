import React from 'react';
import {
  View,
} from 'react-native';

export default class HorizontalRule extends React.Component {
  render() {
    return (
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      />
    );
  }
}
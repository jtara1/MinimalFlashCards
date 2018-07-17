import React, { Component } from 'react';

import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import PhysicalCardsTemplate from './PhysicalCardsTemplate.js';

export default class Example extends Component {
  async createPDF() {
    let names = ['a', 'b', 'c', 'd'];
    let options = {
      html: PhysicalCardsTemplate,
      fileName: 'test',
      directory: 'docs',
    };

    let file = await RNHTMLtoPDF.convert(options)
    // console.log(file.filePath);
    alert(file.filePath);
  }

  render() {
    return(
      <View>
        <TouchableHighlight onPress={this.createPDF}>
          <Text>Create PDF</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
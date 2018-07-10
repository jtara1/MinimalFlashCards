import React from 'react';
import {
  View,
  Modal,
  Button,
  TextInput,
  Text,
} from 'react-native';

export default class NewCardView extends React.Component {
  /**
   * Needs this.props.onSubmit to be defined to be some function that takes
   * two args (str, str): name of card, description of card
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.cardName = 'undefined name';
    this.cardDescription = 'undefined description';
  }

  toggleVisible = () => {
    this.setState(prevState => {
      return {
        visible: !prevState.visible,
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    // alert(`${JSON.stringify(nextProps)}`);
    this.setState({ visible: nextProps.visible });
  }

  render() {
    let nameInput =
      <TextInput
        style={{
          flex: 1,
        }}
        onChangeText={
          text => {
            this.cardName = text;
          }}
      />;

    let descriptionInput =
      <TextInput
        multiline={true}
        style={{
          flex: 1,
        }}
        onChangeText={
          text => {
            this.cardDescription = text;
          }}
      />;

    let clearText = () => {
      nameInput.clear();
      descriptionInput.clear();
    };

    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.visible}
        onRequestClose={() => {
          this.setState({visible: false});
        }}
      >
        <Text>Name</Text>
        {nameInput}

        <Text>Description</Text>
        {descriptionInput}

        <Button
          title={'save'}
          onPress={
            () => {
              // alert(nameInput.value());
              this.props.onSubmit(this.cardName, this.cardDescription);
              this.setState({visible: false});
            }}
        />
        <Button
          title={'close'}
          onPress={
            () => {
              this.setState({
                visible: false
              })
            }}
        />
      </Modal>
    )
  }
}
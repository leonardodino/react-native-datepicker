# react-native-datepicker

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]

react-native DatePicker component for Android and iOS

## Install

```bash
npm install --save @leonardodino/react-native-datepicker
```

or

```bash
yarn add @leonardodino/react-native-datepicker
```

## Screenshots

![android](https://xgfe.github.io/react-native-datepicker/img/react-native-datepicker-android.gif)
![ios](https://xgfe.github.io/react-native-datepicker/img/react-native-datepicker-ios.gif)

## Usage

```javascript
import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'

export default class MyDatePicker extends Component {
  state = {date: new Date('2016-05-15')}

  render(){
    return (
      <DatePicker
        style={{width: 200}}
        date={this.state.date}
        mode='date'
        placeholder='select date'
        minDate={new Date('2016-05-01')}
        maxDate={new Date('2016-06-01')}
        confirmBtnText='Confirm'
        cancelBtnText='Cancel'
        customStyles={{
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({date})}}
      />
    )
  }
}
```

## Properties

| Prop  | Default  | Type | Description |
|---|:---:|:---:|---|
| style | - | `object` | Specify the style of the DatePicker, eg. width, height...  |
| date | - | `date` | Specify the display date of DatePicker. |
| mode | 'date' | `enum` | The `enum` of `date`, `datetime` and `time` |
| androidMode | 'default' | `enum` | The `enum` of `default`, `calendar` and `spinner` (only Android) |
| confirmBtnText | 'Confirm' | `string` | Specify the text of confirm btn in ios. |
| cancelBtnText | 'Cancel' | `string` | Specify the text of cancel btn in ios. |
| locale | 'en' | `string` | Specify the [`bcp47`](https://tools.ietf.org/html/bcp47) locale for display. |
| minDate | - | `date` | Restricts the range of possible date values. |
| maxDate | - | `date` | Restricts the range of possible date values. |
| duration | 300 | `number` | Specify the animation duration of datepicker.|
| customStyles | - | `number` | The hook of customize datepicker style, same as the native style. `dateTouchBody`, `dateInput`...|
| hideText | false | `boolean` | Controller whether or not show the `dateText` |
| disabled | false | `boolean` | Controller whether or not disable the picker |
| placeholder | '' | `string` | The placeholder show when this.props.date is falsy |
| onDateChange | - | `function` | This is called when the user confirm the picked date or time in the UI. |
| onOpenModal | - | `function` | This is called when the DatePicker Modal open. |
| onCloseModal | - | `function` | This is called when the DatePicker Modal close |
| onPressMask | - | `function` | This is called when clicking the ios Modal mask |
| modalOnResponderTerminationRequest | - | `function` | Set the callback for React Native's [Gesture Responder System](https://facebook.github.io/react-native/docs/gesture-responder-system.html#responder-lifecycle)'s call to `onResponderTerminationRequest`. By default this will reject a termination request, but can be overidden in case the View under the Modal is implementing custom gesture responders, and you wish for those to be overidden in certain cases.  |
| TouchableComponent | `TouchableHighlight` | `Component` | Replace the `TouchableHighlight` with a custom `Component`. For example : `TouchableOpacity` |

### Property `customStyles` available keys

* appearance: `dateInput`, `disabled`, `dateTouchBody`, `placeholderText`, `dateText`
* ios select panel: `datePickerCon`, `datePicker`, `btnConfirm`, `btnTextConfirm`, `btnCancel`, `btnTextCancel`

[npm-badge]: https://img.shields.io/npm/v/@leonardodino/react-native-datepicker.svg
[npm-url]: https://www.npmjs.com/package/@leonardodino/react-native-datepicker
[travis-badge]: https://api.travis-ci.org/leonardodino/react-native-datepicker.svg
[travis-url]: https://travis-ci.org/leonardodino/react-native-datepicker

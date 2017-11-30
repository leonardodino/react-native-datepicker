import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {Util} from 'expo'
import DatePicker from './lib/expo'
const NEUTRAL_STATE_COLOR = '#D5D8DB'

// can't use dynamic imports on expo, oh well...
// load'em all while Android lacks propper Intl
if (global.IntlPolyfill && typeof global.IntlPolyfill.__addLocaleData === 'function') {
  try {
    require('intl/locale-data/complete')
  } catch (e) {}
}

export default class App extends React.Component {
  state = {date: new Date(), birthday: null}
  render() {
    const {date, birthday} = this.state
    const customStyles = {
      dateInput: styles.dateInput,
      dateText: styles.dateText,
      placeholderText: styles.placeholderText,
    }
    return (
      <View style={styles.container}>
        <DatePicker
          style={styles.inputRow}
          customStyles={customStyles}
          mode="date"
          placeholder="birthday"
          date={birthday}
          onDateChange={birthday => this.setState({birthday})}
        />
        <DatePicker
          style={styles.inputRow}
          customStyles={customStyles}
          mode="datetime"
          date={date}
          onDateChange={date => this.setState({date})}
        />
        <DatePicker
          style={styles.inputRow}
          customStyles={customStyles}
          mode="time"
          date={date}
          onDateChange={date => this.setState({date})}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: NEUTRAL_STATE_COLOR,
    paddingBottom: 8,
    minHeight: 48,
  },
  dateInput: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 2,
    borderWidth: 0,
    alignSelf: 'flex-end',
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#313233',
    textDecorationLine: 'none',
  },
  placeholderText: {
    fontSize: 16,
    color: '#c9c9c9',
  },
})

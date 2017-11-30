import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {Util} from 'expo'
import DatePicker from './lib/DatePicker'
const NEUTRAL_STATE_COLOR = '#D5D8DB'

if (global.IntlPolyfill && typeof global.IntlPolyfill.__addLocaleData === 'function') {
  try {
    require('intl/locale-data/complete')
  } catch (e) {}
}

const getValidLocale = (locales = []) => {
  let valid = undefined
  let index = 0

  while (!valid && index < locales.length) {
    try {
      valid = Intl.getCanonicalLocales([locales[index]])[0]
    } catch (e) {}
    index += 1
  }

  return valid || 'en'
}

const getValidLocaleAsync = async () => {
  const expoLocale = await Util.getCurrentLocaleAsync()
  const locale = expoLocale.replace(/_/g, '-')
  const language = expoLocale.replace(/[_-].*/, '')
  const values = [expoLocale, locale, language]
  return getValidLocale(values)
}

export default class App extends React.Component {
  state = {date: new Date(), birthday: null, locale: undefined}
  async componentDidMount() {
    const locale = await getValidLocaleAsync()
    this.setState(state => ({...state, locale}))
  }
  render() {
    const {date, birthday, locale} = this.state
    const customStyles = {
      dateInput: styles.dateInput,
      dateText: styles.dateText,
      placeholderText: styles.placeholderText,
    }
    console.log('locale', locale)
    return (
      <View style={styles.container}>
        <DatePicker
          locale={locale}
          style={styles.inputRow}
          customStyles={customStyles}
          mode="date"
          placeholder="birthday"
          date={birthday}
          onDateChange={birthday => this.setState({birthday})}
        />
        <DatePicker
          locale={locale}
          style={styles.inputRow}
          customStyles={customStyles}
          mode="datetime"
          date={date}
          onDateChange={date => this.setState({date})}
        />
        <DatePicker
          locale={locale}
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

import React from 'react'
import {Util} from 'expo'
import DatePicker from './DatePicker'
import PropTypes from 'prop-types'

const validateLocale = (locales = []) => {
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
  return validateLocale(values)
}

export default class ExpoDatePicker extends React.Component {
  static propTypes = {
    ...DatePicker.propTypes,
    pickerRef: PropTypes.func,
  }
  state = {locale: undefined}
  async componentDidMount() {
    const locale = await getValidLocaleAsync()
    this.setState(state => ({...state, locale}))
  }
  render() {
    const {locale} = this.state
    const {pickerRef, ...props} = this.props
    return <DatePicker locale={locale} {...props} ref={pickerRef} />
  }
}

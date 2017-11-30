import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  DatePickerAndroid,
  TimePickerAndroid,
  DatePickerIOS,
  Platform,
  Animated,
  Keyboard,
  Easing,
} from 'react-native'
import styles from './styles'
import './IntlPatch'

const EPSILON = 1e-9

const AppleEasing = {
  easeIn: Easing.bezier(0.42, 0, 1, 1, EPSILON),
  easeOut: Easing.bezier(0, 0, 0.58, 1, EPSILON),
  easeInOut: Easing.bezier(0.42, 0, 0.58, 1, EPSILON),
  default: Easing.bezier(0.25, 0.1, 0.25, 1, EPSILON),
}

const DISMISSED = DatePickerAndroid.dismissedAction
const IS_24HOUR = true // [TODO]: check locale
const SUPPORTED_ORIENTATIONS = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
]

const noop = () => undefined
const removeSeconds = string => string.replace(/[^\d]?\d\d([^\d]*)$/, '$1')

const FORMAT_FUNCTIONS = {
  date: (date, locale) => date.toLocaleDateString(locale),
  time: (date, locale) => removeSeconds(date.toLocaleTimeString(locale)),
  datetime: (date, locale) => removeSeconds(date.toLocaleString(locale)),
}

const isFunction = x => typeof x === 'function'
const exec = (fn, ...args) => isFunction(fn) && fn(...args)

class DatePicker extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      date: this._getDate(this.props.date),
      modalVisible: false,
      translateY: new Animated.Value(this.props.height),
      allowPointerEvents: true,
    }
  }
  onStartShouldSetResponder(e) {
    return true
  }
  onMoveShouldSetResponder(e) {
    return true
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      this.setState(state => ({...state, date: this._getDate(nextProps.date)}))
    }
  }

  _modalShowAnimated = (callback = noop) =>
    Animated.timing(this.state.translateY, {
      toValue: 0,
      useNativeDriver: true,
      duration: this.props.duration,
      easing: AppleEasing.default,
    }).start(callback)

  _modalHideAnimated = (callback = noop) =>
    Animated.timing(this.state.translateY, {
      toValue: this.props.height,
      useNativeDriver: true,
      duration: this.props.duration,
      easing: AppleEasing.default,
    }).start(callback)

  _setModalVisible = visibility => {
    if (visibility) {
      this.setState({modalVisible: true}, () => this._modalShowAnimated())
    } else {
      this._modalHideAnimated(() => this.setState({modalVisible: false}))
    }
  }

  _hideModal = () => this._setModalVisible(false)
  _showModal = () => this._setModalVisible(true)

  _onPressMask = () => {
    return (this.props.onPressMask || this._onPressCancel)()
  }

  _onPressCancel = () => {
    this._hideModal()
    exec(this.props.onCloseModal)
  }

  _onPressConfirm = () => {
    this._datePicked(this.state.date)
    this._hideModal()
    exec(this.props.onCloseModal)
  }

  _getDate = _date => {
    const {mode, minDate, maxDate} = this.props
    const date = _date instanceof Date ? _date : new Date()
    if (minDate && date < minDate) return minDate
    if (maxDate && date > maxDate) return maxDate
    return date
  }

  _getDateStr = date => {
    const {mode, locale} = this.props
    const format = FORMAT_FUNCTIONS[mode] || FORMAT_FUNCTIONS['date']
    return format(date, locale)
  }

  _datePicked = date => exec(this.props.onDateChange, date)

  _getTitleElement = () => {
    const {date, placeholder, customStyles} = this.props
    const dateTextStyle = [styles.dateText, customStyles.dateText]
    const placeholderTextStyle = [styles.placeholderText, customStyles.placeholderText]

    if (date instanceof Date) return <Text style={dateTextStyle}>{this._getDateStr(date)}</Text>
    if (placeholder) return <Text style={placeholderTextStyle}>{placeholder}</Text>
    return null
  }

  _onDateChange = date => {
    this.setState({allowPointerEvents: false, date})
    setTimeout(() => {
      this.setState({allowPointerEvents: true})
    }, 200)
  }

  _onDatePicked = ({action, year, month, day}) => {
    if (action === DISMISSED) return this._onPressCancel()

    const date = new Date(year, month, day)
    this.setState(state => ({...state, date}), () => this._datePicked(date))
  }

  _onTimePicked = ({action, hour, minute}) => {
    if (action === DISMISSED) return this._onPressCancel()

    const date = new Date()
    date.setHours(hour)
    date.setMinutes(minute)
    this.setState(state => ({...state, date}), () => this._datePicked(date))
  }

  _onDatetimePicked = ({action, year, month, day}) => {
    if (action === DISMISSED) return this._onPressCancel()

    const {androidMode} = this.props
    const {date} = this.state
    const options = {
      hour: date.getHours(),
      minute: date.getMinutes(),
      is24Hour: IS_24HOUR,
      mode: androidMode,
    }
    TimePickerAndroid.open(options)
      .then(obj => ({...obj, year, month, day}))
      .then(this._onDatetimeTimePicked)
  }

  _onDatetimeTimePicked = ({action, year, month, day, hour, minute}) => {
    if (action === DISMISSED) return this._onPressCancel()

    const date = new Date(year, month, day, hour, minute)
    this.setState(state => ({...state, date}), () => this._datePicked(date))
  }

  _onPressDate = () => {
    if (this.props.disabled) return true

    Keyboard.dismiss()

    // reset state
    const date = this._getDate(this.props.date)
    this.setState(state => ({...state, date}))

    if (Platform.OS === 'ios') {
      this._showModal()
    } else {
      const {mode, androidMode, minDate, maxDate} = this.props

      if (mode === 'date') {
        DatePickerAndroid.open({
          date,
          minDate,
          maxDate,
          mode: androidMode,
        }).then(this._onDatePicked)
      }

      if (mode === 'time') {
        TimePickerAndroid.open({
          hour: date.getHours(),
          minute: date.getMinutes(),
          is24Hour: IS_24HOUR,
        }).then(this._onTimePicked)
      }

      if (mode === 'datetime') {
        DatePickerAndroid.open({
          date,
          minDate,
          maxDate,
          mode: androidMode,
        }).then(this._onDatetimePicked)
      }
    }

    exec(this.props.onOpenModal)
  }
  _renderIOSModal = () => {
    const {
      height,
      mode,
      customStyles,
      minDate,
      maxDate,
      minuteInterval,
      timeZoneOffsetInMinutes,
      cancelBtnText,
      confirmBtnText,
      TouchableComponent,
      testID,
      cancelBtnTestID,
      confirmBtnTestID,
    } = this.props

    const datePickerConStyle = [
      styles.datePickerCon,
      {height},
      {transform: [{translateY: this.state.translateY}]},
      customStyles.datePickerCon,
    ]

    const datePickerStyle = [styles.datePicker, customStyles.datePicker]
    const cancelBtnStyle = [styles.btnText, styles.btnCancel, customStyles.btnCancel]
    const cancelBtnTextStyle = [
      styles.btnTextText,
      styles.btnTextCancel,
      customStyles.btnTextCancel,
    ]
    const confirmBtnStyle = [styles.btnText, styles.btnConfirm, customStyles.btnConfirm]
    const confirmBtnTextStyle = [styles.btnTextText, customStyles.btnTextConfirm]

    return (
      <Modal
        transparent={true}
        animationType="none"
        visible={this.state.modalVisible}
        supportedOrientations={SUPPORTED_ORIENTATIONS}
        onRequestClose={this._hideModal}
      >
        <View style={{flex: 1}}>
          <TouchableComponent
            style={styles.datePickerMask}
            activeOpacity={1}
            underlayColor={'#00000077'}
            onPress={this._onPressMask}
          >
            <TouchableComponent underlayColor={'#fff'} style={{flex: 1}}>
              <Animated.View style={datePickerConStyle} useNativeDriver={true}>
                <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
                  <DatePickerIOS
                    date={this.state.date}
                    mode={mode}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    onDateChange={this._onDateChange}
                    minuteInterval={minuteInterval}
                    timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
                    style={datePickerStyle}
                  />
                </View>
                <TouchableComponent
                  underlayColor={'transparent'}
                  onPress={this._onPressCancel}
                  style={cancelBtnStyle}
                  testID={cancelBtnTestID}
                >
                  <Text style={cancelBtnTextStyle}>{cancelBtnText}</Text>
                </TouchableComponent>
                <TouchableComponent
                  underlayColor={'transparent'}
                  onPress={this._onPressConfirm}
                  style={confirmBtnStyle}
                  testID={confirmBtnTestID}
                >
                  <Text style={confirmBtnTextStyle}>{confirmBtnText}</Text>
                </TouchableComponent>
              </Animated.View>
            </TouchableComponent>
          </TouchableComponent>
        </View>
      </Modal>
    )
  }
  render() {
    const {style, customStyles, disabled, TouchableComponent, testID} = this.props

    const dateInputStyle = [
      styles.dateInput,
      customStyles.dateInput,
      disabled && styles.disabled,
      disabled && customStyles.disabled,
    ]

    return (
      <TouchableComponent
        style={[styles.dateTouch, style]}
        underlayColor={'transparent'}
        onPress={this._onPressDate}
        testID={testID}
      >
        <View style={[styles.dateTouchBody, customStyles.dateTouchBody]}>
          {this.props.hideText ? (
            <View />
          ) : (
            <View style={dateInputStyle}>{this._getTitleElement()}</View>
          )}
          {Platform.OS === 'ios' ? this._renderIOSModal() : null}
        </View>
      </TouchableComponent>
    )
  }
}

DatePicker.defaultProps = {
  mode: 'date',
  androidMode: 'default',
  height: 259, // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
  duration: 300, // slide animation duration time, default to 300ms, IOS only
  confirmBtnText: 'Confirm',
  cancelBtnText: 'Cancel',
  locale: 'en',
  customStyles: {},
  disabled: false,
  hideText: false,
  placeholder: '',
  TouchableComponent: TouchableHighlight,
  modalOnResponderTerminationRequest: e => true,
}

DatePicker.propTypes = {
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  androidMode: PropTypes.oneOf(['calendar', 'spinner', 'default']),
  date: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  height: PropTypes.number,
  duration: PropTypes.number,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  locale: PropTypes.string,
  customStyles: PropTypes.object,
  disabled: PropTypes.bool,
  onDateChange: PropTypes.func.isRequired,
  onOpenModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  onPressMask: PropTypes.func,
  placeholder: PropTypes.string,
  modalOnResponderTerminationRequest: PropTypes.func,
}

export default DatePicker

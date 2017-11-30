import React from 'react'
import {Platform, Animated, DatePickerAndroid, Modal} from 'react-native'
import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import DatePicker from '../DatePicker.js'

jest.mock('NativeAnimatedHelper')

Enzyme.configure({adapter: new Adapter()})

import 'jsdom-global/register'
console.error = function() {}

describe('DatePicker', () => {
  it('initialize', () => {
    const wrapper = shallow(<DatePicker />)
    const datePicker = wrapper.instance()

    expect(datePicker.props.mode).toEqual('date')
    expect(datePicker.props.duration).toEqual(300)
    expect(datePicker.props.height).toBeGreaterThan(200)
    expect(datePicker.props.confirmBtnText).toEqual('Confirm')
    expect(datePicker.props.cancelBtnText).toEqual('Cancel')
    expect(datePicker.props.customStyles).toMatchObject({})
    expect(datePicker.props.disabled).toEqual(false)

    expect(wrapper.state('date')).toBeInstanceOf(Date)
    expect(wrapper.state('modalVisible')).toEqual(false)
    expect(wrapper.state('translateY')).toBeInstanceOf(Animated.Value)

    const wrapper1 = shallow(
      <DatePicker
        date={new Date('2016-05-11')}
        mode="datetime"
        duration={400}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{testStyle: 123}}
        disabled={true}
      />,
    )
    const datePicker1 = wrapper1.instance()

    expect(datePicker1.props.mode).toEqual('datetime')
    expect(datePicker1.props.duration).toEqual(400)
    expect(datePicker1.props.confirmBtnText).toEqual('Confirm')
    expect(datePicker1.props.cancelBtnText).toEqual('Cancel')
    expect(datePicker1.props.customStyles).toMatchObject({testStyle: 123})
    expect(datePicker1.props.disabled).toEqual(true)
  })

  it('default selected Date', () => {
    var dateStr = null
    const wrapper = shallow(
      <DatePicker
        onDateChange={date => {
          dateStr = date
        }}
      />,
    )
    const datePicker = wrapper.instance()

    datePicker._onPressConfirm()
  })

  it('default selected Date with minDate and maxDate', () => {
    var date = null
    var dateMax = null
    var dateNormal = null

    const year3000 = new Date('3000-09-09')
    const year2016 = new Date('2016-07-07')

    const wrapper = shallow(
      <DatePicker
        minDate={year3000}
        onDateChange={value => {
          date = value
        }}
      />,
    )
    const datePicker = wrapper.instance()

    datePicker._onPressConfirm()

    expect(date).toEqual(year3000)

    const wrapperMax = shallow(
      <DatePicker
        maxDate={year2016}
        onDateChange={value => {
          dateMax = value
        }}
      />,
    )
    const datePickerMax = wrapperMax.instance()

    datePickerMax._onPressConfirm()
    expect(dateMax).toEqual(year2016)

    const wrapperNormal = shallow(
      <DatePicker
        minDate={year2016}
        maxDate={year3000}
        onDateChange={value => {
          dateNormal = value
        }}
      />,
    )
    const datePickerNormal = wrapperNormal.instance()

    datePickerNormal._onPressConfirm()
    expect(dateNormal.getFullYear()).toEqual(new Date().getFullYear())
  })

  it('setModalVisible', () => {
    const wrapper = shallow(<DatePicker />)
    const datePicker = wrapper.instance()

    datePicker._showModal()

    expect(wrapper.state('modalVisible')).toEqual(true)
    expect(wrapper.state('translateY')._animation._toValue).toEqual(0)

    datePicker._hideModal()
    expect(wrapper.state('translateY')._animation._toValue).toEqual(datePicker.props.height)
  })

  it('onPressCancel', () => {
    const setModalVisible = jest.fn()
    const onCloseModal = jest.fn()
    const wrapper = shallow(<DatePicker onCloseModal={onCloseModal} />)
    const datePicker = wrapper.instance()
    datePicker._setModalVisible = setModalVisible

    datePicker._onPressCancel()

    expect(setModalVisible).toHaveBeenCalledWith(false)
    expect(onCloseModal).toHaveBeenCalledTimes(1)
  })

  it('onPressMask', () => {
    const onPressMask = jest.fn()
    const wrapper = shallow(<DatePicker onPressMask={onPressMask} />)
    const datePicker = wrapper.instance()

    datePicker._onPressMask()

    // expect(onPressMask).toHaveBeenCalledTimes(1);

    // call onPressCancel when without onPressMask cb func
    const onPressCancel = jest.fn()
    const wrapper1 = shallow(<DatePicker />)
    const datePicker1 = wrapper1.instance()
    datePicker1._onPressCancel = onPressCancel

    datePicker1._onPressMask()

    expect(onPressCancel).toHaveBeenCalledTimes(1)
  })

  it('onPressConfirm', () => {
    const setModalVisible = jest.fn()
    const datePicked = jest.fn()
    const onCloseModal = jest.fn()
    const wrapper = shallow(<DatePicker onCloseModal={onCloseModal} />)
    const datePicker = wrapper.instance()
    datePicker._setModalVisible = setModalVisible
    datePicker._datePicked = datePicked

    datePicker._onPressConfirm()

    expect(setModalVisible).toHaveBeenCalledWith(false)
    expect(datePicked).toHaveBeenCalledTimes(1)
    expect(onCloseModal).toHaveBeenCalledTimes(1)
  })

  it('getDate', () => {
    const wrapper = shallow(<DatePicker date={new Date('2016-06-04')} />)
    const datePicker = wrapper.instance()

    const date = new Date()
    expect(datePicker._getDate(date)).toEqual(date)
  })

  it('datePicked', () => {
    const onDateChange = jest.fn()
    const wrapper = shallow(<DatePicker onDateChange={onDateChange} />)
    const datePicker = wrapper.instance()
    const date = new Date('2016-06-06')
    wrapper.setState({date})

    datePicker._datePicked(date)

    expect(onDateChange).toHaveBeenCalledWith(date)
  })

  it('onDatePicked', () => {
    const onDateChange = jest.fn()
    const wrapper = shallow(<DatePicker onDateChange={onDateChange} />)
    const datePicker = wrapper.instance()

    datePicker._onDatePicked({
      action: DatePickerAndroid.dismissedAction,
      year: 2016,
      month: 5,
      day: 12,
    })
    datePicker._onDatePicked({action: '', year: 2016, month: 5, day: 12})

    expect(wrapper.state('date')).toMatchObject(new Date(2016, 5, 12))
    expect(onDateChange).toHaveBeenCalledTimes(1)
  })

  it('onTimePicked', () => {
    const onDateChange = jest.fn()
    const wrapper = shallow(<DatePicker onDateChange={onDateChange} />)
    const datePicker = wrapper.instance()

    datePicker._onTimePicked({
      action: DatePickerAndroid.dismissedAction,
      hour: 12,
      minute: 10,
    })
    datePicker._onTimePicked({action: '', hour: 12, minute: 10})

    expect(wrapper.state('date').getHours()).toEqual(12)
    expect(wrapper.state('date').getMinutes()).toEqual(10)
    expect(onDateChange).toHaveBeenCalledTimes(1)
  })

  it('onDatetimeTimePicked', () => {
    const onDateChange = jest.fn()
    const wrapper = shallow(<DatePicker onDateChange={onDateChange} />)
    const datePicker = wrapper.instance()

    datePicker._onDatetimePicked({
      action: DatePickerAndroid.dismissedAction,
      year: 2016,
      month: 12,
      day: 12,
    })
    datePicker._onDatetimePicked({action: '', year: 2016, month: 12, day: 12})
    datePicker._onDatetimeTimePicked({
      year: 2016,
      month: 6,
      day: 1,
      action: DatePickerAndroid.dismissedAction,
      hour: 12,
      minute: 10,
    })
    datePicker._onDatetimeTimePicked({
      year: 2016,
      month: 6,
      day: 1,
      action: '',
      hour: 12,
      minute: 10,
    })

    expect(wrapper.state('date').getFullYear()).toEqual(2016)
    expect(wrapper.state('date').getMonth()).toEqual(6)
    expect(wrapper.state('date').getDate()).toEqual(1)
    expect(wrapper.state('date').getHours()).toEqual(12)
    expect(wrapper.state('date').getMinutes()).toEqual(10)
    expect(onDateChange).toHaveBeenCalledTimes(1)
  })

  it('onPressDate', () => {
    Platform.OS = 'ios'
    const setModalVisible = jest.fn()
    const onOpenModal = jest.fn()
    const wrapper = shallow(
      <DatePicker
        date={new Date('2016-05-06')}
        minDate={new Date('2016-04-01')}
        maxDate={new Date('2016-06-01')}
        onOpenModal={onOpenModal}
      />,
    )
    const datePicker = wrapper.instance()
    datePicker._setModalVisible = setModalVisible

    wrapper.setProps({disabled: true})
    datePicker._onPressDate()

    expect(setModalVisible).toHaveBeenCalledTimes(0)

    wrapper.setProps({disabled: false})
    datePicker._onPressDate()
    expect(wrapper.state('date')).toMatchObject(datePicker._getDate(new Date('2016-05-06')))
    expect(setModalVisible).toHaveBeenCalledTimes(1)
    expect(onOpenModal).toHaveBeenCalledTimes(1)

    Platform.OS = 'android'
    expect(datePicker._onPressDate).not.toThrow(Error)

    wrapper.setProps({mode: 'datetime'})
    expect(datePicker._onPressDate).not.toThrow(Error)

    wrapper.setProps({mode: 'time'})
    expect(datePicker._onPressDate).not.toThrow(Error)

    // wrapper.setProps({mode: 'tttt'});
    // expect(datePicker._onPressDate).toThrow(Error);
  })

  it('panResponder', () => {
    Platform.OS = 'ios'
    const wrapper = shallow(<DatePicker />)
    const datePicker = wrapper.instance()

    datePicker._onPressDate()

    expect(datePicker.onStartShouldSetResponder()).toEqual(true)
    expect(datePicker.onMoveShouldSetResponder()).toEqual(true)

    expect(datePicker.props.modalOnResponderTerminationRequest()).toEqual(true)
  })

  it('getTitleElement - with placeholder', () => {
    const placeholder = 'Please pick a date'
    const wrapper = shallow(<DatePicker placeholder={placeholder} />)
    const datePicker = wrapper.instance()

    expect(datePicker._getTitleElement().props.children).toEqual(placeholder)
  })

  it('getTitleElement - without placeholder', () => {
    const date = new Date('2016-06-04')
    const wrapper = shallow(<DatePicker date={date} />)
    const datePicker = wrapper.instance()

    expect(datePicker._getTitleElement().props.children).toEqual(datePicker._getDateStr(date))
  })

  it('`date` prop changes', () => {
    const date1 = new Date(2016, 5, 4)
    const date2 = new Date(2016, 5, 5)
    const wrapper = shallow(<DatePicker date={date1} />)

    expect(wrapper.state('date')).toMatchObject(date1)

    wrapper.setProps({date: date2})

    expect(wrapper.state('date')).toMatchObject(date2)
  })
})

describe('Coverage', () => {
  it('Event: onRequestClose', () => {
    Platform.OS = 'ios'
    const setModalVisible = jest.fn()
    const wrapper = shallow(<DatePicker />)
    const datePicker = wrapper.instance()
    datePicker._setModalVisible = setModalVisible

    wrapper.find(Modal).simulate('requestClose')

    expect(setModalVisible).toHaveBeenCalledTimes(1)
  })

  it('Event: onDateChange', () => {
    Platform.OS = 'ios'
    const wrapper = shallow(<DatePicker />)

    wrapper.find('DatePickerIOS').simulate('dateChange')
  })
})

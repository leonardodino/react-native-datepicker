import React, {Component} from 'react'
import {StyleSheet, Text, View, PanResponder} from 'react-native'
import DatePicker from './datepicker.js'

const NOW = new Date()

export default class Example extends Component {
  state = {
    date: NOW,
    time: NOW,
    datetime: NOW,
    datetime1: NOW,
  }

  componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e) => {console.log('onStartShouldSetPanResponder'); return true},
      onMoveShouldSetPanResponder: (e) => {console.log('onMoveShouldSetPanResponder'); return true},
      onPanResponderGrant: (e) => console.log('onPanResponderGrant'),
      onPanResponderMove: (e) => console.log('onPanResponderMove'),
      onPanResponderRelease: (e) => console.log('onPanResponderRelease'),
      onPanResponderTerminate: (e) => console.log('onPanResponderTerminate')
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to react-native-datepicker example!
        </Text>
        <DatePicker
          style={{width: 200}}
          date={this.state.date}
          mode='date'
          placeholder='placeholder'
          minDate={new Date('2016-05-01')}
          maxDate={new Date('2016-06-01')}
          onDateChange={date => this.setState({date})}
        />
        <Text style={styles.instructions}>date: {this.state.date}</Text>
        <DatePicker
          style={{width: 200}}
          date={this.state.time}
          mode='time'
          minuteInterval={10}
          onDateChange={time => this.setState({time})}
        />
        <Text style={styles.instructions}>time: {this.state.time}</Text>
        <DatePicker
          style={{width: 200}}
          date={this.state.datetime}
          mode='datetime'
          onDateChange={datetime => this.setState({datetime})}
        />
        <Text style={styles.instructions}>datetime: {this.state.datetime}</Text>
        <DatePicker
          style={{width: 200}}
          date={this.state.datetime1}
          mode='datetime'
          customStyles={{
            dateInput: {
              marginLeft: 36
            }
          }}
          minuteInterval={10}
          onDateChange={datetime1 => this.setState({datetime1})}
        />
        <Text style={styles.instructions}>datetime: {this.state.datetime1}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})

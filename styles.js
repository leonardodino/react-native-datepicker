import {StyleSheet} from 'react-native'

let style = StyleSheet.create({
  dateTouch: {
    width: 142,
  },
  dateTouchBody: {
    flexDirection: 'row',
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIcon: {
    width: 32,
    height: 32,
    marginLeft: 5,
    marginRight: 5,
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#c9c9c9',
    flex: 1,
  },
  datePickerMask: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#00000077',
  },
  datePickerCon: {
    backgroundColor: '#fff',
    height: 0,
    overflow: 'hidden',
  },
  btnText: {
    position: 'absolute',
    top: 0,
    height: 42,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextText: {
    fontWeight: '600',
    color: '#007aff',
    fontSize: 16,
  },
  btnTextCancel: {
    fontWeight: 'normal',
    color: '#666',
  },
  btnCancel: {
    left: 0,
  },
  btnConfirm: {
    right: 0,
  },
  datePicker: {
    marginTop: 42,
    backgroundColor: '#F8F8F8',
    borderTopColor: '#e5e5e5',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    borderTopWidth: 1,
  },
  disabled: {
    backgroundColor: '#eee',
  },
})

export default style

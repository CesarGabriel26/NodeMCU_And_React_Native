import React from 'react'
import { View, StyleSheet } from 'react-native'
import currentStyle from '../style/style_manager'


const EmptyCard = ({children}) => {
  return (
    <View style={style.card}>
      {children}
    </View>
  )
}

const style = StyleSheet.create({
  card: {
    backgroundColor: currentStyle.cardBackgroundColor,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default EmptyCard
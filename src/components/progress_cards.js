import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import currentStyle from '../style/style_manager'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import EmptyCard from './empty_card'

const ProgerssCard = (
  {
    minValue = 0,
    maxValue = 100,
    currentValue = 50,
    name = "progresso",
    valueType = "%",
    subTexto = "Algo Aqui",
    progressColor = currentStyle.defaultColor,
    shadowProgressColor = currentStyle.defaulShadow,
    buttons = []
  }
) => {
  const range = maxValue - minValue;
  const fill = ((currentValue - minValue) / range) * 100;

  if (buttons.length > 2) {
    buttons = buttons.slice(0, 2);
  }

  return (
    <EmptyCard style={style.card}>
      <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedCircularProgress
          size={160}
          width={6.7}
          fill={fill}
          tintColor={progressColor}
          backgroundColor={shadowProgressColor}
          arcSweepAngle={300}
          rotation={210}
          // dashedBackground={{ width: 6, gap: 15 }}
          lineCap="round"
          style={[style.circularProgress, { marginHorizontal: 20, marginVertical: 20 }]}
        >
          {
            (fill) => (
              <View style={style.innerContainer}>
                <Text style={style.uppertext}>{name}</Text>
                <Text style={style.text}>{currentValue.toFixed(1)}</Text>
                <Text style={style.subtext}>{valueType}</Text>
              </View>
            )
          }
        </AnimatedCircularProgress>
      </View>

      {
        (buttons.length > 0) ? (
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }} >
            <TouchableOpacity
              style={[style.buttons, { borderEndEndRadius: 10, borderTopEndRadius: 10, borderEndStartRadius: 25 }]}
              onPress={() => buttons[0].onPressed()}
            >
              <Text style={style.buttonText} >
                {
                  buttons[0].text
                }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[style.buttons, { borderEndStartRadius: 10, borderTopStartRadius: 10, borderEndEndRadius: 25 }]}
              onPress={() => buttons[1].onPressed()}
            >
              <Text style={style.buttonText} >
                {
                  buttons[1].text
                }
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[style.subtext, { color: progressColor, marginBottom: 20 }]}>{subTexto}</Text>
        )
      }

    </EmptyCard>
  )
}

const style = StyleSheet.create({
  card: {
    backgroundColor: currentStyle.cardBackgroundColor,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    width: "45%",
    height: 50,
    backgroundColor: currentStyle.buttonBackgroundColor,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: currentStyle.buttonTextColor,
    fontSize: 25
  },
  circularProgress: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  uppertext: {
    fontSize: 15,
    color: currentStyle.gaugeTextColor,
    textTransform: "uppercase"
  },
  text: {
    fontSize: 20,
    color: currentStyle.gaugeTextColor,
  },
  subtext: {
    fontSize: 20,
    color: currentStyle.gaugeTextColor,
  }
})

export { ProgerssCard }
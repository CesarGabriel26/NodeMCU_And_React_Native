import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import currentStyle from "../style/style_manager"
import { ProgerssCard } from '../components/progress_cards';
import EmptyCard from '../components/empty_card';

export default function OverViewPage() {
    const [serverState, setServerState] = useState('Loading...');
    const [isConnected, setIsConnected] = useState(false);
    const [blueLed, setBlueLed] = useState(false);
    const [alarm, setAlarm] = useState(false);

    const [RGB_ON, setRGB_ON] = useState(false)
    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(0);
    const [blue, setBlue] = useState(0);
    const [RGB_Brightness1, setRGB_Brightness1] = useState(100)

    const [temperature, setTemperature] = useState(0);

    const [currentColor, setCurrentColor] = useState('#FFFFFF'); // Cor inicial, ajuste conforme necessário

    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://192.168.0.216/ws'); // Substitua pelo endereço IP do ESP

        ws.current.onopen = () => {
            setServerState('Connected to the server');
            setIsConnected(true);
        };

        ws.current.onclose = (e) => {
            setServerState('Disconnected. Check internet or server.');
            setIsConnected(false);
        };

        ws.current.onerror = (e) => {
            setServerState(e.message);
        };

        ws.current.onmessage = (e) => {
            console.log('Message from server: ', e.data);
            try {
                const data = JSON.parse(e.data);

                if (data.temperature) {
                    setTemperature(data.temperature);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message: ', error);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const getTemperatureStatus = (temp) => {
        switch (true) {
            case (temp >= -55 && temp < -20):
                return "Frio Extremo";
            case (temp >= -20 && temp < 0):
                return "Muito Frio";
            case (temp >= 0 && temp < 20):
                return "Frio";
            case (temp >= 20 && temp < 30):
                return "Adequado";
            case (temp >= 30 && temp < 36):
                return "Quente";
            case (temp >= 36 && temp < 46):
                return "Muito Quente";
            case (temp >= 46 && temp < 56):
                return "Calor Extremo";
            case (temp >= 56 && temp < 71):
                return "Perigoso";
            case (temp >= 71 && temp < 100):
                return "Risco de Vida";
            case (temp >= 100):
                return "Risco de incendio";
            default:
                return "ERRO";
        }
    };

    const createCommand = (type) => {
        var command = {}

        switch (type) {
            case 'setLED':
                command = {
                    command: 'setLED',
                    red: parseInt(red),
                    green: parseInt(green),
                    blue: parseInt(blue),
                }
                break;
            case 'setBlueLED':
                command = {
                    command: 'setBlueLED',
                    state: blueLed
                }
                break;
            case 'setAlarm':
                command = {
                    command: 'setAlarm',
                    state: alarm
                }
                break;

            default:
                break;
        }

        return command
    }

    const onColorChange = (color) => {
        // hexToRgb(color)
        setCurrentColor(color);
    };

    const onColorChangeComplete = (color) => {
        if (RGB_ON) {
            setCurrentColor(color);
        }
        hexToRgb(color)

    };

    const hexToRgb = (hex) => {
        if (RGB_ON) {
            // Converte hexadecimal para RGB
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);


            // Converte o brilho de 0-100 para uma escala de 0-1
            const brightnessFactor = RGB_Brightness1 / 100;

            // Ajusta os valores RGB com base no brilho
            const adjustedRed = Math.min(255, Math.max(0, Math.round(r * brightnessFactor)));
            const adjustedGreen = Math.min(255, Math.max(0, Math.round(g * brightnessFactor)));
            const adjustedBlue = Math.min(255, Math.max(0, Math.round(b * brightnessFactor)));

            setRed(adjustedRed)
            setGreen(adjustedGreen)
            setBlue(adjustedBlue)

        } else {
            setRed(0)
            setGreen(0)
            setBlue(0)
        }
        sendMessage('setLED')
    };

    const sendMessage = (type) => {
        if (ws.current && isConnected) {
            var command = createCommand(type)

            console.log('Sending message: ', command);
            ws.current.send(JSON.stringify(command));

        } else {
            console.warn('WebSocket is not connected');
        }
    };

    return (
        <View style={styles.container}>


            <ScrollView style={{ marginVertical: 25, flex: 1, width: '100%', height: '100%' }} contentContainerStyle={{ justifyContent: 'center', marginHorizontal: 25 }} >
                <View style={{ flexDirection: "column", gap: 15 }} >
                    {/* TERMISTOR */}
                    <ProgerssCard
                        progressColor={currentStyle.tempGaugeColor}
                        shadowProgressColor={currentStyle.tempGaugeColorShadow}
                        minValue={-55}
                        maxValue={125}
                        currentValue={temperature}
                        name="temp"
                        valueType="ºC"
                        subTexto={getTemperatureStatus(temperature)}
                    />

                    { /* RGB */}

                    <EmptyCard>
                        {
                            RGB_ON ? (
                                <Icon name="lightbulb-on-outline" size={200} color="white" />
                            ) : (
                                <Icon name="lightbulb-off-outline" size={200} color="white" />
                            )
                        }

                        <TouchableOpacity style={styles.ON_OFF_BUTTON} onPress={() => {
                            setRGB_ON(!RGB_ON);
                            onColorChangeComplete(' ')
                        }} >
                            <Text style={styles.buttonText}>
                                {RGB_ON ? 'OFF' : 'ON'}
                            </Text>
                        </TouchableOpacity>
                    </EmptyCard>

                    <ProgerssCard
                        currentValue={RGB_Brightness1}
                        name="brightness"
                        buttons={[
                            {
                                text: "+",
                                onPressed: () => {
                                    if (RGB_Brightness1 >= 100) {
                                        RGB_Brightness1 = 100
                                    };
                                    setRGB_Brightness1(RGB_Brightness1 + 1);
                                    onColorChangeComplete(currentColor);
                                }
                            },
                            {
                                text: "-",
                                onPressed: () => {
                                    if (RGB_Brightness1 <= 2) {
                                        RGB_Brightness1 = 0
                                    };
                                    setRGB_Brightness1(RGB_Brightness1 - 1);
                                    onColorChangeComplete(currentColor);
                                }
                            }
                        ]}
                    />
                    <EmptyCard>
                        <ColorPicker
                            ref={r => { picker = r }}
                            color={currentColor}
                            swatchesOnly={false}
                            onColorChange={onColorChange}
                            onColorChangeComplete={onColorChangeComplete}
                            thumbSize={40}
                            sliderSize={20}
                            noSnap={true}
                            row={false}
                            swatchesLast={true}
                            swatches={true}
                            discrete={false}
                            wheelLodingIndicator={<ActivityIndicator size={40} />}
                            sliderLodingIndicator={<ActivityIndicator size={20} />}
                            useNativeDriver={false}
                            useNativeLayout={false}
                            style={{ marginHorizontal: 20, marginVertical: 20 }}
                        />
                    </EmptyCard>

                    { /* led azul */}

                    <EmptyCard>
                        {
                            blueLed ? (
                                <Icon name="lightbulb-on-outline" size={200} color="white" />
                            ) : (
                                <Icon name="lightbulb-off-outline" size={200} color="white" />
                            )
                        }

                        <TouchableOpacity style={styles.ON_OFF_BUTTON} onPress={() => {
                            setBlueLed(!blueLed);
                            sendMessage("setBlueLED")
                        }} >
                            <Text style={styles.buttonText}>
                                {blueLed ? 'OFF' : 'ON'}
                            </Text>
                        </TouchableOpacity>
                    </EmptyCard>

                    {/* ALARME */}

                    <EmptyCard>
                        {
                            alarm ? (
                                <Icon name="alarm-light-outline" size={200} color="white" />
                            ) : (
                                <Icon name="alarm-light-off-outline" size={200} color="white" />
                            )
                        }

                        <TouchableOpacity style={styles.ON_OFF_BUTTON} onPress={() => {
                            setAlarm(!alarm);
                            sendMessage("setAlarm")
                        }} >
                            <Text style={styles.buttonText}>
                                {alarm ? 'OFF' : 'ON'}
                            </Text>
                        </TouchableOpacity>
                    </EmptyCard>
                </View>

            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentStyle.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
    },

    ON_OFF_BUTTON: {
        width: "100%",
        height: 50,
        backgroundColor: currentStyle.buttonBackgroundColor,
        justifyContent: "center",
        alignItems: "center",
        borderEndEndRadius: 25,
        borderEndStartRadius: 25
    },
    buttonText: {
        color: currentStyle.buttonTextColor,
        fontSize: 25
    },
});

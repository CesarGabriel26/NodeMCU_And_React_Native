import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const App = () => {
    const [serverState, setServerState] = useState('Loading...');
    const [isConnected, setIsConnected] = useState(false);
    const [blueLed, setBlueLed] = useState(true);
    const [alarm, setAlarm] = useState(true);

    const [red, setRed] = useState(25);
    const [green, setGreen] = useState(35);
    const [blue, setBlue] = useState(25);
    const [temperature, setTemperature] = useState(null);

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
            <Text>RGB LED Control</Text>
            <TextInput
                style={styles.input}
                placeholder="Red"
                keyboardType="numeric"
                value={String(red)}
                onChangeText={setRed}
            />
            <TextInput
                style={styles.input}
                placeholder="Green"
                keyboardType="numeric"
                value={String(green)}
                onChangeText={setGreen}
            />
            <TextInput
                style={styles.input}
                placeholder="Blue"
                keyboardType="numeric"
                value={String(blue)}
                onChangeText={setBlue}
            />
            <Button title="Send" onPress={() => sendMessage('setLED')} />

            <Button title={`Toggle Blue LED: ${blueLed ? 'ON' : 'OFF'}`} onPress={() => {
                setBlueLed(!blueLed)
                sendMessage("setBlueLED")
            }} />

            <Button title={`Toggle Alarm: ${alarm ? 'ON' : 'OFF'}`} onPress={() => {
                setAlarm(!alarm)
                sendMessage("setAlarm")
            }} />

            {temperature !== null && (
                <Text>Temperature: {temperature.toFixed(2)} °C</Text>
            )}
            <Text>{serverState}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        width: '80%',
        paddingHorizontal: 10,
    },
});

export default App;

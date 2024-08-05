// Alert.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Alert = ({ message, type, onClose }) => {
    return (
        <View style={[styles.alert, styles[type]]}>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    alert: {
        padding: 15,
        borderRadius: 4,
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    success: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
    },
    danger: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
    },
    warning: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffeeba',
    },
    info: {
        backgroundColor: '#d1ecf1',
        borderColor: '#bee5eb',
    },
    message: {
        fontSize: 16,
    },
    closeButton: {
        marginLeft: 10,
    },
    closeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Alert;

import React, { useState, useEffect } from 'react';

import { KeyboardAvoidingView, Platform, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

import styles from './css/LoginStyles';
import logo from '../assets/logo.png';

function Login({ navigation }){

    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if(user){
                navigation.navigate('Main', { user } )
            }
        })
    }, [])

    async function handleLogin(){
        
        const response = await api.post('/devs', { username: user });

        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id);

        navigation.navigate('Main', { user: _id });
        
    }

    return (
    <KeyboardAvoidingView 
    behavior="padding"
    enabled={Platform.OS === 'ios'}
    style={styles.container}>
       
        <Image source={logo} />
       
        <TextInput autoCapitalize="none" autoCorrect={false} placeholder="Digite seu usuário no GitHub" 
        placeholderTextColor="#999"
        style={styles.input} 
        value={user}
        onChangeText={setUser} />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

    </KeyboardAvoidingView>
    )
}

export default Login;
import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

import api from '../services/api';

import styles from './css/MainStyles';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

import itsamatch from '../assets/itsamatch.png'

function Main({ route, navigation }){

    const id = route.params.user;

    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);


    useEffect(() => {
        async function loadlUsers(){
            const response = await api.get('/devs', {
                headers: {
                    user: id,
                }
            })
            setUsers(response.data);
        }
        loadlUsers();
    }, [id]);

    useEffect(() => {
        const socket = io('http://10.0.0.105:3333', {
            query: { user: id }
        });

        socket.on('match', dev =>  {
            setMatchDev(dev);
        })
    }, [id])

    async function handleLike(){
        
        const [user, ...rest] = users

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        })
        setUsers(rest);
    } 

    async function handleDisLike(){
        const [user, ...rest] = users

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id },
        })
        setUsers(rest);
    }

    async function handleLogOut(){
        AsyncStorage.clear();

        navigation.navigate('Entrar');
    }


    return (
    <SafeAreaView style={styles.container}>
       <TouchableOpacity onPress={handleLogOut}>

            <Image style={styles.logo} source={logo} />

       </TouchableOpacity>
        
        <View style={styles.cardsContainer}>

        {
           users.length === 0 ? <Text style={styles.empty}>Tem ninguém, parça.</Text> : (
           users.map((user, index) => (
            <View key={user._id} style={[styles.card, {zIndex: users.length - index}]}>
                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                <View style={styles.footer}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text numberOfLines={3} style={styles.bio}>{user.bio}</Text>
                </View>
            </View>
        )))
        }
            
        </View>

        { 
            users.length > 0 && (
                <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleDisLike}>
                    <Image source={dislike}></Image>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLike}>
                    <Image source={like}></Image>
                </TouchableOpacity>
            </View>
        ) 
        }       

        {
            matchDev && (
                <View style={styles.matchContainer}>
                    
                    <Image style={styles.matchImage} source={itsamatch} />
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
                    
            <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch} >FECHAR</Text>
                    </TouchableOpacity>

                </View>
            )
        } 
        
    </SafeAreaView>
    )
}


export default Main;
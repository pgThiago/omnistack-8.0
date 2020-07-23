import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Login from './pages/Login';
import Main from './pages/Main';

const Stack = createStackNavigator();

function Routes(){
    return(
    <NavigationContainer >
        <Stack.Navigator initialRouteName="Entrar" >
            <Stack.Screen name="Entrar" component={Login}  options={{ headerTitleAlign: 'center'}}/>
            <Stack.Screen name="Main" component={Main} options={{title: 'Devs', headerTitleAlign: 'center'}} />
        </Stack.Navigator>
    </NavigationContainer>
    )
}

export default Routes;
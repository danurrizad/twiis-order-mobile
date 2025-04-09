import colors from '@/app/utils/colors';
import React from 'react';
import {ActivityIndicator, Dimensions, Image, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const { height } = Dimensions.get('window')

const Loading = () => (
  <SafeAreaProvider style={{ backgroundColor: "white", flex: 1, width: '100%', position: 'absolute', top: 0, height: height, zIndex: 1000, alignItems: "center", justifyContent: "center"}}>
    <SafeAreaView >
        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <Image source={require('../assets/images/logo-twiis-2.png')}  style={{ resizeMode: "center", height: 150, width: 300}}/>
            <View style={{ flexDirection: "row"}}>
                <ActivityIndicator size="large" color={colors.primary4} />
                <ActivityIndicator size="large" color={colors.primary} />
                <ActivityIndicator size="large" color={colors.primary2} />
                <ActivityIndicator size="large" color={colors.primary3} />
                <ActivityIndicator size="large" color='black' />
            </View>
        </View>
    </SafeAreaView>
  </SafeAreaProvider>
);

export default Loading;
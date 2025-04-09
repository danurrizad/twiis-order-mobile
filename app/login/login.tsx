import { View, Text, Image, TextInput, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Stack, useRouter } from 'expo-router';
import colors from '../utils/colors'
import useAuthService from '@/services/AuthDataService';
import * as SecureStore from 'expo-secure-store';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

function Login() {
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isFocused, setIsFocused] = React.useState<boolean>(false);
    const [isFocusedPass, setIsFocusedPass] = React.useState<boolean>(false);
    const [heightPassInput, setHeightPassInput] = React.useState<number>(0)
    const router = useRouter()
    const [form, setForm] = React.useState({
        username: "",
        password: ""
    })

    const { login } = useAuthService()

    const handleLogin = async() => {
        try {
            setLoading(true)
            const response: any = await login(form.username, form.password)
            await SecureStore.setItemAsync('accessToken', response?.data.accessToken);
            await SecureStore.setItemAsync('refreshToken', response?.data.refreshToken);
            router.push('/(tabs)')
        } catch (error) {
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    return (
    <>
        <View style={{paddingHorizontal: 40, backgroundColor: "white", height: "100%", flex: 1, justifyContent: "center"}}>
            <View style={{ flexDirection: "column", alignItems: "center", marginBottom: 50}}>
                <Image 
                    source={require("../../assets/images/logo/TWIIS-NEW.png")} 
                    style={{ height: 100, width: 300, resizeMode: "center"}}
                />
                <Text style={{ fontSize: 30}}>Welcome to TWIIS!</Text>
                
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-start"}}>
                <Text style={{ fontSize: 16, marginBottom: 5}}>Username</Text>
                <TextInput 
                    placeholder='Insert username'
                    value={form.username}
                    onChangeText={(text: string) => setForm({ ...form, username: text})}
                    style={{ borderWidth: 2, paddingHorizontal: 10, borderColor: isFocused ? colors.primary : "black", borderRadius: 10, width: "100%"}}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize='none'
                />
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-start", marginTop: 20}}>
                <Text style={{ fontSize: 16, marginBottom: 5}}>Password</Text>
                <View style={{ position: "relative", width: "100%"}}>
                    <TextInput 
                        placeholder='Your password'
                        secureTextEntry={!showPassword}
                        value={form.password}
                        onChangeText={(text: string) => setForm({ ...form, password: text})}
                        style={{ borderWidth: 2, paddingHorizontal: 10, borderColor: isFocusedPass ? colors.primary : "black", borderRadius: 10, width: "100%", paddingRight: 30}}
                        onFocus={() => setIsFocusedPass(true)}
                        onBlur={() => setIsFocusedPass(false)}
                        autoCapitalize='none'
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                        onKeyPress={(event)=>{
                            if(event.nativeEvent.key == "Enter"){
                                handleLogin()
                            } 
                        }}
                    />
                    <TouchableOpacity 
                        onLayout={(event) => setHeightPassInput(event.nativeEvent.layout.height)} 
                        onPress={()=>setShowPassword(!showPassword)} 
                        style={{ position: "absolute", right: 10, top: '50%', transform: [{ translateY: -heightPassInput/2}]}}
                        >
                        <FontAwesomeIcon icon={ !showPassword ? faEyeSlash : faEye}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ marginTop: 20}}>
                <TouchableOpacity disabled={loading} onPress={handleLogin} style={{ backgroundColor: loading ? "#D9D9D9" : colors.primary, paddingVertical: 12, borderRadius: 10, flexDirection: "row", justifyContent: "center", gap: 10}}>
                    { loading && <ActivityIndicator color={'white'}/>}
                    <Text style={{ color: loading ? "#8B8B8B" : "white", fontSize: 16}}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    </>
  );
}

export default Login
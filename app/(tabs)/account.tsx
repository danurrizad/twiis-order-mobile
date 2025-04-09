import { View, Text, ScrollView, Pressable, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClipboard, faEnvelope, faEnvelopeOpen, faHeart, faRectangleList, faUser, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';
import useVerify from '@/hooks/UseVerify';
import * as SecureStore from 'expo-secure-store';
import useAuthService from '@/services/AuthDataService';

function AccountView() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { token, name, roleName } = useVerify()
  const { logout } = useAuthService()

  const handleLogout = async () => {
    console.log("Logging out.....")
    try {
      setLoading(true)
      const response = await logout()
      // console.log("response logout:", response)
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      router.push('/login/login')
    } catch (error) {
      console.error(error)
    } finally{ 
      setLoading(false)
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "white", padding: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10}}>
        <FontAwesomeIcon icon={faUserCircle} size={75}/>
        <View>
          <Text style={{ fontSize: 24}}>{name}</Text>
          <Text style={{ fontSize: 14}}>{roleName.toUpperCase()}</Text>
        </View>
      </View>
      <View style={{borderBottomWidth: 1, borderColor: 'gray', paddingVertical: 10, marginTop: 40}}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 15}}>
          <FontAwesomeIcon icon={faUser} size={20}/>
          <View>
            <Text style={{  fontSize: 16}}>Profile</Text>
            <Text style={{  fontSize: 12, color: "gray"}}>Account information</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{borderBottomWidth: 1, borderColor: 'gray', paddingVertical: 20}}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 15}}>
          <FontAwesomeIcon icon={faRectangleList} size={20}/>
          <View>
            <Text style={{  fontSize: 16}}>History Order</Text>
            <Text style={{  fontSize: 12, color: "gray"}}>Recently transactions</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{borderBottomWidth: 1, borderColor: 'gray', paddingVertical: 20}}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 15}}>
          <FontAwesomeIcon icon={faHeart} size={20}/>
          <View>
            <Text style={{  fontSize: 16}}>Wishlist</Text>
            <Text style={{  fontSize: 12, color: "gray"}}>Your favorite items to order</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{borderBottomWidth: 1, borderColor: 'gray', paddingVertical: 20}}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 15}}>
          <FontAwesomeIcon icon={faEnvelope} size={20}/>
          <View>
            <Text style={{  fontSize: 16}}>Approval</Text>
            <Text style={{  fontSize: 12, color: "gray"}}>Permitting authority issue of an order</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{borderBottomWidth: 1, borderColor: 'gray', paddingVertical: 20}}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 15}}>
          <FontAwesomeIcon icon={faEnvelopeOpen} size={20}/>
          <View>
            <Text style={{  fontSize: 16}}>GI Confirm</Text>
            <Text style={{  fontSize: 12, color: "gray"}}>Process and generating good issue</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{borderBottomWidth: 1, borderColor: 'gray', paddingVertical: 20}}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 15}}>
          <FontAwesomeIcon icon={faClipboard} size={20}/>
          <View>
            <Text style={{  fontSize: 16}}>Complete Data</Text>
            <Text style={{  fontSize: 12, color: "gray"}}>Finishing list data</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ paddingVertical: 60}}>
        <TouchableOpacity disabled={loading} onPress={handleLogout} style={{ flexDirection: "row", alignItems: "center", gap: 15, backgroundColor: loading ? "#D9D9D9" : "red", justifyContent: "center", paddingVertical: 10, borderRadius: 10}}>
          { loading ? <ActivityIndicator color={"white"}/> : <FontAwesomeIcon icon={faSignOut} size={20} color='white'/>}
          <Text style={{  fontSize: 16, color: loading ? "#8B8B8B" : "white"}}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default AccountView
import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'

export default function Notification() {
  return (
    <>
        <Stack.Screen options={{
            title: "Notification"
        }}
        />
        <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10}}>
          <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 16}}>Transaction Information</Text>
          
          {/* dummy notif */}
          <View style={{ borderWidth: 1, borderColor: 'gray', backgroundColor: "#D9D9D9", marginTop: 20, padding: 10, borderRadius: 10 }}>  
            <View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5}}>
                        <FontAwesomeIcon icon={faEnvelope}/>
                        <Text style={{ color: "gray", fontSize: 12}}>Info</Text>
                    </View>
                    <Text style={{ color: "gray", fontSize: 12 }}>2 min ago</Text>
                </View>
                <View >
                    <Text style={{ fontWeight: 'bold'}}>Message for you</Text>
                    <Text>Order with transaction number TRS-202412050001 has been completed</Text>
                </View>
            </View>
          </View>
        
          {/* dummy notif */}
          <View style={{ borderWidth: 1, borderColor: 'gray', marginTop: 20, padding: 10, borderRadius: 10 }}>  
            <View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5}}>
                        <FontAwesomeIcon icon={faEnvelope}/>
                        <Text style={{ color: "gray", fontSize: 12}}>Info</Text>
                    </View>
                    <Text style={{ color: "gray", fontSize: 12 }}>27 min ago</Text>
                </View>
                <View>
                    <Text style={{ fontWeight: 'bold'}}>Message for you</Text>
                    <Text>Rejected by warehouse: EXT SOCKET W/MAGNET 312EMP10 NAC</Text>
                    <Text style={{ fontStyle: "italic", marginTop: 10}}>Remarks: Stok kosong</Text>
                </View>
            </View>
          </View>
        </View>
    </>
  )
}
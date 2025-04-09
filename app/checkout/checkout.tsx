import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBoxesPacking, faDolly, faMoneyCheckDollar, faShop, faTruckField, faWarehouse, faX } from '@fortawesome/free-solid-svg-icons'
import { useData } from '../utils/context/DataContext'
import config from '../utils/Config'
import { RadioButton } from 'react-native-paper'
import colors from '../utils/colors'
import { useHeaderHeight } from "@react-navigation/elements";

export default function Checkout(){
    const { cartItems, cartCount, warehouse, warehouseName } = useData()
    const [deliveryMethod, setDeliveryMethod] = React.useState<string>('')
    const [paymentMethod, setPaymentMethod] = React.useState<string>('')
    const [paymentCardNumber, setPaymenCardNumber] = React.useState<number>()
    const { height } = useWindowDimensions()
    const headerHeight = useHeaderHeight()
    

  return (
    <>
        <Stack.Screen options={{ 
            title: 'Checkout'
        }}/>
        <View style={{ width: '100%', flex: 1, backgroundColor: "white", gap:20, padding: 12, flexDirection: "column", justifyContent: "space-between"}}>
          <View >
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center", marginBottom: 5}}>
                {/* <FontAwesomeIcon icon={faBoxesPacking} size={16}/> */}
                <Text style={{ fontSize: 16, fontWeight: "bold"}}>Items</Text>
            </View>
            <ScrollView style={{ height: "35%", borderWidth: 1, borderColor: "gray", borderRadius: 5, padding: 10}}>
                <View style={{ paddingBottom: 20}}>
                    { cartItems.map((item: any, index: number)=>{
                        return(
                            <View key={index} style={{ borderColor: "gray", borderBottomWidth: 0.5, padding: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                <View style={{ flexDirection: "row", gap: 5, alignItems: "center"}}>
                                    <View style={{ width: 50, height: 50}}>
                                        <Image source={{ uri: `${config.BACKEND_URL}${item.Inventory.Material.img}.jpg` }} alt={`${item.Inventory.Material.id}-${item.Inventory.Material.description}`} style={{ width:"100%", height: "100%", resizeMode: "center"}}/>
                                    </View>
                                    <View style={{ width: '75%' }}>
                                        <Text numberOfLines={1}>{item.Inventory.Material.description}</Text>
                                        <Text style={{ color: "gray", fontSize: 12}}>{item.Inventory.Material.materialNo}</Text>
                                    </View>
                                </View>
                                <Text>x{item.quantity}</Text>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        
            {/* Location */}
            <View style={{ flexDirection: "row", gap: 5, marginTop: 20, alignItems: "center", marginBottom: 5}}>
                <Text style={{ fontSize: 16, fontWeight: "bold"}}>Warehouse Location</Text>
            </View>
            <View style={{ borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5}}>
                <Text>{warehouseName}</Text>
            </View>
        
            {/* Pickup Method */}
            <View style={{ flexDirection: "row", gap: 5, marginTop: 20, alignItems: "center", marginBottom: 5}}>
                <Text style={{ fontSize: 16, fontWeight: "bold"}}>Delivery Method</Text>
            </View>
            <View style={{  flexDirection: 'row', justifyContent: "space-between"}}>
                <Pressable 
                    onPress={()=>{
                        setDeliveryMethod('pickup')
                    }}
                    style={{ width: "49%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: deliveryMethod === 'pickup' ? colors.primary : 'gray', borderRadius: 5, padding: 5}}
                >
                    <View style={{ }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5}}>
                            <FontAwesomeIcon icon={faShop}/>
                            <Text>Pickup</Text>
                        </View>
                        <Text style={{ color: "gray", fontSize: 12}}>Collect at the warehouse</Text>
                    </View>
                    <RadioButton
                        value='pickup'
                        status={ deliveryMethod === 'pickup' ? 'checked' : 'unchecked'}
                        onPress={()=>{setDeliveryMethod('pickup')}}
                        color={colors.primary}
                    />
                </Pressable>
                <Pressable 
                    onPress={()=>{
                        setDeliveryMethod('otodoke')
                    }}
                    style={{ width: "49%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: deliveryMethod === 'otodoke' ? colors.primary : 'gray', borderRadius: 5, padding: 5}}
                >
                    <View style={{ }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5}}>
                            <FontAwesomeIcon icon={faTruckField}/>
                            <Text>Otodoke</Text>
                        </View>
                        <Text style={{ color: "gray", fontSize: 12}}>Delivered straight to line</Text>
                    </View>
                    <RadioButton
                        value='otodoke'
                        status={ deliveryMethod === 'otodoke' ? 'checked' : 'unchecked'}
                        onPress={()=>{setDeliveryMethod('otodoke')}}
                        color={colors.primary}
                    />
                </Pressable>
            </View>
        
            {/* Payment Method */}
            <View style={{ flexDirection: "row", gap: 5, marginTop: 20, alignItems: "center", marginBottom: 5}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Payment Method</Text>
            </View>
            <View style={{  flexDirection: 'row', justifyContent: "space-between"}}>
                <Pressable 
                    onPress={()=>{
                        setPaymentMethod('gic')
                    }}
                    style={{ width: "49%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: paymentMethod === 'gic' ? colors.primary : 'gray', borderRadius: 5, padding: 5}}
                >
                    <View style={{ }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text>GIC</Text>
                        </View>
                    </View>
                    <RadioButton
                        value='gic'
                        status={ paymentMethod === 'gic' ? 'checked' : 'unchecked'}
                        onPress={()=>{setPaymentMethod('gic')}}
                        color={colors.primary}
                    />
                </Pressable>
                <Pressable 
                    onPress={()=>{
                        setPaymentMethod('wbs')
                    }}
                    style={{ width: "49%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: paymentMethod === 'wbs' ? colors.primary : 'gray', borderRadius: 5, padding: 5}}
                >
                    <View style={{ }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text>WBS</Text>
                        </View>
                    </View>
                    <RadioButton
                        value='wbs'
                        status={ paymentMethod === 'wbs' ? 'checked' : 'unchecked'}
                        onPress={()=>{setPaymentMethod('wbs')}}
                        color={colors.primary}
                    />
                </Pressable>
            </View>

            {/* Card Number */}
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold"}}>Card Number</Text>
            </View>
            <View>
                <TextInput style={{ borderColor: "gray", borderWidth: 1, borderRadius: 5, paddingHorizontal: 10}}/>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Pressable 
                style={({ pressed }) => ({
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.5 : 1,
                    paddingVertical: 10,
                    borderRadius: 5
                })}>
                <Text style={{ color: "white", textAlign: "center"}}>Confirm order</Text>
            </Pressable>
          </View>
        </View>
    </>
  )
}



const styles = StyleSheet.create({})
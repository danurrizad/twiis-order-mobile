import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import config from '../utils/Config';
import useMasterDataService from '@/services/MasterDataService';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faList, faMinus, faPlus, faScaleBalanced, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import colors from '../utils/colors';
import useCartDataService from '@/services/CartDataService';
import { useData } from '../utils/context/DataContext';
import Loading from '@/components/loading';

type WarehouseType = {
    id: number
}

type ItemInCartType = {
  quantity: number
}

export default function Product() {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [quantity, setQuantity] = React.useState<number>(0)
    const { warehouse, cartCount, setCartCount, cartItems, itemInCart, setItemInCart } = useData()
    const { id, description, materialNo, img, warehouseId, categoryId, minOrder, uom } = useLocalSearchParams()
    const [warehouseName, setWarehouseName] = React.useState<string>('')
    const [categoryName, setCategoryName] = React.useState<string>('')
    const { getMasterData } = useMasterDataService()
    const { getCartItems, getCartCount, postCartItem, removeCartItem, updateCartItem } = useCartDataService()
    // const [itemInCart, setItemInCart] = useState<ItemInCartType>()

    const fetchWarehouse = async() => {
        try {
          setLoading(true)
          const response = await getMasterData('warehouse')
          const matchedWh = response.data.find((data: WarehouseType)=>data.id === Number(warehouseId))
          if(matchedWh){
            setWarehouseName(matchedWh.warehouseName)
          }
        } catch (error) {
          console.error(error)
        } finally{
          setLoading(false)
        }
      }
    
    const fetchCategoryById = async() => {
        try {
            setLoading(true)
            const response = await getMasterData(`category-public/${categoryId}`)
            setCategoryName(response.data.categoryName)
        } catch (error) {
            console.error(error)
        } finally{
          setLoading(false)
        }
    }

    useEffect(()=>{
        fetchWarehouse()
        fetchCategoryById()
    }, [])

    const addToCart = async(inventoryId: number, qty: number) => {
      try {
        setLoading(true)
        const response = await postCartItem(Number(warehouseId), inventoryId, qty)
        console.log("response add to cart:", response)
        if(response){
          fetchCartItems()
        }
      } catch (error) {
        console.error(error)      
      } finally{
        setLoading(false)
      }
    }

    const addInputToCart = async(inventoryId: number, qty: number, minOrder: number) => {
      try {
         if(qty < minOrder || qty % minOrder !== 0 ){
              Alert.alert('Failed', `The amount must be a multiple of ${minOrder}`, [{ text: 'OK' }]);
              return
          }else{
              await updateCartItem(Number(warehouse), inventoryId, qty)
          }
        fetchCartCount()
        fetchCartItems()
      } catch (error) {
        console.error(error)      
      }
    }
  
  const minusItemCart = async(inventoryId: number, currentQuantity: number, cartId: number) => {
      try {
        setLoading(true)
        if(currentQuantity === Number(minOrder)){
          await removeCartItem(cartId, warehouse)
        }else{
          await updateCartItem(Number(warehouse), inventoryId, itemInCart?.quantity-Number(minOrder))
        }
        fetchCartCount()
        fetchCartItems()
      } catch (error) {
          console.error(error)
      } finally{
        setLoading(false)
      }
  }

    const fetchCartItems = async() => {
      try {
        setLoading(true)
        const response = await getCartItems(Number(warehouse))
        const matched = response.data.find((data: any)=>data.inventoryId === Number(id))

        const responseCount = await getCartCount(warehouse)
        setCartCount(responseCount.data.totalItems)
        setItemInCart(matched)
        setQuantity(matched?.quantity)
      } catch (error) {
        console.error(error)
      } finally{
        setLoading(false)
      }
    }

    const fetchCartCount = async() => {
      try {
          const response = await getCartCount(warehouse)
          setCartCount(response.data.totalItems)
      } catch (error) {
          console.error(error)
      }
  }

    useEffect(()=>{
      fetchCartItems()
      fetchCartCount()
    }, [cartItems])

 

    return (
    <View style={{ paddingHorizontal: 20, backgroundColor: 'white', flex: 1, justifyContent: "space-between"}}>
        { loading ? (
          <View>
            <ActivityIndicator/>
          </View>
        ) : (
            <View style={{ paddingTop: 12}}>
              <View>
                <View style={{ borderWidth: 0, borderColor: "gray", padding: 10, height: 400, marginBottom: 5}}>
                  <Image source={{ uri: `${config.BACKEND_URL}${img}.jpg` }} alt={`${id}-${description}`} style={{ width:"100%", height: "100%", resizeMode: "center"}}/>
                </View>
              </View>
              <Text style={{ fontSize: 20}}>{description}</Text>
              <Text style={{ fontSize: 16, color: 'gray'}}>{materialNo}</Text>
            
              <View style={{ marginTop: 30, flexDirection: "column", gap: 10}}>
                <View style={{ flexDirection: "row", alignItems: 'center', gap: 5}}>
                  <FontAwesomeIcon size={20} icon={faWarehouse}/>
                  <Text style={{ fontSize: 16 }}>{warehouseName}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: 'center', gap: 5}}>
                  <FontAwesomeIcon size={20} icon={faList}/>
                  <Text style={{ fontSize: 16 }}>{categoryName}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: 'center', gap: 5}}>
                  <FontAwesomeIcon size={20} icon={faScaleBalanced}/>
                  <Text style={{ fontSize: 16 }}>{uom}</Text>
                </View>
              </View>

              <View style={{ marginTop: 30}}>
                <Text style={{ fontStyle: 'italic'}}>Min. Order : {minOrder} {uom}</Text>
              </View>
            
            </View>

        )}
       
        {/* <View style={{ marginBottom: 20}}>
          <View style={{ backgroundColor: 'gray', paddingVertical: 10, borderRadius: 5}}>
            <ActivityIndicator color='white'/>
          </View>
        </View> */}

       { loading ? (
        <View style={{ marginBottom: 20}}>
          <View style={{ backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 5}}>
            <ActivityIndicator color='white'/>
          </View>
        </View>
       ) : itemInCart === undefined && !loading ? (
          <View style={{ marginBottom: 20}}>
            <TouchableOpacity onPress={()=>addToCart(Number(id), Number(minOrder))} style={{ backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 5}}>
              <Text style={{ color: "white", textAlign: "center"}}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
       ) : itemInCart !== undefined && !loading && (
          <View style={{ marginBottom: 20, backgroundColor: colors.primary, justifyContent: "space-between", flexDirection: 'row', padding: 10, paddingHorizontal: 40, borderRadius: 5}}>
            <TouchableOpacity 
                onPress={()=>{
                  minusItemCart(Number(id), itemInCart.quantity, itemInCart?.id)
                }}
            >
                <FontAwesomeIcon icon={faMinus} size={20} style={{ color: "white"}}/>
            </TouchableOpacity>
            <TextInput
              value={quantity?.toString() || ""}
              onChangeText={(e)=>setQuantity(Number(e))}
              onSubmitEditing={()=>addInputToCart(Number(id), quantity, Number(minOrder))}
              style={{ textAlign: "center", color: 'white', borderWidth: 0.5, borderColor: "white", width: 100, paddingVertical: 0 }}
            />
            {/* <Text style={{ color: "white", fontWeight: 'bold'}}>{itemInCart?.quantity}</Text> */}
            <TouchableOpacity 
                onPress={()=>addToCart(Number(id), Number(minOrder))}
            >
                <FontAwesomeIcon icon={faPlus} size={20} style={{ color: "white"}}/>
            </TouchableOpacity>
        </View>
       )}

    </View>

  )
}

const styles = StyleSheet.create({})
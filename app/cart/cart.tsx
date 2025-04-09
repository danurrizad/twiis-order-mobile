import { View, Text, ScrollView, Pressable, TouchableOpacity, Dimensions, Image, ActivityIndicator, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCartPlus, faMinus, faPlus, faSadCry, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faSadTear } from '@fortawesome/free-regular-svg-icons';
import colors from '../utils/colors';
import useCartDataService from '@/services/CartDataService';
import { useData } from '../utils/context/DataContext';
import config from '../utils/Config';
import useWishlistDataService from '@/services/WishlistDataService';

const { height } = Dimensions.get("window")

function CartView() {
    const router = useRouter()
    const [loading, setLoading] = React.useState<any>({})
    const [quantity, setQuantity] = React.useState<any>({})
    const [editQty, setEditQty] = React.useState<number>(0)
    const { warehouse, cartCount, setCartCount, cartItems, setCartItems, favoriteItems, setFavoriteItems, setFavoriteCount } = useData()
    const [totalItem, setTotalItem] = React.useState<number>(0)
    const { getCartItems, getCartCount, postCartItem, updateCartItem, removeCartItem } = useCartDataService()
    const { getWishlistByUser, addToWishlist, removeFromWishlist} = useWishlistDataService()

    const fetchCartCount = async() => {
        try {
            const response = await getCartCount(warehouse)
            setCartCount(response.data.totalItems)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchCartItems = async() => {
        try {
            const response = await getCartItems(warehouse)
            setCartItems(response.data)

            response?.data?.forEach((item: any) => {
                setQuantity((prevState: any)=>({ ...prevState, [item?.Inventory?.id]: item.quantity}))
            });             
            setLoading({ ...loading, [response?.data?.Inventory?.id]: false})
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchCartCount()
        fetchCartItems()
        
    }, [])

    const addToCart = async(inventoryId: number, qty: number) => {
        try {
          setLoading({ ...loading, [inventoryId]: true})
          const response = await postCartItem(Number(warehouse), inventoryId, qty)
          fetchCartCount()
          fetchCartItems()
        } catch (error) {
          console.error(error)      
        } finally{
          setLoading({ ...loading, [inventoryId]: false})
        }
      }

    const addInputToCart = async(inventoryId: number, qty: number, minOrder: number) => {
        try {
            setLoading({ ...loading, [inventoryId]: true})
            if(qty < minOrder || qty % minOrder !== 0 ){
                Alert.alert('Error', `The amount must be a multiple of ${minOrder}`, [{ text: 'OK' }]);
            }else{
                await updateCartItem(Number(warehouse), inventoryId, qty)
            }
            fetchCartCount()
            fetchCartItems()
        } catch (error) {
            console.error(error)
        } finally{
            setLoading({ ...loading, [inventoryId]: false})
        }
    }
    
    const minusItemCart = async(inventoryId: number, qty: number) => {
        try {
            setLoading({ ...loading, [inventoryId]: true})
            const response = await updateCartItem(Number(warehouse), inventoryId, qty)
            fetchCartCount()
            fetchCartItems()
        } catch (error) {
            console.error(error)
        } finally{
            setLoading({ ...loading, [inventoryId]: false})
        }
    }

    const removeItemFromCart = async(id: number) => {
        try {
            // setLoading({ ...loading, [id]: true})
            const response = await removeCartItem(id, warehouse)
            fetchCartCount()
            fetchCartItems()
        } catch (error) {
            console.error(error)
        } finally{
            // setLoading(false)
        }
    }

    const fetchWishlist = async() => {
        try {
          const response = await getWishlistByUser(warehouse)
          setFavoriteItems(response.data)
          setFavoriteCount(response.data.length)
        } catch (error) {
          console.error(error)
        }
      }

    const addItemToWishlist = async(inventoryId: number) => {
        try {
            
            const response = await addToWishlist(Number(warehouse), inventoryId)
            fetchWishlist()
        } catch (error) {
            console.error(error)
        }
    }

    const removeItemFromWishlist = async(inventoryId: number) => {
        try {
            const response = await removeFromWishlist(Number(warehouse), inventoryId)
            fetchWishlist()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchWishlist()
    }, [])

    const checkFavorite = (inventoryId: number) => {
        const matched = favoriteItems.find((data: any)=>data.Inventory.id === inventoryId)
        if(matched){
          return true
        }else{
          return false
        }
      }

  return (
    <>
        {/* Customize Header */}
        <Stack.Screen options={{ 
            title: 'Cart'
        }}/>
    
        <View style={{ backgroundColor: "white", flex: 1}}>
            { cartCount === 0 && (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 500}}>
                    <FontAwesomeIcon icon={faSadTear} size={100}/>
                    <Text style={{ fontWeight: 'bold'}}>You don't have any order right now</Text>
                    <Text>Let's go shopping</Text>
                    <Pressable onPress={() => router.push('/(tabs)')} style={{ backgroundColor: "#003399", borderRadius: 10, marginTop: 20, paddingVertical: 10, paddingHorizontal: 30 }}>
                        <Text style={{ color: "white"}}>Start ordering</Text>
                    </Pressable>
                </View>
            )}
        
            { cartCount > 0 && (
                <View style={{ flexDirection: 'column', height: height-170, justifyContent: "space-between"}}>
                    {/* Carts */}
                    <ScrollView>
                        <View style={{ flexDirection: "column", rowGap: 10, paddingBottom: 20, padding: 12}}>
                            { cartItems.map((cart: any, index: number)=>{
                                return(
                                    <TouchableOpacity 
                                        key={index}  
                                        onPress={()=>{
                                            router.push({
                                                pathname: '/detail-product/product', 
                                                params: { 
                                                    id: cart.Inventory.id, 
                                                    description: cart.Inventory.Material.description, 
                                                    materialNo: cart.Inventory.Material.materialNo,
                                                    img: cart.Inventory.Material.img,
                                                    warehouseId: cart.Inventory.Address_Rack.Storage.Plant.warehouseId,
                                                    categoryId: cart.Inventory.Material.categoryId,
                                                    minOrder: cart.Inventory.Material.minOrder,
                                                    uom: cart.Inventory.Material.uom 
                                                }
                                            })
                                        }} 
                                        style={{ borderWidth: 0.5, borderColor: "gray", padding: 10, borderRadius: 10, flexDirection: "row", gap: 10 }}
                                        >
                                        <View style={{ borderWidth: 0, borderColor: "gray", height: 150, width: 150, marginBottom: 5}}>
                                            <Image source={{ uri: `${config.BACKEND_URL}${cart.Inventory.Material.img}.jpg` }} alt={`${cart.Inventory.Material.id}-${cart.Inventory.Material.description}`} style={{ width:"100%", height: "100%", resizeMode: "center"}}/>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: "space-between"}}>
                                            <View>
                                                <Text numberOfLines={2}>{cart.Inventory.Material.description}</Text>
                                                <Text style={{ fontSize: 12}}>{cart.Inventory.Material.materialNo}</Text>
                                                <Text style={{ fontStyle: "italic", marginTop: 20}}>Min. Order : {cart.Inventory.Material.minOrder}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center"}}>
                                                <Pressable 
                                                    onPress={()=>{
                                                        if(checkFavorite(cart.Inventory.id)){
                                                            removeItemFromWishlist(cart.Inventory.id)
                                                        }else{
                                                            addItemToWishlist(cart.Inventory.id)
                                                        }
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={ checkFavorite(cart.Inventory.id) ? faHeartSolid : faHeart} size={25} color={checkFavorite(cart.Inventory.id) ? "red" : "black"}/>
                                                </Pressable>
                                                <View style={{ flexDirection: 'row', borderWidth: 0.5, alignItems: "center", gap: 10, padding: 5, borderRadius: 5}}>
                                                    <TouchableOpacity 
                                                        // hitSlop={50}
                                                        onPress={()=>{
                                                            console.log("minus")
                                                            if(cart.quantity === cart.Inventory.Material.minOrder){
                                                                removeItemFromCart(cart.id)
                                                            }else{
                                                                minusItemCart(cart.Inventory.id, cart.quantity-cart.Inventory.Material.minOrder)
                                                            }
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} size={20}/>
                                                    </TouchableOpacity>
                                                    { loading[cart.Inventory.id] ? <ActivityIndicator style={{ width: 50, paddingVertical: 5}}/> : (
                                                        <TextInput 
                                                            style={{ borderWidth: 0.75, borderColor: 'gray', width: 50, paddingVertical: 5, textAlign: "center"}}
                                                            onChangeText={(e)=>{setQuantity({ ...quantity, [cart?.Inventory.id]: e})}}
                                                            value={quantity[cart?.Inventory?.id] === undefined ? "" : String(quantity[cart?.Inventory?.id])}
                                                            onSubmitEditing={(e)=>{addInputToCart(cart?.Inventory?.id, quantity[cart?.Inventory?.id], cart?.Inventory?.Material?.minOrder)}}
                                                            onBlur={()=>addInputToCart(cart?.Inventory?.id, quantity[cart?.Inventory?.id], cart?.Inventory?.Material?.minOrder)}
                                                            />
                                                    )}
                                                    <TouchableOpacity 
                                                        // hitSlop={50}
                                                        onPress={()=>{
                                                            addToCart(cart.Inventory.id, cart.Inventory.Material.minOrder)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} size={20}/>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                               
                        </View>
                    </ScrollView>
                    {/* Button Checkout */}
                    <View style={{ paddingTop: 2, paddingHorizontal: 12}}>
                        <Text style={{fontSize: 16, marginBottom: 5, fontWeight: "bold"}}>Total Item : {cartCount}</Text>
                        <Pressable 
                            hitSlop={50}
                            onPress={()=>{
                                router.push("/checkout/checkout")
                            }}
                            
                            style={({ pressed }) => ({
                                flexDirection: "row", 
                                justifyContent: "center", 
                                gap: 20, 
                                alignItems: "center", 
                                borderRadius: 5, 
                                backgroundColor:  colors.primary,
                                opacity: pressed ? 0.5 : 1, 
                                paddingVertical: 10
                            })}
                            >
                            <FontAwesomeIcon icon={faCartPlus} style={{ color: "white"}}/>
                            <Text style={{ color: "white"}}>Checkout</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>

    </>
  );
}

export default CartView
import { View, Text, ScrollView, TouchableOpacity, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faHeart, faSadTear } from '@fortawesome/free-solid-svg-icons';
import colors from '../utils/colors';
import useWishlistDataService from '@/services/WishlistDataService';
import { useData } from '../utils/context/DataContext';
import { router } from 'expo-router';
import config from '../utils/Config';
import useCartDataService from '@/services/CartDataService';

function FavoriteView() {
  const { warehouse, favoriteItems, setFavoriteItems, cartCount, setCartCount, favoriteCount, setFavoriteCount } = useData()
  const { getWishlistByUser, removeFromWishlist } = useWishlistDataService()
  const { postCartItem } = useCartDataService()
  const { getCartCount, getCartItems } = useCartDataService()
  const [loading, setLoading] = React.useState<any>({})
  

  

  const fetchWishlist = async() => {
    try {
      const response = await getWishlistByUser(warehouse)
      setFavoriteItems(response.data)
      setFavoriteCount(response.data.length)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCartCount = async() => {
    try {
        const response = await getCartCount(warehouse)
        setCartCount(response.data.totalItems)

        const responseItems = await getCartItems(warehouse)
        setLoading({ ...loading, [responseItems?.data?.Inventory?.id]: false})    
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(()=>{
    fetchWishlist()
    fetchCartCount()
  }, [])

  const removeWishlist = async(inventoryId: number) => {
    try {
      await removeFromWishlist(Number(warehouse), inventoryId)
      fetchWishlist()
    } catch (error) {
      console.error(error)
    }
  }

  const addToCart = async(inventoryId: number, qty: number) => {
    try {
      setLoading({ ...loading, [inventoryId]: true})
      await postCartItem(Number(warehouse), inventoryId, qty)
      
      fetchCartCount()
    } catch (error) {
      console.error(error)      
    } finally{
      setLoading({ ...loading, [inventoryId]: false})
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", alignItems: 'center', justifyContent: 'center'}}>
      <View style={{ flex: 1, width: "100%"}}>
        <Text style={{ fontWeight: "bold", paddingHorizontal: 12}}>{favoriteCount} items</Text>
        <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
          <View style={{ flexDirection: "column", gap: 20, paddingVertical: 12, paddingBottom: 50}}>
            { favoriteItems.length === 0 && (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 500}}>
                  <FontAwesomeIcon icon={faSadTear} size={100}/>
                  <Text style={{ fontWeight: 'bold'}}>You don't have any product in your favorite right now</Text>
                  <Text>Let's go shopping</Text>
                  <Pressable onPress={() => router.push('/(tabs)')} style={{ backgroundColor: "#003399", borderRadius: 10, marginTop: 20, paddingVertical: 10, paddingHorizontal: 30 }}>
                      <Text style={{ color: "white"}}>Start exploring</Text>
                  </Pressable>
              </View>
            )}
            { favoriteItems.map((data: any, index: number)=>{
              return(
                <TouchableOpacity 
                  key={index} 
                  style={{ 
                    flexDirection: "row", 
                    borderWidth: 0.5, 
                    borderColor: "gray", 
                    flex: 1, 
                    borderRadius: 5, 
                    padding: 10, 
                    gap: 10
                  }}
                  onPress={()=>
                    router.push({ 
                      pathname: "/detail-product/product", 
                      params: {
                        id: data.Inventory.id,
                        description: data.Inventory.Material.description,
                        materialNo: data.Inventory.Material.materialNo,
                        img: data.Inventory.Material.img,
                        warehouseId: data.Inventory.Address_Rack.Storage.Plant.warehouseId,
                        categoryId: data.Inventory.Material.categoryId,
                        minOrder: data.Inventory.Material.minOrder,
                        uom: data.Inventory.Material.uom,
                      },
                    })
                  }
                  >
                  <View style={{ borderWidth: 0, borderColor: "gray", height: 150, width: 150, marginBottom: 5}}>
                      <Image source={{ uri: `${config.BACKEND_URL}${data.Inventory.Material.img}.jpg` }} alt={`${data.Inventory.Material.id}-${data.Inventory.Material.description}`} style={{ width:"100%", height: "100%", resizeMode: "center"}}/>
                  </View>
                  <View style={{ flex: 1, justifyContent: "space-between"}}>
                    <View>
                      <Text numberOfLines={2}>{data.Inventory.Material.description}</Text>
                      <Text style={{ fontSize: 12, color: "gray"}}>{data.Inventory.Material.materialNo}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                      <TouchableOpacity onPress={()=>removeWishlist(data.Inventory.id)}>
                        <FontAwesomeIcon icon={faHeart} color='red' size={25}/>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        disabled={loading[data.Inventory.id]} 
                        style={{ flexDirection: "row", borderRadius: 10, alignItems: "center", gap: 10, backgroundColor: colors.primary, width: 150, paddingVertical: 5}}
                        onPress={()=>addToCart(data.Inventory.id, data.Inventory.Material.minOrder)}
                        >
                        { loading[data.Inventory.id] ? (
                          <ActivityIndicator style={{ flex: 1}} color={'white'}/> 
                          ) : (
                            <View style={{ flexDirection: 'row', alignItems: "center", gap: 10, justifyContent: "center", flex: 1}}>
                              <FontAwesomeIcon style={{ color: 'white'}} icon={faPlus}/>
                              <Text style={{ color: 'white'}}>Add to Cart</Text>
                            </View>
                          ) }
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
            
            
          </View>
        </ScrollView>
      </View>
      <View>

      </View>
    </View>
  );
}

export default FavoriteView
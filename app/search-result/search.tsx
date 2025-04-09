import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useShopService from '@/services/ShopDataService'
import { useData } from '../utils/context/DataContext'
import { Image } from 'react-native'
import config from '../utils/Config'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeart as faHeartAsSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import useWishlistDataService from '@/services/WishlistDataService'

type TypeQuery = {
  searchQuery: string
}

export default function Search() {
  const { warehouse, search, products, favoriteItems, setFavoriteItems, setProducts, showSearchResult, setFavoriteCount } = useData()
  const { searchQuery } = useLocalSearchParams<TypeQuery>()

  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const { getProductsByQuery } = useShopService()

  const { getWishlistByUser, addToWishlist, removeFromWishlist } = useWishlistDataService()

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

  const fetchWishlist = async() => {
    try {
      const response = await getWishlistByUser(Number(warehouse))
      setFavoriteItems(response.data)
      setFavoriteCount(response.data.length)
    } catch (error) {
      console.error(error)
    }
  }

  const checkWishlist = (inventoryId: number) => {
    const matched = favoriteItems.find((data: any)=>data.Inventory.id === inventoryId)
    if(matched){
      return true
    }else{
      return false
    }
  }

  const fetchProductsByNewQuery = async() => {
    try {
      setLoading(true)
      const response = await getProductsByQuery(Number(warehouse), 1, 20, searchQuery)
      setProducts(response.data)
      setPage(1)
    } catch (error) {
      console.error(error)
    } finally{
      setLoading(false)
    }
  }

  const fetchProductsByQuery = async() => {
    try {
      const response = await getProductsByQuery(Number(warehouse), page+1, 20, searchQuery)
      if(response?.data.length !== 0){
        setProducts([...products, ...response.data]); // Append new products
        setPage((prevPage) => prevPage + 1); // Increment page number
      } 
    } catch (error) {
      console.error(error)
    } 
  }

  useEffect(()=>{
    fetchProductsByNewQuery()
    fetchWishlist()
  }, [showSearchResult, warehouse])


  return (
    <View style={{ backgroundColor: "white", width: "100%", height: "100%", paddingTop: 12, paddingBottom: 130}}>
      { 
      loading ? (
        <View style={{ height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
          <ActivityIndicator style={{ position: "absolute", transform: "translateY(-50%)"}} size={50}/>
        </View>
      ) : 
      products.length === 0 ? (
        <View style={{ height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
          <Text style={{ position: "absolute", transform: "translateY(-50%)"}}>No products found!</Text>
        </View>
      ) : (
          <View style={{ }}>
            <FlatList
              style={{ backgroundColor: "white", paddingHorizontal: 10}}
              data={products}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={()=>{
                    router.push({
                      pathname: '/detail-product/product', 
                      params: { 
                      id: item.id, 
                      description: item.Material.description, 
                      materialNo: item.Material.materialNo,
                      img: item.Material.img,
                      warehouseId: item.Address_Rack.Storage.Plant.warehouseId,
                      categoryId: item.Material.categoryId,
                      minOrder: item.Material.minOrder,
                      uom: item.Material.uom 
                      }
                    })
                  }} 
                  // style={{ width: "50%", borderWidth: 0.5, borderRadius: 10, borderColor: 'gray', padding: 10, flexDirection: "column", justifyContent: "space-between"}}
                  style={{
                    width: '48%',
                    position: 'relative',
                    borderWidth: 0.5,
                    borderRadius: 10,
                    borderColor: 'gray',
                    padding: 10,
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                  >
                  <View style={{ position: "relative" }}>
                      <View style={{ borderWidth: 0, borderColor: "gray", height: 150, marginBottom: 5}}>
                        <Image source={{ uri: `${config.BACKEND_URL}${item.Material.img}.jpg` }} alt={`${item.Material.id}-${item.Material.description}`} style={{ width:"100%", height: "100%", resizeMode: "center"}}/>
                      </View>
                      <View style={{ position: "absolute", top: 0, right: 0}}>
                      <TouchableOpacity
                        onPress={()=>{
                          checkWishlist(item.id) ? removeItemFromWishlist(item.id) : addItemToWishlist(item.id)
                        }}
                      >
                        <FontAwesomeIcon icon={ checkWishlist(item.id) ? faHeartAsSolid : faHeart} color={checkWishlist(item.id) ? 'red' : 'black'} size={25} />
                      </TouchableOpacity>
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: 'bold'}} numberOfLines={2}>{item.Material.description}</Text>
                      <Text style={{ fontSize: 12}}>{item.Material.materialNo}</Text>
                    </View>
                </TouchableOpacity>
              )}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between", paddingBottom: 15 }}
              ListFooterComponent={() => loading && <ActivityIndicator size="large" />}
              onEndReached={fetchProductsByQuery} // 🔥 Trigger API call when reaching end
              onEndReachedThreshold={0.5}
            />
          </View>
        
      )}
    </View>
  )
}

const styles = StyleSheet.create({})
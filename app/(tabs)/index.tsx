import { faBell, faHeart} from "@fortawesome/free-regular-svg-icons";
import {  faCartShopping, faGear, faIndustry, faLocationDot, faOilCan, faPencil, faScissors, faSearch, faTag, faToolbox, faX, faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Dimensions, FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useVideoPlayer, VideoView } from 'expo-video';
import Modal from "react-native-modal";
import { RadioButton } from "react-native-paper";
import useShopService from "@/services/ShopDataService";
import config from "../utils/Config";
import useMasterDataService from "@/services/MasterDataService";
import { router, useNavigation } from "expo-router";
import { useData } from "../utils/context/DataContext";
import useWishlistDataService from "@/services/WishlistDataService";
import useCartDataService from "@/services/CartDataService";

const images = [
  require("../../assets/images/home/1.jpg"),
  require("../../assets/images/home/2.jpg"),
  require("../../assets/images/home/3.jpg"),
];

const videoSource = '../../assets/images/home/INVENTORY.mp4';

interface WarehouseOptionsInterface {
  list: ListWarehouseInterface[], 
  selected: string
}

interface WarehouseInterface {
  id: string,
  warehouseName: string,
}

interface ListWarehouseInterface {
  value: string,
  label: string,
}

export default function HomeView() {
  const [search, setSearch] = React.useState<string>('')
  const [page, setPage] = React.useState(1)
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const [optionsWarehouse, setOptionsWarehouse] = React.useState<any>({
    list: [], 
    selected: '1'
  })
  const { 
    warehouse, 
    setWarehouse, 
    warehouseName, 
    setWarehouseName, 
    favoriteItems, 
    setFavoriteItems, 
    setCartItems, 
    setCartCount,
    loading,
    setLoading,
    setFavoriteCount 
  } = useData()
  const navigation = useNavigation()

  const width = Dimensions.get("window").width - 24;
  const ref = React.useRef<ICarouselInstance>(null);

  const data = [...images]

  useEffect(()=>{
    setShowModal(false)
  }, [optionsWarehouse.selected])

  const { getMasterData } = useMasterDataService()
  const { getProducts } = useShopService()
  const { getCartItems, getCartCount } = useCartDataService()
  const [products, setProducts] = React.useState<any>([])

  const fetchWarehouse = async() => {
    try {
      const response = await getMasterData('warehouse')
      const matchesWh = response.data.find((data: any)=>data.id === Number(warehouse))
      setWarehouseName(matchesWh.warehouseName)
      setOptionsWarehouse({ 
        ...optionsWarehouse,
        list: response?.data?.map((data: any)=>{
          return{
            label: data?.warehouseName || "",
            value: data?.id.toString() || ""
          }
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await getProducts(warehouse, page, 20);
      if (response?.data) {
        setProducts([...products, ...response.data]); // Append new products
        setPage((prevPage) => prevPage + 1); // Increment page number
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFirstProducts = async() => {
    try {
      setLoading(true)
      setPage(1)
      const response = await getProducts(warehouse, 1, 20)
      console.log("response products:", response.data)
      if(response?.data){
        setProducts(response.data)
      }
    } catch (error) {
      console.error(error)
    } finally{
      setLoading(false)
    }
  }
  
  
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

  const fetchCart = async() => {
    try {
      setLoading(true)
      const responseCount = await getCartCount(Number(warehouse))
      setCartCount(responseCount.data.totalItems)
      const responseItems = await getCartItems(Number(warehouse))
      setCartItems(responseItems.data)
    } catch (error) {
      console.error(error)
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchWarehouse()
  }, [])

  useEffect(()=>{
    fetchFirstProducts()
    fetchWishlist()
    fetchCart()
  }, [warehouse])

  const checkFavorite = (inventoryId: number) => {
    const matched = favoriteItems.find((data: any)=>data.Inventory.id === inventoryId)
    if(matched){
      return true
    }else{
      return false
    }
  }

  return (
    <FlatList
        style={{ backgroundColor: "white", paddingHorizontal: 10}}
        data={products}
        keyExtractor={(item: any) => item.id.toString()}
        ListHeaderComponent={
          <View style={{ backgroundColor: "white" }}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <FontAwesomeIcon icon={faLocationDot} size={20}/>
              <Text>{warehouseName}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "transparent", // Background color
                  borderWidth: 0,
                  borderColor: "#0056b3", // Border color
                }}
                onPress={() => setShowModal(!showModal)}
              >
                <Text style={{ color: "#003399", fontWeight: "bold" }}>
                  Change
                </Text>
              </TouchableOpacity>

              <Modal 
                isVisible={showModal}
                onBackdropPress={() => setShowModal(false)}
                style={{ justifyContent: 'flex-end', margin: 0 }} // Align modal at the bottom
              >
                <View style={{ height: 250, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                  <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingBottom: 10}}>
                    <Pressable onPress={() => setShowModal(false)}>
                      <FontAwesomeIcon icon={faX}/>
                    </Pressable>
                    <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Select Warehouse</Text>
                  </View>
                  <View style={{ borderTopWidth: 1, paddingTop: 10}}>
                    { optionsWarehouse?.list?.map((list: any, index: number)=>{
                      return(
                        <Pressable 
                          key={index} 
                          onPress={() => {
                            setWarehouseName(list.label)
                            setWarehouse(Number(list.value))
                            setOptionsWarehouse({ ...optionsWarehouse, selected: list.value})
                          }} 
                          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                          >
                          <Text style={{ fontSize: 16, }}>{list.label}</Text>
                          <RadioButton
                            value={warehouse.toString()}
                            status={ list.value === warehouse.toString() ? 'checked' : 'unchecked'}
                            onPress={() => {
                              setWarehouseName(list.label)
                              setWarehouse(Number(list.value))
                              setOptionsWarehouse({ ...optionsWarehouse, selected: list.value})
                            }}
                            color='#003399'
                            />
                        </Pressable>
                      )
                    }) }
                  
                  </View>
                </View>
              </Modal>

            </View>
            
            {/* <View style={{ borderBottomWidth: 1, paddingVertical: 10}}></View> */}
            <View style={{ paddingVertical: 10}}>
              <Carousel
                ref={ref}
                autoPlay
                autoPlayInterval={3000}
                width={width}
                height={width/4.5}
                data={data}
                // onProgressChange={progress}
                renderItem={({ index, item }) => (
                  <View
                    style={{
                      position: 'relative',
                      flex: 1,
                      // borderWidth: 2,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      source={item}
                      style={{ resizeMode: "stretch", width: "100%", height: "100%"}}
                    />
                  </View>
                )}
              />
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10, paddingBottom: 60, alignItems: "flex-end"}}>
              <TouchableOpacity onPress={() => router.push('/operation-category/operation')} style={{ flexDirection: "column", marginTop: 10, width: width/7, height: width < 390 ? 45 : width/12, alignItems: "center", justifyContent: "flex-start"}}>
                <View  style={{ borderWidth: 1, borderRadius: 10, width: width/7, height: width < 390 ? 45 : width/12, flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                  <Image source={require('../../assets/images/logo/logo-operation.png')} style={{ resizeMode: "center"}}/>
                </View>
                <Text>Oper. Supply</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/office-category/office')} style={{ flexDirection: "column", marginTop: 10, width: width/7, height: width < 390 ? 45 : width/12, alignItems: "center", justifyContent: "flex-start"}}>
                <View  style={{ borderWidth: 1, borderRadius: 10, width: width/7, height: width < 390 ? 45 : width/12, flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                  <Image source={require('../../assets/images/logo/logo-office.png')} style={{ resizeMode: "center"}}/>
                </View>
                <Text>Office Supply</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/sparepart-category/sparepart')} style={{ flexDirection: "column", marginTop: 10, width: width/7, height: width < 390 ? 45 : width/12, alignItems: "center", justifyContent: "flex-start"}}>
                <View  style={{ borderWidth: 1, borderRadius: 10, width: width/7, height: width < 390 ? 45 : width/12, flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                  <Image source={require('../../assets/images/logo/logo-spare.png')} style={{ resizeMode: "center"}}/>
                </View>
                <Text>Spare Parts</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/rawmaterial-category/rawmaterial')} style={{ flexDirection: "column", marginTop: 10, width: width/7, height: width < 390 ? 45 : width/12, alignItems: "center", justifyContent: "flex-start"}}>
                <View  style={{ borderWidth: 1, borderRadius: 10, width: width/7, height: width < 390 ? 45 : width/12, flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                  <Image source={require('../../assets/images/logo/logo-material.png')} style={{ resizeMode: "center"}}/>
                </View>
                <Text>Raw Matr.</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/tools-category/tools')} style={{ flexDirection: "column", marginTop: 10, width: width/7, height: width < 390 ? 45 : width/12, alignItems: "center", justifyContent: "flex-start"}}>
                <View  style={{ borderWidth: 1, borderRadius: 10, width: width/7, height: width < 390 ? 45 : width/12, flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                  <Image source={require('../../assets/images/logo/logo-tools.png')} style={{ resizeMode: "center"}}/>
                </View>
                <Text>Tools</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/other-category/other')} style={{ flexDirection: "column", marginTop: 10, width: width/7, height: width < 390 ? 45 : width/12, alignItems: "center", justifyContent: "flex-start"}}>
                <View  style={{ borderWidth: 1, borderRadius: 10, width: width/7, height: width < 390 ? 45 : width/12, flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                  <Image source={require('../../assets/images/logo/logo-others.png')} style={{ resizeMode: "center"}}/>
                </View>
                <Text>Others</Text>
              </TouchableOpacity>
            </View>

            { products.length === 0 && !loading && ( 
              <View style={{ flex: 1, alignItems: 'center', justifyContent: "center"}}>
                <Text>There are no products</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          // { products.length === 0 ? () : ()}
          <TouchableOpacity 
            onPress={() => router.push({
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
            })} 
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
            <View>
              <View style={{ borderWidth: 0, borderColor: "gray", height: 150, marginBottom: 5 }}>
                <Image
                  source={{ uri: `${config.BACKEND_URL}${item.Material.img}.jpg` }}
                  alt={`${item.Material.id}-${item.Material.description}`}
                  style={{ width: "100%", height: "100%", resizeMode: "center" }}
                />
              </View>
              <TouchableOpacity 
                onPress={() => {
                  checkFavorite(item.id) ? removeItemFromWishlist(item.id) : addItemToWishlist(item.id);
                }}
                style={{ position: 'absolute', top: 0, right: 0 }}
              >
                <FontAwesomeIcon icon={checkFavorite(item.id) ? faHeartSolid : faHeart} size={25} color={checkFavorite(item.id) ? "red" : "black"} />
              </TouchableOpacity>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }} numberOfLines={2}>{item.Material.description}</Text>
              <Text style={{ fontSize: 12 }}>{item.Material.materialNo}</Text>
            </View>
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingBottom: 15 }}
        ListFooterComponent={() => loading && <ActivityIndicator size="large" />}
        onEndReached={fetchProducts} // 🔥 Trigger API call when reaching end
        onEndReachedThreshold={0.5} // Load more when scrolled 50% down
      />

  );
}

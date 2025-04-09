import { Tabs, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BackHandler, Pressable, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { faCartShopping, faHome, faSearch, faHeart as faHeartSolid, faRectangleList as faRectangleListSolid, faEnvelopeOpen as faEnvelopeOpenSolid, faUser as faUserSolid, faClockRotateLeft, faX, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEnvelopeOpen, faHeart, faRectangleList, faUser, faBell } from '@fortawesome/free-regular-svg-icons';
import Feather from '@expo/vector-icons/Feather';
import Foundation from '@expo/vector-icons/Foundation';
import colors from '../utils/colors';
import useCartDataService from '@/services/CartDataService';
import { useData } from '../utils/context/DataContext';
import  * as SecureStore from 'expo-secure-store';

export default function TabLayout() {

  function HeaderSearch(){
    const router = useRouter(); 
    const segments = useSegments(); // Get the current active route name
    const currentPage = segments[segments.length - 1]; // Get the last segment (page name)
    const { warehouse, setCartCount, cartCount, loading, search, setSearch, showSearchResult, setShowSearchResult} = useData()
    const { getCartCount, getCartItems } = useCartDataService()
    const [ isFocused, setIsFocused] = useState<boolean>(false)
    const searchRef = useRef<TextInput | any>()
    const [heightSearch, setHeightSearch] = useState(0);
    const [history, setHistory] = useState([])
    
    useEffect(() => {
      loadSearchHistory();
    }, [showSearchResult]);

    // Load search history from AsyncStorage
    const loadSearchHistory = async () => {
      try {
        const storedHistory =  await SecureStore.getItemAsync('recentSearches');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };

    // Save new search query to history
    const saveSearchQuery = async () => {
      if (!search.trim()) return;

      const updatedHistory: any = [search, ...history.filter(item => item !== search)]; // Avoid duplicates
      setHistory(updatedHistory);

      try {
          await SecureStore.setItemAsync('recentSearches', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    };

    // Clear search history
    const clearHistory = async(item: string) => {
        await SecureStore.deleteItemAsync('recentSearches');
        const historyAfterDeletion: any = history.filter(history => history !== item)
        setHistory(historyAfterDeletion)
        await SecureStore.setItemAsync('recentSearches', JSON.stringify(historyAfterDeletion));
    };

    const fetchCartCount = async() => {
      try {
        const response = await getCartCount(warehouse)
        setCartCount(response.data.totalItems)
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(()=>{
      fetchCartCount()
    }, [cartCount])

    // Map the current route name to a search placeholder
    const placeholderMap: any = {
      index: 'Search products',
      history: 'Search order history',
      approval: 'Search approvals',
    };

    useEffect(() => {
      const backAction = () => {
        if (showSearchResult) {
          setShowSearchResult(false);
          searchRef.current?.blur();
          setSearch("");
        } else {
          if (currentPage !== "product") {
            setSearch("");
          }
          router.back();
          searchRef.current?.blur();
        }
  
        return true; // Prevent default back behavior
      };
  
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  
      return () => backHandler.remove(); // Cleanup on unmount
    }, [showSearchResult, setShowSearchResult, setSearch, currentPage, router]);
    
    return(
      <View>
        <View style={{ backgroundColor: "white", flexDirection: "row", paddingTop: 70, paddingBottom: 10, paddingHorizontal: 12, justifyContent: 'space-between', alignItems: "center", gap: 20 }}>
          { showSearchResult && (
            <View>
              <TouchableOpacity 
                onPress={()=>{
                  setShowSearchResult(false)
                  setSearch('')
                  searchRef.current?.blur()
                }}
                >
                <FontAwesomeIcon icon={faArrowLeft}/>
              </TouchableOpacity>
            </View>
          )}   
          <View style={{ position: 'relative', flex: 1, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: isFocused ? colors.primary : "gray", paddingHorizontal: 10, borderRadius: 10}}>
            { !showSearchResult && currentPage === '(tabs)' && <Image source={require('../../assets/images/logo-twiis-2.png')} style={{width: 75, height: 30, resizeMode: "center"}}/> }
            <FontAwesomeIcon icon={faSearch} size={20} color='gray'/>
            <TextInput
              ref={searchRef}
              placeholder={placeholderMap[currentPage] || 'Search products'}
              onSubmitEditing={()=>{
                router.push({ pathname: "/search-result/search", params: { searchQuery: search }})
                  setShowSearchResult(false)
                  saveSearchQuery()
              }}
              onKeyPress={(event) => {
                if (event.nativeEvent.key === "Enter") {
                  router.push({ pathname: "/search-result/search", params: { searchQuery: search }})
                  setShowSearchResult(false)
                  saveSearchQuery()
                }
              }}
              onFocus={() => {
                setIsFocused(true);
                setShowSearchResult(true);
                setTimeout(()=>{
                  searchRef.current?.focus(); 
                }, 100)
              }}
              returnKeyType="done"
              value={search}
              onChangeText={(event: string) => setSearch(event)}
              style={{ width: "100%", paddingRight: 40 }}
            />
            { search !== "" && (
              <TouchableOpacity
                onLayout={(event) => setHeightSearch(event.nativeEvent.layout.height)} 
                style={{ position: "absolute", top: '50%', right: 10, transform: [{translateY: -heightSearch/2}] }}
                onPress={()=>setSearch('')}
                >
                <FontAwesomeIcon icon={faX} color='gray' size={12}/>
              </TouchableOpacity>
            )}
          </View>
          
          { showSearchResult ? (
            <TouchableOpacity 
              onPress={()=>{
                router.push({ pathname: "/search-result/search", params: { searchQuery: search }})
                setShowSearchResult(false)
                saveSearchQuery()
              }} 
              style={{ backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 19, borderRadius: 5}}
              >
              <Text style={{ color: "white"}}>Find</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", gap: 15}}>
              <View style={{ position: 'relative'}}>
                <TouchableOpacity onPress={() => router.push('/cart/cart')}>
                  <FontAwesomeIcon size={25} icon={faCartShopping}/>
                </TouchableOpacity>
                { (cartCount > 0 && !loading) && 
                  <Pressable onPress={() => router.push('/cart/cart')} style={{ position: "absolute", top: -10, left: -10, backgroundColor: colors.primary3, width: 20, height: 20, borderRadius: 100, flexDirection: 'row', alignItems: 'center', justifyContent: "center"}}>
                    <Text>{cartCount}</Text>
                  </Pressable>
                }
              </View>
              <View style={{ position: 'relative'}}>
                <TouchableOpacity onPress={()=>router.push('/notification/notification')}>
                  <FontAwesomeIcon size={25} icon={faBell}/>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        { showSearchResult && (
          <View style={{ backgroundColor: 'white', height: "100%", width: "100%", padding: 12}}>
            { history.length > 0 && history.map((item, index)=>{
              return(
                <TouchableOpacity 
                  key={index}
                  onPress={()=>{
                    router.push({ pathname: "/search-result/search", params: { searchQuery: item }})
                    setShowSearchResult(false)
                    setSearch(item)
                  }}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20}}
                  >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <FontAwesomeIcon icon={faClockRotateLeft}/>
                    <Text>{item}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={()=>{
                      clearHistory(item)
                    }}
                  >
                    <FontAwesomeIcon icon={faX}/>
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </View>
    )
  }


  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#003399', // Active tab title color
        tabBarInactiveTintColor: 'gray', // Inactive tab title color
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          header: () => <HeaderSearch/>,
          tabBarIcon: ({focused}) => {
            if(focused) return <Foundation name="home" size={18} color="#003399" />
            else return <Feather name="home" size={18} color="black" />
          },
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorite',
          header: () => <HeaderSearch/>,
          tabBarIcon: ({focused}) => {
            if(focused) return <FontAwesomeIcon icon={faHeartSolid} color='#003399'/>
            else return <FontAwesomeIcon icon={faHeart} color='black'/>
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History Order',
          header: () => <HeaderSearch/>,
          tabBarIcon: ({focused}) => {
            if(focused) return <FontAwesomeIcon icon={faRectangleListSolid} color='#003399'/>
            else return <FontAwesomeIcon icon={faRectangleList} color='black'/>
          },
        }}
      />
      <Tabs.Screen
        name="approval"
        options={{
          title: 'Approval',
          header: () => <HeaderSearch/>,
          tabBarIcon: ({focused}) => {
            if(focused) return <FontAwesomeIcon icon={faEnvelopeOpenSolid} color='#003399'/>
            else return <FontAwesomeIcon icon={faEnvelopeOpen} color='black'/>
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          // header: () => <HeaderSearch/>,
          tabBarIcon: ({focused}) => {
            if(focused) return <FontAwesomeIcon icon={faUserSolid} color='#003399'/>
            else return <FontAwesomeIcon icon={faUser} color='black'/>
          },
        }}
      />
    </Tabs>
  );
}

import Loading from '@/components/loading';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';
import { Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCartShopping, faClockRotateLeft, faLocationDot, faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { RadioButton } from 'react-native-paper';
import useMasterDataService from '@/services/MasterDataService';
import { DataProvider, useData } from '@/app/utils/context/DataContext';
import Modal from 'react-native-modal';
import colors from './utils/colors';
import useCartDataService from '@/services/CartDataService';
import * as SecureStore from 'expo-secure-store';

// Prevent splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


 


  // header component
  function Header(){
    const segments = useSegments(); // Get the current active route name
    const currentPage = segments[segments.length - 1]; // Get the last segment (page name)
    const { warehouse, setWarehouse, warehouseName, setWarehouseName, cartCount, setCartCount, loading, search, setSearch, showSearchResult, setShowSearchResult } = useData()    
    const inputRef = useRef<TextInput | any>()
    const { getCartCount } = useCartDataService()
    const [heightSearch, setHeightSearch] = useState<number>(0)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [optionsWarehouse, setOptionsWarehouse] = useState<{ list: any[]; selected: string }>({
      list: [],
      selected: '1',
    });

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
    
  
    useEffect(() => {
      setShowModal(false);
    }, [optionsWarehouse.selected]);
  
    const { getMasterData } = useMasterDataService();
  
    const fetchWarehouse = async () => {
      try {
        const response = await getMasterData('warehouse');
        setOptionsWarehouse({
          ...optionsWarehouse,
          list: response?.data?.map((data: any) => ({
            label: data?.warehouseName || '',
            value: data?.id.toString() || '',
          })),
        });
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchWarehouse();
    }, []);
    
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
    }, [])

    useEffect(() => {
      const backAction = () => {
        if (showSearchResult) {
          setShowSearchResult(false);
          inputRef.current?.blur();
          setSearch("");
        } else {
          if (currentPage !== "product") {
            setSearch("");
          }
          router.back();
          inputRef.current?.blur();
        }
  
        return true; // Prevent default back behavior
      };
  
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  
      return () => backHandler.remove(); // Cleanup on unmount
    }, [showSearchResult, setShowSearchResult, setSearch, currentPage, router]);


    return (
      <View style={{ backgroundColor: 'white' }}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 70,
            paddingBottom: 10,
            paddingHorizontal: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            gap: 0,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 15}}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <TouchableOpacity style={{ width: 30}} onPress={() => {
                  if(showSearchResult){
                    setShowSearchResult(false) 
                    inputRef.current?.blur()
                    setSearch('')  
                  }else{
                    if(currentPage !== 'product'){
                      setSearch('')  
                    }
                    router.back()
                    inputRef.current?.blur()
                  }
                }}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} />
              </TouchableOpacity>
              
              <View
                style={{
                  flex: 1,
                  height: 45,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: showSearchResult ? colors.primary : 'gray',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  position: "relative"
                }}
              >
                <FontAwesomeIcon icon={faSearch} size={20} color="gray" />
                <TextInput
                  ref={inputRef}
                  onSubmitEditing={()=>{
                    router.push({ pathname: "/search-result/search", params: { searchQuery: search }})
                        setShowSearchResult(false)
                        saveSearchQuery()
                  }}
                  onKeyPress={(event)=>{
                    if(event.nativeEvent.key == "Enter"){
                      router.push({ pathname: "/search-result/search", params: { searchQuery: search }})
                        setShowSearchResult(false)
                        saveSearchQuery()
                    } 
                  }} 
                  onFocus={() => {
                    setShowSearchResult(true)
                    setTimeout(() => {
                      inputRef.current?.focus()
                    }, 1000)
                  }}
                  returnKeyType="done"
                  value={search}
                  onChangeText={(text: string) => setSearch(text)}
                  placeholder="Search products"
                  style={{ backgroundColor: 'transparent', flex: 1, paddingRight: 20 }} 
                />
                { search !== "" && showSearchResult && (
                  <TouchableOpacity
                    onLayout={(event) => setHeightSearch(event.nativeEvent.layout.height)} 
                    style={{ position: "absolute", top: '50%', right: 10, transform: [{translateY: -heightSearch/2}] }}
                    onPress={()=>setSearch('')}
                    >
                    <FontAwesomeIcon icon={faX} color='gray' size={12}/>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            

          {showSearchResult ? (
            <View >
                <TouchableOpacity 
                  onPress={()=>{
                    router.push({ pathname: "/search-result/search", params: { searchQuery: search }})
                    setShowSearchResult(false)
                    inputRef.current?.blur()
                  }} 
                  style={{ backgroundColor: colors.primary, paddingHorizontal: 34, paddingVertical: 10, borderRadius: 5}}
                  >
                  <Text style={{ color: 'white'}}>Find</Text>
                </TouchableOpacity>
            </View>    
          ) : (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ position: "relative"}}>
                <TouchableOpacity onPress={() => router.push('/cart/cart')}>
                  <FontAwesomeIcon size={25} icon={faCartShopping} />
                </TouchableOpacity>
                { (cartCount > 0 && !loading) && <Pressable onPress={() => router.push('/cart/cart')} style={{ position: "absolute", top: -10, left:-10,  backgroundColor: colors.primary3, borderRadius: 100, width: 20, height: 20, display: 'flex', alignItems: 'center'}}>
                  <Text>{cartCount}</Text>
                </Pressable>}
              </View>
              <View style={{ position: "relative"}}>
                <TouchableOpacity>
                  <FontAwesomeIcon size={25} icon={faBell} />
                </TouchableOpacity>
                {/* <Pressable style={{ position: "absolute", top: -10, left:-10,  backgroundColor: colors.primary3, borderRadius: 100, width: 20, height: 20, display: 'flex', alignItems: 'center'}}>
                  <Text>1</Text>
                  </Pressable> */}
              </View>
              <TouchableOpacity onPress={() => setShowModal(!showModal)}>
              <FontAwesomeIcon icon={faLocationDot} size={25} />
              </TouchableOpacity>
            </View>
          )}

          </View>
        </View>
        
        <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)} style={{ justifyContent: 'flex-end', margin: 0 }}>
          <View style={{ height: 250, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingBottom: 10 }}>
              <Pressable onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faX} />
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Select Warehouse</Text>
            </View>
            <View style={{ borderTopWidth: 1, paddingTop: 10 }}>
              {optionsWarehouse?.list?.map((list: any, index: number) => (
                <Pressable 
                  key={index} 
                  onPress={() =>{
                    setWarehouseName(list.label)
                    setWarehouse(Number(list.value)); // Ensure it's a number
                    setOptionsWarehouse({ ...optionsWarehouse, selected: list.value })} 
                  } 
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                  <Text style={{ fontSize: 16 }}>{list.label}</Text>
                  <RadioButton
                    value={warehouse.toString()}
                    status={list.value === warehouse.toString() ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setWarehouseName(list.label)
                      setWarehouse(Number(list.value)); // Ensure it's a number
                      setOptionsWarehouse({ ...optionsWarehouse, selected: list.value });
                    }}
                    color="#003399"
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>

        { showSearchResult && (
          <View style={{ height: "100%", width: "100%", padding: 12 }}>
            { history.length > 0 && history.map((data, index)=>{
              return(
                <TouchableOpacity 
                  onPress={()=>{
                    router.push({ pathname: "/search-result/search", params: { searchQuery: data }})
                    setSearch(data)
                    setShowSearchResult(false)
                    inputRef.current?.blur()
                  }}
                  key={index} 
                  style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20}}
                  >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10}}>
                    <FontAwesomeIcon icon={faClockRotateLeft}/>
                    <Text>{data}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={()=>{
                      clearHistory(data)
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
    );
  }
  
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Suspense fallback={<Loading />}>
        <DataProvider>
          <Stack>
            <Stack.Screen name="login/login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="operation-category/operation" options={{ header: () => <Header setShowModal={setShowModal} showModal={showModal} setWarehouseName={setWarehouseName} setWarehouse={setWarehouse} setOptionsWarehouse={setOptionsWarehouse} optionsWarehouse={optionsWarehouser} /> }} /> */}
            <Stack.Screen name="operation-category/operation" options={{ header: () => <Header /> }}/>
            <Stack.Screen name="office-category/office" options={{ header: () => <Header /> }} />
            <Stack.Screen name="sparepart-category/sparepart" options={{ header: () => <Header /> }} />
            <Stack.Screen name="rawmaterial-category/rawmaterial" options={{ header: () => <Header /> }} />
            <Stack.Screen name="tools-category/tools" options={{ header: () => <Header /> }} />
            <Stack.Screen name="other-category/other" options={{ header: () => <Header /> }} />
            <Stack.Screen name="detail-product/product" options={{ header: () => <Header /> }} />
            <Stack.Screen name="search-result/search" options={{ header: () => <Header /> }} />
            {/* <Stack.Screen name="checkout/checkout" options={{ header: () => <Header/> }} /> */}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </DataProvider>
      </Suspense>
    </ThemeProvider>
  );
}

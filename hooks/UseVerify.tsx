import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../app/utils/AxiosInstance';
import  * as SecureStore  from 'expo-secure-store';
import { router } from 'expo-router';

interface DecodedInterface{
  name: string,
  roleName: string, 
  anotherWarehouseId: number,
  exp: number,
  isWarehouse: number,
  img: string
}

const useVerify = () => {
  const [name, setName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [warehouseId, setWarehouseId] = useState(0);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState(0);
  const [isWarehouse, setIsWarehouse] = useState(0);
  const [imgProfile, setImgProfile] = useState('');
  
  const navigation = useNavigation();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        // console.log("tes getting a token here in refresh...", {
        //     refreshToken: refreshTokens
        // })
      const response = await axiosInstance.get('/token-mobile', { 
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
       });
    //   console.log("RESPONSE TOKEN:", response)
    const newToken = response.data.accessToken;
    // await SecureStore.setItemAsync("refreshToken", newToken)
      setToken(newToken);
      
      const decoded: DecodedInterface = jwtDecode(newToken);
      setName(decoded.name);
      setRoleName(decoded.roleName);
      setWarehouseId(decoded.anotherWarehouseId);
      setExpire(decoded.exp);
      setIsWarehouse(decoded.isWarehouse);
      setImgProfile(decoded.img);
    } catch (error) {
      console.error('Error refreshing token:', error);
      Alert.alert('Error', 'Token Expired', [{ text: 'OK', onPress: () => router.push('/login/login') }]);
        // Alert.alert('Error', 'Token Expired');  

    }
  };

  const axiosJWT = axiosInstance.create();
  // const axiosJWT = axiosInstance;

  axiosJWT.interceptors.request.use(
    async (config: any) => {
      const currentDate = new Date();
      if (expire * 10000 < currentDate.getTime()) {
        try {
          console.log("tes here 2")
          const refreshToken = await SecureStore.getItemAsync("refreshToken");
          const response = await axiosInstance.get('/token-mobile', {
            headers: {
              Authorization: `Bearer ${refreshToken}`
          }
          });
          // console.log("RESPONSE TOKENN :", response)
          const newToken = response.data.accessToken;
          config.headers.Authorization = `Bearer ${newToken}`;
          setToken(newToken);
          // await SecureStore.setItemAsync("refreshToken", newToken)

          const decoded: DecodedInterface = jwtDecode(newToken);
          setName(decoded.name);
          setRoleName(decoded.roleName);
          setWarehouseId(decoded.anotherWarehouseId);
          setExpire(decoded.exp);
          setIsWarehouse(decoded.isWarehouse);
          setImgProfile(decoded.img);
        } catch (error) {
          console.error('Error refreshing token in interceptor:', error);
          Alert.alert('Error', 'Token Expired', [{ text: 'OK', onPress: () => router.push('/login/login') }]);
        //   Alert.alert('Error', 'Token Expired');
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  return { name, roleName, warehouseId, token, isWarehouse, imgProfile, axiosJWT };
};

export default useVerify;

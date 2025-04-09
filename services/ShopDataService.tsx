import axiosInstance from "@/app/utils/AxiosInstance"
import useVerify from "@/hooks/UseVerify"
import * as SecureStore from 'expo-secure-store';
// const MySwal = withReactContent(Swal)

const useShopService = () => {
    const { token, axiosJWT } = useVerify()
    
    const handleError = (error: any, message: string) => {
      // console.error(message, error)
      // MySwal.fire('Error', `${error.response.data.message}`, 'error')
      // throw new Error(error?.response?.data?.message)
      throw new Error(error.response.data.message)
    }
    
  const getProducts = async(warehouseId: number, page: number, limit: number) =>{
    try {
        const response = await axiosJWT.get(`/product/${warehouseId}?page=${page}&limit=${limit}`)
        return response
    } catch (error) {
        handleError(error, "Error fetching products:")
    }
  }

  const getProductsByCategory = async(warehouseId: number, categoryId: number, page: number, limit: number) => {
    try {
      const response = await axiosJWT.get(`/product-category/${warehouseId}/${categoryId}?page=${page}&limit=${limit}`)
      return response
    } catch (error) {
      handleError(error, "Error fetching products by category:")
    }
  }

  const getProductsByQuery = async(warehouseId: number, page: number, limit: number, q: string) => {
    try {
      const response = await axiosJWT.get(`product/search/${warehouseId}?page=${page}&limit=${limit}&q=${q}`)
      return response
    } catch (error) {
      handleError(error, "Error fetching products by query:")
    }
  }

  return {
    getProducts,
    getProductsByCategory,
    getProductsByQuery
  }
}

export default useShopService

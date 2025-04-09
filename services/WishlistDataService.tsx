import useVerify from "@/hooks/UseVerify"

const useWishlistDataService = () => {
    const { token, axiosJWT } = useVerify()
    
    const handleError = (error: any, message: string) => {
      throw new Error(error.response.data.message)
    }
    
  const getWishlistByUser = async(warehouseId: number) =>{
    try {
        const response = await axiosJWT.get(`/wishlist/${warehouseId}`)
        return response
    } catch (error) {
        handleError(error, "Error fetching products:")
    }
  }

  const removeFromWishlist = async(warehouseId: number, inventoryId: number) => {
    try {
      const response = await axiosJWT.delete(`/wishlist-delete/${inventoryId}/${warehouseId}`)
      return response
    } catch (error) {
      handleError(error, "Error fetching products by category:")
    }
  }

  const addToWishlist = async(warehouseId: number, inventoryId: number) => {
    try {
        const response = await axiosJWT.post(`/wishlist/${warehouseId}`, {
            inventoryId: inventoryId
        })
        return response
    } catch (error) {
        handleError(error, 'Error posting item into cart:')
    }
  }

  const clearWishlist = async(inventoryIds: number[]) => {
    try {
        const response = await axiosJWT.delete('wishlist-clear', {
            inventoryIds: inventoryIds
        })
        return response
    } catch (error) {
        handleError(error, 'Error clearing wishlist:')
    }
  }


  return {
    getWishlistByUser,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
  }
}

export default useWishlistDataService

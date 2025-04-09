import useVerify from "@/hooks/UseVerify"

const useCartDataService = () => {
    const { token, axiosJWT } = useVerify()
    
    const handleError = (error: any, message: string) => {
      throw new Error(error.response.data.message)
    }
    
  const getCartItems = async(warehouseId: number) =>{
    try {
        const response = await axiosJWT.get(`/cart/${warehouseId}`)
        return response
    } catch (error) {
        handleError(error, "Error fetching products:")
    }
  }

  const getCartCount = async(warehouseId: number) => {
    try {
      const response = await axiosJWT.get(`/cart-count/${warehouseId}`)
      return response
    } catch (error) {
      handleError(error, "Error fetching products by category:")
    }
  }

  const postCartItem = async(warehouseId: number, inventoryId: number, quantity: number) => {
    try {
        const response = await axiosJWT.post(`/cart/${warehouseId}`, {
            inventoryId: inventoryId,
            quantity: quantity
        })
        return response
    } catch (error) {
        handleError(error, 'Error posting item into cart:')
    }
  }

  const updateCartItem = async(warehouseId: number, inventoryId: number, quantity: number) => {
    try {
        const response = await axiosJWT.put(`/cart/${warehouseId}`, {
            inventoryId: inventoryId,
            quantity: quantity
        })
        return response
    } catch (error) {
        handleError(error, 'Error updating item cart')
    }
  }

  const removeCartItem = async(id: number, warehouseId: number) => {
    try {
        const response = await axiosJWT.delete(`/cart/${id}/${warehouseId}`)
        return response
    } catch (error) {
        handleError(error, 'Error removing item from cart:')
    }
  }

  return {
    getCartItems,
    getCartCount,
    postCartItem,
    updateCartItem,
    removeCartItem
  }
}

export default useCartDataService

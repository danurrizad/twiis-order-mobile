import useVerify from "@/hooks/UseVerify"


const useMasterDataService = () => {
  const { token, axiosJWT } = useVerify()

  const handleError = (error: any, message: string) => {
    console.error(message, error)

    // Cek apakah ada data duplikat di error.response.data
    // if (error.response?.data?.duplicates) {
    //   const duplicates = error.response.data.duplicates
    //     .map((dup) => `Row: ${dup.rowNumber}, Data: ${dup.data.join(', ')}`)
    //     .join('<br>')

    //   addToast(error.response?.data?.message + duplicates, 'danger', 'error')
    // } else {
    //   addToast(error.response?.data?.message, 'danger', 'error')
    // }

    // Lempar error agar bisa ditangani di level berikutnya
    throw new Error(error.response.data.message)
  }

  const getMasterData = async (api: string) => {
    try {
      const response = await axiosJWT.get(`/${api}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching:')
    }
  }

  const getMasterDataById = async (api: string, id: number) => {
    try {
      const response = await axiosJWT.get(`/${api}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data // Returning the data instead of the whole response
    } catch (error) {
      handleError(error, `Error fetching data for ID ${id}:`)
    }
  }

  const postMasterData = async (api: string, data: object) => {
    try {
      const response = await axiosJWT.post(`/${api}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }

  const uploadMasterData = async (api: string, data: object) => {
    try {
      const response = await axiosJWT.post(`/${api}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }

  const updateMasterDataById = async (api: string, id: number, data: object) => {
    try {
      const response = await axiosJWT.put(`/${api}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data // Returning the data instead of the whole response
    } catch (error) {
      handleError(error, `Error update data for ID ${id}:`)
    }
  }

  const deleteMasterDataById = async (api: string, id: number) => {
    try {
      const response = await axiosJWT.get(`/${api}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data // Returning the data instead of the whole response
    } catch (error) {
      handleError(error, `Error delete data for ID ${id}:`)
    }
  }

  const uploadImageMaterial = async (api: string, id: number, file: File) => {
    try {
      const response = await axiosJWT.post(`/${api}/${id}`, file, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }

  return {
    getMasterData,
    getMasterDataById,
    postMasterData,
    updateMasterDataById,
    deleteMasterDataById,
    uploadMasterData,
    uploadImageMaterial,
  }
}

export default useMasterDataService

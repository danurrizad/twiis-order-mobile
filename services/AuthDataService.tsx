import axiosInstance from "@/app/utils/AxiosInstance"

// const MySwal = withReactContent(Swal)

const useAuthService = () => {

  const handleError = (error: any, message: string) => {
    // console.error(message, error)
    // MySwal.fire('Error', `${error.response.data.message}`, 'error')
    // throw new Error(error?.response?.data?.message)
    throw new Error(error.response.data.message)
  }

  const login = async (username: string, password: string) => {
    try {
      // console.log({
      //   username: username,
      //   password: password
      // })
      const response = await axiosInstance.post('/login-mobile', { username, password })
      return response
    } catch (error: any) {
      // console.log("error masuk sini")
      handleError(error, 'Error during login:')
    }
  }

  const logout = async () => {
    try {
      const response = await axiosInstance.delete('/logout-mobile')
      return response
    } catch (error: any) {
      handleError(error, 'Error during logout:')
    }
  }

  return {
    login,
    logout,
  }
}

export default useAuthService

import axios from 'axios'
import config from './Config'
import https from 'https'


const axiosInstance = axios.create({
  baseURL: `${config.BACKEND_URL}/api`,
  // withCredentials: true,
  // httpsAgent: new https.Agent({
  //   rejectUnauthorized: false, // Ignore SSL verification
  // }),
})

export default axiosInstance

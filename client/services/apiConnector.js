import axios from 'axios';
import { BASE_URL } from '../config';

const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const apiConnector = async (method, url, bodyData = null, headers = null, params = null, dispatch) => {
  console.log("API Connector:", method, url, bodyData, headers, params);

  try {
    const response = await axiosInstance({
      method: method,
      url: url,
      data: bodyData,
      headers: headers,
      params: params,
    });

    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { IHttpClient, IHttpClientRequestParameters } from './IhttpClient'

class HttpClient implements IHttpClient {
  constructor() {}
  get<T, U>(parameters: IHttpClientRequestParameters<T>): Promise<U> {
    const { url, payload } = parameters

    let options: AxiosRequestConfig = {}

    if (payload) {
      options = {
        params: { ...payload }
      }
    }

    return axios
      .get(url, options)
      .then((response: AxiosResponse<U>) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  post<T, U>(parameters: IHttpClientRequestParameters<T>): Promise<U> {
    const { url, payload, params } = parameters

    return axios
      .post(url, payload)
      .then((response: AxiosResponse<U>) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  put<T, U>(parameters: IHttpClientRequestParameters<T>): Promise<U> {
    const { url, payload, params } = parameters

    return axios
      .put(url, payload)
      .then((response: AxiosResponse<U>) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  delete<T, U>(parameters: IHttpClientRequestParameters<T>): Promise<U> {
    const { url, payload } = parameters

    const options: AxiosRequestConfig = {
      ...(payload ? { data: payload } : {})
    }

    return axios
      .delete(url, options)
      .then((response: AxiosResponse<U>) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export const httpClient = new HttpClient()

export interface IHttpClientRequestParameters<T> {
  url: string
  payload?: T
  params?: T
}

export interface IHttpClient {
  get<T, U>(parameters: IHttpClientRequestParameters<T>): Promise<U>
  post<T, U>(parameters: IHttpClientRequestParameters<T>): Promise<U>
  put<T, U>(parameters: IHttpClientRequestParameters<T>): Promise<U>
  delete<T, U>(parameters: IHttpClientRequestParameters<T>): Promise<U>
}

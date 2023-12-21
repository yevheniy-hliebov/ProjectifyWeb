import axios from "axios"
import { getCookie } from "./get-cookie";

export async function register(userDto) {
  return axios.post('/auth/register', userDto).then(response => {
    const authorization_cookie = response.headers.get('Authorization-Cookie')
    if (authorization_cookie) document.cookie = authorization_cookie;
    return response;
  }).catch(err => {
    return err.response;
  })
}

export async function login(signInDto) {
  return axios.post('/auth/login', signInDto).then(response => {
    const authorization_cookie = response.headers.get('Authorization-Cookie')
    if (authorization_cookie) document.cookie = authorization_cookie;
    return response;
  }).catch(err => {
    return err.response;
  })
}

export async function checkIsAuthorized() {
  const accessToken = getCookie('access-token');
  if (!accessToken) {
    return undefined
  }
  return axios.get('/auth/profile', { headers: { "Authorization": accessToken } }).then(response => {
    return response;
  }).catch(err => {
    return err.response;
  })
}
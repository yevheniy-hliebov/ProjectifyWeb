import axios from "axios"

export async function register(userDto) {
  return axios.post('/auth/register', userDto, { withCredentials: true }).then(response => {
    const authorization_cookie =  response.headers.get('Authorization-Cookie')
    if (authorization_cookie) document.cookie = authorization_cookie;
    return response;
  }).catch(err => {
    return err.response;
  })
}
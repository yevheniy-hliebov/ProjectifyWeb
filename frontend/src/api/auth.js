import cookie from '../modules/cookie';
import api from './api';

const root_path = 'auth';

const setAuthCookie = (headers) => {
  const auth_cookie = headers.get('Authorization-Cookie');
  if (auth_cookie) document.cookie = auth_cookie;
};

export const register = async (registerData) => {
  return api
    .post(root_path + '/register', registerData)
    .then((res) => {
      setAuthCookie(res.headers);
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};
export const login = async (loginData) => {
  return api
    .post(root_path + '/login', loginData)
    .then((res) => {
      setAuthCookie(res.headers);
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};

export const responseUnauthorized = { status: 401, message: 'Unauthorized' };

export const getAuthUser = async () => {
  const config = authConfig();
  if (config) {
    return api
      .get(root_path, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } else {
    return responseUnauthorized;
  }
};

export const authConfig = () => {
  const token = cookie.get('jwt-token');
  if (token) {
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  } else {
    return undefined;
  }
};

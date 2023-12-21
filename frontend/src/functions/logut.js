import { getCookie } from "./get-cookie";

export function logout(){
  if(getCookie('access-token')) {
    document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
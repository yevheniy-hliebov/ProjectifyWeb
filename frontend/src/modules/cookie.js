function get(nameCookie) {
  let name = nameCookie + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

function remove(nameCookie) {
  if (get(nameCookie)) {
    document.cookie = `${nameCookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

const Cookie = { get, delete: remove };

export default Cookie;

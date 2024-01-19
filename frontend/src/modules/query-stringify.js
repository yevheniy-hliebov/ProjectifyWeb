export function queryStringify(query) {
  const queryArray = [];
  for (const key in query) {
    if (Object.hasOwnProperty.call(query, key)) {
      queryArray.push(`${key}=${query[key]}`);
    }
  }
  return queryArray.join('&');
}

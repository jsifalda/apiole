export default (token, header = 'X-Auth-Token') => {

  return (headers) => {

    if (!headers) {
      headers = {}
    }

    headers = {
      ...headers,
      [header]: (typeof token === 'function') ? token() : token
    }

    return headers
  }
}

let Apiole = ({
  provider,
  logger = () => {}
}) => {

  if (typeof provider === 'undefined') {
    throw new Error('Please provide provider which will call requests (eg. reqwest) into api options.')
  }

  let endpoints = {}
  let baseUrl = ''

  let createProvider = (service) => {

    return (options) => {

      options = {
        ...options,
        url: baseUrl + options.url
      }

      return new Promise((resolve, reject) => {

        service(options)
        .then((response) => {

          logger('Request successful', response)
          resolve(response)

        })
        .catch((error) => {

          logger(new Error('Request failed'), options, error)
          reject(error)

        })
      })
    }
  }

  let setEndpoints = (_endpoints) => {
    endpoints = _endpoints
    return instance
  }

  let setBaseUrl = (_baseUrl) => {
    baseUrl = _baseUrl
    return instance
  }

  let create = () => {
    let service = {}

    provider = createProvider(provider)

    Object.keys(endpoints).map((key) => {
      service[key] = {
        ...endpoints[key](provider)
      }
    })

    return service
  }

  let instance = {
    endpoints: setEndpoints,
    baseUrl: setBaseUrl,
    create
  }

  return instance

}

export default Apiole

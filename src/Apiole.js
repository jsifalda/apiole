let Apiole = ({
  provider,
  logger = () => {},
  validators = {}
}) => {

  if (typeof provider === 'undefined') {
    throw new Error('Please provide provider which will call requests (eg. reqwest) into api options.')
  }

  let endpoints = {}
  let baseUrl = ''
  let defaults = {}

  let createProvider = (service) => {

    return (options) => {

      options = {
        ...defaults,
        ...options
      }

      Object.keys(validators).map((key) => {
        let validator = validators[key]

        if (validator && !Array.isArray(validator)) {
          validator = [validator]
        }

        validator.map((validate) => {

          if (typeof validate !== 'function') {
            throw new Error(`Validator for ${ key } must be function`)
          }

          let value = validate(options[key])

          options = {
            ...options,
            [key]: value
          }
        })
      })

      return new Promise((resolve, reject) => {

        options = {
          ...options,
          url: baseUrl + options.url
        }

        logger('Sending request to', options.url)

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

  let setDefaults = (_defaults) => {
    defaults = _defaults
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
    defaults: setDefaults,
    create
  }

  return instance

}

export default Apiole

import isUrl from 'is-absolute-url'

let Apiole = ({ provider, logger = () => {}, validators = {} }) => {
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
            throw new Error(`Validator for ${key} must be function`)
          }

          let value = validate(options[key], options)

          options = {
            ...options,
            [key]: value
          }
        })
      })

      return new Promise((resolve, reject) => {
        options = {
          method: 'get', // defaults
          ...options,
          url: isUrl(options.url) ? options.url : baseUrl + options.url
        }

        logger(`Sending request to ${options.url} with method '${options.method}'`)

        service(options)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            logger(new Error(`Request ${options.url} failed`), options, error)
            reject(error)
          })
      })
    }
  }

  let setEndpoints = (_endpoints) => {
    endpoints = _endpoints
    return this
  }

  let setBaseUrl = (_baseUrl) => {
    baseUrl = _baseUrl
    return this
  }

  let setDefaults = (_defaults) => {
    defaults = _defaults
    return this
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

  return {
    endpoints: setEndpoints,
    baseUrl: setBaseUrl,
    defaults: setDefaults,
    create
  }
}

export default Apiole

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

      options = {
        method: 'get', // defaults
        ...options,
        url: isUrl(options.url) ? options.url : baseUrl + options.url
      }

      logger(`Sending request to ${options.url} with method '${options.method}'`)

      return service(options)
    }
  }

  let setEndpoints = function(_endpoints) {
    endpoints = _endpoints
    return this
  }

  let setBaseUrl = function(_baseUrl) {
    baseUrl = _baseUrl
    return this
  }

  let setDefaults = function(_defaults) {
    defaults = _defaults
    return this
  }

  let create = () => {
    provider = createProvider(provider)
    Object.keys(endpoints).map((key) => {
      provider[key] = {
        ...endpoints[key](provider)
      }
    })

    return provider
  }

  return {
    endpoints: setEndpoints,
    baseUrl: setBaseUrl,
    defaults: setDefaults,
    create
  }
}

export default Apiole

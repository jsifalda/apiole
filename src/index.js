import buildPath from './validators/buildPath.js'
import token from './validators/token.js'
import Apiole from './Apiole.js'

Apiole.validators = {
  url: {
    buildPath
  },
  headers: {
    token
  }
}

export default Apiole

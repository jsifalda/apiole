let buildPath = (value) => {

  if (Array.isArray(value)) {

    if (value.length === 1) {
      return value[0]
    }

    let path = value[0]
    let counter = 1

    if (typeof path !== 'string') {
      throw new Error('First index of array has to be string - endpoint path!')
    }

    path = path.replace(/(:(.[^\/]+))/g, (item) => {
      counter++
      return value[counter - 1] || item
    })

    return path
  }

  return value
}

export default () => {
  return buildPath
}

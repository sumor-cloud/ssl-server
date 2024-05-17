export default options => {
  options = options || {}
  options.domain = options.domain || 'localhost'
  options.httpsPort = options.httpsPort || 443
  options.httpPort = options.httpPort || 80

  return options
}

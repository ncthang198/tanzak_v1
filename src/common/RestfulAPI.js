import Config from './Config'

export default class RestfulAPI {
  constructor (baseUrl = '', headers = {}) {
    if (!baseUrl) baseUrl = Config.URL.api
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
    Object.assign(this.headers, headers)
    this.baseUrl = baseUrl
  }

  _fullRoute (url) {
    return `${this.baseUrl}${url}`
  }

  async _fetch (route, method, body) {
    try {
      if (!route) throw new Error('Route is undefined')
      let fullRoute = this._fullRoute(route)
      let opts = {
        method,
        headers: this.headers,
      }
      if (body) {
        if (method == 'GET' || method == 'DELETE') {
          var qs = require('qs')
          const query = qs.stringify(body)
          fullRoute = `${fullRoute}?${query}`
        } else {
            Object.assign(opts, {body: JSON.stringify(body)})
        }
      }

      let fetchPromise = await fetch(fullRoute, opts)
      let responseJson = await fetchPromise.json()
      return responseJson
    } catch (error) {
        console.error(error)
    }
  }

  GET (route, query) { return this._fetch(route, 'GET', query) }

  POST (route, body) { return this._fetch(route, 'POST', body) }

  PUT (route, body) { return this._fetch(route, 'PUT', body) }

  DELETE (route, query) { return this._fetch(route, 'DELETE', query) }
}

class RestrictedRoutes {
  constructor() {
    this.routes = {};
  }
  addRoutes(routeDefs) {
    this.routes = {...this.routes, ...routeDefs}
  }
  getRoutes() {
    return this.routes;
  }
  getAccessCheck(req) {
    let result = null;
    Object.entries(this.routes).forEach(([endpointSig, accessCheck]) => {
      const [method, url] = endpointSig.split(' ');
      let matches = [];
      if (req.method === method && (matches = req.url.match(new RegExp('^'+url)))) {
        result = accessCheck;
        req.locals.routeParams = matches.slice(1)
        console.log(`AUTH DEBUG: Adding local routeParams for ${url}: `,req.locals.routeParams)
      }
    });
    return result;
  }
}
const restrictedRoutes = new RestrictedRoutes();
module.exports = restrictedRoutes;

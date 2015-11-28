var bedwetterOptions = {}

module.exports = [{
  path: '/user',
  method: 'GET',
  config: {
      handler: {
          bedwetter: bedwetterOptions
      }
  }
}, {
  path: '/user/{id}',
  method: 'GET',
  config: {
      handler: {
          bedwetter: bedwetterOptions
      }
  }
}, {
  path: '/user',
  method: 'POST',
  config: {
      handler: {
          bedwetter: bedwetterOptions
      }
  }
}, {
  path: '/user/{id}',
  method: ['PATCH', 'POST'],
  config: {
      handler: {
          bedwetter: bedwetterOptions
      }
  }
}, {
  path: '/user/{id}',
  method: 'DELETE',
  config: {
      handler: {
          bedwetter: bedwetterOptions
      }
  }
}];
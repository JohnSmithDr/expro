'use strict';

const path = require('path');
const express = require('express');
const swaggerTools = require('swagger-tools');

const expro = require('../lib');

const PORT = 3000;

let app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let swaggerSpec = require('./docs/swagger');
swaggerSpec.host = `localhost:${PORT}`;

swaggerTools.initializeMiddleware(swaggerSpec, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter({
    controllers: path.resolve(__dirname, 'routes')
  }));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.use(expro.jsonResult());
  app.use(expro.jsonError());

  app.listen(PORT, (err) => {
    if (err) {
      console.error(err);
      process.exit(-1);
      return;
    }
    console.log('Server started.');
    console.log(`Visit: http://localhost:${PORT}/docs`);
  });

});
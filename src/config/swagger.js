// src/utils/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mega Backend API Docs',
      version: '1.0.0',
      description: 'API documentation for your project',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
        {
          url: 'http://localhost:8000/api/v1',
        },
      ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.js'], // path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

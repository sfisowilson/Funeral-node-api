module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Funeral API',
      version: '1.0.0',
      description: 'API for managing funeral services, members, policies, claims, and more.'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Development Server' }
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts'], // Path to the API docs in route files and index.ts
};

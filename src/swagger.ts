import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
// Use require for CommonJS config import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../swagger-jsdoc-config');

const router = express.Router();

const swaggerSpec = swaggerJSDoc(config);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;

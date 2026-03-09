const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swagger');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
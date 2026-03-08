const express = require('express');
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use(routes);

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
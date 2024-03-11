import router from './routes/index';

const express = require('express');

const app = express();

const PORT = 5000;

app.use(express.json({ limit: '200mb' }));

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

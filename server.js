const express = require('express');
const cors = require('cors');
const videoRoutes = require('./src/routes/videoRoutes');

const app = express();
const port = 4200;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Mount the video routes
app.use('/api/v1/video', videoRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

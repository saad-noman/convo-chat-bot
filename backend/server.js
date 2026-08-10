const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();

// CORS for Vue frontend's access to the backend
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Chatbot routes
app.use('/api/chat', chatRoutes);

// Run server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
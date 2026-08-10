const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');

const app = express();

// CORS for Vue frontend's access to the backend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());

// Chatbot routes
app.use('/api/chat', chatRoutes);

// Run server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
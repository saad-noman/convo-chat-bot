const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');

const app = express();

// CORS for Vue frontend's access to the backend
// Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
];

app.use(cors({
  origin(origin, callback) {
    // Allow non-browser requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

// Parse incoming JSON requests
app.use(express.json());

// Chatbot routes
app.use('/api/chat', chatRoutes);

// Run server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
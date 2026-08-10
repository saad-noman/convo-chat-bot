const { generateResponse } = require('../services/langChainService');

// Handle POST /api/chat
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Get AI response
    const botReply = await generateResponse(message);

    // Send response
    res.json({
      success: true,
      userMessage: message,
      botMessage: botReply
    });

  } catch (error) {
    console.error('Chat Controller Error:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to generate AI response'
    });
  }
};

module.exports = {
  sendMessage
};
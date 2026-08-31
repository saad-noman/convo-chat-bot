const { ChatGroq } = require('@langchain/groq');
const {
  HumanMessage,
  SystemMessage
} = require('@langchain/core/messages');

// Initialize Groq LLM
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'openai/gpt-oss-120b',
  temperature: 0.7
});

// Generate AI response
const generateResponse = async (message) => {
  const messages = [
    new SystemMessage(
      'You are a helpful AI assistant. Answer clearly and concisely.'
    ),
    new HumanMessage(message)
  ];

  const response = await llm.invoke(messages);

  return response.content;
};

module.exports = {
  generateResponse
};
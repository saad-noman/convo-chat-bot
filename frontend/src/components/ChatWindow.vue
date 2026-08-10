<template>
  <div class="chat-container" :class="{ dark: isDark }">

    <!-- ===== HEADER ===== -->
    <header class="chat-header">
      <span class="logo">Convo</span>
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </header>

    <!-- ===== MESSAGES ===== -->
    <div class="messages" ref="messageContainer">
      <MessageItem
        v-for="(msg, index) in messages"
        :key="index"
        :text="msg.text"
        :role="msg.role"
      />

      <div v-if="loading" class="typing">
        <span></span><span></span><span></span>
      </div>
    </div>

    <!-- ===== INPUT ===== -->
    <div class="input-area">
      <input
        v-model="input"
        @keyup.enter="send"
        placeholder="Ask anything..."
      />
      <button @click="send" :disabled="loading">
        <span v-if="!loading">Send</span>
        <span v-else>⏳</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import MessageItem from './MessageItem.vue';
import { sendMessage } from '../services/api';

const input = ref('');
const loading = ref(false);
const isDark = ref(false); // start in light mode

const messages = ref([
  {
    text: 'Hello! I am your AI assistant. Ask me anything.',
    role: 'bot'
  }
]);

const messageContainer = ref(null);

// Toggle theme – updates both the component state and the <body> class
const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.body.classList.toggle('dark-theme', isDark.value);
};

// On mount, ensure <body> matches the initial theme (light by default)
onMounted(() => {
  // If you ever want dark mode as default, set isDark.value = true here
  // and add the class:
  // document.body.classList.add('dark-theme');
  // But we keep light as default, so nothing extra needed.
  // However, to be safe, we sync the body class:
  if (isDark.value) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
});

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop =
      messageContainer.value.scrollHeight;
  }
};

const send = async () => {
  if (!input.value.trim() || loading.value) return;

  const userText = input.value;

  messages.value.push({
    text: userText,
    role: 'user'
  });

  input.value = '';
  loading.value = true;

  scrollToBottom();

  try {
    const response = await sendMessage(userText);

    messages.value.push({
      text: response.data.botMessage,
      role: 'bot'
    });

  } catch (error) {
    messages.value.push({
      text: 'Unable to connect to the chatbot server.',
      role: 'bot'
    });
  }

  loading.value = false;

  scrollToBottom();
};
</script>

<!-- ========================================================= -->
<!-- SCOPED STYLES – component-specific theming & layout       -->
<!-- ========================================================= -->
<style scoped>
/* ===== LIGHT THEME (default) – CSS variables ===== */
.chat-container {
  /* Backgrounds */
  --bg-app: #ffffff;
  --bg-messages: #fafbfc;
  --bg-header: #ffffff;

  /* Text */
  --text-primary: #0f172a; /* for "Convo" and general text */
  --text-bot: #1e293b;

  /* Bubbles */
  --bg-user: linear-gradient(135deg, #2563eb, #3b82f6);
  --text-user: #ffffff;
  --bg-bot: #f1f3f5;

  /* Input */
  --input-bg: #f8fafc;
  --input-border: #e2e8f0;

  /* Borders & shadows */
  --border-color: #e9edf2;
  --shadow: 0 0 30px rgba(0, 0, 0, 0.06);

  /* Layout */
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-app);
  box-shadow: var(--shadow);
  font-family: system-ui, -apple-system, sans-serif;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

/* ===== DARK THEME – overrides variables ===== */
.chat-container.dark {
  --bg-app: #1e293b;
  --bg-messages: #0f172a;
  --bg-header: #1e293b;

  --text-primary: #f1f5f9;
  --text-bot: #e2e8f0;

  --bg-user: linear-gradient(135deg, #4f46e5, #7c3aed);
  --text-user: #ffffff;
  --bg-bot: #334155;

  --input-bg: #1e293b;
  --input-border: #475569;

  --border-color: #475569;
  --shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

/* ===== HEADER ===== */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.logo {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  transition: color 0.25s ease;
}

.theme-toggle {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 30px;
  transition: background 0.2s;
  line-height: 1;
}

.theme-toggle:hover {
  background: rgba(128, 128, 128, 0.15);
}

/* ===== MESSAGES AREA ===== */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: var(--bg-messages);
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background 0.25s ease;
}

/* ===== TYPING INDICATOR ===== */
.typing {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 0;
  color: #94a3b8;
  font-size: 0.9rem;
}
.typing span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typingBounce 1.4s infinite both;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* ===== INPUT AREA ===== */
.input-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--bg-app);
  border-top: 1px solid var(--border-color);
  transition: background 0.25s ease, border-color 0.25s ease;
}

.input-area input {
  flex: 1;
  padding: 12px 18px;
  border: 1.5px solid var(--input-border);
  border-radius: 30px;
  font-size: 0.95rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.25s ease, color 0.25s ease;
}

.input-area input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.input-area input::placeholder {
  color: #94a3b8;
}

.input-area button {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  background: var(--bg-user);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, background 0.25s ease;
  white-space: nowrap;
  min-width: 80px;
}

.input-area button:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
}

.input-area button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .chat-container {
    max-width: 100%;
    height: 100dvh;
    border-radius: 0;
    box-shadow: none;
  }

  .chat-header {
    padding: 12px 16px;
  }

  .logo {
    font-size: 1.1rem;
  }

  .messages {
    padding: 16px 14px;
  }

  .input-area {
    padding: 10px 14px;
    gap: 8px;
  }

  .input-area input {
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  .input-area button {
    padding: 10px 16px;
    min-width: 60px;
    font-size: 0.85rem;
  }
}

@media (min-width: 1024px) {
  .chat-container {
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    height: calc(100vh - 40px);
    max-height: 900px;
  }
  .chat-container.dark {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }
}
</style>

<!-- ========================================================= -->
<!-- GLOBAL STYLES – affects the <body> OUTSIDE the component -->
<!-- ========================================================= -->
<style>
/* Reset and base page background (light mode) */
body {
  margin: 0;
  background: #f1f5f9;
  transition: background 0.3s ease;
  min-height: 100vh;
}

/* Dark mode page background */
body.dark-theme {
  background: #0f172a;
}

/* Center the chat container on the page */
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0;
}
</style>
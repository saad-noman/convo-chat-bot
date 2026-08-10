<template>
  <div :class="['message', role]">
    {{ text }}
  </div>
</template>

<script setup>
defineProps({
  text: String,
  role: String
});
</script>

<style scoped>
.message {
  max-width: 80%;
  padding: 12px 18px;
  border-radius: 18px;
  margin: 6px 0;
  word-wrap: break-word;
  line-height: 1.6;
  font-size: 0.95rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: background 0.25s ease, color 0.25s ease, transform 0.2s, box-shadow 0.2s;
}

.user {
  background: var(--bg-user, #2563eb);
  color: var(--text-user, white);
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.bot {
  background: var(--bg-bot, #f1f3f5);
  color: var(--text-bot, #1e293b);
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.message:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
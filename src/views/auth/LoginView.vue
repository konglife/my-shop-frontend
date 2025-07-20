<template>
  <div class="login-container">
    <n-card title="Login to My Shop" style="max-width: 400px;">
      <n-form @submit.prevent="handleLogin">
        <n-form-item-row label="Username or Email">
          <n-input v-model:value="identifier" placeholder="Enter your username or email" />
        </n-form-item-row>
        <n-form-item-row label="Password">
          <n-input
            type="password"
            show-password-on="mousedown"
            v-model:value="password"
            placeholder="Enter your password"
          />
        </n-form-item-row>
        <n-button type="primary" attr-type="submit" block :loading="loading">
          Log In
        </n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { NCard, NForm, NFormItemRow, NInput, NButton, useNotification } from 'naive-ui';

const identifier = ref('');
const password = ref('');
const loading = ref(false);
const authStore = useAuthStore();
const notification = useNotification();

const handleLogin = async () => {
  if (!identifier.value || !password.value) {
    notification.error({ content: 'Please enter both identifier and password.', duration: 3000 });
    return;
  }

  loading.value = true;
  try {
    await authStore.login(identifier.value, password.value);
    // The store will handle redirection on success
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || 'An unknown error occurred.';
    notification.error({
      title: 'Login Failed',
      content: errorMessage,
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
</style>

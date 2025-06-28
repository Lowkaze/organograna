<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const auth = useAuthStore()

const email = ref('')
const password = ref('')
</script>

<template>
  <div class="d-flex vh-100">
    <div class="d-flex justify-content-center align-items-center h-100 w-50">
      <div class="w-50 rounded bg-success ps-1 pt-1 shadow">
        <form
          class="d-flex flex-column gap-2 p-3 rounded bg-white"
          @submit.prevent="auth.register(email, password)"
        >
          <h1>Registro</h1>
          <div>
            <label for="email" class="form-label">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              class="form-control"
              v-model="email"
              required
            />
          </div>
          <div>
            <label for="password" class="form-label">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              class="form-control"
              v-model="password"
              required
            />
          </div>
          <button type="submit" class="btn btn-success mt-2 fw-bold">Registrar-se</button>
          <p class="text-center m-0">
            Já possui uma conta?
            <a
              class="text-success"
              @click="$router.push({ name: 'login' })"
              style="cursor: pointer"
            >
              Faça login
            </a>
          </p>
        </form>
      </div>
    </div>
    <div class="h-100 w-50 bg-success d-flex flex-column justify-content-center align-items-center">
      <h1 class="text-white">Organograna</h1>
      <i class="bi bi-cash-coin text-white lh-sm" style="font-size: 13rem" />
    </div>
  </div>
</template>

import type { FirebaseApp } from 'firebase/app'
import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const firebaseApp = inject('firebaseApp') as FirebaseApp
  const firebaseAuth = getAuth(firebaseApp)
  const user = ref<User>()
  const router = useRouter()

  function register(email: string, password: string) {
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => (user.value = userCredential.user))
      .then(() => router.push({ name: 'home' }))
      .catch((error) => console.error(error))
  }

  function login(email: string, password: string) {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => (user.value = userCredential.user))
      .then(() => router.push({ name: 'home' }))
      .catch((error) => console.error(error))
  }

  function logout() {
    signOut(firebaseAuth)
      .then(() => (user.value = undefined))
      .then(() => router.push({ name: 'login' }))
  }

  return { user, register, login, logout }
})

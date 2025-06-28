<script setup lang="ts">
import { Modal } from 'bootstrap'
import type { FirebaseApp } from 'firebase/app'
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { computed, inject, onMounted, ref, useTemplateRef } from 'vue'
import type { Transacao } from '@/types'
import { marked } from 'marked'

const { transactions } = defineProps<{ transactions: Transacao[] }>()

const firebaseApp = inject('firebaseApp') as FirebaseApp
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() })
const model = getGenerativeModel(ai, { model: 'gemini-2.5-flash' })

const modalElement = useTemplateRef('modalElement')
const modalInstance = ref<Modal>()

const isLoading = ref(true)
const advice = ref('')
const prompt = computed(
  () =>
    `Você é um assistente financeiro. Analise as seguintes transações e forneça conselhos sobre como economizar dinheiro: ${JSON.stringify(transactions)}`,
)

async function show() {
  isLoading.value = true

  modalInstance.value?.show()

  advice.value = (await model.generateContent(prompt.value)).response.text()

  isLoading.value = false
}

function hide() {
  modalInstance.value?.hide()
}

onMounted(() => {
  if (modalElement.value) {
    modalInstance.value = Modal.getOrCreateInstance(modalElement.value as HTMLElement, {
      backdrop: 'static',
      keyboard: false,
    })

    modalElement.value.addEventListener('hidden.bs.modal', () => {
      isLoading.value = true
      advice.value = ''
    })
  }
})

defineExpose({ show, hide })
</script>

<template>
  <div class="modal modal-xl fade" tabindex="-1" aria-hidden="true" ref="modalElement">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content h-100">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Aconselhamento</h1>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="hide"
            v-if="!isLoading"
          ></button>
        </div>
        <div
          class="modal-body"
          :class="{
            'd-flex': isLoading,
            'align-items-center': isLoading,
            'justify-content-center': isLoading,
          }"
        >
          <div
            class="spinner-border text-success fs-1"
            role="status"
            style="width: 10rem; height: 10rem"
            v-if="isLoading"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          <div v-html="marked.parse(advice)" v-else></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="hide" :disabled="isLoading">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

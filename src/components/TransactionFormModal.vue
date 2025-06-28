<script setup lang="ts">
import { Categoria, FormaPagamento, TipoTransacao, type Transacao } from '@/types'
import { Modal } from 'bootstrap'
import type { FirebaseApp } from 'firebase/app'
import { inject, onMounted, ref, useTemplateRef, watchEffect } from 'vue'
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

const { transactionToEdit, isEdit } = defineProps<{
  transactionToEdit?: Transacao
  isEdit: boolean
}>()

const emit = defineEmits<{
  transactionCreated: [transaction: Transacao]
  transactionUpdated: [transaction: Transacao]
  modalClose: []
}>()

const firebaseApp = inject('firebaseApp') as FirebaseApp
const db = getFirestore(firebaseApp)
const auth = useAuthStore()

const transaction = ref<Transacao>(emptyTransaction())

const modalElement = useTemplateRef('modalElement')
const modalInstance = ref<Modal>()

function emptyTransaction(): Transacao {
  return {
    data: '',
    categoria: '',
    tipo: '',
    descricao: '',
    formaPagamento: '',
    valor: '',
    usuarioId: auth.user?.uid,
  }
}

function show() {
  modalInstance.value?.show()
}

function hide() {
  transaction.value = emptyTransaction()
  modalInstance.value?.hide()
}

async function save() {
  if (isEdit && transactionToEdit) {
    await update()
  } else {
    await create()
  }

  transaction.value = emptyTransaction()
  hide()
}

async function create() {
  const createdDocument = await addDoc(collection(db, 'transacoes'), transaction.value)

  const [year, month, day] = (transaction.value.data as string).split('-')

  emit('transactionCreated', {
    ...transaction.value,
    data: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    id: createdDocument.id,
  })
}

async function update() {
  await updateDoc(doc(db, 'transacoes', transactionToEdit?.id as string), transaction.value)

  const [year, month, day] = (transaction.value.data as string).split('-')

  emit('transactionUpdated', {
    ...transaction.value,
    data: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    id: transactionToEdit?.id,
  })
}

watchEffect(() => {
  if (isEdit && transactionToEdit) {
    transaction.value = {
      ...transactionToEdit,
      data: (transactionToEdit.data as Date).toISOString().split('T')[0],
    }

    delete transaction.value.id

    return
  }

  transaction.value = emptyTransaction()
})

onMounted(() => {
  if (modalElement.value) {
    modalInstance.value = Modal.getOrCreateInstance(modalElement.value as HTMLElement, {
      backdrop: 'static',
      keyboard: false,
    })
  }
})

defineExpose({ show, hide })
</script>

<template>
  <div class="modal fade" tabindex="-1" aria-hidden="true" ref="modalElement">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Nova transação</h1>
          <button type="button" class="btn-close" aria-label="Close" @click="hide"></button>
        </div>
        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="d-flex flex-column gap-2">
              <div>
                <label for="data" class="form-label">Data</label>
                <input
                  type="date"
                  class="form-control"
                  id="data"
                  v-model="transaction.data"
                  required
                />
              </div>
              <div>
                <label for="categoria" class="form-label">Categoria</label>
                <select class="form-select" id="categoria" v-model="transaction.categoria" required>
                  <option value="" disabled selected></option>
                  <option
                    v-for="categoria in Object.values(Categoria)"
                    :key="categoria"
                    :value="categoria"
                  >
                    {{ categoria }}
                  </option>
                </select>
              </div>
              <div>
                <label for="tipo" class="form-label">Tipo</label>
                <select class="form-select" id="tipo" v-model="transaction.tipo" required>
                  <option value="" disabled selected></option>
                  <option v-for="tipo in Object.values(TipoTransacao)" :key="tipo" :value="tipo">
                    {{ tipo }}
                  </option>
                </select>
              </div>
              <div>
                <label for="descricao" class="form-label">Descrição</label>
                <input
                  type="text"
                  class="form-control"
                  id="descricao"
                  v-model="transaction.descricao"
                  required
                />
              </div>
              <div>
                <label for="formaPagamento" class="form-label">Forma de pagamento</label>
                <select
                  class="form-select"
                  id="formaPagamento"
                  v-model="transaction.formaPagamento"
                  required
                >
                  <option value="" disabled selected></option>
                  <option
                    v-for="formaPagamento in Object.values(FormaPagamento)"
                    :key="formaPagamento"
                    :value="formaPagamento"
                  >
                    {{ formaPagamento }}
                  </option>
                </select>
              </div>
              <div>
                <label for="valor" class="form-label">Valor</label>
                <input
                  type="number"
                  class="form-control"
                  id="valor"
                  step="any"
                  v-model="transaction.valor"
                  required
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hide">Fechar</button>
            <button type="submit" class="btn btn-success">Salvar transação</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

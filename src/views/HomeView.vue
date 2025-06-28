<script setup lang="ts">
import AdviceModal from '@/components/AdviceModal.vue'
import TransactionFormModal from '@/components/TransactionFormModal.vue'
import { useAuthStore } from '@/stores/auth'
import { TipoTransacao, type Transacao } from '@/types'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Colors,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import DataTablesCore from 'datatables.net-bs5'
import 'datatables.net-fixedheader-bs5'
import 'datatables.net-responsive-bs5'
import DataTable from 'datatables.net-vue3'
import type { FirebaseApp } from 'firebase/app'
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { computed, inject, onMounted, ref, useTemplateRef } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'

Chart.register(Tooltip, Legend, Colors, ArcElement, BarElement, CategoryScale, LinearScale, Title)
DataTable.use(DataTablesCore)

const columns = [
  {
    title: 'Data',
    data: 'data',
    render: (data: Date, type: string) => {
      if (type === 'sort') {
        return data.getTime()
      }

      return dateFormatter.format(data)
    },
  },
  {
    title: 'Categoria',
    data: 'categoria',
  },
  {
    title: 'Tipo',
    data: 'tipo',
  },
  {
    title: 'Descrição',
    data: 'descricao',
  },
  {
    title: 'Forma de Pagamento',
    data: 'formaPagamento',
  },
  {
    title: 'Valor',
    data: 'valor',
    render: (valor: number) => formatter.format(valor),
  },
  {
    title: 'Ações',
    data: null,
    orderable: false,
    searchable: false,
  },
]

const isEdit = ref(false)
const transactionToEdit = ref<Transacao>()

const auth = useAuthStore()

const transacoes = ref<Transacao[]>([])

const totalReceitas = computed(() => {
  return transacoes.value
    .filter((transacao) => transacao.tipo === TipoTransacao.RECEITA)
    .reduce((total, transacao) => total + (transacao.valor as number), 0)
})

const totalDespesas = computed(() => {
  return transacoes.value
    .filter((transacao) => transacao.tipo === TipoTransacao.DESPESA)
    .reduce((total, transacao) => total + (transacao.valor as number), 0)
})

const saldo = computed(() => totalReceitas.value - totalDespesas.value)

const despesasPorCategoria = computed(() => {
  return transacoes.value
    .filter((transacao) => transacao.tipo === TipoTransacao.DESPESA)
    .reduce(
      (acc, transacao) => {
        acc[transacao.categoria] = (acc[transacao.categoria] || 0) + (transacao.valor as number)
        return acc
      },
      {} as Record<string, number>,
    )
})

const percentualDespesasPorCategoria = computed(() => {
  return Object.entries(despesasPorCategoria.value).reduce(
    (acc, [categoria, valor]) => {
      acc[categoria] = parseFloat(((valor / totalDespesas.value) * 100).toFixed(2))
      return acc
    },
    {} as Record<string, number>,
  )
})

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dateFormatter = new Intl.DateTimeFormat('pt-BR')

const modal = useTemplateRef('modal')
const adviceModal = useTemplateRef('adviceModal')

const firebaseApp = inject('firebaseApp') as FirebaseApp
const db = getFirestore(firebaseApp)

function selectTransaction(id: string) {
  const selectedTransaction = transacoes.value.find((transacao) => transacao.id === id)

  if (selectedTransaction) {
    isEdit.value = true
    transactionToEdit.value = selectedTransaction
    modal.value?.show()
  }
}

async function deleteTransaction(id: string) {
  if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
    return
  }

  try {
    await deleteDoc(doc(db, 'transacoes', id))

    const index = transacoes.value.findIndex((transacao) => transacao.id === id)

    if (index !== -1) {
      transacoes.value.splice(index, 1)
    }
  } catch (error) {
    console.error(error)
  }
}

function handleTransactionUpdated(updatedTransaction: Transacao) {
  const index = transacoes.value.findIndex((transacao) => transacao.id === updatedTransaction.id)

  if (index !== -1) {
    transacoes.value[index] = updatedTransaction
  }

  isEdit.value = false
  transactionToEdit.value = undefined
}

function createTransaction() {
  isEdit.value = false
  transactionToEdit.value = undefined
  modal.value?.show()
}

onMounted(async () => {
  const firebaseApp = inject('firebaseApp') as FirebaseApp
  const db = getFirestore(firebaseApp)
  const q = query(collection(db, 'transacoes'), where('usuarioId', '==', auth.user?.uid))

  getDocs(q)
    .then((snapshot) =>
      snapshot.docs
        .map((d) => {
          const [year, month, day] = (d.data().data as string).split('-')
          new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

          return {
            ...d.data(),
            id: d.id,
            data: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
          }
        })
        .forEach((x) => transacoes.value.push(x as Transacao)),
    )
    .catch((error) => console.error('Erro ao buscar transações:', error))
})
</script>

<template>
  <nav class="navbar bg-success">
    <div class="container-fluid">
      <div class="d-flex align-items-center gap-2 text-white">
        <i class="bi bi-cash-coin text-white lh-1 fs-3" />
        <h3>Organograna</h3>
      </div>
      <button class="btn btn-light fw-bold" @click="auth.logout()">Sair</button>
    </div>
  </nav>
  <div class="container-fluid p-3">
    <div class="d-flex flex-column gap-3">
      <div class="d-flex gap-3">
        <div class="d-flex flex-column flex-shrink-0 gap-3">
          <div class="d-flex gap-3">
            <button class="btn btn-lg btn-success fw-bold" @click="createTransaction">
              Nova transação
            </button>
            <button
              class="btn btn-lg btn-success fw-bold"
              @click="adviceModal?.show"
              :disabled="transacoes.length === 0"
            >
              Aconselhamento
            </button>
          </div>
          <div class="shadow-lg p-3 bg-body rounded">
            <h3>Total de receitas</h3>
            <p class="fs-4 m-0 text-success">{{ formatter.format(totalReceitas) }}</p>
          </div>
          <div class="shadow-lg p-3 bg-body rounded">
            <h3>Total de despesas</h3>
            <p class="fs-4 m-0 text-danger">{{ formatter.format(totalDespesas) }}</p>
          </div>
          <div class="shadow-lg p-3 bg-body rounded">
            <h3>Saldo</h3>
            <p class="fs-4 m-0">{{ formatter.format(saldo) }}</p>
          </div>
        </div>
        <div
          class="d-flex gap-3 flex-column shadow-lg p-3 rounded bg-body"
          style="flex: 1; min-width: 0"
        >
          <h3>Transações por tipo</h3>
          <span v-if="transacoes.length === 0">Não há transações para gerar o gráfico.</span>
          <div class="flex-grow-1" v-if="transacoes.length > 0">
            <Bar
              :data="{
                labels: [TipoTransacao.RECEITA, TipoTransacao.DESPESA],
                datasets: [
                  {
                    label: 'Quantidade',
                    data: [
                      transacoes.filter((t) => t.tipo === TipoTransacao.RECEITA).length,
                      transacoes.filter((t) => t.tipo === TipoTransacao.DESPESA).length,
                    ],
                    backgroundColor: ['rgba(25, 135, 84, 0.75)', 'rgba(220, 53, 69, 0.75)'],
                  },
                ],
              }"
              :options="{
                responsive: true,
                maintainAspectRatio: false,
                onResize: (chart) => chart.resize(),
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                    },
                    max:
                      Math.max(
                        transacoes.filter((t) => t.tipo === TipoTransacao.RECEITA).length,
                        transacoes.filter((t) => t.tipo === TipoTransacao.DESPESA).length,
                      ) + 1,
                  },
                },
              }"
            />
          </div>
        </div>
        <div
          class="d-flex gap-3 flex-column shadow-lg p-3 rounded bg-body"
          style="flex: 1; min-width: 0"
        >
          <h3>Despesas por categoria</h3>
          <span v-if="transacoes.filter(({ tipo }) => tipo === TipoTransacao.DESPESA).length === 0">
            Não há transações do tipo despesa para gerar o gráfico.
          </span>
          <div v-if="transacoes.filter(({ tipo }) => tipo === TipoTransacao.DESPESA).length > 0">
            <Doughnut
              :data="{
                labels: Object.keys(percentualDespesasPorCategoria),
                datasets: [
                  {
                    label: 'Percentual',
                    data: Object.values(percentualDespesasPorCategoria),
                    backgroundColor: [
                      '13, 110, 253',
                      '108, 117, 125',
                      '25, 135, 84',
                      '13, 202, 240',
                      '255, 193, 7',
                      '220, 53, 69',
                      '33, 37, 41',
                    ].map((color) => `rgba(${color}, 0.75)`),
                  },
                ],
              }"
              :options="{
                responsive: true,
                maintainAspectRatio: false,
                onResize: (chart) => chart.resize(),
                plugins: {
                  legend: {
                    position: 'right',
                    align: 'center',
                    labels: {
                      padding: 20,
                      boxWidth: 12,
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                    display: true,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${context.raw}%`
                      },
                    },
                  },
                  colors: {
                    enabled: true,
                  },
                },
              }"
            />
          </div>
        </div>
      </div>
      <div class="flex-grow-1 shadow-lg p-3 rounded bg-body">
        <h3>Transações</h3>
        <DataTable
          :columns="columns"
          :data="transacoes"
          :options="{
            responsive: true,
            paging: false,
            searching: true,
            ordering: true,
            fixedHeader: true,
            language: {
              search: 'Pesquisar:',
              emptyTable: 'Você ainda não possui transações registradas.',
              zeroRecords: 'Nenhuma transação encontrada.',
            },
            layout: {
              topStart: null,
              bottomStart: null,
              bottomEnd: null,
            },
          }"
          class="table table-responsive text-nowrap"
        >
          <template #column-6="{ rowData }">
            <button class="btn btn-sm btn-success me-2" @click="selectTransaction(rowData.id)">
              <i class="bi bi-pencil-square" />
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteTransaction(rowData.id)">
              <i class="bi bi-trash3-fill" />
            </button>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
  <TransactionFormModal
    :is-edit="isEdit"
    :transaction-to-edit="transactionToEdit"
    ref="modal"
    @transaction-created="transacoes.push($event)"
    @transaction-updated="handleTransactionUpdated"
  />
  <AdviceModal ref="adviceModal" :transactions="transacoes" />
</template>

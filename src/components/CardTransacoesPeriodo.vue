<script setup lang="ts">
import VCard from '@/components/VCard.vue'

const dateFormatter = new Intl.DateTimeFormat('pt-BR')
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const { transacoes } = defineProps<{ transacoes: object[] }>()
</script>

<template>
  <VCard header="Transações no período">
    <table class="table table-hover table-borderless">
      <thead>
        <tr>
          <th scope="col">Data</th>
          <th scope="col">Categoria</th>
          <th scope="col">Tipo</th>
          <th scope="col">Descrição</th>
          <th scope="col">Forma de pagamento</th>
          <th scope="col">Valor</th>
          <th scope="col">Observação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transacao, i) in transacoes" :key="i">
          <td>{{ dateFormatter.format(transacao.data) }}</td>
          <td>{{ transacao.categoria }}</td>
          <td>{{ transacao.tipo }}</td>
          <td>{{ transacao.descricao }}</td>
          <td>{{ transacao.formaPagamento }}</td>
          <td
            :class="{
              'text-danger': transacao.tipo === 'Despesa',
              'text-success': transacao.tipo === 'Receita',
            }"
          >
            {{ `${transacao.tipo === 'Despesa' ? '- ' : ''}${formatter.format(transacao.valor)}` }}
          </td>
          <td>{{ transacao.observacao }}</td>
        </tr>
      </tbody>
    </table>
  </VCard>
</template>

<style scoped></style>

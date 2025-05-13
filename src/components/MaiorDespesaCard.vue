<script setup lang="ts">
import VCard from '@/components/VCard.vue'
import { computed } from 'vue'

const { transacoes } = defineProps<{ transacoes: object[] }>()
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const maiorDespesa = computed(() => {
  if (transacoes.length === 0) {
    return null
  }

  return transacoes
    .filter((d) => d.tipo === 'Despesa')
    .reduce((acc, d) => (d.valor > acc.valor ? d : acc), { valor: 0 })
})
</script>

<template>
  <VCard header="Maior despesa">
    <span class="text-danger fs-3">{{ `- ${formatter.format(maiorDespesa?.valor ?? 0)}` }}</span>
  </VCard>
</template>

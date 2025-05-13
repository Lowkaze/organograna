<script setup lang="ts">
import VCard from '@/components/VCard.vue'
import { computed } from 'vue'

const { transacoes } = defineProps<{ transacoes: object[] }>()
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const maiorReceita = computed(() => {
  if (transacoes.length === 0) {
    return null
  }

  return transacoes
    .filter((d) => d.tipo === 'Receita')
    .reduce((acc, d) => (d.valor > acc.valor ? d : acc), { valor: 0 })
})
</script>

<template>
  <VCard header="Maior receita">
    <span class="text-success fs-3">{{ formatter.format(maiorReceita?.valor ?? 0) }}</span>
  </VCard>
</template>

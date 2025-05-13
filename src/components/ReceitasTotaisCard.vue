<script setup lang="ts">
import VCard from '@/components/VCard.vue'
import { computed } from 'vue'

const { transacoes } = defineProps<{ transacoes: object[] }>()
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const receitasTotais = computed(() => {
  if (transacoes.length === 0) {
    return 0
  }

  return transacoes.filter((d) => d.tipo === 'Receita').reduce((acc, d) => acc + d.valor, 0)
})
</script>

<template>
  <VCard header="Receitas totais">
    <span class="text-success fs-3">{{ formatter.format(receitasTotais) }}</span>
  </VCard>
</template>

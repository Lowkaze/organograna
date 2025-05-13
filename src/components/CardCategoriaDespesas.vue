<script setup lang="ts">
import VCard from '@/components/VCard.vue'
import { Doughnut } from 'vue-chartjs'
import { Chart, Tooltip, Legend, Colors, ArcElement } from 'chart.js'
import { computed } from 'vue'

Chart.register(Tooltip, Legend, Colors, ArcElement)

const { transacoes } = defineProps<{ transacoes: object[] }>()
const despesas = computed(() => {
  return transacoes.filter(({ tipo }) => tipo === 'Despesa')
})
const categorias = computed(() => {
  return [...new Set(despesas.value.map(({ categoria }) => categoria))].sort()
})
const ae = computed(() => {
  const d = []
  const a = Object.fromEntries(categorias.value.map((d) => [d, []]))

  despesas.value.forEach(({ categoria, valor }) => a[categoria].push(valor))

  Object.keys(a).forEach((x) => {
    const i = a[x].length
    d.push((i * 100) / despesas.value.length)
  })

  return d
})
</script>

<template>
  <VCard header="Categorias de despesas" class="h-100">
    <Doughnut
      :data="{
        labels: categorias,
        datasets: [
          {
            label: 'Despesas',
            data: ae,
          },
        ],
      }"
      :options="{
        responsive: true,
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
        },
      }"
    />
  </VCard>
</template>

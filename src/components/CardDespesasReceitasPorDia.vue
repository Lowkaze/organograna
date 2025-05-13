<script setup lang="ts">
import VCard from '@/components/VCard.vue'
import { Bar } from 'vue-chartjs'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors,
} from 'chart.js'
import { computed } from 'vue'

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors)

const { transacoes } = defineProps<{ transacoes: object[] }>()
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dateFormatter = new Intl.DateTimeFormat('pt-BR')
const transacoesOrdenadasPorData = computed(() => {
  return [...transacoes].sort((a, b) => {
    if (a.data < b.data) {
      return -1
    }

    if (a.data > b.data) {
      return 1
    }

    return 0
  })
})

const labels = computed(() => {
  return [
    ...new Set(transacoesOrdenadasPorData.value.map(({ data }) => dateFormatter.format(data))),
  ]
})
const despesas = computed(() => {
  return transacoesOrdenadasPorData.value.filter((d) => d.tipo === 'Despesa')
})

const despesasPorDia = computed(() => {
  const aaa: object = Object.fromEntries(labels.value.map((d) => [d, []]))

  Object.keys(aaa).forEach((d) =>
    aaa[d].push(despesas.value.find((t) => dateFormatter.format(t.data) === d)?.valor ?? 0),
  )

  return Object.values(aaa).map((d) => d.reduce((acc, d) => parseFloat(acc + d), 0))
})

const receitas = computed(() => {
  return transacoesOrdenadasPorData.value.filter((d) => d.tipo === 'Receita')
})

const receitarPorDia = computed(() => {
  const aaa: object = Object.fromEntries(labels.value.map((d) => [d, []]))

  Object.keys(aaa).forEach((d) =>
    aaa[d].push(receitas.value.find((t) => dateFormatter.format(t.data) === d)?.valor ?? 0),
  )

  return Object.values(aaa).map((d) => d.reduce((acc, d) => parseFloat(acc + d), 0))
})
</script>

<template>
  <VCard header="Despesas e receitas por dia">
    <Bar
      :data="{
        labels: labels,
        datasets: [
          {
            label: 'Despesas',
            data: despesasPorDia,
            borderWidth: 1,
          },
          {
            label: 'Receitas',
            data: receitarPorDia,
            borderWidth: 1,
          },
        ],
      }"
      :options="{
        responsive: true,
        scales: {
          y: {
            ticks: {
              callback: (value: number) => formatter.format(value),
            },
          },
          x: {
            ticks: {
              autoSkip: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || ''

                if (label) {
                  label += ': '
                }

                if (context.parsed.y !== null) {
                  label += formatter.format(context.parsed.y)
                }

                return label
              },
            },
          },
        },
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y',
        },
        skipNull: true,
      }"
    />
  </VCard>
</template>

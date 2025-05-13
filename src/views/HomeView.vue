<script setup lang="ts">
import { ref } from 'vue'
import CardDespesasReceitasPorDia from '@/components/CardDespesasReceitasPorDia.vue'
import CardCategoriaDespesas from '@/components/CardCategoriaDespesas.vue'
import CardTransacoesPeriodo from '@/components/CardTransacoesPeriodo.vue'
import MaiorReceitaCard from '@/components/MaiorReceitaCard.vue'
import MaiorDespesaCard from '@/components/MaiorDespesaCard.vue'
import ReceitasTotaisCard from '@/components/ReceitasTotaisCard.vue'
import DespesasTotaisCard from '@/components/DespesasTotaisCard.vue'

function range(start, stop, step = 1) {
  return Array.from({ length: Math.ceil((stop - start) / step) }, (_, i) => start + i * step)
}

function randomData(count: number) {
  const data = []
  const categorias = ['Transporte', 'Alimentação', 'Lazer', 'Educação', 'Saúde', 'Outros']
  const tipos = ['Receita', 'Despesa']
  const descricoes = ['Uber', 'Mercado', 'Café', 'Pizza', 'Casa', 'Salário']
  const formasPagamento = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Pix']
  const valores = [149.5, 11.5, 176.5, 200.5, 950.5, 30.5]
  const dias = range(1, 32)

  for (let i = 0; i < count; i++) {
    data.push({
      data: new Date(2025, 2, dias[Math.floor(Math.random() * dias.length)]),
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      descricao: descricoes[Math.floor(Math.random() * descricoes.length)],
      formaPagamento: formasPagamento[Math.floor(Math.random() * formasPagamento.length)],
      valor: valores[Math.floor(Math.random() * valores.length)],
      observacao: '',
    })
  }

  return data
}

const data = ref(randomData(15))
</script>

<template>
  <main>
    <div class="container py-4">
      <div class="d-flex align-items-center justify-content-between">
        <h1>Organograna</h1>
        <button class="btn btn-link">Sair</button>
      </div>

      <div class="row mb-4 align-items-center justify-content-center">
        <label for="periodo-inicial" class="col-auto col-form-label col-form-label-lg"
          >Período</label
        >
        <div class="col-auto">
          <input type="date" class="form-control form-control-lg" id="periodo-inicial" />
        </div>
        <label for="periodo-final" class="col-auto col-form-label col-form-label-lg">a</label>
        <div class="col-auto">
          <input type="date" class="form-control form-control-lg" id="periodo-final" />
        </div>
      </div>

      <div class="row row-cols-4 g-4">
        <div class="col text-center">
          <DespesasTotaisCard :transacoes="data" />
        </div>
        <div class="col text-center">
          <ReceitasTotaisCard :transacoes="data" />
        </div>
        <div class="col text-center">
          <MaiorDespesaCard :transacoes="data" />
        </div>
        <div class="col text-center">
          <MaiorReceitaCard :transacoes="data" />
        </div>
        <div class="col-8">
          <CardDespesasReceitasPorDia :transacoes="data" />
        </div>
        <div class="col-4">
          <CardCategoriaDespesas :transacoes="data" />
        </div>
        <div class="col-12">
          <CardTransacoesPeriodo :transacoes="data" />
        </div>
      </div>
    </div>
  </main>
</template>

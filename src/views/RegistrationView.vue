<script setup lang="ts"></script>

<template>
  <div class="d-flex vh-100">
    <div class="d-flex justify-content-center align-items-center h-100 w-50">
      <div class="w-50 rounded bg-success ps-1 pt-1 shadow">
        <div class="d-flex flex-column gap-2 p-3 rounded bg-white">
          <h1>Registro</h1>
          <div>
            <label for="name" class="form-label">Nome</label>
            <input type="text" name="name" id="name" class="form-control" />
          </div>
          <div>
            <label for="email" class="form-label">E-mail</label>
            <input type="email" name="email" id="email" class="form-control" />
          </div>
          <div>
            <label for="password" class="form-label">Senha</label>
            <input type="password" name="password" id="password" class="form-control" />
          </div>
          <button type="button" class="btn btn-success mt-2 fw-bold">Registrar-se</button>
        </div>
      </div>
    </div>
    <div class="h-100 w-50 bg-success d-flex flex-column justify-content-center align-items-center">
      <h1 class="text-white">Organograna</h1>
      <i class="bi bi-cash-coin text-white lh-sm" style="font-size: 13rem" />
    </div>
  </div>
</template>

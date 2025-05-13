<script setup lang="ts">
defineProps<{ header: string }>()
</script>

<template>
  <div class="card">
    <div class="card-header fs-5">{{ header }}</div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

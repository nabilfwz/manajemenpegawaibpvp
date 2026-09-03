<script setup lang="ts">
const { data } = await useFetch('/api/pegawai', { query: { pageSize: 1 } })
const totalPegawai = computed(() => data.value?.meta.total ?? 0)
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Dashboard</h1>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UCard>
        <template #header>
          <span class="text-sm text-gray-500">Total Pegawai</span>
        </template>
        <p class="text-3xl font-semibold">{{ totalPegawai }}</p>
      </UCard>
    </div>

    <div class="mt-8">
      <UButton to="/pegawai" icon="i-lucide-users">
        Lihat Data Pegawai
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  { label: 'Dashboard', to: '/', icon: 'i-lucide-layout-dashboard' },
  { label: 'Data Pegawai', to: '/pegawai', icon: 'i-lucide-users' }
]
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 p-4">
      <div class="text-lg font-semibold mb-6 px-2">SDM App</div>
      <nav class="space-y-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          active-class="bg-gray-100 dark:bg-gray-800 font-medium"
        >
          <UIcon :name="link.icon" class="size-4" />
          {{ link.label }}
        </NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>

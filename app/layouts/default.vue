<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

const links = [
  { label: 'Dashboard', to: '/', icon: 'i-lucide-layout-dashboard' },
  { label: 'Data Pegawai', to: '/pegawai', icon: 'i-lucide-users' }
]

// Tutup sidebar otomatis tiap pindah halaman (khusus mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Topbar: cuma tampil di HP -->
    <header class="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center gap-3 h-14 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <UButton
        icon="i-lucide-menu"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="sidebarOpen = true"
      />
      <span class="font-semibold">SDM App</span>
    </header>

    <!-- Overlay backdrop, cuma muncul di HP saat sidebar terbuka -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <aside
      class="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900
             fixed inset-y-0 left-0 z-50
             transition-transform duration-200 ease-in-out
             lg:static lg:translate-x-0 lg:z-auto"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between mb-6 px-2">
        <span class="text-lg font-semibold">SDM App</span>
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          color="neutral"
          size="sm"
          class="lg:hidden"
          @click="sidebarOpen = false"
        />
      </div>

      <nav class="space-y-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          active-class="bg-gray-100 dark:bg-gray-800 font-medium"
          exact-active-class="bg-gray-100 dark:bg-gray-800 font-medium"
        >
          <UIcon :name="link.icon" class="size-4" />
          {{ link.label }}
        </NuxtLink>
      </nav>
    </aside>

    <main class="flex-1 p-6 pt-20 lg:pt-6">
      <slot />
    </main>
  </div>
</template>
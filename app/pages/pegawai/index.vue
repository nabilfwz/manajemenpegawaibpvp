<script setup lang="ts">
const search = ref('')
const page = ref(1)
const filterStatus = ref('')
const toast = useToast()

const statusFilterOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'PNS', value: 'PNS' },
  { label: 'PPPK', value: 'PPPK' },
  { label: 'Non-ASN', value: 'NON_ASN' }
]

const { data, refresh, status } = await useFetch('/api/pegawai', {
  query: { search, page, status: filterStatus },
  watch: [search, page, filterStatus]
})

const columns = [
  { accessorKey: 'nama', header: 'Nama' },
  { accessorKey: 'nip', header: 'NIP' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'jabatan', header: 'Jabatan' },
  { accessorKey: 'golongan', header: 'Golongan' },
  { accessorKey: 'aksi', header: '' }
]

const statusLabel: Record<string, string> = {
  PNS: 'PNS',
  PPPK: 'PPPK',
  NON_ASN: 'Non-ASN'
}

const statusColor: Record<string, 'primary' | 'info' | 'neutral'> = {
  PNS: 'primary',
  PPPK: 'info',
  NON_ASN: 'neutral'
}

// Gabungkan field jabatan yang kondisional jadi satu tampilan
function jabatanLabel(row: any) {
  if (row.status === 'NON_ASN') return row.jabatanNonAsn || '-'
  if (row.jenisJabatan === 'FUNGSIONAL') return `${row.namaJabatanFungsional ?? ''} ${row.jenjangFungsional ?? ''}`.trim()
  if (row.jenisJabatan === 'PELAKSANA') return `${row.namaJabatanPelaksana ?? ''} ${row.jenjangPelaksana ?? ''}`.trim()
  if (row.jenisJabatan === 'STRUKTURAL') return row.jabatanStruktural || '-'
  return '-'
}

async function hapusPegawai(id: string, nama: string) {
  if (!confirm(`Hapus data ${nama}?`)) return

  try {
    await $fetch(`/api/pegawai/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Pegawai berhasil dihapus', color: 'success' })
    refresh()
  } catch {
    toast.add({ title: 'Gagal menghapus pegawai', color: 'error' })
  }
}
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <h1 class="text-2xl font-semibold">Data Pegawai</h1>
      <UButton to="/pegawai/tambah" icon="i-lucide-plus" block class="sm:w-auto">
        Tambah Pegawai
      </UButton>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <UInput
        v-model="search"
        placeholder="Cari nama, NIP, atau email..."
        icon="i-lucide-search"
        class="w-full sm:max-w-sm"
      />
      <USelectMenu
        v-model="filterStatus"
        :items="statusFilterOptions"
        value-key="value"
        searchable
        placeholder="Filter status"
        class="w-full sm:w-48"
      />
    </div>

    <!-- DESKTOP: tabel biasa, disembunyikan di HP -->
    <UTable
      :data="data?.data"
      :columns="columns"
      :loading="status === 'pending'"
      class="hidden sm:block"
    >
      <template #status-cell="{ row }">
        <UBadge :color="statusColor[row.original.status]" variant="subtle">
          {{ statusLabel[row.original.status] }}
        </UBadge>
      </template>
      <template #jabatan-cell="{ row }">
        {{ jabatanLabel(row.original) }}
      </template>
      <template #golongan-cell="{ row }">
        {{ row.original.golongan || '-' }}
      </template>
      <template #aksi-cell="{ row }">
        <div class="flex gap-2 justify-end">
          <UButton
            :to="`/pegawai/${row.original.id}/edit`"
            icon="i-lucide-pencil"
            variant="ghost"
            size="sm"
          />
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="error"
            size="sm"
            @click="hapusPegawai(row.original.id, row.original.nama)"
          />
        </div>
      </template>
    </UTable>

    <!-- MOBILE: card list, disembunyikan di desktop -->
    <div class="sm:hidden space-y-3">
      <div v-if="status === 'pending'" class="space-y-3">
        <USkeleton v-for="i in 4" :key="i" class="h-24 w-full rounded-lg" />
      </div>

      <p v-else-if="!data?.data?.length" class="text-center text-gray-500 py-8">
        Tidak ada data pegawai
      </p>

      <UCard v-for="row in data?.data" :key="row.id" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="font-medium truncate">{{ row.nama }}</p>
            <p class="text-sm text-gray-500 truncate">{{ row.nip || '-' }}</p>
          </div>
          <UBadge :color="statusColor[row.status]" variant="subtle" class="shrink-0">
            {{ statusLabel[row.status] }}
          </UBadge>
        </div>

        <div class="mt-3 text-sm space-y-1">
          <p class="text-gray-700">{{ jabatanLabel(row) }}</p>
          <p v-if="row.golongan" class="text-gray-500">Golongan {{ row.golongan }}</p>
        </div>

        <div class="mt-3 flex gap-2 justify-end border-t border-gray-100 pt-3">
          <UButton
            :to="`/pegawai/${row.id}/edit`"
            icon="i-lucide-pencil"
            variant="ghost"
            size="sm"
          >
            Edit
          </UButton>
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="error"
            size="sm"
            @click="hapusPegawai(row.id, row.nama)"
          >
            Hapus
          </UButton>
        </div>
      </UCard>
    </div>

    <div v-if="data?.meta && data.meta.totalPages > 1" class="mt-4 flex justify-center">
      <UPagination v-model:page="page" :total="data.meta.total" :items-per-page="data.meta.pageSize" />
    </div>
  </div>
</template>
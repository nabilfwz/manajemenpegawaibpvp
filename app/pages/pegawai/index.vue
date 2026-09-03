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
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Data Pegawai</h1>
      <UButton to="/pegawai/tambah" icon="i-lucide-plus">
        Tambah Pegawai
      </UButton>
    </div>

    <div class="flex gap-3 mb-4">
      <UInput
        v-model="search"
        placeholder="Cari nama, NIP, atau email..."
        icon="i-lucide-search"
        class="max-w-sm"
      />
      <USelectMenu
        v-model="filterStatus"
        :items="statusFilterOptions"
        value-key="value"
        searchable
        placeholder="Filter status"
        class="w-48"
      />
    </div>

    <UTable :data="data?.data" :columns="columns" :loading="status === 'pending'">
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

    <div v-if="data?.meta && data.meta.totalPages > 1" class="mt-4 flex justify-center">
      <UPagination v-model:page="page" :total="data.meta.total" :items-per-page="data.meta.pageSize" />
    </div>
  </div>
</template>

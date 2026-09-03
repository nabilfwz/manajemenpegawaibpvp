<script setup lang="ts">
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = ref({
  nama: '',
  nip: '',
  email: '',
  status: '' as const,
  jenisJabatan: '' as const,
  namaJabatanFungsional: '',
  jenjangFungsional: '',
  namaJabatanPelaksana: '',
  jenjangPelaksana: '',
  jabatanStruktural: '',
  jabatanNonAsn: '',
  golongan: ''
})

async function simpan() {
  loading.value = true
  errors.value = {}
  try {
    await $fetch('/api/pegawai', { method: 'POST', body: form.value })
    toast.add({ title: 'Pegawai berhasil ditambahkan', color: 'success' })
    router.push('/pegawai')
  } catch (err: any) {
    if (err?.data?.data) {
      errors.value = err.data.data
    }
    toast.add({
      title: 'Gagal menyimpan',
      description: err?.data?.statusMessage ?? 'Periksa kembali data yang diisi',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Tambah Pegawai</h1>
    <FormPegawai v-model="form" submit-label="Simpan Pegawai" :loading="loading" :errors="errors" @submit="simpan" />
  </div>
</template>

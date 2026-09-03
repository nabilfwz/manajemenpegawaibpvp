<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const errors = ref<Record<string, string[]>>({})
const id = route.params.id as string

const { data: pegawai } = await useFetch(`/api/pegawai/${id}`)

if (!pegawai.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pegawai tidak ditemukan' })
}

const form = ref({
  nama: pegawai.value.nama,
  nip: pegawai.value.nip,
  email: pegawai.value.email,
  status: pegawai.value.status,
  jenisJabatan: pegawai.value.jenisJabatan ?? '',
  namaJabatanFungsional: pegawai.value.namaJabatanFungsional ?? '',
  jenjangFungsional: pegawai.value.jenjangFungsional ?? '',
  namaJabatanPelaksana: pegawai.value.namaJabatanPelaksana ?? '',
  jenjangPelaksana: pegawai.value.jenjangPelaksana ?? '',
  jabatanStruktural: pegawai.value.jabatanStruktural ?? '',
  jabatanNonAsn: pegawai.value.jabatanNonAsn ?? '',
  golongan: pegawai.value.golongan ?? ''
})

async function simpan() {
  loading.value = true
  errors.value = {}
  try {
    await $fetch(`/api/pegawai/${id}`, { method: 'PUT', body: form.value })
    toast.add({ title: 'Perubahan berhasil disimpan', color: 'success' })
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
    <h1 class="text-2xl font-semibold mb-6">Edit Pegawai</h1>
    <FormPegawai v-model="form" submit-label="Simpan Perubahan" :loading="loading" :errors="errors" @submit="simpan" />
  </div>
</template>

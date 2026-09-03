<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const errors = ref<Record<string, string[]>>({})
const id = route.params.id as string

const { data: pegawaiRes } = await useFetch(`/api/pegawai/${id}`)

// normalisasi: dukung baik response langsung objek maupun ter-wrap { data: {...} }
const pegawai = computed(() => {
  const raw = pegawaiRes.value as any
  if (!raw) return null
  return raw.data ?? raw
})

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
  <div class="p-4 sm:p-6">
    <h1 class="text-xl sm:text-2xl font-semibold mb-6">Edit Pegawai</h1>
    <FormPegawai v-model="form" submit-label="Simpan Perubahan" :loading="loading" :errors="errors" @submit="simpan" />
  </div>
</template>
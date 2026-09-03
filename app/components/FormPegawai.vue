<script setup lang="ts">
type PegawaiForm = {
  nama: string
  nip: string
  email: string
  status: 'PNS' | 'PPPK' | 'NON_ASN' | ''
  jenisJabatan: 'FUNGSIONAL' | 'STRUKTURAL' | 'PELAKSANA' | ''
  namaJabatanFungsional: string
  jenjangFungsional: string
  namaJabatanPelaksana: string
  jenjangPelaksana: string
  jabatanStruktural: string
  jabatanNonAsn: string
  golongan: string
}

const props = defineProps<{
  modelValue: PegawaiForm
  submitLabel?: string
  loading?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{
  'update:modelValue': [PegawaiForm]
  submit: []
}>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isAsn = computed(() => form.value.status === 'PNS' || form.value.status === 'PPPK')

const statusOptions = [
  { label: 'PNS', value: 'PNS' },
  { label: 'PPPK', value: 'PPPK' },
  { label: 'Non-ASN', value: 'NON_ASN' }
]

const jenisJabatanOptions = [
  { label: 'Fungsional', value: 'FUNGSIONAL' },
  { label: 'Struktural', value: 'STRUKTURAL' },
  { label: 'Pelaksana', value: 'PELAKSANA' }
]

const jenjangOptions = [
  { label: 'Ahli Pertama', value: 'Ahli Pertama' },
  { label: 'Ahli Muda', value: 'Ahli Muda' },
  { label: 'Ahli Madya', value: 'Ahli Madya' },
  { label: 'Ahli Utama', value: 'Ahli Utama' }
]

// Daftar lengkap golongan/ruang PNS (PP No. 11 Tahun 2017), dari I/a s.d IV/e
const golonganOptions = [
  { label: 'I/a — Juru Muda', value: 'I/a' },
  { label: 'I/b — Juru Muda Tingkat I', value: 'I/b' },
  { label: 'I/c — Juru', value: 'I/c' },
  { label: 'I/d — Juru Tingkat I', value: 'I/d' },
  { label: 'II/a — Pengatur Muda', value: 'II/a' },
  { label: 'II/b — Pengatur Muda Tingkat I', value: 'II/b' },
  { label: 'II/c — Pengatur', value: 'II/c' },
  { label: 'II/d — Pengatur Tingkat I', value: 'II/d' },
  { label: 'III/a — Penata Muda', value: 'III/a' },
  { label: 'III/b — Penata Muda Tingkat I', value: 'III/b' },
  { label: 'III/c — Penata', value: 'III/c' },
  { label: 'III/d — Penata Tingkat I', value: 'III/d' },
  { label: 'IV/a — Pembina', value: 'IV/a' },
  { label: 'IV/b — Pembina Tingkat I', value: 'IV/b' },
  { label: 'IV/c — Pembina Utama Muda', value: 'IV/c' },
  { label: 'IV/d — Pembina Utama Madya', value: 'IV/d' },
  { label: 'IV/e — Pembina Utama', value: 'IV/e' }
]

function errFor(field: string) {
  return props.errors?.[field]?.[0]
}

// Reset field jabatan yang tidak relevan saat status/jenis jabatan berubah,
// supaya tidak ada data "nyangkut" dari pilihan sebelumnya
watch(() => form.value.status, (status) => {
  if (status !== 'PNS' && status !== 'PPPK') {
    form.value.jenisJabatan = ''
    form.value.namaJabatanFungsional = ''
    form.value.jenjangFungsional = ''
    form.value.namaJabatanPelaksana = ''
    form.value.jenjangPelaksana = ''
    form.value.jabatanStruktural = ''
  } else {
    form.value.jabatanNonAsn = ''
  }
})

watch(() => form.value.jenisJabatan, (jenis) => {
  if (jenis !== 'FUNGSIONAL') {
    form.value.namaJabatanFungsional = ''
    form.value.jenjangFungsional = ''
  }
  if (jenis !== 'PELAKSANA') {
    form.value.namaJabatanPelaksana = ''
    form.value.jenjangPelaksana = ''
  }
  if (jenis !== 'STRUKTURAL') {
    form.value.jabatanStruktural = ''
  }
})
</script>

<template>
  <form class="space-y-4 max-w-lg" @submit.prevent="emit('submit')">
    <UFormField label="Nama Lengkap" required :error="errFor('nama')">
      <UInput v-model="form.nama" placeholder="Nama pegawai" class="w-full" />
    </UFormField>

    <UFormField label="NIP" required :error="errFor('nip')">
      <UInput v-model="form.nip" placeholder="Nomor Induk Pegawai" class="w-full" />
    </UFormField>

    <UFormField label="Email" required :error="errFor('email')">
      <UInput v-model="form.email" type="email" placeholder="nama@instansi.go.id" class="w-full" />
    </UFormField>

    <UFormField label="Status Pegawai" required :error="errFor('status')">
      <USelectMenu
        v-model="form.status"
        :items="statusOptions"
        value-key="value"
        searchable
        placeholder="Pilih status"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Golongan" hint="Ketik untuk mencari, contoh: III/a">
      <USelectMenu
        v-model="form.golongan"
        :items="golonganOptions"
        value-key="value"
        searchable
        searchable-placeholder="Cari golongan..."
        placeholder="Pilih golongan"
        class="w-full"
      />
    </UFormField>

    <!-- ASN: pilih jenis jabatan dulu -->
    <template v-if="isAsn">
      <UFormField label="Jenis Jabatan" required :error="errFor('jenisJabatan')">
        <USelectMenu
          v-model="form.jenisJabatan"
          :items="jenisJabatanOptions"
          value-key="value"
          searchable
          placeholder="Pilih jenis jabatan"
          class="w-full"
        />
      </UFormField>

      <template v-if="form.jenisJabatan === 'FUNGSIONAL'">
        <UFormField label="Nama Jabatan Fungsional" required :error="errFor('namaJabatanFungsional')" hint="Contoh: Instruktur">
          <UInput v-model="form.namaJabatanFungsional" placeholder="Contoh: Instruktur" class="w-full" />
        </UFormField>
        <UFormField label="Jenjang" required :error="errFor('jenjangFungsional')">
          <USelectMenu
            v-model="form.jenjangFungsional"
            :items="jenjangOptions"
            value-key="value"
            searchable
            placeholder="Pilih jenjang"
            class="w-full"
          />
        </UFormField>
      </template>

      <template v-else-if="form.jenisJabatan === 'PELAKSANA'">
        <UFormField label="Nama Jabatan Pelaksana" required :error="errFor('namaJabatanPelaksana')" hint="Contoh: Analis Kepegawaian">
          <UInput v-model="form.namaJabatanPelaksana" placeholder="Contoh: Analis Kepegawaian" class="w-full" />
        </UFormField>
        <UFormField label="Jenjang" required :error="errFor('jenjangPelaksana')">
          <USelectMenu
            v-model="form.jenjangPelaksana"
            :items="jenjangOptions"
            value-key="value"
            searchable
            placeholder="Pilih jenjang"
            class="w-full"
          />
        </UFormField>
      </template>

      <template v-else-if="form.jenisJabatan === 'STRUKTURAL'">
        <UFormField label="Jabatan Struktural" required :error="errFor('jabatanStruktural')" hint="Contoh: Kepala Bidang">
          <UInput v-model="form.jabatanStruktural" placeholder="Contoh: Kepala Bidang" class="w-full" />
        </UFormField>
      </template>
    </template>

    <!-- Non-ASN: langsung ke jabatan -->
    <UFormField v-else-if="form.status === 'NON_ASN'" label="Jabatan" required :error="errFor('jabatanNonAsn')" hint="Contoh: Pramubakti, Satpam">
      <UInput v-model="form.jabatanNonAsn" placeholder="Contoh: Pramubakti, Satpam" class="w-full" />
    </UFormField>

    <div class="flex gap-2 pt-2">
      <UButton type="submit" :loading="loading">
        {{ submitLabel ?? 'Simpan' }}
      </UButton>
      <UButton to="/pegawai" variant="ghost" color="neutral">
        Batal
      </UButton>
    </div>
  </form>
</template>

<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use App\Models\Poli;
use App\Models\Ruangan;
use Illuminate\Database\Seeder;

class RuanganSeeder extends Seeder
{
    public function run(): void
    {
        $poliByCode = Poli::query()
            ->get()
            ->keyBy(fn ($poli) => strtolower($poli->code));

        $facilityByName = Fasilitas::query()
            ->get()
            ->keyBy(fn ($f) => $f->name);

        $ugd = $facilityByName->get('Unit Gawat Darurat');
        $irj = $facilityByName->get('Instalasi Rawat Jalan');
        $iri = $facilityByName->get('Instalasi Rawat Inap');
        $icu = $facilityByName->get('Unit Perawatan Intensif');
        $ok = $facilityByName->get('Kamar Operasi');
        $penunjang = $facilityByName->get('Penunjang Medis');
        $umum = $facilityByName->get('Fasilitas Umum & Pendukung');

        $ruangans = [
            // ── UGD ──────────────────────────────────────
            ['code' => 'IGD',  'name' => 'IGD',           'facility_id' => $ugd?->id, 'poli_code' => null, 'description' => 'Unit Gawat Darurat — penanganan pasien darurat.', 'is_active' => true],

            // ── Instalasi Rawat Jalan (Poli) ────────────
            ['code' => 'PLU',  'name' => 'Ruang Poli Umum',       'facility_id' => $irj?->id, 'poli_code' => 'PLUM', 'description' => 'Pelayanan pemeriksaan umum.', 'is_active' => true],
            ['code' => 'PLG',  'name' => 'Ruang Poli Gigi',       'facility_id' => $irj?->id, 'poli_code' => 'PLGI', 'description' => 'Pelayanan kesehatan gigi dan mulut.', 'is_active' => true],
            ['code' => 'PLA',  'name' => 'Ruang Poli Anak',       'facility_id' => $irj?->id, 'poli_code' => 'PLAN', 'description' => 'Pelayanan kesehatan anak.', 'is_active' => true],
            ['code' => 'PLM',  'name' => 'Ruang Poli Mata',       'facility_id' => $irj?->id, 'poli_code' => 'PLMA', 'description' => 'Pelayanan kesehatan mata.', 'is_active' => true],
            ['code' => 'PLT',  'name' => 'Ruang Poli THT',        'facility_id' => $irj?->id, 'poli_code' => null,   'description' => 'Pelayanan kesehatan telinga, hidung, dan tenggorokan.', 'is_active' => true],
            ['code' => 'PLPD', 'name' => 'Ruang Poli Penyakit Dalam', 'facility_id' => $irj?->id, 'poli_code' => null, 'description' => 'Pelayanan kesehatan penyakit dalam.', 'is_active' => true],
            ['code' => 'PLK',  'name' => 'Ruang Poli Kandungan',  'facility_id' => $irj?->id, 'poli_code' => null,   'description' => 'Pelayanan kesehatan kandungan.', 'is_active' => true],
            ['code' => 'PLB',  'name' => 'Ruang Poli Bedah',      'facility_id' => $irj?->id, 'poli_code' => null,   'description' => 'Pelayanan bedah.', 'is_active' => true],

            // ── Instalasi Rawat Inap ─────────────────────
            ['code' => 'PRM',  'name' => 'Ruang Pemeriksaan',     'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Ruang pemeriksaan dan ruang rawat inap.', 'is_active' => true],
            ['code' => 'A-01', 'name' => 'Ruang Anggrek 01',      'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar VIP.', 'is_active' => true],
            ['code' => 'A-02', 'name' => 'Ruang Anggrek 02',      'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar VIP.', 'is_active' => true],
            ['code' => 'A-03', 'name' => 'Ruang Anggrek 03',      'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar VIP.', 'is_active' => true],
            ['code' => 'M-01', 'name' => 'Ruang Mawar 01',        'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 1.', 'is_active' => true],
            ['code' => 'M-02', 'name' => 'Ruang Mawar 02',        'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 1.', 'is_active' => true],
            ['code' => 'M-03', 'name' => 'Ruang Mawar 03',        'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 1.', 'is_active' => true],
            ['code' => 'ML-01','name' => 'Ruang Melati 01',       'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 2.', 'is_active' => true],
            ['code' => 'ML-02','name' => 'Ruang Melati 02',       'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 2.', 'is_active' => true],
            ['code' => 'ML-03','name' => 'Ruang Melati 03',       'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 2.', 'is_active' => true],
            ['code' => 'D-01', 'name' => 'Ruang Dahlia 01',       'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 3.', 'is_active' => true],
            ['code' => 'D-02', 'name' => 'Ruang Dahlia 02',       'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 3.', 'is_active' => true],
            ['code' => 'D-03', 'name' => 'Ruang Dahlia 03',       'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Kamar Kelas 3.', 'is_active' => true],
            ['code' => 'T-01', 'name' => 'Ruang Tulip 01',        'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Ruang isolasi.', 'is_active' => true],
            ['code' => 'T-02', 'name' => 'Ruang Tulip 02',        'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Ruang isolasi.', 'is_active' => true],
            ['code' => 'T-03', 'name' => 'Ruang Tulip 03',        'facility_id' => $iri?->id, 'poli_code' => null, 'description' => 'Ruang isolasi.', 'is_active' => true],

            // ── Unit Perawatan Intensif ──────────────────
            ['code' => 'ICU',  'name' => 'Ruang ICU',             'facility_id' => $icu?->id, 'poli_code' => null, 'description' => 'Intensive Care Unit.', 'is_active' => true],
            ['code' => 'NICU', 'name' => 'Ruang NICU',            'facility_id' => $icu?->id, 'poli_code' => null, 'description' => 'Neonatal Intensive Care Unit — perawatan intensif bayi baru lahir.', 'is_active' => true],
            ['code' => 'PICU', 'name' => 'Ruang PICU',            'facility_id' => $icu?->id, 'poli_code' => null, 'description' => 'Pediatric Intensive Care Unit — perawatan intensif anak.', 'is_active' => true],

            // ── Kamar Operasi ────────────────────────────
            ['code' => 'OK-01','name' => 'Ruang Operasi 01',      'facility_id' => $ok?->id,  'poli_code' => null, 'description' => 'Ruang operasi bedah umum.', 'is_active' => true],
            ['code' => 'OK-02','name' => 'Ruang Operasi 02',      'facility_id' => $ok?->id,  'poli_code' => null, 'description' => 'Ruang operasi bedah spesialis.', 'is_active' => true],
            ['code' => 'PRE',  'name' => 'Ruang Pra-Operasi',     'facility_id' => $ok?->id,  'poli_code' => null, 'description' => 'Persiapan pasien sebelum operasi.', 'is_active' => true],
            ['code' => 'PAS',  'name' => 'Ruang Pasca-Operasi',   'facility_id' => $ok?->id,  'poli_code' => null, 'description' => 'Pemulihan pasien pasca operasi.', 'is_active' => true],

            // ── Penunjang Medis ──────────────────────────
            ['code' => 'LAB',  'name' => 'Laboratorium Klinik',   'facility_id' => $penunjang?->id, 'poli_code' => null, 'description' => 'Pelayanan pemeriksaan laboratorium darah, urine, dll.', 'is_active' => true],
            ['code' => 'RAD',  'name' => 'Radiologi',             'facility_id' => $penunjang?->id, 'poli_code' => null, 'description' => 'Rontgen, USG, CT Scan.', 'is_active' => true],
            ['code' => 'FARM', 'name' => 'Farmasi / Apotek',      'facility_id' => $penunjang?->id, 'poli_code' => null, 'description' => 'Apotek 24 jam.', 'is_active' => true],

            // ── Fasilitas Umum & Pendukung ───────────────
            ['code' => 'KAS',  'name' => 'Kasir',                 'facility_id' => $umum?->id, 'poli_code' => null, 'description' => 'Loket kasir pembayaran.', 'is_active' => true],
            ['code' => 'REG',  'name' => 'Loket Pendaftaran',     'facility_id' => $umum?->id, 'poli_code' => null, 'description' => 'Pendaftaran pasien baru dan lama.', 'is_active' => true],
            ['code' => 'MUSH', 'name' => 'Mushola',               'facility_id' => $umum?->id, 'poli_code' => null, 'description' => 'Tempat ibadah.', 'is_active' => true],
            ['code' => 'KANT', 'name' => 'Kantin',                'facility_id' => $umum?->id, 'poli_code' => null, 'description' => 'Area makan dan minum.', 'is_active' => true],
        ];

        foreach ($ruangans as $ruangan) {
            $poliCode = $ruangan['poli_code'] ?? null;
            unset($ruangan['poli_code']);
            $ruangan['poli_id'] = $poliCode
                ? $poliByCode->get(strtolower($poliCode))?->id
                : null;

            Ruangan::updateOrCreate(
                ['code' => $ruangan['code']],
                $ruangan,
            );
        }
    }
}

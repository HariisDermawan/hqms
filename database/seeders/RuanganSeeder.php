<?php

namespace Database\Seeders;

use App\Models\Ruangan;
use Illuminate\Database\Seeder;

class RuanganSeeder extends Seeder
{
    public function run(): void
    {
        $ruangans = [
            // Ruang Pelayanan Pasien
            ['code' => 'IGD', 'name' => 'IGD', 'category' => 'IGD', 'description' => 'Unit Gawat Darurat — penanganan pasien darurat.', 'is_active' => true],
            ['code' => 'PLU', 'name' => 'Ruang Poli Umum', 'category' => 'Poli', 'description' => 'Pelayanan pemeriksaan umum.', 'is_active' => true],
            ['code' => 'PLG', 'name' => 'Ruang Poli Gigi', 'category' => 'Poli', 'description' => 'Pelayanan kesehatan gigi dan mulut.', 'is_active' => true],
            ['code' => 'PLA', 'name' => 'Ruang Poli Anak', 'category' => 'Poli', 'description' => 'Pelayanan kesehatan anak.', 'is_active' => true],
            ['code' => 'PLM', 'name' => 'Ruang Poli Mata', 'category' => 'Poli', 'description' => 'Pelayanan kesehatan mata.', 'is_active' => true],
            ['code' => 'PLT', 'name' => 'Ruang Poli THT', 'category' => 'Poli', 'description' => 'Pelayanan kesehatan telinga, hidung, dan tenggorokan.', 'is_active' => true],
            ['code' => 'PLPD', 'name' => 'Ruang Poli Penyakit Dalam', 'category' => 'Poli', 'description' => 'Pelayanan kesehatan penyakit dalam.', 'is_active' => true],
            ['code' => 'PLK', 'name' => 'Ruang Poli Kandungan', 'category' => 'Poli', 'description' => 'Pelayanan kesehatan kandungan.', 'is_active' => true],
            ['code' => 'PLB', 'name' => 'Ruang Poli Bedah', 'category' => 'Poli', 'description' => 'Pelayanan bedah.', 'is_active' => true],
            ['code' => 'PRM', 'name' => 'Ruang Pemeriksaan', 'category' => 'Ruang Rawat Inap', 'description' => 'Ruang pemeriksaan dan ruang rawat inap.', 'is_active' => true],

            // Kamar VIP (Ruang Anggrek)
            ['code' => 'A-01', 'name' => 'Ruang Anggrek 01', 'category' => 'Kamar VIP', 'description' => 'Kamar VIP.', 'is_active' => true],
            ['code' => 'A-02', 'name' => 'Ruang Anggrek 02', 'category' => 'Kamar VIP', 'description' => 'Kamar VIP.', 'is_active' => true],
            ['code' => 'A-03', 'name' => 'Ruang Anggrek 03', 'category' => 'Kamar VIP', 'description' => 'Kamar VIP.', 'is_active' => true],

            // Kamar Kelas 1 (Ruang Mawar)
            ['code' => 'M-01', 'name' => 'Ruang Mawar 01', 'category' => 'Kamar Kelas 1', 'description' => 'Kamar Kelas 1.', 'is_active' => true],
            ['code' => 'M-02', 'name' => 'Ruang Mawar 02', 'category' => 'Kamar Kelas 1', 'description' => 'Kamar Kelas 1.', 'is_active' => true],
            ['code' => 'M-03', 'name' => 'Ruang Mawar 03', 'category' => 'Kamar Kelas 1', 'description' => 'Kamar Kelas 1.', 'is_active' => true],

            // Kamar Kelas 2 (Ruang Melati)
            ['code' => 'ML-01', 'name' => 'Ruang Melati 01', 'category' => 'Kamar Kelas 2', 'description' => 'Kamar Kelas 2.', 'is_active' => true],
            ['code' => 'ML-02', 'name' => 'Ruang Melati 02', 'category' => 'Kamar Kelas 2', 'description' => 'Kamar Kelas 2.', 'is_active' => true],
            ['code' => 'ML-03', 'name' => 'Ruang Melati 03', 'category' => 'Kamar Kelas 2', 'description' => 'Kamar Kelas 2.', 'is_active' => true],

            // Kamar Kelas 3 (Ruang Dahlia)
            ['code' => 'D-01', 'name' => 'Ruang Dahlia 01', 'category' => 'Kamar Kelas 3', 'description' => 'Kamar Kelas 3.', 'is_active' => true],
            ['code' => 'D-02', 'name' => 'Ruang Dahlia 02', 'category' => 'Kamar Kelas 3', 'description' => 'Kamar Kelas 3.', 'is_active' => true],
            ['code' => 'D-03', 'name' => 'Ruang Dahlia 03', 'category' => 'Kamar Kelas 3', 'description' => 'Kamar Kelas 3.', 'is_active' => true],

            // Isolasi (Ruang Tulip)
            ['code' => 'T-01', 'name' => 'Ruang Tulip 01', 'category' => 'Isolasi', 'description' => 'Ruang isolasi.', 'is_active' => true],
            ['code' => 'T-02', 'name' => 'Ruang Tulip 02', 'category' => 'Isolasi', 'description' => 'Ruang isolasi.', 'is_active' => true],
            ['code' => 'T-03', 'name' => 'Ruang Tulip 03', 'category' => 'Isolasi', 'description' => 'Ruang isolasi.', 'is_active' => true],

            // Ruang Flamboyan (Ruang Khusus)
            ['code' => 'F-01', 'name' => 'Ruang Flamboyan 01', 'category' => 'Ruang Khusus', 'description' => 'Ruang khusus.', 'is_active' => true],
            ['code' => 'F-02', 'name' => 'Ruang Flamboyan 02', 'category' => 'Ruang Khusus', 'description' => 'Ruang khusus.', 'is_active' => true],

            // Ruang Khusus (ICU, NICU, PICU)
            ['code' => 'ICU', 'name' => 'Ruang ICU', 'category' => 'ICU', 'description' => 'Intensive Care Unit.', 'is_active' => true],
            ['code' => 'NICU', 'name' => 'Ruang NICU', 'category' => 'NICU', 'description' => 'Neonatal Intensive Care Unit — perawatan intensif bayi baru lahir.', 'is_active' => true],
            ['code' => 'PICU', 'name' => 'Ruang PICU', 'category' => 'PICU', 'description' => 'Pediatric Intensive Care Unit — perawatan intensif anak.', 'is_active' => true],
        ];

        foreach ($ruangans as $ruangan) {
            Ruangan::updateOrCreate(
                ['code' => $ruangan['code']],
                $ruangan
            );
        }
    }
}

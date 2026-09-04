<?php

use App\Models\Antrian;
use App\Models\Dokter;
use App\Models\Faq;
use App\Models\JadwalDokter;
use App\Models\Message;
use App\Models\Obat;
use App\Models\Pasien;
use App\Models\Pembayaran;
use App\Models\Pemeriksaan;
use App\Models\Pendaftaran;
use App\Models\Perawat;
use App\Models\Poli;
use App\Models\Presensi;
use App\Models\Ruangan;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/ticket', function () {
    return Inertia::render('Kiosk/TicketDisplay');
})->name('ticket');

Route::get('/antrians-ticker', function () {
    return Inertia::render('Kiosk/Ticker');
})->name('antrians-ticker');

Route::get('/absen-karyawan', function () {
    return Inertia::render('Kiosk/AbsenKaryawan');
})->name('absen-karyawan');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/monitorings', function () {
    return Inertia::render('Monitoring/Index');
})->name('monitorings.index');

Route::get('/pasiens/create', function () {
    return Inertia::render('Pasien/Create');
})->name('pasiens.create');

Route::get('/pasiens/{pasien}/edit', function (Pasien $pasien) {
    return Inertia::render('Pasien/Edit', [
        'id' => $pasien->id,
    ]);
})->name('pasiens.edit');

Route::get('/pasiens/{pasien}', function (Pasien $pasien) {
    return Inertia::render('Pasien/Show', [
        'id' => $pasien->id,
    ]);
})->name('pasiens.show');

Route::get('/pasiens', function () {
    return Inertia::render('Pasien/Index');
})->name('pasiens.index');

Route::get('/polis/create', function () {
    return Inertia::render('Poli/Create');
})->name('polis.create');

Route::get('/polis/{poli}/edit', function (Poli $poli) {
    return Inertia::render('Poli/Edit', [
        'id' => $poli->id,
    ]);
})->name('polis.edit');

Route::get('/polis/{poli}', function (Poli $poli) {
    return Inertia::render('Poli/Show', [
        'id' => $poli->id,
    ]);
})->name('polis.show');

Route::get('/polis', function () {
    return Inertia::render('Poli/Index');
})->name('polis.index');

Route::get('/ruangans/create', function () {
    return Inertia::render('Ruangan/Create');
})->name('ruangans.create');

Route::get('/ruangans/{ruangan}/edit', function (Ruangan $ruangan) {
    return Inertia::render('Ruangan/Edit', [
        'id' => $ruangan->id,
    ]);
})->name('ruangans.edit');

Route::get('/ruangans/{ruangan}', function (Ruangan $ruangan) {
    return Inertia::render('Ruangan/Show', [
        'id' => $ruangan->id,
    ]);
})->name('ruangans.show');

Route::get('/ruangans', function () {
    return Inertia::render('Ruangan/Index');
})->name('ruangans.index');

Route::get('/dokters/create', function () {
    return Inertia::render('Dokter/Create');
})->name('dokters.create');

Route::get('/dokters/{dokter}/edit', function (Dokter $dokter) {
    return Inertia::render('Dokter/Edit', [
        'id' => $dokter->id,
    ]);
})->name('dokters.edit');

Route::get('/dokters/{dokter}', function (Dokter $dokter) {
    return Inertia::render('Dokter/Show', [
        'id' => $dokter->id,
    ]);
})->name('dokters.show');

Route::get('/dokters', function () {
    return Inertia::render('Dokter/Index');
})->name('dokters.index');

Route::get('/perawats/create', function () {
    return Inertia::render('Perawat/Create');
})->name('perawats.create');

Route::get('/perawats/{perawat}/edit', function (Perawat $perawat) {
    return Inertia::render('Perawat/Edit', [
        'id' => $perawat->id,
    ]);
})->name('perawats.edit');

Route::get('/perawats/{perawat}', function (Perawat $perawat) {
    return Inertia::render('Perawat/Show', [
        'id' => $perawat->id,
    ]);
})->name('perawats.show');

Route::get('/perawats', function () {
    return Inertia::render('Perawat/Index');
})->name('perawats.index');

Route::get('/presensis/create', function () {
    return Inertia::render('Presensi/Create');
})->name('presensis.create');

Route::get('/presensis/{presensi}/edit', function (Presensi $presensi) {
    return Inertia::render('Presensi/Edit', [
        'id' => $presensi->id,
    ]);
})->name('presensis.edit');

Route::get('/presensis/{presensi}', function (Presensi $presensi) {
    return Inertia::render('Presensi/Show', [
        'id' => $presensi->id,
    ]);
})->name('presensis.show');

Route::get('/presensis', function () {
    return Inertia::render('Presensi/Index');
})->name('presensis.index');

Route::get('/jadwal-dokters/create', function () {
    return Inertia::render('JadwalDokter/Create');
})->name('jadwal-dokters.create');

Route::get('/jadwal-dokters/{jadwal_dokter}/edit', function (JadwalDokter $jadwalDokter) {
    return Inertia::render('JadwalDokter/Edit', [
        'id' => $jadwalDokter->id,
    ]);
})->name('jadwal-dokters.edit');

Route::get('/jadwal-dokters/{jadwal_dokter}', function (JadwalDokter $jadwalDokter) {
    return Inertia::render('JadwalDokter/Show', [
        'id' => $jadwalDokter->id,
    ]);
})->name('jadwal-dokters.show');

Route::get('/jadwal-dokters', function () {
    return Inertia::render('JadwalDokter/Index');
})->name('jadwal-dokters.index');

Route::get('/pendaftarans/create', function (Request $request) {
    return Inertia::render('Pendaftaran/Create', [
        'antrian_id' => (int) $request->query('antrian_id', 0),
    ]);
})->name('pendaftarans.create');

Route::get('/pendaftarans/{pendaftaran}/edit', function (Pendaftaran $pendaftaran) {
    return Inertia::render('Pendaftaran/Edit', [
        'id' => $pendaftaran->id,
    ]);
})->name('pendaftarans.edit');

Route::get('/pendaftarans/{pendaftaran}', function (Pendaftaran $pendaftaran) {
    return Inertia::render('Pendaftaran/Show', [
        'id' => $pendaftaran->id,
    ]);
})->name('pendaftarans.show');

Route::get('/pendaftarans', function () {
    return Inertia::render('Pendaftaran/Index');
})->name('pendaftarans.index');

Route::get('/pemeriksaans/create', function (Request $request) {
    return Inertia::render('Pemeriksaan/Create', [
        'antrian_id' => (int) $request->query('antrian_id', 0),
        'pasien_id' => (int) $request->query('pasien_id', 0),
        'poli_id' => (int) $request->query('poli_id', 0),
    ]);
})->name('pemeriksaans.create');

Route::get('/pemeriksaans/{pemeriksaan}/edit', function (Pemeriksaan $pemeriksaan) {
    return Inertia::render('Pemeriksaan/Edit', [
        'id' => $pemeriksaan->id,
    ]);
})->name('pemeriksaans.edit');

Route::get('/pemeriksaans/{pemeriksaan}', function (Pemeriksaan $pemeriksaan) {
    return Inertia::render('Pemeriksaan/Show', [
        'id' => $pemeriksaan->id,
    ]);
})->name('pemeriksaans.show');

Route::get('/pemeriksaans', function () {
    return Inertia::render('Pemeriksaan/Index');
})->name('pemeriksaans.index');

Route::get('/obats/create', function (Request $request) {
    return Inertia::render('Obat/Create', [
        'pemeriksaan_id' => (int) $request->query('pemeriksaan_id', 0),
    ]);
})->name('obats.create');

Route::get('/obats/{obat}/edit', function (Obat $obat) {
    return Inertia::render('Obat/Edit', [
        'id' => $obat->id,
    ]);
})->name('obats.edit');

Route::get('/obats/{obat}', function (Obat $obat) {
    return Inertia::render('Obat/Show', [
        'id' => $obat->id,
    ]);
})->name('obats.show');

Route::get('/obats', function () {
    return Inertia::render('Obat/Index');
})->name('obats.index');

Route::get('/pembayarans/create', function (Request $request) {
    return Inertia::render('Pembayaran/Create', [
        'pemeriksaan_id' => (int) $request->query('pemeriksaan_id', 0),
    ]);
})->name('pembayarans.create');

Route::get('/pembayarans/{pembayaran}/edit', function (Pembayaran $pembayaran) {
    return Inertia::render('Pembayaran/Edit', [
        'id' => $pembayaran->id,
    ]);
})->name('pembayarans.edit');

Route::get('/pembayarans/{pembayaran}', function (Pembayaran $pembayaran) {
    return Inertia::render('Pembayaran/Show', [
        'id' => $pembayaran->id,
    ]);
})->name('pembayarans.show');

Route::get('/pembayarans', function () {
    return Inertia::render('Pembayaran/Index');
})->name('pembayarans.index');

Route::get('/profile', function () {
    return Inertia::render('Profile/Index');
})->name('profile.index');

Route::get('/faqs/create', function () {
    return Inertia::render('Faq/Create');
})->name('faqs.create');

Route::get('/faqs/{faq}/edit', function (Faq $faq) {
    return Inertia::render('Faq/Edit', [
        'id' => $faq->id,
    ]);
})->name('faqs.edit');

Route::get('/faqs/{faq}', function (Faq $faq) {
    return Inertia::render('Faq/Show', [
        'id' => $faq->id,
    ]);
})->name('faqs.show');

Route::get('/faqs', function () {
    return Inertia::render('Faq/Index');
})->name('faqs.index');

Route::get('/messages/create', function () {
    return Inertia::render('Message/Create');
})->name('messages.create');

Route::get('/messages/{message}/edit', function (Message $message, Request $request) {
    return Inertia::render('Message/Edit', [
        'id' => $message->id,
        'reply' => (bool) $request->query('reply', false),
    ]);
})->name('messages.edit');

Route::get('/messages/{message}', function (Message $message) {
    return Inertia::render('Message/Show', [
        'id' => $message->id,
    ]);
})->name('messages.show');

Route::get('/messages', function () {
    return Inertia::render('Message/Index');
})->name('messages.index');

Route::get('/testimonials/create', function () {
    return Inertia::render('Testimonial/Create');
})->name('testimonials.create');

Route::get('/testimonials/{testimonial}/edit', function (Testimonial $testimonial) {
    return Inertia::render('Testimonial/Edit', [
        'id' => $testimonial->id,
    ]);
})->name('testimonials.edit');

Route::get('/testimonials/{testimonial}', function (Testimonial $testimonial) {
    return Inertia::render('Testimonial/Show', [
        'id' => $testimonial->id,
    ]);
})->name('testimonials.show');

Route::get('/testimonials', function () {
    return Inertia::render('Testimonial/Index');
})->name('testimonials.index');

Route::get('/antrians/create', function () {
    return Inertia::render('Antrian/Create');
})->name('antrians.create');

Route::get('/antrians/{antrian}/edit', function (Antrian $antrian) {
    return Inertia::render('Antrian/Edit', [
        'id' => $antrian->id,
    ]);
})->name('antrians.edit');

Route::get('/antrians/{antrian}', function (Antrian $antrian) {
    return Inertia::render('Antrian/Show', [
        'id' => $antrian->id,
    ]);
})->name('antrians.show');

Route::get('/antrians', function () {
    return Inertia::render('Antrian/Index');
})->name('antrians.index');

import About from '@/components/About';
import Berita from '@/components/Berita';
import Dokter from '@/components/Dokter';
import FasilitasSection from '@/components/Fasilitas/Section';
import HeroSection from '@/components/HeroSection';
import Jadwal from '@/components/Jadwal';
import LayananKencana from '@/components/LayananKencana';
import LayananRuangan from '@/components/LayananRuangan';
import Navbar from '@/components/Navbar';
import Penawaran from '@/components/Penawaran';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function welcome() {
    return (
        <>
            <Head title="Rumah Sakit Medika HRS" />
            <main className="relative min-h-screen overflow-hidden">
                <Navbar />
                <HeroSection />
                <Dokter />
                <About />
                <Penawaran />
                <Jadwal />
                <LayananRuangan />
                <FasilitasSection />
                <Berita />
                <LayananKencana />
            </main>
        </>
    );
}

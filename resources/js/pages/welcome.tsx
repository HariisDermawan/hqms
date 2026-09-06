import Dokter from '@/components/Dokter';
import HeroSection from '@/components/HeroSection';
import Jadwal from '@/components/Jadwal';
import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function welcome() {
    return (
        <>
            <Head title="Rumah Sakit Medika HRS" />
            <main className="relative min-h-screen overflow-hidden">
                <Navbar/>
                <HeroSection/>
                <Dokter/>
                <Jadwal/>
            </main>
        </>
    );
}

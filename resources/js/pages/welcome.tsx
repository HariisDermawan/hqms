import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';
import React from 'react'

export default function welcome() {
  return (
    <>
    <Head title="Rumah Sakit Medika HRS" />
    <main className="relative min-h-screen overflow-hidden bg-[#075985]">
        <Navbar/>
        <HeroSection/>
    </main>
    </>
  );
}


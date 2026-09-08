import About from '@/components/About';
import Berita from '@/components/Berita';
import Chatbot from '@/components/Chatbot/Chatbot';
import Dokter from '@/components/Dokter';
import FaqSection from '@/components/Faq/FaqSection';
import FasilitasSection from '@/components/Fasilitas/Section';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import LayananKencana from '@/components/LayananKencana';
import MessageSection from '@/components/Message/MessageSection';
import Navbar from '@/components/Navbar';
import Penawaran from '@/components/Penawaran';
import TestimonialSection from '@/components/Testimonial/TestimonialSection';
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
                <FasilitasSection />
                <LayananKencana />
                <Berita />
                <FaqSection />
                <TestimonialSection />
                <MessageSection />
                <Footer />
                <Chatbot />
            </main>
        </>
    );
}

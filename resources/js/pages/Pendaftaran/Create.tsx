import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storePasien } from '@/api/pasien';
import { storePendaftaran } from '@/api/pendaftaran';
import AppLayout from '@/Layouts/AppLayout';
import PendaftaranForm, { type PendaftaranFormValues } from './Form';

export default function PendaftaranCreate({
    antrianId,
}: {
    antrianId?: number;
}) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (values: PendaftaranFormValues) => {
        setProcessing(true);
        setErrors({});

        try {
            if (!values.pasien?.name || !values.pasien.nik) {
                setErrors({
                    general: 'Data pasien (nama dan NIK) wajib diisi.',
                });

                return;
            }

            const pasienResponse = await storePasien({
                poli_id: values.poli_id ?? 0,
                name: values.pasien.name,
                nik: values.pasien.nik,
                gender: values.pasien.gender,
                birth_date: values.pasien.birth_date,
                phone: values.pasien.phone,
                address: values.pasien.address,
            });

            const pasienId = pasienResponse.data?.pasien?.id;

            if (!pasienId) {
                setErrors({
                    general: 'Gagal menyimpan data pasien.',
                });

                return;
            }

            await storePendaftaran({
                antrian_id: values.antrian_id ?? null,
                pasien_id: pasienId,
                poli_id: values.poli_id ?? null,
                registration_date: values.registration_date,
                notes: values.notes,
            });

            router.visit('/pendaftarans');
        } catch (error: any) {
            console.error('Gagal menyimpan pendaftaran', error);

            if (error.response?.status === 422) {
                setErrors({
                    general: error.response.data?.message,
                    ...error.response.data?.errors,
                });

                return;
            }

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setErrors({
                general:
                    error.response?.data?.message ||
                    'Gagal menyimpan data pendaftaran.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Registrasi Pasien" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Registrasi Pasien
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Daftarkan pasien ke poli tujuan
                    </p>
                </div>

                <PendaftaranForm
                    antrianId={antrianId ?? 0}
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}

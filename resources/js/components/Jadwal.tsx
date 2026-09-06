import { getKioskPolis } from '@/api/kiosk';
import { useEffect, useState } from 'react';

function SectionTitle({ title }: { title: string }) {
    return (
        <h3 className="mb-4 text-xl font-bold text-[#075985] sm:text-2xl">
            {title}
        </h3>
    );
}

function SelectArrow() {
    return (
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#075985]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M7 10l5 5 5-5" />
            </svg>
        </span>
    );
}

const OPENING_HOURS = [
    { day: 'Senin', hours: '08.00 – 21.00' },
    { day: 'Selasa', hours: '08.00 – 21.00' },
    { day: 'Rabu', hours: '08.00 – 21.00' },
    { day: 'Kamis', hours: '08.00 – 21.00' },
    { day: 'Jumat', hours: '08.00 – 21.00' },
    { day: 'Sabtu', hours: '08.00 – 17.00' },
    { day: 'Minggu', hours: '09.00 – 15.00' },
];

const SERVICE_HOURS = [
    { name: 'Poli Umum', hours: '08.00 – 21.00' },
    { name: 'Poli Gigi', hours: '08.00 – 17.00' },
    { name: 'Poli Mata', hours: '08.00 – 17.00' },
    { name: 'Poli Jantung', hours: '09.00 – 17.00' },
    { name: 'Poli Anak', hours: '08.00 – 17.00' },
    { name: 'IGD 24 Jam', hours: '24 Jam' },
];

export default function Jadwal() {
    const [department, setDepartment] = useState('');
    const [doctor, setDoctor] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    return (
        <section className="w-full bg-white px-5 py-12 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div>
                        <SectionTitle title="Opening Hours" />

                        <div className="rounded-xl border-2 border-[#075985] px-5 py-5">
                            <ul className="space-y-3 text-sm text-gray-500">
                                {OPENING_HOURS.map((item) => (
                                    <li
                                        key={item.day}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <span className="font-medium">
                                            {item.day}
                                        </span>
                                        <span>{item.hours}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <SectionTitle title="Jadwal Poli" />

                        <div className="rounded-xl border-2 border-[#075985] px-5 py-5">
                            <ul className="space-y-3 text-sm text-gray-500">
                                {SERVICE_HOURS.map((item) => (
                                    <li
                                        key={item.name}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <span className="font-medium">
                                            {item.name}
                                        </span>
                                        <span className="font-semibold text-[#075985]">
                                            {item.hours}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <SectionTitle title="Buat Janji Tamu" />

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                console.log({
                                    department,
                                    doctor,
                                    name,
                                    phone,
                                });
                            }}
                            className="rounded-xl border-2 border-[#075985] p-5"
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="relative">
                                    <select
                                        value={department}
                                        onChange={(e) =>
                                            setDepartment(e.target.value)
                                        }
                                        className="h-12 w-full appearance-none rounded-xl border border-[#075985] bg-white px-4 pr-10 text-sm text-gray-700 transition outline-none focus:ring-2 focus:ring-[#075985]/20"
                                    >
                                        <option value="" disabled>
                                            Select Department
                                        </option>
                                        <option value="umum">
                                            General Medicine
                                        </option>
                                        <option value="anak">Pediatrics</option>
                                        <option value="jantung">
                                            Cardiology
                                        </option>
                                        <option value="mata">
                                            Ophthalmology
                                        </option>
                                        <option value="gigi">Dental</option>
                                    </select>
                                    <SelectArrow />
                                </div>

                                <div className="relative">
                                    <select
                                        value={doctor}
                                        onChange={(e) =>
                                            setDoctor(e.target.value)
                                        }
                                        className="h-12 w-full appearance-none rounded-xl border border-[#075985] bg-white px-4 pr-10 text-sm text-gray-700 transition outline-none focus:ring-2 focus:ring-[#075985]/20"
                                    >
                                        <option value="" disabled>
                                            Select Doctor
                                        </option>
                                        <option value="doctor-1">
                                            Dr. Ahmad
                                        </option>
                                        <option value="doctor-2">
                                            Dr. Siti
                                        </option>
                                        <option value="doctor-3">
                                            Dr. Budi
                                        </option>
                                        <option value="doctor-4">
                                            Dr. Andi
                                        </option>
                                    </select>
                                    <SelectArrow />
                                </div>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    className="h-12 w-full rounded-xl border border-[#075985] bg-white px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#075985]/20"
                                />

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Phone Number"
                                    className="h-12 w-full rounded-xl border border-[#075985] bg-white px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#075985]/20"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-[#075985] px-5 text-sm font-bold text-white transition hover:bg-[#064e73] hover:shadow-md"
                            >
                                Make Appointment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

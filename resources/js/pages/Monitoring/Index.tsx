import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { getMonitoring, type MonitoringStats } from '@/api/monitoring';
import AppLayout from '@/Layouts/AppLayout';

const PIE_COLORS = [
    '#07577f',
    '#0e7490',
    '#2563eb',
    '#16a34a',
    '#f59e0b',
    '#ef4444',
];

const summaryCards = (summary: MonitoringStats['summary']) => [
    {
        label: 'Total Pasien',
        value: summary.total_pasien,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
            </svg>
        ),
    },
    {
        label: 'Total Poli',
        value: summary.total_poli,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 7h6M9 11h6M9 15h4" />
            </svg>
        ),
    },
    {
        label: 'Pendaftaran Hari Ini',
        value: summary.pendaftaran_hari_ini,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8M8 11h8M8 15h5" />
            </svg>
        ),
    },
    {
        label: 'Pendaftaran Bulan Ini',
        value: summary.pendaftaran_bulan_ini,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M8 3v4M16 3v4M3 10h18" />
            </svg>
        ),
    },
    {
        label: 'Antrian Hari Ini',
        value: summary.antrian_hari_ini,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3 2" />
            </svg>
        ),
    },
    {
        label: 'Pemeriksaan Hari Ini',
        value: summary.pemeriksaan_hari_ini,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M12 8v8M8 12h8" />
            </svg>
        ),
    },
    {
        label: 'Pemeriksaan Bulan Ini',
        value: summary.pemeriksaan_bulan_ini,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M9 11V7a3 3 0 0 1 6 0v4" />
                <rect x="5" y="11" width="14" height="9" rx="2" />
            </svg>
        ),
    },
];

export default function MonitoringIndex() {
    const [data, setData] = useState<MonitoringStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getMonitoring()
            .then((response) => {
                setData(response.data ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat data monitoring', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError(
                    error.response?.data?.message ||
                        'Gagal mengambil data monitoring.',
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const renderBar = (
        title: string,
        subtitle: string,
        bars: { label: string | number; jumlah: number }[],
        dataKeyX: string,
    ) => (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800">{title}</h3>
            <p className="mt-0.5 text-[12px] text-gray-400">{subtitle}</p>

            <div className="mt-4 h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={bars}
                        margin={{
                            top: 5,
                            right: 10,
                            left: -12,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey={dataKeyX}
                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f7f9fb' }}
                            contentStyle={{
                                borderRadius: 12,
                                border: '1px solid #e5e7eb',
                                fontSize: 12,
                            }}
                        />
                        <Bar
                            dataKey="jumlah"
                            fill="#07577f"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Monitoring" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Monitoring
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Ringkasan dan grafik pasien, pendaftaran, antrian, dan
                        pemeriksaan
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data monitoring...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : data ? (
                    <>
                        {/* SUMMARY CARDS */}
                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                            {summaryCards(data.summary).map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-xl bg-white p-4 shadow-sm"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#07577f]/10 text-[#07577f]">
                                        {card.icon}
                                    </div>

                                    <p className="mt-3 text-xl font-bold text-gray-800">
                                        {card.value}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-gray-400">
                                        {card.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* CHARTS */}
                        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {renderBar(
                                'Pendaftaran 7 Hari Terakhir',
                                'Jumlah pendaftaran per hari',
                                data.charts.pendaftaran_per_day,
                                'tanggal',
                            )}

                            {renderBar(
                                'Pasien 6 Bulan Terakhir',
                                'Jumlah pasien terdaftar per bulan',
                                data.charts.pasien_per_month,
                                'bulan',
                            )}

                            {renderBar(
                                'Pendaftaran per Poli',
                                'Distribusi pendaftaran berdasarkan poli',
                                data.charts.pendaftaran_per_poli,
                                'poli',
                            )}

                            {renderBar(
                                'Pasien per Poli',
                                'Distribusi pasien berdasarkan poli',
                                data.charts.pasien_per_poli,
                                'poli',
                            )}
                        </div>

                        {/* ANTRIAN STATUS PIE */}
                        <div className="mt-5 rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-800">
                                Status Antrian
                            </h3>

                            <p className="mt-0.5 text-[12px] text-gray-400">
                                Distribusi status antrian saat ini
                            </p>

                            {data.charts.antrian_status.every(
                                (item) => item.value === 0,
                            ) ? (
                                <div className="py-10 text-center text-sm text-gray-400">
                                    Belum ada data antrian.
                                </div>
                            ) : (
                                <div className="mt-4 h-[280px] w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={
                                                    data.charts.antrian_status
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={90}
                                                paddingAngle={3}
                                            >
                                                {data.charts.antrian_status.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={entry.status}
                                                            fill={
                                                                PIE_COLORS[
                                                                    index %
                                                                        PIE_COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: 12,
                                                    border: '1px solid #e5e7eb',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{
                                                    fontSize: 12,
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </AppLayout>
        </>
    );
}

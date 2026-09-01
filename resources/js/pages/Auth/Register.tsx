    import { useState } from "react";

    export default function Register() {
        const [form, setForm] = useState({
            username: "",
            email: "",
            password: "",
            password_confirmation: "",
        });

        const handleChange = (e) => {
            setForm({
                ...form,
                [e.target.name]: e.target.value,
            });
        };

        const handleRegister = (e) => {
            e.preventDefault();

            console.log(form);
        };

        return (
            <div className="min-h-screen bg-[#e8f2f7] flex items-center justify-center lg:p-8">

                {/* Register Card */}
                <div
                    className="
                        w-full
                        min-h-screen
                        bg-white
                        overflow-hidden

                        lg:min-h-0
                        lg:w-[410px]
                        lg:rounded-[24px]
                        lg:shadow-[0_15px_50px_rgba(0,0,0,0.10)]
                    "
                >

                    {/* ================= HEADER ================= */}
                    <div
                        className="
                            relative
                            h-[222px]
                            bg-[#084e7a]
                            rounded-b-[50%]

                            lg:h-[225px]
                        "
                    >

                        {/* Logo */}
                        <div
                            className="
                                absolute
                                top-[34px]
                                left-0
                                right-0
                                flex
                                flex-col
                                items-center
                            "
                        >

                            {/* Icon Rumah Sakit */}
                            <div className="relative flex items-center justify-center">

                                {/* Gedung */}
                                <div
                                    className="
                                        w-[70px]
                                        h-[60px]
                                        bg-white
                                        rounded-t-lg
                                        rounded-b-sm
                                        flex
                                        items-end
                                        justify-center
                                        pb-2
                                    "
                                >
                                    <div className="grid grid-cols-2 gap-[8px]">
                                        <div className="w-[11px] h-[13px] bg-[#084e7a]" />
                                        <div className="w-[11px] h-[13px] bg-[#084e7a]" />
                                        <div className="w-[11px] h-[13px] bg-[#084e7a]" />
                                        <div className="w-[11px] h-[13px] bg-[#084e7a]" />
                                    </div>
                                </div>

                                {/* Plus */}
                                <div
                                    className="
                                        absolute
                                        -top-[14px]
                                        w-[35px]
                                        h-[35px]
                                        bg-white
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <div
                                        className="
                                            w-[27px]
                                            h-[27px]
                                            border-[3px]
                                            border-[#084e7a]
                                            rounded-md
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <span
                                            className="
                                                text-[#084e7a]
                                                text-[24px]
                                                font-bold
                                                leading-none
                                            "
                                        >
                                            +
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Nama Rumah Sakit */}
                            <h1
                                className="
                                    mt-[10px]
                                    text-white
                                    text-[21px]
                                    font-bold
                                "
                            >
                                Rs Merdeka
                            </h1>

                        </div>
                    </div>


                    {/* ================= FORM ================= */}
                    <div
                        className="
                            px-[36px]
                            pt-[32px]
                            pb-[40px]
                        "
                    >

                        <form onSubmit={handleRegister}>

                            {/* ================= USERNAME ================= */}
                            <div className="mb-[12px]">

                                <label
                                    htmlFor="username"
                                    className="
                                        block
                                        text-[13px]
                                        text-[#333]
                                        mb-[5px]
                                    "
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Masukan Username"
                                    className="
                                        w-full
                                        h-[42px]
                                        px-[12px]
                                        rounded-[12px]
                                        bg-[#d9d9d9]
                                        text-[13px]
                                        text-gray-700
                                        placeholder:text-[#999]
                                        outline-none

                                        focus:bg-[#d5d5d5]
                                        focus:ring-2
                                        focus:ring-[#084e7a]/30

                                        transition
                                    "
                                />

                            </div>


                            {/* ================= EMAIL ================= */}
                            <div className="mb-[12px]">

                                <label
                                    htmlFor="email"
                                    className="
                                        block
                                        text-[13px]
                                        text-[#333]
                                        mb-[5px]
                                    "
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Masukan Email"
                                    className="
                                        w-full
                                        h-[42px]
                                        px-[12px]
                                        rounded-[12px]
                                        bg-[#d9d9d9]
                                        text-[13px]
                                        text-gray-700
                                        placeholder:text-[#999]
                                        outline-none

                                        focus:bg-[#d5d5d5]
                                        focus:ring-2
                                        focus:ring-[#084e7a]/30

                                        transition
                                    "
                                />

                            </div>


                            {/* ================= PASSWORD ================= */}
                            <div className="mb-[12px]">

                                <label
                                    htmlFor="password"
                                    className="
                                        block
                                        text-[13px]
                                        text-[#333]
                                        mb-[5px]
                                    "
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Masukan Password"
                                    className="
                                        w-full
                                        h-[42px]
                                        px-[12px]
                                        rounded-[12px]
                                        bg-[#d9d9d9]
                                        text-[13px]
                                        text-gray-700
                                        placeholder:text-[#999]
                                        outline-none

                                        focus:bg-[#d5d5d5]
                                        focus:ring-2
                                        focus:ring-[#084e7a]/30

                                        transition
                                    "
                                />

                            </div>


                            {/* ================= KONFIRMASI PASSWORD ================= */}
                            <div className="mb-[35px]">

                                <label
                                    htmlFor="password_confirmation"
                                    className="
                                        block
                                        text-[13px]
                                        text-[#333]
                                        mb-[5px]
                                    "
                                >
                                    Konfirmasi Password
                                </label>

                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Ulangi Password"
                                    className="
                                        w-full
                                        h-[42px]
                                        px-[12px]
                                        rounded-[12px]
                                        bg-[#d9d9d9]
                                        text-[13px]
                                        text-gray-700
                                        placeholder:text-[#999]
                                        outline-none

                                        focus:bg-[#d5d5d5]
                                        focus:ring-2
                                        focus:ring-[#084e7a]/30
                                        transition
                                    "
                                />

                            </div>


                            {/* ================= REGISTER BUTTON ================= */}
                            <button
                                type="submit"
                                className="
                                    w-full
                                    h-[43px]
                                    rounded-[12px]
                                    bg-[#084e7a]
                                    mb-10
                                    text-white
                                    text-[13px]
                                    font-bold
                                    hover:bg-[#063f62]
                                    hover:shadow-md
                                    active:scale-[0.99]
                                    transition-all
                                    duration-200
                                "
                            >
                                Register
                            </button>

                        </form>


                        {/* ================= LOGIN ================= */}
                        <div className="flex justify-center mt-[22px]">

                            <p className="text-[12px] text-gray-500">

                                Sudah punya akun?{" "}

                                <button
                                    type="button"
                                    className="
                                        text-[#73a1bd]
                                        font-medium

                                        hover:text-[#084e7a]

                                        transition
                                    "
                                >
                                    Login
                                </button>

                            </p>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

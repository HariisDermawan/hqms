import { Link } from "@inertiajs/react";
import React from "react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#075985]">
            <div
                className=" absolute inset-0 z-0 bg-cover bg-center
            bg-no-repeat
        "
                style={{ backgroundImage: "url('/banner/bn1.png')" }}
            />

            <div
                className="
            absolute inset-0 z-[1]
            bg-gradient-to-r
            from-[#075985]/95
            via-[#075985]/85
            to-[#0284c7]/55
        "
            />

            <div
                className="
            absolute inset-0 z-[1]
            bg-[radial-gradient(circle_at_75%_50%,rgba(56,189,248,0.25),transparent_40%)]
        "
            />
            <div
                className="
            pointer-events-none absolute right-0 z-[2]
            bottom-[-80px] h-[78%] w-[82%]
            sm:bottom-[-60px] sm:h-[78%] sm:w-[76%]
            md:bottom-[-20px] md:h-[74%] md:w-[54%]
            lg:bottom-[-10px] lg:h-[86%] lg:w-[52%]
            xl:bottom-0 xl:h-[90%] xl:w-[50%]
        "
            >
                <img
                    src="/banner/hero.png"
                    alt="Doctor"
                    className="
                absolute right-[-35px] bottom-0
                h-full w-auto max-w-none
                object-contain object-bottom
                sm:right-[-25px]
                md:right-[-15px]
                lg:right-[-10px]
                xl:right-0
            "
                />
            </div>

            <div
                className="
        relative z-10 mx-auto flex min-h-screen w-full max-w-7xl
        -translate-y-32 items-center
        px-5 pb-24 pt-[105px]
        sm:-translate-y-24 sm:px-8 sm:pb-20 sm:pt-[115px]
        md:translate-y-0 md:px-10 md:pb-16 md:pt-[100px]
        lg:px-14 lg:pt-[100px]
    "
            >
                <div
                    className="
                relative z-20 w-full max-w-[620px]
                lg:max-w-[680px]
                xl:max-w-[720px]
            "
                >
                    <div
                        className="
        mb-6 inline-flex items-center gap-2 rounded-full
        bg-white/95 px-5 py-2.5 shadow-lg backdrop-blur-sm
        sm:mb-7 sm:px-6 sm:py-3
    "
                    >
                        <img
                            src="/icons/wc.svg"
                            alt=""
                            className="h-6 w-6 shrink-0 object-contain sm:h-5 sm:w-5"
                        />

                        <span
                            className="
            text-[11px] font-semibold text-[#075985]
            sm:text-xs md:text-sm
        "
                        >
                            Welcome to the hospital services.
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="
                    text-[40px] font-extrabold leading-[0.98]
                    tracking-tight text-white drop-shadow-sm
                    sm:text-[48px]
                    md:text-[60px]
                    lg:text-[70px]
                    xl:text-[76px]
                "
                    >
                        A Great Place to
                        <br />
                        Receive Care
                    </h1>

                    {/* Description */}
                    <p
                        className="
                    mt-2 max-w-[580px]
                    text-sm leading-6 text-white/90
                    sm:mt-7 sm:text-base sm:leading-7
                    md:text-lg
                "
                    >
                        Overcome any hurdle or any other problem with
                        professional medical services.
                    </p>
                </div>
            </div>
        </section>
    );
}

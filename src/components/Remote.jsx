"use client";

import Image from "next/image";

const websites = [
    { id: "youtube", logo: "/logos/youtube.png", link: "https://www.youtube.com" },
    { id: "netflix", logo: "/logos/netflix.png", link: "https://www.netflix.com" },
    { id: "paramount", logo: "/logos/paramount.png", link: "https://www.paramountplus.com" },
    { id: "disney plus", logo: "/logos/disney plus.png", link: "https://www.disneyplus.com" },
    { id: "hulu", logo: "/logos/hulu.png", link: "https://www.hulu.com" },
];

function handleWebsiteClick(link) {
    console.log(`Navigating to ${link}`);
}

export default function Remote() {
    const menuIconSize = 30;
    const buttonStyle = "flex items-center justify-center w-18 h-18 rounded-full transition-colors";

    return (
        <div>
            { /* 1. First row of buttons */ }
            <div className="flex gap-4 p-4 justify-center">
                <button id="power" className={buttonStyle + " bg-red-500 hover:bg-red-700"}>
                    <Image src="/menu_icons/power.svg" alt="power" width={menuIconSize} height={menuIconSize} loading="eager" />
                </button>

                <button id="refresh" className={buttonStyle + " bg-white hover:bg-gray-300"}>
                    <Image src="/menu_icons/refresh.svg" alt="refresh" width={menuIconSize} height={menuIconSize} />
                </button>

                <button id="pause/play" className={buttonStyle + " bg-white hover:bg-gray-300"}>
                    <Image src="/menu_icons/pause.svg" alt="pause/play" width={menuIconSize} height={menuIconSize} />
                </button>

                <button id="full screen/exit full screen" className={buttonStyle + " bg-white hover:bg-gray-300"}>
                    <Image src="/menu_icons/full screen.svg" alt="full screen/exit full screen" width={menuIconSize} height={menuIconSize} />
                </button>
            </div>

            { /* 2. Horizontal scroll area to jump to a specific website */ }
            <div className="relative p-4">
                <div className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-none">
                    {websites.map((service) => (
                        <button
                            key={service.id}
                            id={service.id}
                            className="shrink-0 snap-start w-28 h-16 overflow-hidden rounded-2xl transition-all duration-200 active:scale-95"
                            onClick={() => handleWebsiteClick(service.link)}
                        >
                            <Image
                                src={service.logo}
                                alt={service.id}
                                width={112}
                                height={64}
                                loading="eager"
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-black/40 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-black/40 to-transparent" />
            </div>

            { /* 3. Trackpad */ }
            <div className="px-4 pb-4">
                <button
                    id="trackpad"
                    className="w-full h-150 rounded-3xl bg-gray-700 shadow-inner shadow-black/40 transition-colors duration-200 active:bg-gray-500 touch-none select-none"
                />
            </div>

        </div>
  );
}

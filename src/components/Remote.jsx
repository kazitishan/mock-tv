"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { openWindow, closeWindow, refreshWindow, navigateWindow, pressKeyCombination, moveCursor, clickCursor, scrollPage } from "@/app/actions";

// Tracks a pointer drag on an element and forwards the accumulated delta to `sendDelta`,
// waiting for each in-flight call to resolve before sending the next so relative moves can't race.
function useDragHandlers(sendDelta) {
    const stateRef = useRef({ active: false, lastX: 0, lastY: 0, pendingDx: 0, pendingDy: 0, sending: false });

    const flush = () => {
        const state = stateRef.current;
        if (state.sending || (state.pendingDx === 0 && state.pendingDy === 0)) return;

        const dx = state.pendingDx;
        const dy = state.pendingDy;
        state.pendingDx = 0;
        state.pendingDy = 0;
        state.sending = true;

        Promise.resolve(sendDelta(dx, dy)).finally(() => {
            state.sending = false;
            flush();
        });
    };

    return {
        onPointerDown: (e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const state = stateRef.current;
            state.active = true;
            state.lastX = e.clientX;
            state.lastY = e.clientY;
        },
        onPointerMove: (e) => {
            const state = stateRef.current;
            if (!state.active) return;

            state.pendingDx += e.clientX - state.lastX;
            state.pendingDy += e.clientY - state.lastY;
            state.lastX = e.clientX;
            state.lastY = e.clientY;

            flush();
        },
        onPointerUp: () => {
            stateRef.current.active = false;
        },
    };
}

const websites = [
    { id: "youtube", link: "https://www.youtube.com" },
    { id: "netflix", link: "https://www.netflix.com" },
    { id: "paramount", link: "https://www.paramountplus.com" },
    { id: "disney plus", link: "https://www.disneyplus.com" },
    { id: "hulu", link: "https://www.hulu.com" },
];

export default function Remote() {
    const menuIconSize = 30;
    const buttonStyle = "flex items-center justify-center w-18 h-18 rounded-full transition-colors";

    const [power, setPower] = useState("off");
    const [playback, setPlayback] = useState("pause");
    const [fullscreen, setFullscreen] = useState("full screen");

    const handlePowerButtonClick = () => {
        if (power === "off") {
            setPower("on");
            openWindow();
        } else {
            setPower("off");
            closeWindow();
        }
    };

    const handleRefreshClick = () => {
        refreshWindow();
    };

    const handlePausePlayClick = () => {
        setPlayback((prev) => (prev === "pause" ? "play" : "pause"));
        pressKeyCombination([" "]);
    };

    const handleFullScreenClick = () => {
        setFullscreen((prev) => (prev === "full screen" ? "exit full screen" : "full screen"));
        pressKeyCombination(["f"]);
    };

    const handleLaunchClick = (link) => {
        setPower("on");
        navigateWindow(link);
    };

    const handleTypingKeyDown = (e) => {
        pressKeyCombination([e.key]);
    };

    const trackpadHandlers = useDragHandlers((dx, dy) => moveCursor(dx, dy));
    const scrollHandlers = useDragHandlers((_dx, dy) => scrollPage(dy));

    const handleClick = () => {
        clickCursor();
    };

    return (
        <div>
            { /* 1. First row of buttons */ }
            <div className="flex gap-4 p-4 justify-center">
                <button id="power" onClick={handlePowerButtonClick} className={buttonStyle + (power === "on" ? " bg-green-500 hover:bg-green-700" : " bg-red-500 hover:bg-red-700")}>
                    <Image src="/menu_icons/power.svg" alt="power" width={menuIconSize} height={menuIconSize} loading="eager" />
                </button>

                <button id="refresh" onClick={handleRefreshClick} className={buttonStyle + " bg-white hover:bg-gray-300"}>
                    <Image src="/menu_icons/refresh.svg" alt="refresh" width={menuIconSize} height={menuIconSize} />
                </button>

                <button id="pause/play" onClick={handlePausePlayClick} className={buttonStyle + " bg-white hover:bg-gray-300"}>
                    <Image src={playback === "pause" ? "/menu_icons/pause.svg" : "/menu_icons/play.svg"} alt={playback} width={menuIconSize} height={menuIconSize} />
                </button>

                <button id="full screen/exit full screen" onClick={handleFullScreenClick} className={buttonStyle + " bg-white hover:bg-gray-300"}>
                    <Image src={fullscreen === "full screen" ? "/menu_icons/full screen.svg" : "/menu_icons/exit full screen.svg"} alt={fullscreen} width={menuIconSize} height={menuIconSize} />
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
                            onClick={() => handleLaunchClick(service.link)}
                        >
                            <Image
                                src={"/logos/" + service.id + ".png"}
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

            { /* 3. Text input */ }
            <div className="px-4 pb-2">
                <textarea
                    id="keyboard-input"
                    onKeyDown={handleTypingKeyDown}
                    placeholder="Type here..."
                    rows={2}
                    className="w-full rounded-2xl bg-gray-700 text-white placeholder-gray-400 p-3 resize-none touch-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>

            { /* 4. Trackpad */ }
            <div className="px-4 pb-4 flex gap-3">
                <div className="relative flex-1 h-150">
                    <div
                        id="trackpad"
                        {...trackpadHandlers}
                        onPointerCancel={trackpadHandlers.onPointerUp}
                        onPointerLeave={trackpadHandlers.onPointerUp}
                        className="absolute inset-0 rounded-3xl bg-gray-700 shadow-inner shadow-black/40 transition-colors duration-200 active:bg-gray-500 touch-none select-none"
                    />
                    <button
                        id="click"
                        onClick={handleClick}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm border border-white/40 text-white text-sm font-medium transition-colors"
                    >
                        Click
                    </button>
                </div>
                <div
                    id="scroll-strip"
                    {...scrollHandlers}
                    onPointerCancel={scrollHandlers.onPointerUp}
                    onPointerLeave={scrollHandlers.onPointerUp}
                    className="w-14 h-150 rounded-3xl bg-gray-700 shadow-inner shadow-black/40 transition-colors duration-200 active:bg-gray-500 touch-none select-none"
                />
            </div>

        </div>
  );
}

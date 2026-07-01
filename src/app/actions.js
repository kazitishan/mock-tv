"use server";

import {
    launchWindow,
    closeWindow as closeBrowserWindow,
    refreshWindow as refreshBrowserWindow,
    pressKeys,
    moveCursor as moveBrowserCursor,
    clickCursor as clickBrowserCursor,
    scrollPage as scrollBrowserPage,
} from "@/lib/browser";

export async function openWindow() {
    await launchWindow();
}

export async function closeWindow() {
    await closeBrowserWindow();
}

export async function refreshWindow() {
    await refreshBrowserWindow();
}

export async function pressKeyCombination(keys) {
    await pressKeys(keys);
}

export async function moveCursor(dx, dy) {
    await moveBrowserCursor(dx, dy);
}

export async function clickCursor() {
    await clickBrowserCursor();
}

export async function scrollPage(deltaY) {
    await scrollBrowserPage(deltaY);
}


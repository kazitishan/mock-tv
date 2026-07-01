"use server";

import { launchWindow, closeWindow as closeBrowserWindow, refreshWindow as refreshBrowserWindow, pressKeys } from "@/lib/browser";

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


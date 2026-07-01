import { chromium } from "playwright";

function getSession() {
    if (!globalThis.__mocktvSession) {
        globalThis.__mocktvSession = { browser: null, page: null };
    }
    return globalThis.__mocktvSession;
}

export async function launchWindow() {
    const session = getSession();

    if (session.browser) {
        await session.browser.close();
    }

    session.browser = await chromium.launch({ headless: false });
    session.page = await session.browser.newPage();

    return session.page;
}

export function getPage() {
    return getSession().page;
}

export async function refreshWindow() {
    const page = getPage();
    if (!page) return;

    await page.reload();
}

export async function closeWindow() {
    const session = getSession();

    if (session.browser) {
        await session.browser.close();
    }

    session.browser = null;
    session.page = null;
}

const KEY_ALIASES = {
    cmd: "Meta",
    ctrl: "Control",
    alt: "Alt",
    shift: "Shift",
    " ": "Space",
};

export async function pressKeys(keys) {
    const page = getPage();
    if (!page) return;

    const combination = keys.map((key) => KEY_ALIASES[key] ?? key).join("+");
    await page.keyboard.press(combination);
}

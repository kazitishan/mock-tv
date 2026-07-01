import { chromium } from "playwright";
import path from "node:path";

// A persistent user-data-dir keeps cookies, local storage, and login sessions
// between launches instead of starting from a blank profile every time.
const USER_DATA_DIR = path.join(process.cwd(), ".mocktv-browser-profile");

// Playwright's page.mouse.move() dispatches synthetic input straight to the renderer, so the
// OS cursor never actually moves. This draws a visible dot that follows the real mousemove
// events the page still receives, so remote cursor movement is visible in the window.
function injectCursorOverlay() {
    if (window.__mocktvCursorInjected) return;
    window.__mocktvCursorInjected = true;

    const cursor = document.createElement("div");
    cursor.id = "__mocktv-cursor";
    Object.assign(cursor.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        background: "red",
        border: "2px solid white",
        pointerEvents: "none",
        zIndex: "2147483647",
        transform: "translate(-50%, -50%)",
        boxShadow: "0 0 4px rgba(0,0,0,0.6)",
    });

    // addInitScript runs before <html> exists, so the cursor can't be mounted immediately.
    let mounted = false;
    function mount() {
        if (mounted || !document.documentElement) return;
        mounted = true;
        document.documentElement.appendChild(cursor);
    }
    document.addEventListener("DOMContentLoaded", mount);
    document.addEventListener("readystatechange", mount);

    document.addEventListener("mousemove", (e) => {
        mount();
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });
}

function getSession() {
    if (!globalThis.__mocktvSession) {
        globalThis.__mocktvSession = { context: null, page: null };
    }
    return globalThis.__mocktvSession;
}

export async function launchWindow() {
    const session = getSession();

    if (session.context) {
        await session.context.close();
    }

    // Google's sign-in flow blocks Playwright's bundled Chromium and the default
    // automation flags (navigator.webdriver, the "controlled by automated test
    // software" banner) as a security risk. Launching real Chrome without those
    // flags avoids tripping that check.
    session.context = await chromium.launchPersistentContext(USER_DATA_DIR, {
        headless: false,
        channel: "chrome",
        args: ["--disable-blink-features=AutomationControlled"],
        ignoreDefaultArgs: ["--enable-automation"],
    });
    session.page = session.context.pages()[0] ?? (await session.context.newPage());
    session.cursor = null;

    await session.page.addInitScript(injectCursorOverlay);
    await session.page.evaluate(injectCursorOverlay);

    return session.page;
}

export function getPage() {
    return getSession().page;
}

export async function navigateWindow(url) {
    const session = getSession();

    if (!session.context) {
        await launchWindow();
    }

    await session.page.goto(url);
}

export async function refreshWindow() {
    const page = getPage();
    if (!page) return;

    await page.reload();
}

export async function closeWindow() {
    const session = getSession();

    if (session.context) {
        await session.context.close();
    }

    session.context = null;
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

async function ensureCursor(page) {
    const session = getSession();

    if (!session.cursor) {
        const viewport = page.viewportSize() ?? { width: 800, height: 600 };
        session.cursor = { x: viewport.width / 2, y: viewport.height / 2 };
        await page.mouse.move(session.cursor.x, session.cursor.y);
    }

    return session.cursor;
}

export async function moveCursor(dx, dy) {
    const page = getPage();
    if (!page) return;

    const viewport = page.viewportSize() ?? { width: 800, height: 600 };
    const cursor = await ensureCursor(page);

    cursor.x = Math.min(Math.max(cursor.x + dx, 0), viewport.width);
    cursor.y = Math.min(Math.max(cursor.y + dy, 0), viewport.height);

    await page.mouse.move(cursor.x, cursor.y);
}

export async function clickCursor() {
    const page = getPage();
    if (!page) return;

    await ensureCursor(page);
    await page.mouse.down();
    await page.mouse.up();
}

export async function scrollPage(deltaY) {
    const page = getPage();
    if (!page) return;

    await page.mouse.wheel(0, deltaY);
}

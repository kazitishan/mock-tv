import { chromium } from "playwright";

const driver = await chromium.launch();
const page = await driver.newPage();
page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));

await page.goto("http://localhost:3000");
console.log("Powering on...");
await page.click("#power");
await page.waitForTimeout(2000);

console.log("Dragging trackpad (writes more files inside the profile dir: cache, history, etc)...");
const box = await page.locator("#trackpad").boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
for (let i = 1; i <= 5; i++) {
    await page.mouse.move(box.x + box.width / 2 + i * 15, box.y + box.height / 2 + i * 10, { steps: 3 });
    await page.waitForTimeout(100);
}
await page.mouse.up();
await page.waitForTimeout(1000);

const status = await fetch("http://localhost:3000").then(r => r.status).catch(e => "FETCH FAILED: " + e.message);
console.log("dev server status after drag:", status);

await driver.close();

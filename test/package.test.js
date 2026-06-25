const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const packageInfo = require("../package.json");
const openApi = require("../plugin/openApi.json");

test("package metadata describes a Signal K read-only alert viewer", () => {
  assert.equal(packageInfo.name, "signalk-ajrm-marine-alerts");
  assert.match(packageInfo.version, /^\d+\.\d+\.\d+$/);
  assert.ok(packageInfo.keywords.includes("signalk-node-server-plugin"));
  assert.ok(packageInfo.keywords.includes("signalk-webapp"));
  assert.equal(packageInfo.signalk.displayName, "AJRM Marine Alerts");
  assert.equal(openApi.info.version, packageInfo.version);
});

test("viewer does not include direct browser speech controls", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");
  const html = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");

  assert.doesNotMatch(app, /speechSynthesis/);
  assert.doesNotMatch(app, /SpeechSynthesisUtterance/);
  assert.doesNotMatch(html, /Enable sound on this device/);
});

test("viewer sorts recent activity newest first", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");

  assert.match(app, /sortRecentActivity\(\s*filterRecentActivity/);
  assert.match(app, /right\.time - left\.time/);
  assert.match(app, /left\.index - right\.index/);
});

test("viewer stops polling notifications when disabled by configuration", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");

  assert.match(app, /state\.enabled = status\.enabled !== false/);
  assert.match(app, /if \(!state\.enabled\) \{/);
  assert.match(app, /renderDisabled\(\)/);
  assert.match(app, /Disabled by configuration\./);
});

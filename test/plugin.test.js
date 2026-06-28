const assert = require("node:assert/strict");
const test = require("node:test");
const createPlugin = require("../plugin");
const packageInfo = require("../package.json");

function harness() {
  const statuses = [];
  const plugin = createPlugin({
    setPluginStatus(message) {
      statuses.push(message);
    },
  });
  return { plugin, statuses };
}

function routeHarness() {
  const routes = new Map();
  return {
    router: {
      get(path, handler) {
        routes.set(`GET ${path}`, handler);
      },
      post(path) {
        throw new Error(`Unexpected write route ${path}`);
      },
      put(path) {
        throw new Error(`Unexpected write route ${path}`);
      },
      delete(path) {
        throw new Error(`Unexpected write route ${path}`);
      },
    },
    routes,
  };
}

test("plugin starts as read-only AJRM Marine Alert Panel", () => {
  const { plugin, statuses } = harness();
  plugin.start({});

  assert.equal(plugin.id, "signalk-ajrm-marine-alerts");
  assert.equal(plugin.name, "AJRM Marine Alert Panel");
  assert.equal(plugin.schema.properties.enabled.default, true);
  assert.equal(plugin.schema.properties.refreshIntervalMs.default, 2000);
  assert.equal(plugin.schema.properties.recentActivityHours.default, 12);
  assert.equal(statuses[0], `Enabled v${packageInfo.version}`);
});

test("plugin status route exposes read-only status", () => {
  const { plugin } = harness();
  plugin.start({ refreshIntervalMs: 750, recentActivityHours: 6 });
  const { router, routes } = routeHarness();
  plugin.registerWithRouter(router);

  let body;
  routes.get("GET /status")(
    {},
    {
      json(value) {
        body = value;
      },
    },
  );

  assert.equal(body.ok, true);
  assert.equal(body.plugin, "signalk-ajrm-marine-alerts");
  assert.equal(body.version, packageInfo.version);
  assert.equal(body.readOnly, true);
  assert.equal(body.refreshIntervalMs, 750);
  assert.equal(body.recentActivityHours, 6);
  assert.equal(body.notificationsStatusUrl, "../plugins/signalk-ajrm-marine-notifications/status");
});

test("plugin clamps refresh interval and reports disabled configuration", () => {
  const { plugin, statuses } = harness();
  plugin.start({ enabled: false, refreshIntervalMs: 10, recentActivityHours: 999 });
  const { router, routes } = routeHarness();
  plugin.registerWithRouter(router);

  let body;
  routes.get("GET /status")({}, { json: (value) => (body = value) });

  assert.equal(statuses[0], `Disabled by configuration v${packageInfo.version}`);
  assert.equal(body.enabled, false);
  assert.equal(body.refreshIntervalMs, 500);
  assert.equal(body.recentActivityHours, 168);
});

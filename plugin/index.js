"use strict";

const packageInfo = require("../package.json");
const openApi = require("./openApi.json");

const PLUGIN_ID = "signalk-ajrm-marine-alerts";

module.exports = function ajrmMarineAlerts(app) {
  const plugin = {};
  let options = normalizeOptions({});
  let startedAt = null;

  plugin.id = PLUGIN_ID;
  plugin.name = "AJRM Marine Alerts";
  plugin.description =
    "Read-only crew alert viewer for AJRM Marine notifications.";

  plugin.schema = {
    type: "object",
    properties: {
      enabled: {
        type: "boolean",
        title: "Enable AJRM Marine Alerts web app",
        default: true,
      },
      refreshIntervalMs: {
        type: "integer",
        title: "Viewer refresh interval",
        default: 2000,
        minimum: 500,
        maximum: 30000,
      },
      recentActivityHours: {
        type: "number",
        title: "Recent activity retention",
        description:
          "Number of hours of recent activity to show in the viewer. Active alerts are never hidden by this setting.",
        default: 12,
        minimum: 0.25,
        maximum: 168,
      },
    },
  };

  plugin.start = (pluginOptions = {}) => {
    options = normalizeOptions(pluginOptions);
    startedAt = new Date().toISOString();
    app.setPluginStatus?.(
      `${options.enabled ? "Enabled" : "Disabled by configuration"} v${packageInfo.version}`,
    );
  };

  plugin.stop = () => {
    startedAt = null;
  };

  plugin.registerWithRouter = (router) => {
    router.get("/status", (_req, res) => {
      res.json(status());
    });
  };

  plugin.getOpenApi = () => openApi;

  return plugin;

  function status() {
    return {
      ok: true,
      plugin: PLUGIN_ID,
      version: packageInfo.version,
      enabled: options.enabled,
      refreshIntervalMs: options.refreshIntervalMs,
      recentActivityHours: options.recentActivityHours,
      readOnly: true,
      startedAt,
      notificationsStatusUrl: "../plugins/signalk-ajrm-marine-notifications/status",
    };
  }
};

function normalizeOptions(value) {
  const refreshIntervalMs = Number.parseInt(value.refreshIntervalMs, 10);
  const recentActivityHours = Number(value.recentActivityHours);
  return {
    enabled: value.enabled !== false,
    refreshIntervalMs: Number.isFinite(refreshIntervalMs)
      ? Math.min(30000, Math.max(500, refreshIntervalMs))
      : 2000,
    recentActivityHours: Number.isFinite(recentActivityHours)
      ? Math.min(168, Math.max(0.25, recentActivityHours))
      : 12,
  };
}

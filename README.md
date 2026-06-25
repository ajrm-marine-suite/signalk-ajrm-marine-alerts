# AJRM Marine Alerts

Read-only alert viewer for the AJRM Marine suite.

Version `0.1.5` makes the disabled plugin setting stop the viewer polling Notifications Plus and show a disabled read-only screen.

Version `0.1.2` removes local browser speech controls. AJRM Marine Alerts is a
visual-only viewer; browser/headphone playback, Pi speaker output, radio stream,
mute, and sound checks are owned by AJRM Marine Audio.

Version `0.1.1` adds a configurable recent-activity retention window. By
default the viewer shows the last 12 hours of recent activity, while active
alerts remain visible regardless of age.

Version `0.1.0` introduces a new crew-safe webapp for phones, tablets, and
watch-sized screens. It displays AJRM Marine Notifications active and recent
alerts via the read-only Signal K data API and keeps layout/font preferences in
local browser storage.

This app deliberately does **not** change vessel alerting state:

- no profile selection;
- no sensitivity sliders;
- no silence/unsilence actions;
- no Traffic Core writes;
- no Notifications history-clear writes;
- no Audio plugin configuration writes.

The older AJRM Marine Companion and Apple Watch apps are frozen as fallbacks
while this read-only viewer replaces them.

## Security model

AJRM Marine Alerts is intended to work with Signal K read-only access. Local
settings such as layout mode and font size stay on the device and are not sent
back to the boat.

AJRM Marine Alerts does not play audio directly. Use AJRM Marine Audio for
browser/headphone playback, Pi speaker output, radio stream output, mute, and
sound checks.

## Install from GitHub

```bash
cd ~/.signalk
npm install git+https://github.com/ajrm-marine-suite/signalk-ajrm-marine-alerts.git#v0.5.0 --omit=dev --no-package-lock
sudo systemctl restart signalk
```

Then open the Signal K webapps list and launch **AJRM Marine Alerts**.


## Public Beta

Alert panel for AJRM Marine Suite notifications.

Development assistance: OpenAI Codex helped with code generation, refactoring, and automated testing during the beta development cycle.

# AJRM Marine Alert Panel

Read-only alert viewer for the AJRM Marine suite.

Version `0.5.3` renames the public app label from AJRM Marine Alerts to
AJRM Marine Alert Panel, making clear that this app is the visual panel rather
than the alert engine.

Version `0.5.2` updates the public beta documentation and install command for
the AJRM Marine repository.

This app deliberately does **not** change vessel alerting state:

- no profile selection;
- no sensitivity sliders;
- no silence/unsilence actions;
- no AJRM Marine Traffic writes;
- no Notifications history-clear writes;
- no Audio plugin configuration writes.

The older AJRM Marine Companion and Apple Watch apps are frozen as fallbacks
while this read-only viewer replaces them.

## Security model

AJRM Marine Alert Panel is intended to work with Signal K read-only access. Local
settings such as layout mode and font size stay on the device and are not sent
back to the boat.

AJRM Marine Alert Panel does not play audio directly. Use AJRM Marine Audio for
browser/headphone playback, Pi speaker output, radio stream output, mute, and
sound checks.

## Install from GitHub

```bash
cd ~/.signalk
npm install git+https://github.com/ajrm-marine-suite/signalk-ajrm-marine-alerts.git#v0.5.3 --omit=dev --no-package-lock
sudo systemctl restart signalk
```

Then open the Signal K webapps list and launch **AJRM Marine Alert Panel**.


## Public Beta

Alert panel for AJRM Marine Suite notifications.

Development assistance: OpenAI Codex helped with code generation, refactoring, and automated testing during the beta development cycle.

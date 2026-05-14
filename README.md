# The Wildsea (Unofficial) — Foundry VTT

An unofficial Foundry VTT system for [The Wildsea](https://thewildsea.co.uk/) by Felix Isaacs, patched for compatibility with **Foundry VTT v14 (Build 361)**.

![Player Sheet](https://i.imgur.com/8oHSKRu.png)

> **Disclaimer:** This is an unofficial community patch and is not affiliated with Felix Isaacs or Mythwork Games. The Wildsea RPG is copyright © 2022 Felix Isaacs. All rights reserved.

---

## What Is This?

The original Wildsea system for Foundry VTT was developed by [demondownload](https://dice.camp/@aniki21) and contributors, and is hosted on [GitLab](https://gitlab.com/pacosgrove1/wildsea-foundry). Development on the original has since stopped, and it is not compatible with Foundry VTT v13 or v14.

This repository is a community-maintained compatibility patch. It makes the minimum changes necessary to get the system working correctly on **Foundry VTT v14 (Build 361)**. No gameplay rules, content, or compendium data has been changed.

---

## Compatibility

| Foundry VTT Version | Status |
|---|---|
| v14 (Build 361) | ✅ Supported (this patch) |
| v13 | ⚠️ Untested |
| v12 and below | ❌ Use the [original system](https://gitlab.com/pacosgrove1/wildsea-foundry) |

---

## Installation

Because this patch is not listed in the official Foundry package browser, you will need to install it manually.

### Option A — Install via Manifest URL (Recommended)

1. Open Foundry VTT and go to the **Game Systems** tab
2. Click **Install System**
3. At the bottom of the dialog, paste the following URL into the **Manifest URL** field:
   ```
   https://raw.githubusercontent.com/brooksultra/wildsea/main/system.json
   ```
4. Click **Install**

### Option B — Manual Installation

1. Download the latest zip file from the [Releases](../../releases) page
2. Extract the zip — it will contain a folder called `wildsea`
3. Place it in your Foundry user data folder under `Data/systems/`
   - On Windows this is typically: `C:\Users\YourName\AppData\Local\FoundryVTT\Data\systems\`
   - You can find your exact path in Foundry under **Configuration → User Data Path**
4. Restart Foundry VTT

---

## What Was Changed

This patch touches six files. No templates, styles, compendium data, or game logic were changed.

- **`system.json`** — Updated compatibility flags for v14; added required `documentTypes` declaration
- **`wildsea.js`** — Removed deprecated TinyMCE config; fixed journal hook for v14's ApplicationV2; updated scene controls API; added `makeDefault` to sheet registrations
- **`system/actor.js`** — Moved ship rating calculation to the correct data lifecycle hook (`prepareDerivedData`); switched to `itemTypes` for better performance; added safety checks
- **`system/applications/dice_pool.js`** — Fixed removed `CHAT_MESSAGE_TYPES.ROLL` constant; fixed deprecated `game.user._id`
- **`system/sheets/ship.js`** — Same two fixes as above
- **`system/helpers.js`** — Added Mac Command key (`metaKey`) support for modifier clicks; added `relativeLinks` support for enriched content
- **`system/preload.js`** — Wrapped `trackCell` Handlebars helper output in `SafeString`; fixed a pre-existing attribute quoting bug

See [CHANGELOG.md](CHANGELOG.md) for the full technical detail on every change and why it was made.

### Known Limitations

- **Custom journal styling** has been removed. The `WildseaJournalSheet` class is no longer compatible with v14's journal API. Journals open correctly using Foundry's default sheet, but will not use the Wildsea custom window dimensions.
- This patch does not migrate the system to Foundry's newer **Data Models** API or **ApplicationV2** sheet framework. Both are best-practice recommendations for new system development but are not required for compatibility, and implementing them would be a near-complete rewrite.

---

## Credits

All credit for the original system goes to its creators:

- **demondownload** — original system author ([dice.camp](https://dice.camp/@aniki21), [ko-fi](https://ko-fi.com/demondownload))
- **Max Schreifels** — contributor
- **Dan Stricoff** — contributor

Original source: [gitlab.com/pacosgrove1/wildsea-foundry](https://gitlab.com/pacosgrove1/wildsea-foundry)

---

## License

All source code (JavaScript, HBS, LESS) is licensed under the [MIT License](LICENSE).

The Wildsea RPG content is copyright © 2022 Felix Isaacs. All rights reserved. This project does not include, reproduce, or distribute any proprietary game content.

Icons from [Game-Icons.net](https://game-icons.net) are licensed under CC BY 3.0. Fonts from [Google Fonts](https://fonts.google.com) are licensed under the SIL Open Font License.

---

## Contributing

Found a bug or have a fix? Pull requests are welcome. Please keep changes focused on v14 compatibility — this project aims to be a minimal, stable patch rather than a feature development fork.


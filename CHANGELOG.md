# The Wildsea (Unofficial) - FoundryVTT

## v0.2.1-v14patch

Community compatibility patch for Foundry VTT Version 14 (Build 361). The original system was last updated by its developer targeting V12/V13. This patch makes no changes to gameplay, rules, or content — it only addresses API breakages introduced in V13 and V14.

### `system.json`

- **Removed `maximum` compatibility cap** — the manifest declared `"maximum": "13"`, which caused Foundry V14 to refuse to load the system entirely. Removed this field so Foundry will attempt to load the system regardless of version.
- **Updated `verified` version** to `"14"` — suppresses the in-app compatibility warning shown to users.
- **Added `documentTypes` declaration** — Foundry V12 introduced a requirement for systems to explicitly declare all Actor and Item subtypes in the manifest. Without this block, Foundry V14 marks custom document types (player, ship, hazard, aspect, resource, design, fitting, undercrew, attribute, temporaryTrack) as invalid and refuses to display their sheets. Added the required `documentTypes` block covering all seven Item subtypes and three Actor subtypes used by this system.

### `wildsea.js`

- **Removed `CONFIG.TinyMCE.content_css` line** — TinyMCE was fully removed from Foundry VTT in V14. This line would throw an error on startup because `CONFIG.TinyMCE` no longer exists. The system's custom journal styling is preserved via the existing `styles/wildsea.css` and `styles/tinymce.css` files, which are still loaded by ProseMirror's compatible CSS pipeline.
- **Removed `Journal.unregisterSheet` / `Journal.registerSheet` calls** — the Journal sheet registration API changed in V13 as part of the ApplicationV2 framework migration. The `WildseaJournalSheet` class (which only adjusted window dimensions) is no longer registerable via the old API and is not needed for basic function. Journals open and display correctly using Foundry's default sheet.
- **Replaced `renderSceneControls` hook with `getSceneControlButtons`** — the `renderSceneControls` hook signature and the method for injecting custom scene control buttons changed in V13. The old approach of appending raw HTML to the controls DOM no longer works. Replaced with the `getSceneControlButtons` hook and the standard tool registration API, which preserves the dice pool button in the scene controls toolbar.
- **Refactored `renderJournalPageSheet` hook to use vanilla JS** — V14's ApplicationV2 hooks pass a raw `HTMLElement` rather than a jQuery-wrapped object. Replaced the jQuery `.on('click', ...)` pattern with `querySelectorAll` and `addEventListener` for correct V14 compatibility. Also removed a stray `console.log` debug statement, updated the hook signature to the standard `(app, element, data)` form, and tightened the result guard to `if (result && !result.cancelled)` to prevent errors if the dialog closes unexpectedly.
- **Removed unused `WildseaJournalSheet` import** — the journal sheet class is no longer registered, so its import was left as dead code. Removed to keep the module clean.
- **Added `makeDefault: true` to primary sheet registrations** — explicitly marks `WildseaPlayerSheet` (for `player` actors) and `WildseaAspectSheet` (for `aspect` and `temporaryTrack` items) as the default sheets for their types. When only one sheet is registered per type Foundry usually selects it automatically, but declaring this explicitly guarantees correct sheet selection for new documents and avoids ambiguity.

### `system/actor.js`

- **Moved ship rating calculation from `prepareBaseData` to `prepareDerivedData`** — `prepareBaseData` runs before embedded Items are fully processed and linked, meaning rating mod calculations could operate on incomplete item data. `prepareDerivedData` is the correct lifecycle hook for any calculations that depend on owned items. The previous placement could cause ship ratings to display incorrectly until the sheet was opened a second time.
- **Replaced `this.items.filter()` with `this.itemTypes`** — `itemTypes` is a pre-cached lookup object maintained by Foundry, avoiding the creation of a new filtered array on every data preparation cycle. Cleaner and more performant.
- **Added safety check for missing rating keys** — if a compendium item's `ratingMod` references a rating that doesn't exist on the actor (due to a typo or a stale entry), the old code would throw an uncaught error. Added a guard (`system.ratings?.[ratingKey]`) to skip invalid entries gracefully.
- **Renamed `prepareShipBaseData` to `_prepareShipData`** — updated the private method name to follow Foundry's convention of prefixing internal methods with an underscore, and to reflect that it now runs in the derived data phase.

### `system/applications/dice_pool.js`

- **`game.user._id` → `game.user.id`** — the `_id` property on `game.user` was deprecated in V11 and fully removed in V13. Updated to use the standard `game.user.id` accessor.
- **Removed `type: CONST.CHAT_MESSAGE_TYPES.ROLL`** from chat message creation — `CHAT_MESSAGE_TYPES` was renamed to `CHAT_MESSAGE_STYLES` in V12, and the `ROLL` value was removed entirely in V13. Roll messages are now automatically identified by Foundry from the presence of the `rolls` array (already included in the payload), so this field is not needed.

### `system/sheets/ship.js`

- **`game.user._id` → `game.user.id`** — same fix as above, applied to the ship rating roll chat message creation in this file.
- **Removed `type: CONST.CHAT_MESSAGE_TYPES.ROLL`** — same fix as above, applied to the ship rating roll chat message creation in this file.

### `system/helpers.js`

- **Added `relativeLinks: true` to `TextEditor.enrichHTML` options** — enables correct resolution of relative URLs in enriched journal and item content. Harmless on absolute links, prevents broken links on relative ones.
- **Added `event.metaKey` to `clickModifiers()`** — the original only checked `shiftKey` and `ctrlKey`. On macOS, the Command key maps to `metaKey`, not `ctrlKey`, meaning Mac users could not trigger modifier-key click behaviour (used for track burn interactions). Adding `metaKey` restores correct behaviour on Mac.

### `system/preload.js`

- **Wrapped `trackCell` helper output in `Handlebars.SafeString`** — Handlebars helpers that return raw HTML strings should use `SafeString` to signal that the content is intentionally unescaped. Without it, Handlebars may escape the HTML in certain rendering contexts, turning `<li class="box">` into visible literal text on screen. The template-level triple-brace `{{{trackCell ...}}}` mitigated this previously, but `SafeString` is the correct fix at the source.
- **Fixed pre-existing attribute quoting bug in `trackCell`** — the original helper had a missing opening quote on the `data-index` attribute (`data-index=${index}"` instead of `data-index="${index}"`). Corrected as part of the same change.

---

*Patch applied May 2026. Original system by demondownload, Max Schreifels, and Dan Stricoff.*

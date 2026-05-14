import { WILDSEA, registerSystemSettings } from './system/config.js'
import {
  loadHandlebarsHelpers,
  loadHandlebarsPartials,
} from './system/preload.js'
import WildseaActor from './system/actor.js'
import { addDiceColor } from './system/dice.js'
import WildseaAspectSheet from './system/sheets/aspect.js'
import WildseaAttributeSheet from './system/sheets/attribute.js'
import WildseaDicePool from './system/applications/dice_pool.js'
import WildseaItem from './system/item.js'
import WildseaPlayerSheet from './system/sheets/player.js'
import WildseaResourceSheet from './system/sheets/resource.js'
import WildseaShipSheet from './system/sheets/ship.js'
import WildseaShipItemSheet from './system/sheets/ship_item.js'
import WildseaAdversarySheet from './system/sheets/adversary.js'
import { setupEnrichers } from './system/enrichers.js'
import { runMigrations } from './system/migrations.js'

import * as WildseaTracks from './system/applications/tracks/index.js'

Hooks.once('init', () => {
  console.log('wildsea | Initializing')

  registerSystemSettings()

  if (game.settings.get('wildsea', 'showDepth'))
    WILDSEA.shipRatings.push('depth')

  CONFIG.wildsea = WILDSEA
  CONFIG.ActiveEffect.legacyTransferral = false
  game.wildsea = {}

  WildseaTracks.setup()

  loadHandlebarsPartials()
  loadHandlebarsHelpers()
  setupEnrichers()

  CONFIG.Actor.documentClass = WildseaActor
  CONFIG.Item.documentClass = WildseaItem

  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('wildsea', WildseaPlayerSheet, { types: ['player'], makeDefault: true })
  Actors.registerSheet('wildsea', WildseaShipSheet, { types: ['ship'] })
  Actors.registerSheet('wildsea', WildseaAdversarySheet, { types: ['hazard'] })

  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet('wildsea', WildseaAspectSheet, {
    types: ['aspect', 'temporaryTrack'],
    makeDefault: true,
  })
  Items.registerSheet('wildsea', WildseaResourceSheet, { types: ['resource'] })
  Items.registerSheet('wildsea', WildseaShipItemSheet, {
    types: ['design', 'fitting', 'undercrew'],
  })
  Items.registerSheet('wildsea', WildseaAttributeSheet, {
    types: ['attribute'],
  })

  // Journal sheet registration removed: JournalSheet is no longer a standard
  // sheet class in V13+. The default journal works correctly without override.
  // If custom journal styling is needed, it requires the ApplicationV2 approach.
})

Hooks.once('ready', () => {
  runMigrations()
})

Hooks.on('ready', async () => {
  game.wildsea.dicePool = new WildseaDicePool()
})

Hooks.on('renderJournalPageSheet', (app, element, data) => {
  if (!game.user.isGM) return

  element.querySelectorAll('.track').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const btnData = event.currentTarget.dataset

      const result = await game.wildsea.trackDatabase.showTrackDialog(
        'wildsea.TRACKS.addTrack',
        btnData,
      )
      if (result && !result.cancelled) {
        game.wildsea.trackDatabase.addTrack({ ...result })
      }
    })
  })
})

Hooks.on('getSceneControlButtons', (controls) => {
  // Find the token layer controls, or fall back to the first group
  const tokenControls = controls.find(c => c.name === 'token') ?? controls[0]
  if (!tokenControls) return

  tokenControls.tools = tokenControls.tools ?? []
  tokenControls.tools.push({
    name: 'dice-pool',
    title: game.i18n.localize('wildsea.dicePoolTitle'),
    icon: 'fas fa-dice',
    button: true,
    onClick: async () => {
      await game.wildsea.dicePool.toggle()
    },
  })
})

Hooks.once('diceSoNiceReady', (dice3d) => {
  const dark = '#2e2c20'
  const mid = '#626256'
  const light = '#858778'

  addDiceColor(dice3d, 'wildsea-dark', 'Dark', dark)
  addDiceColor(dice3d, 'wildsea-mid', 'Mid', mid)
  addDiceColor(dice3d, 'wildsea-light', 'Light', light)
})

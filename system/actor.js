import { clamp } from './helpers.js'

export default class WildseaActor extends Actor {
  static getDefaultArtwork(data) {
    return {
      img: CONFIG.wildsea.defaultTokens[data.type],
      texture: { src: CONFIG.wildsea.defaultTokens[data.type] },
    }
  }

  prepareBaseData() {
    super.prepareBaseData()
  }

  // prepareDerivedData runs after all embedded Items are fully processed,
  // making it the correct place for calculations that depend on owned items.
  prepareDerivedData() {
    super.prepareDerivedData()

    if (this.type === 'ship') this._prepareShipData()
  }

  _prepareShipData() {
    const system = this.system

    // itemTypes is a pre-cached lookup maintained by Foundry — faster and
    // cleaner than calling this.items.filter() on every data preparation cycle.
    const ratingProviders = [
      ...this.itemTypes.design,
      ...this.itemTypes.fitting,
      ...this.itemTypes.undercrew,
    ]

    for (const item of ratingProviders) {
      if (!item.system.ratingMods) continue

      for (const ratingMod of item.system.ratingMods) {
        const ratingKey = ratingMod.rating

        // Safety check: skip if the rating key doesn't exist on this actor,
        // preventing crashes from typos or stale compendium entries.
        if (!system.ratings?.[ratingKey]) continue

        const currentMax = system.ratings[ratingKey].max || 0
        const modValue = parseInt(ratingMod.value) || 0

        system.ratings[ratingKey].max = clamp(currentMax + modValue, 8)
      }
    }
  }

  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user)
    if (data.type === 'player' || data.type === 'ship') {
      const prototypeToken = {
        sight: { enabled: true },
        actorLink: true,
        disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      }
      return this.updateSource({ prototypeToken })
    }
  }
}

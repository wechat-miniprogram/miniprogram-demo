const { findDrink } = require('./storage.js')
const { genItemId } = require('./id.js')

function resolveOption(options, rawVal) {
  if (rawVal == null) return null
  const v = String(rawVal).trim()
  const vLower = v.toLowerCase()
  let opt = options.find(o => o.value === v)
  if (opt) return opt
  opt = options.find(o => String(o.value).toLowerCase() === vLower)
  if (opt) return opt
  opt = options.find(o => o.label === v)
  if (opt) return opt
  opt = options.find(o => String(o.label).replace(/\s+/g, '') === v.replace(/\s+/g, ''))
  if (opt) return opt
  return null
}

const DEFAULT_SINGLE_SPEC = { temperature: 'ice', sugar: 'normal', cupSize: 'medium' }

function validateSpecs(drinkId, rawSpecs) {
  const drink = findDrink(drinkId)
  if (!drink) {
    return { valid: false, error: `未找到 id 为 ${drinkId} 的饮品` }
  }
  const schema = drink.skuSchema
  const specs = rawSpecs || {}
  const normalized = {}
  const textParts = []
  let extraPrice = 0

  for (const dim of schema.dimensions) {
    const val = specs[dim.key]
    if (dim.multiple) {
      const arr = Array.isArray(val) ? val : (val ? [val] : [])
      const validValues = []
      const labels = []
      for (const v of arr) {
        const opt = resolveOption(dim.options, v)
        if (opt) {
          validValues.push(opt.value)
          labels.push(opt.label)
          extraPrice += (opt.extraPrice || 0)
        } else {
          const allow = dim.options.map(o => `${o.value}(${o.label})`).join('、')
          return { valid: false, error: `${dim.label} 不支持 "${v}"，可选：${allow}` }
        }
      }
      normalized[dim.key] = validValues
      if (labels.length) textParts.push(`${dim.label}:${labels.join('+')}`)
    } else {
      const useVal = (val != null && String(val).trim())
        ? val
        : (DEFAULT_SINGLE_SPEC[dim.key] || (dim.options[0] && dim.options[0].value))
      const opt = resolveOption(dim.options, useVal)
      if (!opt) {
        const allow = dim.options.map(o => `${o.value}(${o.label})`).join('、')
        return { valid: false, error: `${dim.label} 不支持 "${val}"，可选：${allow}` }
      }
      normalized[dim.key] = opt.value
      extraPrice += (opt.extraPrice || 0)
      textParts.push(`${opt.label}`)
    }
  }

  const totalPrice = drink.price + extraPrice
  return {
    valid: true,
    normalizedSpecs: normalized,
    specText: textParts.join(' / '),
    totalPrice,
    basePrice: drink.price,
    extraPrice
  }
}

function buildOrderItem(drinkId, rawSpecs) {
  const drink = findDrink(drinkId)
  if (!drink) {
    return { valid: false, error: `未找到 drinkId=${drinkId} 的饮品` }
  }
  const check = validateSpecs(drinkId, rawSpecs)
  if (!check.valid) return check
  return {
    valid: true,
    item: {
      itemId: genItemId(),
      drinkId: drink.id,
      drinkName: drink.name,
      imageUrl: drink.imageUrl,
      specs: check.normalizedSpecs,
      specText: check.specText,
      basePrice: check.basePrice,
      extraPrice: check.extraPrice,
      totalPrice: check.totalPrice
    }
  }
}

module.exports = { validateSpecs, buildOrderItem }

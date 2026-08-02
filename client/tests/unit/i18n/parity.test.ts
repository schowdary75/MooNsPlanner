import { describe, it, expect } from 'vitest'
import type { TranslationStrings } from '@moons/shared/i18n'
import en from '@moons/shared/i18n/en'
import de from '@moons/shared/i18n/de'
import es from '@moons/shared/i18n/es'
import fr from '@moons/shared/i18n/fr'
import hu from '@moons/shared/i18n/hu'
import itIT from '@moons/shared/i18n/it'
import tr from '@moons/shared/i18n/tr'
import ru from '@moons/shared/i18n/ru'
import zh from '@moons/shared/i18n/zh'
import zhTW from '@moons/shared/i18n/zh-TW'
import nl from '@moons/shared/i18n/nl'
import idID from '@moons/shared/i18n/id'
import ar from '@moons/shared/i18n/ar'
import br from '@moons/shared/i18n/br'
import cs from '@moons/shared/i18n/cs'
import pl from '@moons/shared/i18n/pl'
import ja from '@moons/shared/i18n/ja'
import ko from '@moons/shared/i18n/ko'
import uk from '@moons/shared/i18n/uk'
import gr from '@moons/shared/i18n/gr'

// Runtime guard for the aggregated i18n bundles. `t()` resolves keys against the
// active locale's flat dot-key map (see TranslationContext), so a key that is
// present in en but missing in another locale silently falls back to English at
// runtime — easy to ship, hard to notice. This test fails loudly when any locale
// drifts away from the en key set so translators get an explicit, diagnostic list.
//
// The shared package also runs a file-level parity check (shared/scripts), but
// that one only inspects per-domain source files; this one asserts the *merged*
// export each locale actually serves to the app.

const NON_EN_LOCALES: Record<string, TranslationStrings> = {
  de, es, fr, hu, it: itIT, tr, ru, zh, 'zh-TW': zhTW, nl, id: idID,
  ar, br, cs, pl, ja, ko, uk, gr,
}

const enKeys = new Set(Object.keys(en))

describe('i18n locale key parity', () => {
  it('covers every non-en locale', () => {
    // Keep the assertion set in lockstep with the supported language list minus en.
    expect(Object.keys(NON_EN_LOCALES)).toHaveLength(19)
  })

  for (const [locale, strings] of Object.entries(NON_EN_LOCALES)) {
    it(`${locale} has the exact same key set as en`, () => {
      const localeKeys = new Set(Object.keys(strings))
      const missing = [...enKeys].filter((k) => !localeKeys.has(k))
      const extra = [...localeKeys].filter((k) => !enKeys.has(k))

      const diagnostic =
        `Locale "${locale}" key drift vs en — ` +
        `missing ${missing.length}` +
        (missing.length ? ` (${missing.slice(0, 10).join(', ')}${missing.length > 10 ? ', …' : ''})` : '') +
        `; extra ${extra.length}` +
        (extra.length ? ` (${extra.slice(0, 10).join(', ')}${extra.length > 10 ? ', …' : ''})` : '')

      expect(missing, diagnostic).toEqual([])
      expect(extra, diagnostic).toEqual([])
    })
  }
})

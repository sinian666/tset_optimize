
// Intl.PluralRules.~locale.si
/* @generated */
// prettier-ignore
if (Intl.PluralRules && typeof Intl.PluralRules.__addLocaleData === 'function') {
  Intl.PluralRules.__addLocaleData({"data":{"si":{"categories":{"cardinal":["one","other"],"ordinal":["other"]},"fn":function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '';
  if (ord) return 'other';
  return (n == 0 || n == 1) || i == 0 && f == 1 ? 'one' : 'other';
}}},"availableLocales":["si"]})
}


// Intl.PluralRules.~locale.nl
/* @generated */
// prettier-ignore
if (Intl.PluralRules && typeof Intl.PluralRules.__addLocaleData === 'function') {
  Intl.PluralRules.__addLocaleData({"locale":"nl","categories":{"cardinal":["one","other"],"ordinal":["other"]},"fn":function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}})
}

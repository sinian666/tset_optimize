Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({locale:"tk",categories:{cardinal:["one","other"],ordinal:["few","other"]},fn:function(e,l){var a=String(e).split("."),t=Number(a[0])==e,r=t&&a[0].slice(-1);return l?6==r||9==r||10==e?"few":"other":1==e?"one":"other"}});
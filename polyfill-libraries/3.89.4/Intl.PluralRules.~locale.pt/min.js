Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({locale:"pt",categories:{cardinal:["one","other"],ordinal:["other"]},fn:function(l,a){var t=String(l).split("."),e=t[0];return a?"other":0==e||1==e?"one":"other"}});
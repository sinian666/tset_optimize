Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({locale:"ceb",categories:{cardinal:["one","other"],ordinal:["other"]},fn:function(l,e){var a=String(l).split("."),t=a[0],n=a[1]||"",o=!a[1],r=t.slice(-1),c=n.slice(-1);return e?"other":o&&(1==t||2==t||3==t)||o&&4!=r&&6!=r&&9!=r||!o&&4!=c&&6!=c&&9!=c?"one":"other"}});
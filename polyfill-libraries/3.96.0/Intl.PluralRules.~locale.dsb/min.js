Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{dsb:{categories:{cardinal:["one","two","few","other"],ordinal:["other"]},fn:function(a,l){var e=String(a).split("."),t=e[0],o=e[1]||"",n=!e[1],r=t.slice(-2),i=o.slice(-2);return l?"other":n&&1==r||1==i?"one":n&&2==r||2==i?"two":n&&(3==r||4==r)||3==i||4==i?"few":"other"}}},availableLocales:["dsb"]});
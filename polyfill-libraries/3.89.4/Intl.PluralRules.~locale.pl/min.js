Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({locale:"pl",categories:{cardinal:["one","few","many","other"],ordinal:["other"]},fn:function(l,e){var a=String(l).split("."),n=a[0],t=!a[1],o=n.slice(-1),r=n.slice(-2);return e?"other":1==l&&t?"one":t&&o>=2&&o<=4&&(r<12||r>14)?"few":t&&1!=n&&(0==o||1==o)||t&&o>=5&&o<=9||t&&r>=12&&r<=14?"many":"other"}});
Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{be:{categories:{cardinal:["one","few","many","other"],ordinal:["few","other"]},fn:function(e,a){var l=String(e).split("."),t=Number(l[0])==e,n=t&&l[0].slice(-1),r=t&&l[0].slice(-2);return a?2!=n&&3!=n||12==r||13==r?"other":"few":1==n&&11!=r?"one":n>=2&&n<=4&&(r<12||r>14)?"few":t&&0==n||n>=5&&n<=9||r>=11&&r<=14?"many":"other"}}},availableLocales:["be"]});
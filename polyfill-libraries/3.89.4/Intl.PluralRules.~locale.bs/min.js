Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({locale:"bs",categories:{cardinal:["one","few","other"],ordinal:["other"]},fn:function(l,e){var a=String(l).split("."),t=a[0],n=a[1]||"",o=!a[1],r=t.slice(-1),c=t.slice(-2),i=n.slice(-1),s=n.slice(-2);return e?"other":o&&1==r&&11!=c||1==i&&11!=s?"one":o&&r>=2&&r<=4&&(c<12||c>14)||i>=2&&i<=4&&(s<12||s>14)?"few":"other"}});
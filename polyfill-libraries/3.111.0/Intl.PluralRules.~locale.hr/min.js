Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{categories:{cardinal:["one","few","other"],ordinal:["other"]},fn:function(l,e){var a=String(l).split("."),t=a[0],r=a[1]||"",n=!a[1],o=t.slice(-1),c=t.slice(-2),i=r.slice(-1),s=r.slice(-2);return e?"other":n&&1==o&&11!=c||1==i&&11!=s?"one":n&&o>=2&&o<=4&&(c<12||c>14)||i>=2&&i<=4&&(s<12||s>14)?"few":"other"}},locale:"hr"});
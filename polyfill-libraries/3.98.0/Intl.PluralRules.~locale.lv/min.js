Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{categories:{cardinal:["zero","one","other"],ordinal:["other"]},fn:function(l,e){var a=String(l).split("."),t=a[1]||"",r=t.length,o=Number(a[0])==l,n=o&&a[0].slice(-1),c=o&&a[0].slice(-2),i=t.slice(-2),u=t.slice(-1);return e?"other":o&&0==n||c>=11&&c<=19||2==r&&i>=11&&i<=19?"zero":1==n&&11!=c||2==r&&1==u&&11!=i||2!=r&&1==u?"one":"other"}},locale:"lv"});
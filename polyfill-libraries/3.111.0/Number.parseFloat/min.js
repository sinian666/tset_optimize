!function(r,t){var a=function o(t){var a=String(t).trim(),e=r(a);return 0===e&&"-"==a.charAt(0)?-0:e};try{CreateMethodProperty(t,"parseFloat",a)}catch(e){t.parseFloat=a}CreateMethodProperty(Number,"parseFloat",t.parseFloat)}(parseFloat,this);
!function(e){var t=!0,r=function(e,r,n,i){Object.defineProperty?Object.defineProperty(e,r,{configurable:!1===t||!!i,get:n}):e.__defineGetter__(r,n)};try{r({},"support")}catch(i){t=!1}var n=function(e,i,l){r(e.prototype,i,function(){var e,c=this,s="__defineGetter__DEFINE_PROPERTY"+i;if(c[s])return e;if(c[s]=!0,!1===t){for(var o,a=n.mirror||document.createElement("div"),f=a.childNodes,d=f.length,m=0;m<d;++m)if(f[m]._R===c){o=f[m];break}o||(o=a.appendChild(document.createElement("div"))),e=DOMTokenList.call(o,c,l)}else e=new _DOMTokenList(c,l);return r(c,i,function(){return e}),delete c[s],e},!0)};n(e.Element,"classList","className"),n(e.HTMLElement,"classList","className"),n(e.HTMLLinkElement,"relList","rel"),n(e.HTMLAnchorElement,"relList","rel"),n(e.HTMLAreaElement,"relList","rel")}(self);
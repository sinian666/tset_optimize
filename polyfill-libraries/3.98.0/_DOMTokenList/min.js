var _DOMTokenList=function(){var n=!0,t=function(t,e,r,o){Object.defineProperty?Object.defineProperty(t,e,{configurable:!1===n||!!o,get:r}):t.__defineGetter__(e,r)};try{t({},"support")}catch(e){n=!1}return function(n,e){var r=this,o=[],i={},a=0,c=0,f=function(n){t(r,n,function(){return u(),o[n]},!1)},l=function(){if(a>=c)for(;c<a;++c)f(c)},u=function(){var t,r,c=arguments,f=/\s+/;if(c.length)for(r=0;r<c.length;++r)if(f.test(c[r]))throw t=new SyntaxError('String "'+c[r]+'" contains an invalid character'),t.code=5,t.name="InvalidCharacterError",t;for(o="object"==typeof n[e]?(""+n[e].baseVal).replace(/^\s+|\s+$/g,"").split(f):(""+n[e]).replace(/^\s+|\s+$/g,"").split(f),""===o[0]&&(o=[]),i={},r=0;r<o.length;++r)i[o[r]]=!0;a=o.length,l()};return u(),t(r,"length",function(){return u(),a}),r.toLocaleString=r.toString=function(){return u(),o.join(" ")},r.item=function(n){return u(),o[n]},r.contains=function(n){return u(),!!i[n]},r.add=function(){u.apply(r,t=arguments);for(var t,c,f=0,p=t.length;f<p;++f)c=t[f],i[c]||(o.push(c),i[c]=!0);a!==o.length&&(a=o.length>>>0,"object"==typeof n[e]?n[e].baseVal=o.join(" "):n[e]=o.join(" "),l())},r.remove=function(){u.apply(r,t=arguments);for(var t,c={},f=0,p=[];f<t.length;++f)c[t[f]]=!0,delete i[t[f]];for(f=0;f<o.length;++f)c[o[f]]||p.push(o[f]);o=p,a=p.length>>>0,"object"==typeof n[e]?n[e].baseVal=o.join(" "):n[e]=o.join(" "),l()},r.toggle=function(n,t){return u.apply(r,[n]),undefined!==t?t?(r.add(n),!0):(r.remove(n),!1):i[n]?(r.remove(n),!1):(r.add(n),!0)},r.forEach=Array.prototype.forEach,r}}();
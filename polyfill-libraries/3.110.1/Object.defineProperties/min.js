CreateMethodProperty(Object,"defineProperties",function e(r,t){if("object"!==Type(r))throw new TypeError("Object.defineProperties called on non-object");for(var o=ToObject(t),n=Object.keys(o),c=[],i=0;i<n.length;i++){var b=n[i],f=Object.getOwnPropertyDescriptor(o,b);if(f!==undefined&&f.enumerable){var p=Get(o,b),a=p;c.push([b,a])}}for(var j=0;j<c.length;j++){var d=c[j][0];a=c[j][1],Object.defineProperty(r,d,a)}return r});
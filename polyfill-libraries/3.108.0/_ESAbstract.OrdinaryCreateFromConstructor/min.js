function OrdinaryCreateFromConstructor(r,e){var t=arguments[2]||{},o=GetPrototypeFromConstructor(r,e),a=Object.create(o);for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&Object.defineProperty(a,n,{configurable:!0,enumerable:!1,writable:!0,value:t[n]});return a}
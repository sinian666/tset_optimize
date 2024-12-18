!function(e){function t(e,t){if("object"!==Type(e))throw new TypeError("createMapIterator called on incompatible receiver "+Object.prototype.toString.call(e));if(!0!==e._es6Map)throw new TypeError("createMapIterator called on incompatible receiver "+Object.prototype.toString.call(e));var r=Object.create(u);return Object.defineProperty(r,"[[Map]]",{configurable:!0,enumerable:!1,writable:!0,value:e}),Object.defineProperty(r,"[[MapNextIndex]]",{configurable:!0,enumerable:!1,writable:!0,value:0}),Object.defineProperty(r,"[[MapIterationKind]]",{configurable:!0,enumerable:!1,writable:!0,value:t}),r}var r=function(){try{var e={};return Object.defineProperty(e,"t",{configurable:!0,enumerable:!1,get:function(){return!0},set:undefined}),!!e.t}catch(t){return!1}}(),o=0,a=Symbol("meta_"+(1e8*Math.random()+"").replace(".","")),n=function(e){if("object"==typeof e?null!==e:"function"==typeof e){if(!Object.isExtensible(e))return!1;if(!Object.prototype.hasOwnProperty.call(e,a)){var t=typeof e+"-"+ ++o;Object.defineProperty(e,a,{configurable:!1,enumerable:!1,writable:!1,value:t})}return e[a]}return""+e},i=function(e,t){var r=n(t);if(!1===r)return p(e,t);var o=e._table[r];return o!==undefined&&o},p=function(e,t){for(var r=0;r<e._keys.length;r++){var o=e._keys[r];if(o!==c&&SameValueZero(o,t))return r}return!1},l=function(e,t,r){var o=n(t);return!1!==o&&(!1===r?delete e._table[o]:e._table[o]=r,!0)},c=Symbol("undef"),y=function f(){if(!(this instanceof f))throw new TypeError('Constructor Map requires "new"');var e=OrdinaryCreateFromConstructor(this,f.prototype,{_table:{},_keys:[],_values:[],_size:0,_es6Map:!0});r||Object.defineProperty(e,"size",{configurable:!0,enumerable:!1,writable:!0,value:0});var t=arguments.length>0?arguments[0]:undefined;if(null===t||t===undefined)return e;var o=e.set;if(!IsCallable(o))throw new TypeError("Map.prototype.set is not a function");try{for(var a=GetIterator(t);;){var n=IteratorStep(a);if(!1===n)return e;var i=IteratorValue(n);if("object"!==Type(i))try{throw new TypeError("Iterator value "+i+" is not an entry object")}catch(u){return IteratorClose(a,u)}try{var p=i[0],l=i[1];o.call(e,p,l)}catch(s){return IteratorClose(a,s)}}}catch(s){if(Array.isArray(t)||"[object Arguments]"===Object.prototype.toString.call(t)||t.callee){var c,y=t.length;for(c=0;c<y;c++)o.call(e,t[c][0],t[c][1])}}return e};Object.defineProperty(y,"prototype",{configurable:!1,enumerable:!1,writable:!1,value:{}}),r?Object.defineProperty(y,Symbol.species,{configurable:!0,enumerable:!1,get:function(){return this},set:undefined}):CreateMethodProperty(y,Symbol.species,y),CreateMethodProperty(y.prototype,"clear",function b(){var e=this;if("object"!==Type(e))throw new TypeError("Method Map.prototype.clear called on incompatible receiver "+Object.prototype.toString.call(e));if(!0!==e._es6Map)throw new TypeError("Method Map.prototype.clear called on incompatible receiver "+Object.prototype.toString.call(e));for(var t=e._keys,o=0;o<t.length;o++)e._keys[o]=c,e._values[o]=c;return this._size=0,r||(this.size=this._size),this._table={},undefined}),CreateMethodProperty(y.prototype,"constructor",y),CreateMethodProperty(y.prototype,"delete",function(e){var t=this;if("object"!==Type(t))throw new TypeError("Method Map.prototype.clear called on incompatible receiver "+Object.prototype.toString.call(t));if(!0!==t._es6Map)throw new TypeError("Method Map.prototype.clear called on incompatible receiver "+Object.prototype.toString.call(t));var o=i(t,e);if(!1!==o){var a=t._keys[o];if(a!==c&&SameValueZero(a,e))return this._keys[o]=c,this._values[o]=c,this._size=--this._size,r||(this.size=this._size),l(this,e,!1),!0}return!1}),CreateMethodProperty(y.prototype,"entries",function h(){return t(this,"key+value")}),CreateMethodProperty(y.prototype,"forEach",function(e){var t=this;if("object"!==Type(t))throw new TypeError("Method Map.prototype.forEach called on incompatible receiver "+Object.prototype.toString.call(t));if(!0!==t._es6Map)throw new TypeError("Method Map.prototype.forEach called on incompatible receiver "+Object.prototype.toString.call(t));if(!IsCallable(e))throw new TypeError(Object.prototype.toString.call(e)+" is not a function.");if(arguments[1])var r=arguments[1];for(var o=t._keys,a=0;a<o.length;a++)t._keys[a]!==c&&t._values[a]!==c&&e.call(r,t._values[a],t._keys[a],t);return undefined}),CreateMethodProperty(y.prototype,"get",function d(e){var t=this;if("object"!==Type(t))throw new TypeError("Method Map.prototype.get called on incompatible receiver "+Object.prototype.toString.call(t));if(!0!==t._es6Map)throw new TypeError("Method Map.prototype.get called on incompatible receiver "+Object.prototype.toString.call(t));var r=i(t,e);if(!1!==r){var o=t._keys[r];if(o!==c&&SameValueZero(o,e))return t._values[r]}return undefined}),CreateMethodProperty(y.prototype,"has",function v(e){var t=this;if("object"!=typeof t)throw new TypeError("Method Map.prototype.has called on incompatible receiver "+Object.prototype.toString.call(t));if(!0!==t._es6Map)throw new TypeError("Method Map.prototype.has called on incompatible receiver "+Object.prototype.toString.call(t));var r=i(t,e);if(!1!==r){var o=t._keys[r];if(o!==c&&SameValueZero(o,e))return!0}return!1}),CreateMethodProperty(y.prototype,"keys",function M(){return t(this,"key")}),CreateMethodProperty(y.prototype,"set",function w(e,t){var o=this;if("object"!==Type(o))throw new TypeError("Method Map.prototype.set called on incompatible receiver "+Object.prototype.toString.call(o));if(!0!==o._es6Map)throw new TypeError("Method Map.prototype.set called on incompatible receiver "+Object.prototype.toString.call(o));var a=i(o,e);if(!1!==a)o._values[a]=t;else{-0===e&&(e=0);var n={"[[Key]]":e,"[[Value]]":t};o._keys.push(n["[[Key]]"]),o._values.push(n["[[Value]]"]),l(o,e,o._keys.length-1),++o._size,r||(o.size=o._size)}return o}),r&&Object.defineProperty(y.prototype,"size",{configurable:!0,enumerable:!1,get:function(){var e=this;if("object"!==Type(e))throw new TypeError("Method Map.prototype.size called on incompatible receiver "+Object.prototype.toString.call(e));if(!0!==e._es6Map)throw new TypeError("Method Map.prototype.size called on incompatible receiver "+Object.prototype.toString.call(e));return this._size},set:undefined}),CreateMethodProperty(y.prototype,"values",function j(){return t(this,"value")}),CreateMethodProperty(y.prototype,Symbol.iterator,y.prototype.entries),"name"in y||Object.defineProperty(y,"name",{configurable:!0,enumerable:!1,writable:!1,value:"Map"});var u={};Object.defineProperty(u,"isMapIterator",{configurable:!1,enumerable:!1,writable:!1,value:!0}),CreateMethodProperty(u,"next",function _(){var e=this;if("object"!==Type(e))throw new TypeError("Method %MapIteratorPrototype%.next called on incompatible receiver "+Object.prototype.toString.call(e));if(!e.isMapIterator)throw new TypeError("Method %MapIteratorPrototype%.next called on incompatible receiver "+Object.prototype.toString.call(e));var t=e["[[Map]]"],r=e["[[MapNextIndex]]"],o=e["[[MapIterationKind]]"];if(t===undefined)return CreateIterResultObject(undefined,!0);if(!t._es6Map)throw new Error(Object.prototype.toString.call(t)+" has a [[MapData]] internal slot.");for(var a=t._keys,n=a.length;r<n;){var i=Object.create(null);if(i["[[Key]]"]=t._keys[r],i["[[Value]]"]=t._values[r],r+=1,e["[[MapNextIndex]]"]=r,i["[[Key]]"]!==c){if("key"===o)var p=i["[[Key]]"];else if("value"===o)p=i["[[Value]]"];else{if("key+value"!==o)throw new Error;p=[i["[[Key]]"],i["[[Value]]"]]}return CreateIterResultObject(p,!1)}}return e["[[Map]]"]=undefined,CreateIterResultObject(undefined,!0)}),CreateMethodProperty(u,Symbol.iterator,function g(){return this});try{CreateMethodProperty(e,"Map",y)}catch(s){e.Map=y}}(self);
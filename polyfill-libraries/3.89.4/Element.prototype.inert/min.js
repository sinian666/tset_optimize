!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t():"function"==typeof define&&define.amd?define("inert",t):t()}(0,function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,n,i){if(e.nodeType==Node.ELEMENT_NODE){var o=e;n&&n(o);var r=o.shadowRoot;if(r)return void t(r,n,r);if("content"==o.localName){for(var s=o,a=s.getDistributedNodes?s.getDistributedNodes():[],d=0;d<a.length;d++)t(a[d],n,i);return}if("slot"==o.localName){for(var u=o,h=u.assignedNodes?u.assignedNodes({flatten:!0}):[],c=0;c<h.length;c++)t(h[c],n,i);return}}for(var l=e.firstChild;null!=l;)t(l,n,i),l=l.nextSibling}function n(e){if(!e.querySelector("style#inert-style")){var t=document.createElement("style");t.setAttribute("id","inert-style"),t.textContent="\n[inert] {\n  pointer-events: none;\n  cursor: default;\n}\n\n[inert], [inert] * {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n",e.appendChild(t)}}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=Array.prototype.slice,r=Element.prototype.matches||Element.prototype.msMatchesSelector,s=["a[href]","area[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])","button:not([disabled])","details","summary","iframe","object","embed","[contenteditable]"].join(","),a=function(){function n(t,i){e(this,n),this._inertManager=i,this._rootElement=t,this._managedNodes=new Set,this._rootElement.hasAttribute("aria-hidden")?this._savedAriaHidden=this._rootElement.getAttribute("aria-hidden"):this._savedAriaHidden=null,this._rootElement.setAttribute("aria-hidden","true"),this._makeSubtreeUnfocusable(this._rootElement),this._observer=new MutationObserver(this._onMutation.bind(this)),this._observer.observe(this._rootElement,{attributes:!0,childList:!0,subtree:!0})}return i(n,[{key:"destructor",value:function a(){this._observer.disconnect(),this._rootElement&&(null!==this._savedAriaHidden?this._rootElement.setAttribute("aria-hidden",this._savedAriaHidden):this._rootElement.removeAttribute("aria-hidden")),this._managedNodes.forEach(function(e){this._unmanageNode(e.node)},this),this._observer=null,this._rootElement=null,this._managedNodes=null,this._inertManager=null}},{key:"_makeSubtreeUnfocusable",value:function d(e){var n=this;t(e,function(e){return n._visitNode(e)});var i=document.activeElement;if(!document.body.contains(e)){for(var o=e,r=undefined;o;){if(o.nodeType===Node.DOCUMENT_FRAGMENT_NODE){r=o;break}o=o.parentNode}r&&(i=r.activeElement)}e.contains(i)&&(i.blur(),i===document.activeElement&&document.body.focus())}},{key:"_visitNode",value:function u(e){if(e.nodeType===Node.ELEMENT_NODE){var t=e;t!==this._rootElement&&t.hasAttribute("inert")&&this._adoptInertRoot(t),(r.call(t,s)||t.hasAttribute("tabindex"))&&this._manageNode(t)}}},{key:"_manageNode",value:function h(e){var t=this._inertManager.register(e,this);this._managedNodes.add(t)}},{key:"_unmanageNode",value:function c(e){var t=this._inertManager.deregister(e,this);t&&this._managedNodes["delete"](t)}},{key:"_unmanageSubtree",value:function l(e){var n=this;t(e,function(e){return n._unmanageNode(e)})}},{key:"_adoptInertRoot",value:function f(e){var t=this._inertManager.getInertRoot(e);t||(this._inertManager.setInert(e,!0),t=this._inertManager.getInertRoot(e)),t.managedNodes.forEach(function(e){this._manageNode(e.node)},this)}},{key:"_onMutation",value:function _(e,t){e.forEach(function(e){var t=e.target;if("childList"===e.type)o.call(e.addedNodes).forEach(function(e){this._makeSubtreeUnfocusable(e)},this),o.call(e.removedNodes).forEach(function(e){this._unmanageSubtree(e)},this);else if("attributes"===e.type)if("tabindex"===e.attributeName)this._manageNode(t);else if(t!==this._rootElement&&"inert"===e.attributeName&&t.hasAttribute("inert")){this._adoptInertRoot(t);var n=this._inertManager.getInertRoot(t);this._managedNodes.forEach(function(e){t.contains(e.node)&&n._manageNode(e.node)})}},this)}},{key:"managedNodes",get:function b(){return new Set(this._managedNodes)}},{key:"hasSavedAriaHidden",get:function v(){return null!==this._savedAriaHidden}},{key:"savedAriaHidden",set:function m(e){this._savedAriaHidden=e},get:function y(){return this._savedAriaHidden}}]),n}(),d=function(){function t(n,i){e(this,t),this._node=n,this._overrodeFocusMethod=!1,this._inertRoots=new Set([i]),this._savedTabIndex=null,this._destroyed=!1,this.ensureUntabbable()}return i(t,[{key:"destructor",value:function n(){if(this._throwIfDestroyed(),this._node&&this._node.nodeType===Node.ELEMENT_NODE){var e=this._node;null!==this._savedTabIndex?e.setAttribute("tabindex",this._savedTabIndex):e.removeAttribute("tabindex"),this._overrodeFocusMethod&&delete e.focus}this._node=null,this._inertRoots=null,this._destroyed=!0}},{key:"_throwIfDestroyed",value:function o(){if(this.destroyed)throw new Error("Trying to access destroyed InertNode")}},{key:"ensureUntabbable",value:function a(){if(this.node.nodeType===Node.ELEMENT_NODE){var e=this.node;if(r.call(e,s)){if(-1===e.tabIndex&&this.hasSavedTabIndex)return;e.hasAttribute("tabindex")&&(this._savedTabIndex=e.tabIndex),e.setAttribute("tabindex","-1"),e.nodeType===Node.ELEMENT_NODE&&(e.focus=function(){},this._overrodeFocusMethod=!0)}else e.hasAttribute("tabindex")&&(this._savedTabIndex=e.tabIndex,e.removeAttribute("tabindex"))}}},{key:"addInertRoot",value:function d(e){this._throwIfDestroyed(),this._inertRoots.add(e)}},{key:"removeInertRoot",value:function u(e){this._throwIfDestroyed(),this._inertRoots["delete"](e),0===this._inertRoots.size&&this.destructor()}},{key:"destroyed",get:function h(){return this._destroyed}},{key:"hasSavedTabIndex",get:function c(){return null!==this._savedTabIndex}},{key:"node",get:function l(){return this._throwIfDestroyed(),this._node}},{key:"savedTabIndex",set:function f(e){this._throwIfDestroyed(),this._savedTabIndex=e},get:function _(){return this._throwIfDestroyed(),this._savedTabIndex}}]),t}(),u=function(){function t(i){if(e(this,t),!i)throw new Error("Missing required argument; InertManager needs to wrap a document.");this._document=i,this._managedNodes=new Map,this._inertRoots=new Map,this._observer=new MutationObserver(this._watchForInert.bind(this)),n(i.head||i.body||i.documentElement),"loading"===i.readyState?i.addEventListener("DOMContentLoaded",this._onDocumentLoaded.bind(this)):this._onDocumentLoaded()}return i(t,[{key:"setInert",value:function s(e,t){if(t){if(this._inertRoots.has(e))return;var i=new a(e,this);if(e.setAttribute("inert",""),this._inertRoots.set(e,i),!this._document.body.contains(e))for(var o=e.parentNode;o;)11===o.nodeType&&n(o),o=o.parentNode}else{if(!this._inertRoots.has(e))return;this._inertRoots.get(e).destructor(),this._inertRoots["delete"](e),e.removeAttribute("inert")}}},{key:"getInertRoot",value:function u(e){return this._inertRoots.get(e)}},{key:"register",value:function h(e,t){var n=this._managedNodes.get(e);return n!==undefined?n.addInertRoot(t):n=new d(e,t),this._managedNodes.set(e,n),n}},{key:"deregister",value:function c(e,t){var n=this._managedNodes.get(e);return n?(n.removeInertRoot(t),n.destroyed&&this._managedNodes["delete"](e),n):null}},{key:"_onDocumentLoaded",value:function l(){o.call(this._document.querySelectorAll("[inert]")).forEach(function(e){this.setInert(e,!0)},this),this._observer.observe(this._document.body||this._document.documentElement,{attributes:!0,subtree:!0,childList:!0})}},{key:"_watchForInert",value:function f(e,t){var n=this;e.forEach(function(e){switch(e.type){case"childList":o.call(e.addedNodes).forEach(function(e){if(e.nodeType===Node.ELEMENT_NODE){var t=o.call(e.querySelectorAll("[inert]"));r.call(e,"[inert]")&&t.unshift(e),t.forEach(function(e){this.setInert(e,!0)},n)}},n);break;case"attributes":if("inert"!==e.attributeName)return;var t=e.target,i=t.hasAttribute("inert");n.setInert(t,i)}},this)}}]),t}(),h=new u(document);Element.prototype.hasOwnProperty("inert")||Object.defineProperty(Element.prototype,"inert",{enumerable:!0,get:function c(){return this.hasAttribute("inert")},set:function l(e){h.setInert(this,e)}})});
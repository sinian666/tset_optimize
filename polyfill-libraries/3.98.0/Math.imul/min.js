CreateMethodProperty(Math,"imul",function t(r,e){var n=ToUint32(r),o=ToUint32(e),i=n>>>16&65535,a=65535&n,u=o>>>16&65535,h=65535&o;return a*h+(i*h+a*u<<16>>>0)|0});
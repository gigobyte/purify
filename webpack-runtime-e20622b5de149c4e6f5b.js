!function(){"use strict";var e,t,n,r,o,a={},c={};function s(e){var t=c[e];if(void 0!==t)return t.exports;var n=c[e]={exports:{}};return a[e](n,n.exports,s),n.exports}s.m=a,e=[],s.O=function(t,n,r,o){if(!n){var a=1/0;for(u=0;u<e.length;u++){n=e[u][0],r=e[u][1],o=e[u][2];for(var c=!0,i=0;i<n.length;i++)(!1&o||a>=o)&&Object.keys(s.O).every((function(e){return s.O[e](n[i])}))?n.splice(i--,1):(c=!1,o<a&&(a=o));if(c){e.splice(u--,1);var f=r();void 0!==f&&(t=f)}}return t}o=o||0;for(var u=e.length;u>0&&e[u-1][2]>o;u--)e[u]=e[u-1];e[u]=[n,r,o]},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,{a:t}),t},s.d=function(e,t){for(var n in t)s.o(t,n)&&!s.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},s.f={},s.e=function(e){return Promise.all(Object.keys(s.f).reduce((function(t,n){return s.f[n](e,t),t}),[]))},s.u=function(e){return{34:"component---src-pages-utils-list-js",91:"component---src-pages-getting-started-js",138:"component---src-pages-adts-either-js",243:"component---src-pages-changelog-0-16-js",329:"component---src-pages-faq-js",344:"component---src-pages-adts-tuple-js",351:"commons",364:"component---src-pages-changelog-js",531:"component---src-pages-adts-maybe-async-js",532:"styles",678:"component---src-pages-index-js",699:"component---src-pages-adts-non-empty-list-js",730:"component---src-pages-changelog-0-15-js",767:"component---src-pages-changelog-0-12-js",769:"component---src-pages-adts-either-async-js",797:"component---src-pages-utils-function-js",856:"component---src-pages-utils-codec-js",904:"component---src-pages-changelog-0-13-js",923:"component---src-pages-adts-maybe-js",935:"component---src-pages-guides-maybeasync-eitherasync-for-haskellers-js",950:"component---src-pages-changelog-0-14-js",970:"component---src-pages-changelog-0-11-js"}[e]+"-"+{34:"67a38d81b4f4034e17b1",91:"c790f874e78acc71aab7",138:"8c344ed43d2eb192f2b2",243:"d1963edf69865488b348",329:"f32ac3253afea6afde2d",344:"fd9430b9b93737dfcd48",351:"b9370af9642da0fcb455",364:"cb025ad3b2ef35eaa6fd",531:"181ab251a551916ca28f",532:"13fdd8269d161b1a268e",678:"fe854d3d273ab97865af",699:"2ee12c1e0f8b59643c67",730:"38638126a74ceb24a996",767:"6b6444c1af2f4f7e725f",769:"c4c8c285a5ed975d2221",797:"d719fdd7000405a6e629",856:"b9062291358185297dd2",904:"5ef581a0a170ca06014c",923:"6b97d2a1f67e0a584651",935:"92cf2abb6a03c0f6922a",950:"15579eca6959945c7ada",970:"8a7260126275fcaad62d"}[e]+".js"},s.miniCssF=function(e){return"styles.ab0d47a6a3726a63a4e5.css"},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t={},n="purify-website:",s.l=function(e,r,o,a){if(t[e])t[e].push(r);else{var c,i;if(void 0!==o)for(var f=document.getElementsByTagName("script"),u=0;u<f.length;u++){var d=f[u];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==n+o){c=d;break}}c||(i=!0,(c=document.createElement("script")).charset="utf-8",c.timeout=120,s.nc&&c.setAttribute("nonce",s.nc),c.setAttribute("data-webpack",n+o),c.src=e),t[e]=[r];var l=function(n,r){c.onerror=c.onload=null,clearTimeout(p);var o=t[e];if(delete t[e],c.parentNode&&c.parentNode.removeChild(c),o&&o.forEach((function(e){return e(r)})),n)return n(r)},p=setTimeout(l.bind(null,void 0,{type:"timeout",target:c}),12e4);c.onerror=l.bind(null,c.onerror),c.onload=l.bind(null,c.onload),i&&document.head.appendChild(c)}},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.p="/purify/",r=function(e){return new Promise((function(t,n){var r=s.miniCssF(e),o=s.p+r;if(function(e,t){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var o=(c=n[r]).getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(o===e||o===t))return c}var a=document.getElementsByTagName("style");for(r=0;r<a.length;r++){var c;if((o=(c=a[r]).getAttribute("data-href"))===e||o===t)return c}}(r,o))return t();!function(e,t,n,r){var o=document.createElement("link");o.rel="stylesheet",o.type="text/css",o.onerror=o.onload=function(a){if(o.onerror=o.onload=null,"load"===a.type)n();else{var c=a&&("load"===a.type?"missing":a.type),s=a&&a.target&&a.target.href||t,i=new Error("Loading CSS chunk "+e+" failed.\n("+s+")");i.code="CSS_CHUNK_LOAD_FAILED",i.type=c,i.request=s,o.parentNode.removeChild(o),r(i)}},o.href=t,document.head.appendChild(o)}(e,o,t,n)}))},o={658:0},s.f.miniCss=function(e,t){o[e]?t.push(o[e]):0!==o[e]&&{532:1}[e]&&t.push(o[e]=r(e).then((function(){o[e]=0}),(function(t){throw delete o[e],t})))},function(){var e={658:0};s.f.j=function(t,n){var r=s.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else if(/^(532|658)$/.test(t))e[t]=0;else{var o=new Promise((function(n,o){r=e[t]=[n,o]}));n.push(r[2]=o);var a=s.p+s.u(t),c=new Error;s.l(a,(function(n){if(s.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var o=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src;c.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",c.name="ChunkLoadError",c.type=o,c.request=a,r[1](c)}}),"chunk-"+t,t)}},s.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,o,a=n[0],c=n[1],i=n[2],f=0;if(a.some((function(t){return 0!==e[t]}))){for(r in c)s.o(c,r)&&(s.m[r]=c[r]);if(i)var u=i(s)}for(t&&t(n);f<a.length;f++)o=a[f],s.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return s.O(u)},n=self.webpackChunkpurify_website=self.webpackChunkpurify_website||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}()}();
//# sourceMappingURL=webpack-runtime-e20622b5de149c4e6f5b.js.map
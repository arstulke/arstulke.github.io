if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return a[e]||(s=new Promise((async s=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]}))},s=(s,a)=>{Promise.all(s.map(e)).then((e=>a(1===e.length?e[0]:e)))},a={require:Promise.resolve(s)};self.define=(s,r,c)=>{a[s]||(a[s]=Promise.resolve().then((()=>{let a={};const i={uri:location.origin+s.slice(1)};return Promise.all(r.map((s=>{switch(s){case"exports":return a;case"module":return i;default:return e(s)}}))).then((e=>{const s=c(...e);return a.default||(a.default=s),a}))})))}}define("./sw.js",["./workbox-cf684d81"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/apple-touch-icon.f48feca8.png",revision:"ea8e48605f7e65acbccfd5614c95a79a"},{url:"assets/favicon-16x16.d373269a.png",revision:"b91c2b3c213876a9e0660531c5af05c7"},{url:"assets/favicon-32x32.8a0e8500.png",revision:"901432c31f92071f92e154d395fcb649"},{url:"assets/mstile-150x150.df8c49be.png",revision:"b62e00145254e4f6967c3bffe600d787"},{url:"assets/mstile-310x150.cb73d1f6.png",revision:"c5ad67f2ecbc0d203871c8f3c1966cba"},{url:"assets/mstile-310x310.8ac46cfb.png",revision:"fc47a9fe5dc9adbb293f1deae1e3eb72"},{url:"assets/mstile-70x70.64abba2a.png",revision:"9ce06a502a44be55d33e9447dbeeedc2"},{url:"assets/virtual-background-icon-144x144.0b89f3a0.webp",revision:"7f969cad0e41b96f523fa73da2b3e65f"},{url:"assets/virtual-background-icon-144x144.e0023511.png",revision:"8c73f87d5f1f4bb32133fac92d5d53aa"},{url:"assets/virtual-background-icon-192x192.cb225a58.png",revision:"89151ca09f109ef783ca3b6b1446fbee"},{url:"assets/virtual-background-icon-192x192.d3e677a9.webp",revision:"5839aafa26087f9b7e1de23452a91d0b"},{url:"assets/virtual-background-icon-384x384.0a32ee2a.webp",revision:"4609b927a6ed1464aa622c62e4fd54fb"},{url:"assets/virtual-background-icon-384x384.32ce311b.png",revision:"416aa68445e1ae5de77ad814315dfd2d"},{url:"assets/virtual-background-icon-512x512.80280470.webp",revision:"2332c8ffcca98cb662e67b2b3fcf663f"},{url:"assets/virtual-background-icon-512x512.f2359c16.png",revision:"5d1aaa15652aec5552e4564623861c63"},{url:"browserconfig.xml",revision:"b43b43a921821d17a9afb3cd7136f7b8"},{url:"demo.80296ee6.js",revision:"ed499232aae511465738ad99aaa69913"},{url:"index.html",revision:"9e39cc5839b07f9e796c37e3c3993f0a"},{url:"manifest.webmanifest",revision:"3d64cc08889db0367099d4c2c2bd7c42"}],{})}));
//# sourceMappingURL=sw.js.map
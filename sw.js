if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,c)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let r={};const a=e=>i(e,o),t={module:{uri:o},exports:r,require:a};s[o]=Promise.all(n.map((e=>t[e]||a(e)))).then((e=>(c(...e),r)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-L-BztczD.css",revision:null},{url:"assets/index-ZbJk96l6.js",revision:null},{url:"index.html",revision:"a8ccaef8c3b65088672f04b23675585a"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/pwa-192x192.png",revision:"8307c4e6b2322a1c0e52c39c8fb8a549"},{url:"assets/config-example.json",revision:"8df9287baf46808c085b32a246bacac1"},{url:"assets/config-matches.json",revision:"04d68cda3177c866992899382a0eacf7"},{url:"assets/config-pits.json",revision:"8cbb4e04edfa3d610d67ea5b550c4b56"},{url:"assets/configurations.txt",revision:"c3be00f86c2fb2e9aa54cb4c9134817f"},{url:"assets/demo.png",revision:"9054c01f1665aa58fea29cf8c6ee0f87"},{url:"assets/field.png",revision:"5ae51c9a7c47d574c96120c651d6e7bf"},{url:"assets/gemslogo.png",revision:"498b8054e39c788b4239b1e6cde64490"},{url:"assets/logo.png",revision:"73b6e660379b0ee2e6dc3a077ddebcd1"},{url:"icons/apple-touch-icon.png",revision:"7161f293d5c04db1afa0b71b6af7ef19"},{url:"icons/mask-icon.svg",revision:"fcb7663a6682083519f8672db8b115c6"},{url:"icons/pwa-512x512.png",revision:"a9267f3446fb838db215f06af22bc23e"},{url:"manifest.webmanifest",revision:"0dc883e6657f1627db16a2bdbb618903"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

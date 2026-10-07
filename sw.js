const C="maschen-4.0";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const same=new URL(r.url).origin===location.origin;
  const store=res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res};
  // Eigene Dateien: erst Netz (damit Updates ankommen), sonst Cache. Externes (Schriften, OCR): erst Cache.
  e.respondWith(same
    ?fetch(r).then(store).catch(()=>caches.match(r))
    :caches.match(r).then(h=>h||fetch(r).then(store)));
});

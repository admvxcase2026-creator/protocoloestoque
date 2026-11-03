/* Service worker do Protocolo de Saída.
   Regra: nunca servir versão velha. Páginas e arquivos do próprio site vêm SEMPRE da rede
   (o cache só entra se estiver sem internet). Chamadas ao Supabase e a qualquer outro
   domínio não passam por aqui. Trocar o número abaixo força todo mundo a atualizar. */
var VERSAO = 'saida-2026-11-03a';

self.addEventListener('install', function (e) { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (nomes) { return Promise.all(nomes.filter(function (n) { return n !== VERSAO; }).map(function (n) { return caches.delete(n); })); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;      // Supabase, CDN etc: direto, sem cache
  e.respondWith(
    fetch(req, { cache: 'no-store' })
      .then(function (res) {
        if (res && res.ok) { var copia = res.clone(); caches.open(VERSAO).then(function (c) { c.put(req, copia); }); }
        return res;
      })
      .catch(function () { return caches.match(req); })
  );
});

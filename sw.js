// ATENÇÃO: Mude 'v2' para 'v3', 'v4', etc., toda vez que você fizer QUALQUER ALTERAÇÃO na lista de arquivos 'urlsToCache'
const CACHE_NAME = 'sacristia-cache-v2'; 

// 1. ARQUIVOS LOCAIS (Essenciais para o funcionamento base)
const localUrlsToCache = [
    '/aparoquia/',                  // A URL raiz do seu app
    '/aparoquia/index.html',       // O arquivo HTML principal
    '/aparoquia/manifest.json',    // O manifesto
];

// 2. ARQUIVOS EXTERNOS (CDNs - Cruciais para o visual e ícone)
const externalUrlsToCache = [
    // O Tailwind CSS que dá o estilo
    'https://cdn.tailwindcss.com', 
    // O ícone que está no Flaticon, conforme seu manifest.json
    'https://cdn-icons-png.flaticon.com/512/12114/12114233.png'
];

// JUNTA TUDO
const urlsToCache = [...localUrlsToCache, ...externalUrlsToCache];


// ----------------------------------------------------------------------
// --- 1. EVENTO INSTALL (O Serviço de Cacheamento Inicia) ---
// ----------------------------------------------------------------------
self.addEventListener('install', (event) => {
    // Garante que o Service Worker não termine até que TODOS os arquivos estejam salvos no cache.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto (v2): Salvando todos os arquivos essenciais e externos...');
                // Adiciona todos os arquivos à lista de cache
                return cache.addAll(urlsToCache);
            })
            // Força a ativação imediatamente para começar a funcionar
            .then(() => self.skipWaiting())
            .catch(error => {
                // Se um CDN (como o Flaticon) falhar ao ser cacheado, 
                // o log de erro irá mostrar, mas o restante dos arquivos locais será salvo.
                console.error('Falha ao cachear um ou mais recursos:', error);
            })
    );
});


// ----------------------------------------------------------------------
// --- 2. EVENTO ACTIVATE (O Serviço de Limpeza de Versões Antigas) ---
// ----------------------------------------------------------------------
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; 
    
    event.waitUntil(
        // Pega todos os nomes de cache que já existem no navegador
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Se o nome do cache NÃO for o atual (v2), ele é deletado
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Permite que o Service Worker comece a interceptar as requisições imediatamente
    return self.clients.claim();
});

// ----------------------------------------------------------------------
// --- 3. EVENTO FETCH (A Estratégia "Primeiro o Depósito") ---
// ----------------------------------------------------------------------
// Intercepta todas as requisições que o app faz.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // 1. Tenta encontrar o arquivo no cache (depósito)
        caches.match(event.request)
            .then((response) => {
                // Se achou (response), retorna o que está no cache (RÁPIDO e OFFLINE!)
                if (response) {
                    console.log('Servindo do Cache:', event.request.url);
                    return response;
                }
                
                // 2. Se não achou, faz a busca na rede (LENTO e ONLINE)
                return fetch(event.request).catch(() => {
                    // Aqui você poderia colocar uma página 'Sem Internet' se a busca falhar,
                    // mas para a Sacristia, vamos confiar no Cache-First para as URLs críticas.
                });
            })
    );
});

// ATENÇÃO: Mude 'v2' para 'v3' se precisar forçar uma nova atualização após esta.
const CACHE_NAME = 'sacristia-cache-v2'; 

// 1. ARQUIVOS LOCAIS (Essenciais para o funcionamento base)
const localUrlsToCache = [
    '/aparoquia/',                  // URL raiz
    '/aparoquia/index.html',       // Página principal
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
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto (v2): Salvando todos os arquivos essenciais e externos...');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
            .catch(error => {
                console.error('Falha ao cachear um ou mais recursos. Tentando continuar:', error);
            })
    );
});


// ----------------------------------------------------------------------
// --- 2. EVENTO ACTIVATE (O Serviço de Limpeza de Versões Antigas) ---
// ----------------------------------------------------------------------
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; 
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// ----------------------------------------------------------------------
// --- 3. EVENTO FETCH (A Estratégia "Primeiro o Depósito") ---
// ----------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Servindo do Cache:', event.request.url);
                    return response;
                }
                
                return fetch(event.request).catch(() => {
                    // Se falhar na rede, e for um documento HTML, 
                    // você pode retornar uma página offline fallback.
                    // Para simplicidade, vamos deixar assim.
                });
            })
    );
});

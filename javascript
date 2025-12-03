const CACHE_NAME = 'sacristia-cache-v1'; // Nome e Versão do Cache
// Lista de arquivos CRÍTICOS para o funcionamento offline
const urlsToCache = [
    '/aparoquia/',             // A URL raiz (home page)
    '/aparoquia/index.html',  // O arquivo principal
    '/aparoquia/manifest.json', // O arquivo de manifesto
    // Se você tiver um arquivo de script ou estilo externo (ex: 'main.js'), adicione aqui!
    // Exemplo: '/aparoquia/javascript/meu_script.js'
    // Como seu JS principal está no index, não precisamos adicioná-lo separadamente.
];

// --- 1. ETAPA DE INSTALAÇÃO (Caching dos arquivos) ---
self.addEventListener('install', (event) => {
    // Força a espera até que o cache seja aberto e todos os arquivos sejam adicionados
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto com sucesso. Arquivos essenciais pré-caching...');
                // Adiciona todos os arquivos essenciais à lista de cache
                return cache.addAll(urlsToCache);
            })
    );
});

// --- 2. ETAPA DE ATIVAÇÃO (Limpeza de caches antigos) ---
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Apenas a versão atual do cache é permitida
    
    // Deleta versões antigas de cache para economizar espaço
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
});

// --- 3. ETAPA DE FETCH (Estratégia Cache-First para navegação offline) ---
self.addEventListener('fetch', (event) => {
    // Intercepta a requisição e usa a estratégia Cache-First
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Se o recurso estiver no cache, retorna-o imediatamente
                if (response) {
                    return response;
                }
                
                // Se não estiver no cache, tenta buscar na rede
                return fetch(event.request).catch(() => {
                    // Se falhar na rede, e for um arquivo crítico, você pode retornar uma "página offline" aqui.
                    // Para o caso da Sacristia, vamos apenas deixar falhar se não estiver no cache.
                });
            })
    );
});

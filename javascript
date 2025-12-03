// --- VARIÁVEL GLOBAL PARA O POP-UP ---
let deferredPrompt; 
let installButtonVisible = false; // Flag para controlar a exibição

// --- LÓGICA DO INSTALL PROMPT ---

// 1. Captura o evento do navegador que permite a instalação
window.addEventListener('beforeinstallprompt', (e) => {
    // Evita que o navegador mostre o prompt padrão imediatamente
    e.preventDefault(); 
    
    // Armazena o evento
    deferredPrompt = e;
    
    // Mostra o botão ou pop-up customizado (se não foi mostrado antes)
    if (!installButtonVisible) {
        showCustomInstallPrompt();
        installButtonVisible = true;
    }
});

// 2. Função para mostrar o botão/pop-up customizado (VOCÊ PRECISA ADICIONAR O HTML!)
function showCustomInstallPrompt() {
    // AQUI VOCÊ PODE INJETAR UM PEQUENO BANNER/POP-UP NO SEU HTML 
    // Por exemplo:
    const appContainer = document.getElementById('app-container');
    const bannerHtml = `
        <div id="install-banner" class="bg-priest-blue p-3 text-center rounded-lg mb-4 flex items-center justify-between shadow-lg">
            <span class="font-semibold text-gray-900">🔔 Instale a Sacristia como App!</span>
            <button onclick="installPWA()" class="bg-highlight-gold hover:bg-yellow-500 text-gray-900 font-bold py-1 px-3 rounded-full text-sm transition duration-200">
                Instalar
            </button>
        </div>
    `;
    if (appContainer) {
        appContainer.insertAdjacentHTML('beforebegin', bannerHtml);
    }
}

// 3. Função chamada pelo seu botão customizado para disparar a instalação
function installPWA() {
    if (deferredPrompt) {
        // Dispara o pop-up NATIVO (o que você tirou a primeira foto)
        deferredPrompt.prompt(); 
        
        // Monitora a escolha do usuário
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Instalação aceita!');
            } else {
                console.log('Instalação recusada.');
            }
            // Remove o banner/botão após a tentativa
            const banner = document.getElementById('install-banner');
            if (banner) banner.remove();
            deferredPrompt = null;
        });
    }
}
let deferredPrompt;

// 1. O Chrome dispara este evento quando o site está pronto para ser PWA
window.addEventListener('beforeinstallprompt', (e) => {
    // Evita que o pop-up padrão do Chrome apareça automaticamente
    e.preventDefault(); 
    
    // 2. Armazena o evento para usá-lo depois
    deferredPrompt = e;
    
    // 3. Torna o seu botão/pop-up de instalação visível na página
    showInstallPromotion(); // Função que você criará para mostrar seu pop-up
});

function showInstallPromotion() {
    // Lógica para mostrar sua caixa de diálogo customizada
    // Ex: document.getElementById('meu-popup-pwa').style.display = 'block';
}

// 4. Esta função é chamada quando o usuário clica no seu botão "Instalar"
function installPWA() {
    if (deferredPrompt) {
        // Dispara o pop-up nativo (aquele que você tirou print!)
        deferredPrompt.prompt(); 
        
        // Esconde sua caixa de diálogo
        hideInstallPromotion(); 
        
        // Monitora a escolha do usuário
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log(choiceResult.outcome); // 'accepted' ou 'dismissed'
            deferredPrompt = null; // Zera a variável para não mostrar de novo
        });
    }
}
// Você pode, por exemplo, anexar 'installPWA()' ao evento de clique do seu botão de instalação.

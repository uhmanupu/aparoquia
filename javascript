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

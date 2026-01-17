document.addEventListener('DOMContentLoaded', function() {
    // Konfiguracja Supabase - zgodna z script.js
    const SUPABASE_CONFIG = {
        URL: 'https://hgksfqrgfwvrsubwdrnl.supabase.co',
        KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhna3NmcXJnZnd2cnN1Yndkcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMjQzNTcsImV4cCI6MjA4MjcwMDM1N30.2C3QT0V79MsHDZwMLIorQYw81nJ-uq6WS5MD1EQ3cwM'
    };

    let supabase = null;
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.KEY);
    } else {
        console.error('Brak biblioteki Supabase');
        return;
    }

    // Elementy DOM
    const authDiscordBtn = document.getElementById('auth-discord-btn');

    // Logowanie przez Discord
    authDiscordBtn.addEventListener('click', async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'discord',
                options: {
                    redirectTo: window.location.origin + '/bubify.html'
                }
            });
            if (error) throw error;
        } catch (e) {
            showToast('Błąd Discord: ' + e.message);
        }
    });

    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return alert(message);
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        
        // Wymuś reflow
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
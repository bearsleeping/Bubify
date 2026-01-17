document.addEventListener('DOMContentLoaded', function() {
    // --- Poprawka na wysokość 100vh na urządzeniach mobilnych (np. iOS Safari) ---
    function setViewportHeight() {
        // Obliczamy 1% wysokości okna przeglądarki i ustawiamy jako zmienną CSS
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    // Uruchom funkcję na starcie
    setViewportHeight();
    // Uruchom funkcję przy zmianie rozmiaru okna (np. obrót ekranu)
    window.addEventListener('resize', setViewportHeight);

    // --- Wykrywanie iOS i ukrywanie suwaka głośności ---
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        document.body.classList.add('is-ios');
    }

    const playBtn = document.getElementById('play-btn');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const songListEl = document.getElementById('song-list');
    const queueBtn = document.querySelector('.queue-btn');
    const body = document.body;
    const volumeSlider = document.getElementById('volume-slider');
    const albumCover = document.querySelector('.album-cover');
    const progressBar = document.querySelector('.progress-bar');
    const repeatBtn = document.getElementById('repeat-btn');
    const iconRepeatAll = repeatBtn.querySelector('.icon-repeat-all');
    const iconRepeatOne = repeatBtn.querySelector('.icon-repeat-one');
    const playlistTitleEl = document.querySelector('.playlist-title');
    const managePlaylistsBtn = document.querySelector('.manage-playlists-btn');
    const playlistManagerView = document.querySelector('.playlist-manager-view');
    const closePlaylistManagerBtn = document.querySelector('.close-playlist-manager-btn');
    const playlistManagerList = document.getElementById('playlist-manager-list');
    const createPlaylistBtn = document.querySelector('.create-playlist-btn');
    const addToPlaylistView = document.querySelector('.add-to-playlist-view');
    const closeAddToPlaylistBtn = document.querySelector('.close-add-to-playlist-btn');
    const addToPlaylistList = document.getElementById('add-to-playlist-list');
    const addToPlaylistTitle = document.getElementById('add-to-playlist-title');
    const favoritePlayerBtn = document.getElementById('favorite-player-btn');
    const searchInput = document.getElementById('search-input');
    const playlistCoverInput = document.getElementById('playlist-cover-input');
    const playlistCoverOverlay = document.getElementById('playlist-cover-overlay');
    const playlistCoverImg = document.getElementById('playlist-cover-img');
    const editPlaylistBtn = document.getElementById('edit-playlist-btn');
    const editPlaylistModal = document.getElementById('edit-playlist-modal');
    const editModalNameInput = document.getElementById('edit-modal-name-input');
    const editModalCoverImg = document.getElementById('edit-modal-cover-img');
    const editModalFileInput = document.getElementById('edit-modal-file-input');
    const editModalCoverWrapper = document.getElementById('edit-modal-cover-wrapper');
    const editModalCancelBtn = document.getElementById('edit-modal-cancel-btn');
    const editModalSaveBtn = document.getElementById('edit-modal-save-btn');
    
    const authView = document.getElementById('auth-view');
    const authUsernameInput = document.getElementById('auth-username');
    const authEmailInput = document.getElementById('auth-email');
    const authPasswordInput = document.getElementById('auth-password');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authDiscordBtn = document.getElementById('auth-discord-btn');
    const authTitle = document.getElementById('auth-title');
    const authSwitchBtn = document.getElementById('auth-switch-btn');
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userProfileName = document.getElementById('user-profile-name');
    const userDropdown = document.getElementById('user-dropdown');
    const userDropdownAccount = document.getElementById('user-dropdown-account');
    const userDropdownTheme = document.getElementById('user-dropdown-theme');
    const userDropdownLogout = document.getElementById('user-dropdown-logout');
    const notificationSound = document.getElementById('notification-sound');

    // Dodanie przycisku Admina do dropdownu
    const adminDropdownItem = document.createElement('div');
    adminDropdownItem.className = 'user-dropdown-item';
    adminDropdownItem.id = 'user-dropdown-admin';
    adminDropdownItem.style.display = 'none';
    adminDropdownItem.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        Panel Administratora
    `;
    // Wstaw przed wylogowaniem
    userDropdown.insertBefore(adminDropdownItem, userDropdown.querySelector('.user-dropdown-separator'));
    
    const accountSettingsModal = document.getElementById('account-settings-modal');
    const accountAvatarWrapper = document.getElementById('account-avatar-wrapper');
    const accountAvatarImg = document.getElementById('account-avatar-img');
    const accountAvatarInput = document.getElementById('account-avatar-input');
    const accountUsernameDisplay = document.getElementById('account-username-display');
    const accountBioInput = document.getElementById('account-bio-input');
    const statPlays = document.getElementById('stat-plays');
    const statPlaylists = document.getElementById('stat-playlists');
    const statJoined = document.getElementById('stat-joined');
    const accountOldPassword = document.getElementById('account-old-password');
    const accountNewPassword = document.getElementById('account-new-password');
    const accountModalCancelBtn = document.getElementById('account-modal-cancel-btn');
    const accountModalSaveBtn = document.getElementById('account-modal-save-btn');
    const sbTestBtn = document.getElementById('sb-test-btn');
    
    // Admin Dashboard Elements
    const adminView = document.getElementById('admin-view');
    const closeAdminViewBtn = document.getElementById('close-admin-view-btn');
    const adminNavItems = document.querySelectorAll('.admin-nav-item');
    const adminSections = document.querySelectorAll('.admin-section');
    const adminUsersTableBody = document.getElementById('admin-users-table-body');
    const adminDashAddBtn = document.getElementById('admin-dash-add-btn');
    const adminDashNewUser = document.getElementById('admin-dash-new-user');
    const adminDashNewPass = document.getElementById('admin-dash-new-pass');
    const adminDashLogs = document.getElementById('admin-dash-logs');
    const adminStatsTableBody = document.getElementById('admin-stats-table-body');
    const adminExitBtn = document.getElementById('admin-exit-btn');
    const adminActivityChartCanvas = document.getElementById('admin-activity-chart');
    const adminArtistChartCanvas = document.getElementById('admin-artist-chart');
    const adminStatsFilter = document.getElementById('admin-stats-filter');
    const githubUploadBtn = document.getElementById('github-upload-btn');
    
    // --- View Switching Logic ---
    const navItems = document.querySelectorAll('.main-nav-item');
    const views = {
        'music-view': document.getElementById('music-view'),
        'kino-view': document.getElementById('kino-view'),
        'chat-view': document.getElementById('chat-view')
    };

    // Zmienna do przechowywania subskrypcji czatu
    let chatSubscription = null;
    let userSubscription = null;
    let isChatLoaded = false;
    let activeChatId = 'global_chat';
    let friendsList = [];
    let friendRequests = [];
    let blockedUsers = [];
    let heartbeatInterval = null;
    let statusCheckInterval = null;
    let typingTimeout = null;
    let isTyping = false;
    let globalPresenceChannel = null;
    let chatPollingInterval = null;
    let rawChatMessages = []; // Przechowuje zaszyfrowane wiadomości do porównywania

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update Nav State
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch View
            const targetId = item.dataset.view;
            Object.values(views).forEach(view => {
                if (view) view.classList.remove('active');
            });
            if (views[targetId]) views[targetId].classList.add('active');

            if (targetId !== 'chat-view') {
                if (chatPollingInterval) clearInterval(chatPollingInterval);
            }

            // Load Chat if selected
            if (targetId === 'chat-view' && !isChatLoaded) {
                initChatView();
            }

            // Dostosuj nagłówek tylko dla widoku czatu
            if (targetId === 'chat-view') {
                document.body.classList.add('view-chat-active');
            } else {
                document.body.classList.remove('view-chat-active');
            }

            // Ukryj odtwarzacz w widokach Kino i Chat
            if (targetId === 'kino-view' || targetId === 'chat-view') {
                document.body.classList.add('player-hidden');
            } else {
                document.body.classList.remove('player-hidden');
            }

            // Mobile: Close sidebar
            if (document.body.classList.contains('playlist-manager-open')) {
                document.body.classList.remove('playlist-manager-open');
            }
        });
    });

    const SUPABASE_CONFIG = {
        URL: 'https://hgksfqrgfwvrsubwdrnl.supabase.co', // Twój URL jest poprawny
        KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhna3NmcXJnZnd2cnN1Yndkcm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMjQzNTcsImV4cCI6MjA4MjcwMDM1N30.2C3QT0V79MsHDZwMLIorQYw81nJ-uq6WS5MD1EQ3cwM' // WAŻNE: Wklej tutaj klucz `anon public`
    };

    // Inicjalizacja klienta Supabase
    let supabase = null;
    if (window.supabase && SUPABASE_CONFIG.URL.startsWith('http')) {
        supabase = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.KEY);
    }

    // Funkcja pobierająca dane z Supabase (Logowanie / Start)
    async function syncDown(specificUser = null) {
        if (!supabase) {
            console.log('Brak konfiguracji Supabase - działam offline.');
            return false;
        }

        try {
            // 1. Pobierz listę użytkowników (globalną)
            const { data: usersData } = await supabase
                .from('bubify_data')
                .select('content')
                .eq('id', 'global_users')
                .single();

            if (usersData && usersData.content) {
                localStorage.setItem('bubify_users', JSON.stringify(usersData.content));
            }

            // 2. Jeśli podano użytkownika, pobierz jego prywatne dane
            if (specificUser) {
                const { data: userData } = await supabase
                    .from('bubify_data')
                    .select('content')
                    .eq('id', `user_${specificUser}`)
                    .single();

                if (userData && userData.content) {
                    // Uzupełnij friendsList i friendRequests z pobranych danych
                    friendsList = userData.content.friends || [];
                    friendRequests = userData.content.friendRequests || [];
                    blockedUsers = userData.content.blockedUsers || [];

                    Object.keys(userData.content).forEach(key => {
                        if (typeof userData.content[key] === 'string') {
                            localStorage.setItem(key, userData.content[key]);
                        }
                    });
                }
            }

            console.log('Pobrano dane z Supabase');
            return true;
        } catch (e) {
            console.error('Błąd synchronizacji z Supabase (Down):', e);
            showToast('Błąd połączenia z bazą danych.');
            return false;
        }
    }

    // Funkcja wysyłająca dane do Supabase (Zapis)
    async function syncUp() {
        if (!supabase) {
            console.error("Brak konfiguracji Supabase.");
            return false;
        }
        
        try {
            // 1. Zapisz listę użytkowników (globalną)
            const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            const { error: usersError } = await supabase
                .from('bubify_data')
                .upsert({ id: 'global_users', content: users });
            
            if (usersError) throw usersError;

            // 2. Jeśli użytkownik jest zalogowany, zapisz jego prywatne dane
            if (currentUser) {
                const userData = {};
                const prefix = `${currentUser}_`;
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith(prefix)) {
                        userData[key] = localStorage.getItem(key);
                    }
                }
                
                // Dołącz dane społecznościowe i status do synchronizacji
                userData.friends = friendsList;
                userData.friendRequests = friendRequests;
                userData.blockedUsers = blockedUsers;
                userData.lastSeen = Date.now();

                const { error: userError } = await supabase
                    .from('bubify_data')
                    .upsert({ id: `user_${currentUser}`, content: userData });
                
                if (userError) throw userError;
            }

            console.log('Wysłano dane do Supabase');
            return true;
        } catch (e) {
            console.error('Błąd synchronizacji z Supabase (Up):', e);
            return false;
        }
    }

    let isPlaying = false;
    let currentSongIndex = 0;
    const audio = new Audio();
    let currentRotation = 0;
    let animationFrameId = null;
    let repeatMode = 0; // 0: none, 1: all, 2: one
    let songForAction = null; // Przechowuje utwór do operacji (dodaj/usuń)
    let currentUser = null; // Aktualnie zalogowany użytkownik
    let tempAvatarDataUrl = null;
    let adminChartInstance = null;
    let adminArtistChartInstance = null;

    // --- Toast Notification System ---
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        // Wymuś przeliczenie stylów (reflow) dla animacji
        void toast.offsetWidth;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) container.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // --- Nowa struktura danych dla playlist ---
    let allSongs = []; // Główna lista wszystkich obiektów piosenek
    let playlists = {}; // { "nazwa": [url1, url2], ... }
    let playlistMetadata = {}; // { "nazwa": { cover: "base64..." } }
    let activePlaylistName = 'Wszystkie utwory';
    let songs = []; // Widok piosenek dla aktywnej playlisty

    // --- System Logowania (Local Storage) ---
    
    // Inicjalizacja domyślnego konta Administratora
    const initUsers = JSON.parse(localStorage.getItem('bubify_users') || '{}');
    // Usuwamy lokalne konto Admin, jeśli ma domyślne hasło, aby wymusić pobranie właściwego z Supabase
    if (initUsers['Admin'] && initUsers['Admin'].password === 'rabarbar') {
        delete initUsers['Admin'];
        localStorage.setItem('bubify_users', JSON.stringify(initUsers));
    }

    function getStorageKey(key) {
        if (!currentUser) return key; // Fallback
        return `${currentUser}_${key}`;
    }

    async function checkLogin(explicitSession = null) {
        let sessionFound = false;
        let session = explicitSession;

        if (supabase && !session) {
            const { data } = await supabase.auth.getSession();
            session = data.session;
        }

        if (session && session.user) {
            sessionFound = true;
            
            // 1. Pobierz aktualną bazę użytkowników, aby sprawdzić powiązania
            await syncDown(null);
            let users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            
            let username = null;
            const email = session.user.email;
            
            // 2. Spróbuj znaleźć użytkownika po emailu (dla Discorda i logowania mailem)
            if (email) {
                const foundKey = Object.keys(users).find(k => users[k].email && users[k].email.toLowerCase() === email.toLowerCase());
                if (foundKey) username = foundKey;
            }

            // 3. Jeśli nie znaleziono (np. pierwszy raz przez Discord), utwórz konto
            if (!username) {
                // Pobierz nazwę z metadanych Discorda lub emaila
                let candidateName = session.user.user_metadata.full_name || 
                                  session.user.user_metadata.name || 
                                  (email ? email.split('@')[0] : 'Użytkownik');
                
                candidateName = candidateName.trim();

                // Sprawdź unikalność nazwy, jeśli zajęta - dodaj losowy numer
                if (users[candidateName]) {
                    candidateName = `${candidateName}_${Math.floor(Math.random() * 1000)}`;
                }
                
                username = candidateName;
                
                // Utwórz nowy profil
                users[username] = {
                    email: email,
                    joinDate: new Date().toLocaleDateString(),
                    plays: 0,
                    bio: '',
                    avatar: session.user.user_metadata.avatar_url || null // Pobierz awatar z Discorda
                };
                
                localStorage.setItem('bubify_users', JSON.stringify(users));
                await syncUp(); // Zapisz w bazie globalnej
                showToast(`Utworzono nowe konto: ${username}`);
            } else {
                // Aktualizuj awatar jeśli logowanie przez Discord i brak awatara lokalnie
                if (session.user.app_metadata.provider === 'discord' && session.user.user_metadata.avatar_url) {
                    if (users[username].avatar !== session.user.user_metadata.avatar_url) {
                        users[username].avatar = session.user.user_metadata.avatar_url;
                        localStorage.setItem('bubify_users', JSON.stringify(users));
                        await syncUp();
                    }
                }
            }

            await loginUser(username);
        }

        if (!sessionFound) {
            authView.classList.remove('hidden');
            localStorage.removeItem('bubify_current_user');
        }
    }

    /* STARA WERSJA checkLogin (usunięta przez diff powyżej)
    async function checkLogin() {
        let sessionFound = false;
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user) {
                sessionFound = true;
                
                // 1. Pobierz aktualną bazę użytkowników, aby sprawdzić powiązania
                await syncDown(null);
                let users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
                
                let username = null;
                const email = session.user.email;
                
                // 2. Spróbuj znaleźć użytkownika po emailu (dla Discorda i logowania mailem)
                if (email) {
                    const foundKey = Object.keys(users).find(k => users[k].email && users[k].email.toLowerCase() === email.toLowerCase());
                    if (foundKey) username = foundKey;
                }

                // 3. Jeśli nie znaleziono (np. pierwszy raz przez Discord), utwórz konto
                if (!username) {
                    // Pobierz nazwę z metadanych Discorda lub emaila
                    let candidateName = session.user.user_metadata.full_name || 
                                      session.user.user_metadata.name || 
                                      (email ? email.split('@')[0] : 'Użytkownik');
                    
                    candidateName = candidateName.trim();

                    // Sprawdź unikalność nazwy, jeśli zajęta - dodaj losowy numer
                    if (users[candidateName]) {
                        candidateName = `${candidateName}_${Math.floor(Math.random() * 1000)}`;
                    }
                    
                    username = candidateName;
                    
                    // Utwórz nowy profil
                    users[username] = {
                        email: email,
                        joinDate: new Date().toLocaleDateString(),
                        plays: 0,
                        bio: '',
                        avatar: session.user.user_metadata.avatar_url || null // Pobierz awatar z Discorda
                    };
                    
                    localStorage.setItem('bubify_users', JSON.stringify(users));
                    await syncUp(); // Zapisz w bazie globalnej
                    showToast(`Utworzono nowe konto: ${username}`);
                } else {
                    // Aktualizuj awatar jeśli logowanie przez Discord i brak awatara lokalnie
                    if (session.user.app_metadata.provider === 'discord' && session.user.user_metadata.avatar_url) {
                        if (users[username].avatar !== session.user.user_metadata.avatar_url) {
                            users[username].avatar = session.user.user_metadata.avatar_url;
                            localStorage.setItem('bubify_users', JSON.stringify(users));
                            await syncUp();
                        }
                    }
                }

                await loginUser(username);
            }
        }

        if (!sessionFound) {
            authView.classList.remove('hidden');
            localStorage.removeItem('bubify_current_user');
        }
    }
    */

    async function loginUser(username) {
        currentUser = username;
        localStorage.setItem('bubify_current_user', username);
        userProfileName.textContent = username;
        authView.classList.add('hidden');

        // Pokaż przycisk admina jeśli to admin
        const userRole = localStorage.getItem('bubify_user_role');
        if (username === 'Administrator' || userRole === 'admin') {
            adminDropdownItem.style.display = 'flex';
        }

        let syncSuccess = false;
        // Pobierz dane użytkownika z serwera
        if (supabase) {
            showToast('Synchronizacja profilu...');
            syncSuccess = await syncDown(username);
        }

        // Załaduj awatar użytkownika
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        if (users[username] && users[username].avatar) {
            // Aktualizacja ikony w headerze (mała sztuczka - podmieniamy SVG na IMG jeśli jest awatar)
            updateHeaderAvatar(users[username].avatar);
        } else {
            resetHeaderAvatar();
        }
        
        // Załaduj dane użytkownika
        loadPlaylists();
        applyTheme(localStorage.getItem(getStorageKey('musicPlayerTheme')));
        
        // Inicjalizacja znajomych (dane załadowane w syncDown)
        renderFriendList();
        if (syncSuccess) {
            subscribeToUserUpdates();
            initGlobalPresence();
            startHeartbeat();
        }
        
        // Załaduj głośność użytkownika
        const savedVolume = localStorage.getItem(getStorageKey('bubify_volume'));
        if (savedVolume !== null) {
            const vol = parseFloat(savedVolume);
            audio.volume = vol;
            volumeSlider.value = vol * 100;
            updateVolumeSlider();
        }

        // Załaduj tryb powtarzania
        const savedRepeat = localStorage.getItem(getStorageKey('bubify_repeat'));
        if (savedRepeat !== null) {
            repeatMode = parseInt(savedRepeat);
            updateRepeatUI();
        }
        
        // Pobierz utwory (jeśli jeszcze nie pobrane) i odśwież widok
        if (allSongs.length === 0) {
            fetchSongs();
        } else {
            // Jeśli utwory już są, tylko odśwież playlisty
            const lastActivePlaylist = localStorage.getItem(getStorageKey('bubify_lastActivePlaylist')) || 'Wszystkie utwory';
            setActivePlaylist(playlists[lastActivePlaylist] ? lastActivePlaylist : 'Wszystkie utwory');
        }
    }

    function updateHeaderAvatar(src) {
        const profileBtn = document.getElementById('user-profile-btn');
        // Usuń istniejące SVG jeśli jest
        const existingSvg = profileBtn.querySelector('svg');
        const existingImg = profileBtn.querySelector('img');
        
        if (existingSvg) existingSvg.remove();
        if (existingImg) existingImg.remove();

        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = "width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-right: 5px;";
        profileBtn.insertBefore(img, profileBtn.firstChild);
    }

    function resetHeaderAvatar() {
        const profileBtn = document.getElementById('user-profile-btn');
        const existingImg = profileBtn.querySelector('img');
        if (existingImg) existingImg.remove();
        
        if (!profileBtn.querySelector('svg')) {
            const svgHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
            profileBtn.insertAdjacentHTML('afterbegin', svgHTML);
        }
    }

    async function logoutUser() {
        if (confirm('Czy na pewno chcesz się wylogować?')) {
            if (supabase) {
                await supabase.auth.signOut();
            }
            currentUser = null;
            localStorage.removeItem('bubify_current_user');
            localStorage.removeItem('bubify_user_role');
            stopHeartbeat();
            location.reload(); // Najprostszy sposób na wyczyszczenie stanu aplikacji
        }
    }

    // Zmienna trybu (Logowanie / Rejestracja)
    let isRegisterMode = false;

    if (authSwitchBtn) {
        authSwitchBtn.addEventListener('click', () => {
            isRegisterMode = !isRegisterMode;
            if (isRegisterMode) {
                authTitle.textContent = 'Zarejestruj się';
                authSubmitBtn.textContent = 'Zarejestruj';
                authSwitchBtn.textContent = 'Masz już konto? Zaloguj się';
                if (authEmailInput) authEmailInput.style.display = 'block';
                if (document.getElementById('auth-confirm-info')) document.getElementById('auth-confirm-info').style.display = 'block';
                authUsernameInput.placeholder = 'Nazwa użytkownika';
            } else {
                authTitle.textContent = 'Zaloguj się';
                authSubmitBtn.textContent = 'Zaloguj';
                authSwitchBtn.textContent = 'Nie masz konta? Zarejestruj się';
                if (authEmailInput) authEmailInput.style.display = 'none';
                if (document.getElementById('auth-confirm-info')) document.getElementById('auth-confirm-info').style.display = 'none';
                authUsernameInput.placeholder = 'Nazwa użytkownika lub Email';
            }
        });
    }

    // Obsługa klawisza Enter w formularzu logowania
    const handleAuthEnter = (e) => {
        if (e.key === 'Enter') {
            authSubmitBtn.click();
        }
    };
    authUsernameInput.addEventListener('keypress', handleAuthEnter);
    authPasswordInput.addEventListener('keypress', handleAuthEnter);
    if (authEmailInput) authEmailInput.addEventListener('keypress', handleAuthEnter);

    // Obsługa logowania przez Discord
    if (authDiscordBtn) {
        authDiscordBtn.addEventListener('click', async () => {
            const originalText = authDiscordBtn.innerHTML;
            authDiscordBtn.textContent = 'Łączenie...';
            authDiscordBtn.disabled = true;
            
            if (supabase) {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'discord',
                    options: {
                        redirectTo: window.location.href // Przekieruj z powrotem na tę stronę
                    }
                });
                if (error) {
                    showToast('Błąd logowania Discord: ' + error.message);
                    authDiscordBtn.innerHTML = originalText;
                    authDiscordBtn.disabled = false;
                }
            } else {
                showToast('Błąd konfiguracji Supabase');
                authDiscordBtn.innerHTML = originalText;
                authDiscordBtn.disabled = false;
            }
        });
    }

    authSubmitBtn.addEventListener('click', async () => {
        const username = authUsernameInput.value.trim();
        const password = authPasswordInput.value.trim();
        const email = authEmailInput ? authEmailInput.value.trim() : '';

        if (!username || !password) return showToast('Wypełnij wszystkie pola');

        if (isRegisterMode && !email) {
            return showToast('Podaj adres email');
        }

        const originalText = authSubmitBtn.textContent;
        authSubmitBtn.textContent = 'Przetwarzanie...';
        authSubmitBtn.disabled = true;

        try {
            // 1. Pobierz aktualną listę użytkowników z bazy (JSON store)
            await syncDown(null); // Kluczowe: pobiera mapowanie nazw użytkowników na e-maile
            let users = JSON.parse(localStorage.getItem('bubify_users') || '{}');

            if (isRegisterMode) {
                // --- REJESTRACJA (Supabase Auth + JSON Store) ---
                
                // Sprawdź czy nazwa zajęta w JSON store (case-insensitive)
                const existingUser = Object.keys(users).find(key => key.toLowerCase() === username.toLowerCase());
                if (existingUser) {
                    throw new Error('Nazwa użytkownika jest już zajęta.');
                }

                // Dodatkowe sprawdzenie bezpośrednio w bazie danych (dla pewności)
                if (supabase) {
                    const { data: dbUser } = await supabase
                        .from('bubify_data')
                        .select('id')
                        .eq('id', `user_${username}`)
                        .maybeSingle();

                    if (dbUser) throw new Error('Nazwa użytkownika jest już zajęta (Baza danych).');
                }

                // Sprawdź czy email jest już używany (wstępna weryfikacja lokalna)
                if (Object.values(users).some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
                    throw new Error('Ten adres email jest już powiązany z innym kontem.');
                }

                // Rejestracja w Supabase Auth (tworzy "prawdziwe" konto)
                if (supabase) {
                    const { data, error } = await supabase.auth.signUp({
                        email: email, // Używamy wprowadzonego emaila
                        password: password,
                        options: { 
                            data: { 
                                username: username,
                                full_name: username, // To pole Supabase często traktuje jako "Display Name"
                                display_name: username, // Dodatkowe pole dla pewności
                                role: username === 'Administrator' ? 'admin' : 'user' // Domyślna rola
                            } 
                        }
                    });
                    
                    if (error) {
                        console.warn("Supabase Auth Error:", error);
                        if (error.message.includes('already registered')) {
                            throw new Error('Ten adres email jest już zarejestrowany.');
                        }
                        throw error;
                    }

                    // Rejestracja w Supabase się powiodła, tworzymy profil w naszej bazie
                    users[username] = {
                        email: email,
                        joinDate: new Date().toLocaleDateString(),
                        plays: 0,
                        bio: ''
                    };
                    localStorage.setItem('bubify_users', JSON.stringify(users));
                    await syncUp();

                    if (data.session) { // Sesja istnieje = potwierdzenie email jest wyłączone
                        await loginUser(username);
                        showToast('Zarejestrowano i zalogowano pomyślnie!');
                    } else { // Sesji brak = wymagane potwierdzenie
                        showToast('Rejestracja udana! Sprawdź email, aby potwierdzić konto.');
                        authUsernameInput.value = '';
                        authPasswordInput.value = '';
                        if (authEmailInput) authEmailInput.value = '';
                        if (isRegisterMode) authSwitchBtn.click(); // Przełącz na widok logowania
                    }
                }

            } else {
                // --- LOGOWANIE ---
                let loginSuccess = false;
                let targetUsername = username;

                // 1. Próba logowania przez Supabase Auth
                if (supabase) {
                    // Sprawdź czy wprowadzono email czy nazwę użytkownika
                    let loginEmail = username;
                    if (!username.includes('@')) {
                        // Jeśli brak @, to jest to nazwa użytkownika. Szukamy przypisanego emaila w pobranej bazie.
                        let userKey = username;
                        if (!users[userKey]) {
                            // Szukanie case-insensitive (bez względu na wielkość liter)
                            const foundKey = Object.keys(users).find(k => k.toLowerCase() === username.toLowerCase());
                            if (foundKey) userKey = foundKey;
                        }

                        if (users[userKey] && users[userKey].email) {
                            loginEmail = users[userKey].email;
                        } else {
                            // Fallback dla bardzo starych kont bez zapisanego emaila
                            loginEmail = `${username}@bubify.com`;
                        }
                    }

                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: loginEmail,
                        password: password
                    });
                    
                    if (error) {
                        console.error("Login error:", error);
                        if (error.message.includes('Invalid login credentials')) {
                            throw new Error('Nieprawidłowa nazwa użytkownika lub hasło.');
                        } else if (error.message.includes('Email not confirmed')) {
                            throw new Error('Adres email nie został potwierdzony.');
                        }
                        throw new Error('Błąd logowania: ' + error.message);
                    }

                    if (!error && data.session) {
                        loginSuccess = true;
                        if (data.user.user_metadata && data.user.user_metadata.username) {
                            targetUsername = data.user.user_metadata.username;
                        }
                        // Pobierz i zapisz rolę z metadanych
                        const role = (data.user.user_metadata && data.user.user_metadata.role) ? data.user.user_metadata.role : 'user';
                        localStorage.setItem('bubify_user_role', role);
                    }
                }

                if (loginSuccess) {
                    await loginUser(targetUsername);
                    showToast('Zalogowano pomyślnie!');
                } else {
                    // Ten blok catch wyłapie błędy rzucone powyżej
                }
            }
        } catch (err) {
            showToast(err.message);
        } finally {
            authSubmitBtn.textContent = originalText;
            authSubmitBtn.disabled = false;
        }
    });

    // --- Obsługa przycisku testu połączenia ---
    if (sbTestBtn) {
        sbTestBtn.addEventListener('click', async () => {
            const originalText = sbTestBtn.textContent;
            sbTestBtn.textContent = 'Łączenie...';
            
            const success = await syncDown();
            
            if (success) {
                showToast('Połączenie aktywne! Baza danych dostępna.');
            } else {
                showToast('Nie udało się połączyć. Sprawdź konfigurację.');
            }
            sbTestBtn.textContent = originalText;
        });
    }

    
    // Obsługa menu użytkownika
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userProfileBtn.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    userDropdownLogout.addEventListener('click', logoutUser);
    
    // --- Obsługa Ustawień Konta ---
    userDropdownAccount.addEventListener('click', () => {
        showToast('Ustawienia konta - wkrótce!');
        userDropdown.classList.remove('show');
        openAccountSettings();
    });
    
    adminDropdownItem.addEventListener('click', () => {
        userDropdown.classList.remove('show');
        openAdminDashboard();
    });
    
    closeAdminViewBtn.addEventListener('click', () => {
        adminView.classList.remove('open');
    });

    adminExitBtn.addEventListener('click', () => {
        adminView.classList.remove('open');
    });

    function openAccountSettings() {
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        const userData = users[currentUser] || {};

        accountUsernameDisplay.textContent = currentUser;
        accountOldPassword.value = '';
        accountNewPassword.value = '';
        
        // Wczytaj statystyki i bio
        accountBioInput.value = userData.bio || '';
        statPlays.textContent = userData.plays || 0;
        statJoined.textContent = userData.joinDate || 'Nieznana';
        
        // Policz playlisty (tylko własne)
        const userPlaylistsCount = Object.keys(playlists).filter(k => k !== 'Wszystkie utwory' && k !== 'Radio' && k !== 'Ulubione').length;
        statPlaylists.textContent = userPlaylistsCount;

        tempAvatarDataUrl = null;

        if (userData.avatar) {
            accountAvatarImg.src = userData.avatar;
        } else {
            accountAvatarImg.src = `https://placehold.co/100x100/333/999?text=${currentUser.charAt(0).toUpperCase()}`;
        }

        accountSettingsModal.classList.add('open');
    }

    accountModalCancelBtn.addEventListener('click', () => {
        accountSettingsModal.classList.remove('open');
    });

    accountAvatarWrapper.addEventListener('click', () => accountAvatarInput.click());

    accountAvatarInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(ev) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxSize = 300;
                    let width = img.width;
                    let height = img.height;
                    if (width > height) { if (width > maxSize) { height *= maxSize / width; width = maxSize; } }
                    else { if (height > maxSize) { width *= maxSize / height; height = maxSize; } }
                    canvas.width = width; canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    tempAvatarDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    accountAvatarImg.src = tempAvatarDataUrl;
                }
                img.src = ev.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    accountModalSaveBtn.addEventListener('click', () => {
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        const oldPass = accountOldPassword.value;
        const newPass = accountNewPassword.value;

        // Zmiana hasła
        if (newPass) {
            if (users[currentUser].password !== oldPass) {
                return showToast('Stare hasło jest nieprawidłowe!');
            }
            users[currentUser].password = newPass;
            showToast('Hasło zostało zmienione.');
        }

        // Zmiana awatara
        if (tempAvatarDataUrl) {
            users[currentUser].avatar = tempAvatarDataUrl;
            updateHeaderAvatar(tempAvatarDataUrl);
        }

        // Zapisz Bio
        users[currentUser].bio = accountBioInput.value.trim();

        localStorage.setItem('bubify_users', JSON.stringify(users));
        syncUp(); // Synchronizacja po zmianie ustawień konta
        accountSettingsModal.classList.remove('open');
        if (newPass) {
            showToast('Zmiany zostały zapisane. Hasło zostało zmienione.');
        } else {
            showToast('Zmiany zostały zapisane.');
        }
    });

    // --- Panel Administratora ---
    function openAdminDashboard() {
        adminView.classList.add('open');
        renderAdminUsersTable();
        renderAdminDashLogs();
        renderAdminStats();
        renderActivityChart();
        renderArtistChart();
    }

    // Obsługa zmiany filtra statystyk
    adminStatsFilter.addEventListener('change', () => {
        renderAdminStats();
        renderActivityChart();
        renderArtistChart();
    });

    // Nawigacja w panelu admina
    adminNavItems.forEach(item => {
        item.addEventListener('click', () => {
            adminNavItems.forEach(i => i.classList.remove('active'));
            adminSections.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(item.dataset.target).classList.add('active');
        });
    });

    function renderAdminUsersTable() {
        adminUsersTableBody.innerHTML = '';
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        
        Object.keys(users).forEach(username => {
            const user = users[username];
            const tr = document.createElement('tr');
            tr.className = 'admin-user-row';
            
            let actionsHtml = '';
            if (username !== 'Administrator') {
                actionsHtml = `
                    <button class="admin-reset-password-btn" style="background:none; border:none; cursor:pointer; color:#3478f6; margin-right:10px;" data-username="${username}">Reset</button>
                    <button class="admin-delete-user-btn" style="background:none; border:none; cursor:pointer; color:#ff453a;" data-username="${username}">Usuń</button>
                `;
            }
            
            tr.innerHTML = `
                <td style="display:flex; align-items:center; gap:10px; padding-left: 25px;">
                    <img src="${user.avatar || 'https://placehold.co/40x40/333/999?text=' + username.charAt(0)}" style="width:30px; height:30px; border-radius:50%;">
                    ${username}
                </td>
                <td>${user.joinDate || '-'}</td>
                <td>${user.plays || 0}</td>
                <td style="padding-right: 25px;">${actionsHtml}</td>
            `;
            adminUsersTableBody.appendChild(tr);
        });
    }
    
    adminUsersTableBody.addEventListener('click', (e) => {
        if (e.target.dataset.username) {
            const username = e.target.dataset.username;
            if (e.target.classList.contains('admin-delete-user-btn')) {
                adminDeleteUser(username);
            } else if (e.target.classList.contains('admin-reset-password-btn')) {
                adminResetPassword(username);
            }
        }
    });

    function renderAdminStats() {
        if (!adminStatsTableBody) return;
        adminStatsTableBody.innerHTML = '';
        
        const filter = adminStatsFilter.value;
        
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        const globalStats = {};
        const now = Date.now();

        Object.values(users).forEach(user => {
            if (filter === 'all') {
                // Dla "Cały czas" używamy zagregowanych danych (wspiera stare dane)
                if (user.songStats) {
                    Object.entries(user.songStats).forEach(([key, count]) => {
                        globalStats[key] = (globalStats[key] || 0) + count;
                    });
                }
            } else {
                // Dla zakresów czasowych używamy historii odtworzeń
                if (user.playHistory) {
                    let timeLimit = 0;
                    if (filter === '24h') timeLimit = 24 * 60 * 60 * 1000;
                    if (filter === '7d') timeLimit = 7 * 24 * 60 * 60 * 1000;
                    if (filter === '30d') timeLimit = 30 * 24 * 60 * 60 * 1000;

                    user.playHistory.forEach(entry => {
                        if (now - entry.timestamp <= timeLimit) {
                            const key = `${entry.artist} - ${entry.title}`;
                            globalStats[key] = (globalStats[key] || 0) + 1;
                        }
                    });
                }
            }
        });

        const sortedStats = Object.entries(globalStats)
            .map(([key, count]) => {
                const parts = key.split(' - ');
                const artist = parts[0];
                const title = parts.slice(1).join(' - ');
                return { artist, title, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 50);

        if (sortedStats.length === 0) {
            adminStatsTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">Brak danych</td></tr>';
            return;
        }

        sortedStats.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding-left: 25px;">${index + 1}</td>
                <td>${item.title}</td>
                <td>${item.artist}</td>
                <td style="padding-right: 25px;">${item.count}</td>
            `;
            adminStatsTableBody.appendChild(tr);
        });
    }

    function renderActivityChart() {
        if (!adminActivityChartCanvas) return;
        const ctx = adminActivityChartCanvas.getContext('2d');
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        const filter = adminStatsFilter.value;
        const now = Date.now();
        
        // Przygotowanie danych
        const userArray = Object.keys(users).map(username => {
            let count = 0;
            if (filter === 'all') {
                count = users[username].plays || 0;
            } else {
                if (users[username].playHistory) {
                    let timeLimit = 0;
                    if (filter === '24h') timeLimit = 24 * 60 * 60 * 1000;
                    if (filter === '7d') timeLimit = 7 * 24 * 60 * 60 * 1000;
                    if (filter === '30d') timeLimit = 30 * 24 * 60 * 60 * 1000;

                    count = users[username].playHistory.filter(entry => (now - entry.timestamp <= timeLimit)).length;
                }
            }
            
            return {
                username: username,
                plays: count
            };
        });
        
        // Sortowanie malejąco po liczbie odtworzeń
        userArray.sort((a, b) => b.plays - a.plays);
        
        const labels = userArray.map(u => u.username);
        const data = userArray.map(u => u.plays);

        // Zniszcz poprzedni wykres, jeśli istnieje
        if (adminChartInstance) {
            adminChartInstance.destroy();
        }

        const gradientColors = [
            ['#ff6b7b', '#ff4b5c'], ['#4e95f3', '#2a75d9'], ['#ffce56', '#ffb347'],
            ['#4bc0c0', '#34a0a0'], ['#a77ff2', '#8e54e9'], ['#ff9f40', '#ff8c1a'],
            ['#63da68', '#4caf50'], ['#f777e1', '#e91e63']
        ];

        const backgroundColors = data.map((_, i) => {
            const colorPair = gradientColors[i % gradientColors.length];
            const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient.addColorStop(0, colorPair[0]);
            gradient.addColorStop(1, colorPair[1]);
            return gradient;
        });

        // Utwórz nowy wykres
        adminChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Liczba odtworzeń',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    hoverOffset: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { 
                        position: 'right', 
                        labels: { 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            font: { size: 12, weight: '500' },
                            boxWidth: 12,
                            padding: 15
                        } 
                    },
                    tooltip: {
                        backgroundColor: 'rgba(28, 28, 30, 0.9)',
                        titleColor: 'rgba(255, 255, 255, 0.9)',
                        bodyColor: 'rgba(255, 255, 255, 0.7)',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: true,
                        boxWidth: 10,
                        boxPadding: 5
                    }
                }
            }
        });
    }

    function renderArtistChart() {
        if (!adminArtistChartCanvas) return;
        const ctx = adminArtistChartCanvas.getContext('2d');
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        const filter = adminStatsFilter.value;
        const now = Date.now();
        const artistCounts = {};

        // Agregacja odtworzeń per artysta
        Object.values(users).forEach(user => {
            if (filter === 'all') {
                if (user.songStats) {
                    Object.entries(user.songStats).forEach(([key, count]) => {
                        const parts = key.split(' - ');
                        if (parts.length > 0) {
                            const artist = parts[0];
                            artistCounts[artist] = (artistCounts[artist] || 0) + count;
                        }
                    });
                }
            } else {
                if (user.playHistory) {
                    let timeLimit = 0;
                    if (filter === '24h') timeLimit = 24 * 60 * 60 * 1000;
                    if (filter === '7d') timeLimit = 7 * 24 * 60 * 60 * 1000;
                    if (filter === '30d') timeLimit = 30 * 24 * 60 * 60 * 1000;

                    user.playHistory.forEach(entry => {
                        if (now - entry.timestamp <= timeLimit) {
                            artistCounts[entry.artist] = (artistCounts[entry.artist] || 0) + 1;
                        }
                    });
                }
            }
        });

        // Sortowanie i wybór Top 10
        const sortedArtists = Object.entries(artistCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const labels = sortedArtists.map(a => a[0]);
        const data = sortedArtists.map(a => a[1]);

        if (adminArtistChartInstance) {
            adminArtistChartInstance.destroy();
        }

        const gradientColors = [
            ['#ff6b7b', '#ff4b5c'], ['#4e95f3', '#2a75d9'], ['#ffce56', '#ffb347'],
            ['#4bc0c0', '#34a0a0'], ['#a77ff2', '#8e54e9'], ['#ff9f40', '#ff8c1a'],
            ['#63da68', '#4caf50'], ['#f777e1', '#e91e63']
        ];

        const backgroundColors = data.map((_, i) => {
            const colorPair = gradientColors[i % gradientColors.length];
            const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            gradient.addColorStop(0, colorPair[0]);
            gradient.addColorStop(1, colorPair[1]);
            return gradient;
        });

        adminArtistChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    hoverOffset: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { 
                        position: 'right', 
                        labels: { 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            font: { size: 12, weight: '500' },
                            boxWidth: 12,
                            padding: 15
                        } 
                    },
                    tooltip: {
                        backgroundColor: 'rgba(28, 28, 30, 0.9)',
                        titleColor: 'rgba(255, 255, 255, 0.9)',
                        bodyColor: 'rgba(255, 255, 255, 0.7)',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: true,
                        boxWidth: 10,
                        boxPadding: 5
                    }
                }
            }
        });
    }

    function addAdminLog(action, targetUser) {
        const logs = JSON.parse(localStorage.getItem('bubify_admin_logs') || '[]');
        const newLog = {
            timestamp: new Date().toLocaleString(),
            admin: currentUser,
            action: action,
            target: targetUser
        };
        logs.unshift(newLog);
        if (logs.length > 50) logs.pop(); // Zachowaj ostatnie 50 logów
        localStorage.setItem('bubify_admin_logs', JSON.stringify(logs));
        renderAdminDashLogs();
    }

    function renderAdminDashLogs() {
        if (!adminDashLogs) return;
        adminDashLogs.innerHTML = '';
        const logs = JSON.parse(localStorage.getItem('bubify_admin_logs') || '[]');
        if (logs.length === 0) {
            adminDashLogs.innerHTML = '<div style="padding:5px; text-align:center;">Brak logów</div>';
            return;
        }
        logs.forEach(log => {
            const div = document.createElement('div');
            div.className = 'admin-log-item';
            div.innerHTML = `<span class="admin-log-time">[${log.timestamp}]</span> <span style="color: var(--text-primary);">${log.action}:</span> ${log.target}`;
            adminDashLogs.appendChild(div);
        });
    }

    function adminResetPassword(username) {
        const newPassword = prompt(`Wprowadź nowe hasło dla użytkownika "${username}":`);
        if (newPassword && newPassword.trim() !== "") {
            const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            if (users[username]) {
                users[username].password = newPassword.trim();
                localStorage.setItem('bubify_users', JSON.stringify(users));
                syncUp(); // Synchronizacja po resecie hasła
                addAdminLog('Zresetowano hasło', username);
                showToast(`Hasło dla użytkownika "${username}" zostało zresetowane.`);
            }
        } else if (newPassword !== null) {
            showToast('Hasło nie może być puste.');
        }
    }

    async function adminDeleteUser(username) {
        if (confirm(`Czy na pewno chcesz usunąć użytkownika "${username}" i wszystkie jego dane (playlisty, ustawienia)? Tej operacji nie można cofnąć.`)) {
            const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            
            delete users[username];
            localStorage.setItem('bubify_users', JSON.stringify(users));

            // Usuń wszystkie dane powiązane z tym użytkownikiem
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${username}_`)) {
                    localStorage.removeItem(key);
                }
            }

            // Usuń dane z Supabase
            if (supabase) {
                await supabase.from('bubify_data').delete().eq('id', `user_${username}`);
            }

            addAdminLog('Usunięto użytkownika', username);
            showToast(`Użytkownik "${username}" został usunięty.`);
            syncUp(); // Synchronizacja po usunięciu użytkownika
            renderAdminUsersTable();
        }
    }

    adminDashAddBtn.addEventListener('click', async () => {
        const newUsername = adminDashNewUser.value.trim();
        const newPassword = adminDashNewPass.value.trim();
        if (!newUsername || !newPassword) return showToast('Nazwa użytkownika i hasło nie mogą być puste.');
        
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        if (users[newUsername]) return showToast('Użytkownik o tej nazwie już istnieje.');
        
        const originalText = adminDashAddBtn.textContent;
        adminDashAddBtn.textContent = 'Zapisywanie...';
        adminDashAddBtn.disabled = true;

        users[newUsername] = { password: newPassword, joinDate: new Date().toLocaleDateString(), plays: 0, bio: '' };
        localStorage.setItem('bubify_users', JSON.stringify(users));
        syncUp(); // Synchronizacja po dodaniu użytkownika
        
        await syncUp(); // Czekamy na potwierdzenie zapisu w bazie
        
        adminDashAddBtn.textContent = originalText;
        adminDashAddBtn.disabled = false;

        addAdminLog('Utworzono użytkownika', newUsername);
        showToast(`Utworzono użytkownika "${newUsername}".`);
        adminDashNewUser.value = '';
        adminDashNewPass.value = '';
        renderAdminUsersTable();
    });

    // --- GitHub Upload Logic ---
    githubUploadBtn.addEventListener('click', async () => {
        const token = document.getElementById('github-token').value.trim();
        const fileInput = document.getElementById('github-upload-file');
        const artist = document.getElementById('github-upload-artist').value.trim();
        const title = document.getElementById('github-upload-title').value.trim();

        if (!token) return showToast('Podaj token GitHub');
        if (!fileInput.files[0]) return showToast('Wybierz plik MP3');
        if (!artist || !title) return showToast('Podaj artystę i tytuł');

        const file = fileInput.files[0];
        const filename = `${artist} - ${title}.mp3`;
        
        githubUploadBtn.textContent = 'Wysyłanie...';
        githubUploadBtn.disabled = true;

        const reader = new FileReader();
        reader.onload = async function(e) {
            const contentBase64 = e.target.result.split(',')[1]; // Remove data:audio/mpeg;base64, header
            
            try {
                const repo = 'bearsleeping/Muzyka';
                const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(filename)}`;
                
                const body = {
                    message: `Add ${filename} via Bubify Admin`,
                    content: contentBase64
                };

                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Błąd wysyłania');
                }

                showToast('Utwór wysłany pomyślnie!');
                addAdminLog('Wysłano utwór', filename);
                
                // Reset form
                document.getElementById('github-upload-artist').value = '';
                document.getElementById('github-upload-title').value = '';
                fileInput.value = '';
            } catch (err) {
                console.error(err);
                showToast('Błąd: ' + err.message);
            } finally {
                githubUploadBtn.textContent = 'Wyślij do GitHub';
                githubUploadBtn.disabled = false;
            }
        };
        reader.readAsDataURL(file);
    });

    // --- Heartbeat & Status Logic ---
    function startHeartbeat() {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        if (statusCheckInterval) clearInterval(statusCheckInterval);

        // Aktualizuj status "online" co 30 sekund
        heartbeatInterval = setInterval(() => {
            syncUp(); // syncUp teraz aktualizuje lastSeen
        }, 30000);

        // Sprawdzaj statusy znajomych co 30 sekund
        statusCheckInterval = setInterval(updateFriendsStatuses, 30000);
        
        // Pierwsze sprawdzenie od razu
        updateFriendsStatuses();
    }

    function stopHeartbeat() {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        if (statusCheckInterval) clearInterval(statusCheckInterval);
    }

    // --- Global Presence (Online Status) ---
    function initGlobalPresence() {
        if (!supabase || !currentUser) return;
        if (globalPresenceChannel) supabase.removeChannel(globalPresenceChannel);

        globalPresenceChannel = supabase.channel('global_presence', {
            config: { presence: { key: currentUser } }
        });

        globalPresenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = globalPresenceChannel.presenceState();
                updateOnlineStatuses(state);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                if (key !== currentUser && friendsList.includes(key)) {
                    showToast(`${key} jest teraz online!`);
                }
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await globalPresenceChannel.track({ online_at: new Date().toISOString() });
                }
            });
    }

    function updateOnlineStatuses(presenceState) {
        // Resetujemy statusy, aby usunąć "online" dla osób, które zniknęły
        document.querySelectorAll('.status-dot, .status-indicator').forEach(el => el.classList.remove('online'));

        Object.keys(presenceState).forEach(username => {
            const dot = document.getElementById(`status-${username}`);
            if (dot) dot.classList.add('online');
            const headerDot = document.getElementById(`header-status-${username}`);
            if (headerDot) headerDot.classList.add('online');
        });
    }

    async function updateFriendsStatuses() {
        if (!supabase || !currentUser || friendsList.length === 0) return;
        
        const friendIds = friendsList.map(f => `user_${f}`);
        const { data } = await supabase.from('bubify_data').select('id, content').in('id', friendIds);
        
        if (data) {
            const now = Date.now();
            // Pobierz stan Realtime, jeśli dostępny
            const presenceState = globalPresenceChannel ? globalPresenceChannel.presenceState() : {};

            data.forEach(row => {
                const username = row.id.replace('user_', '');
                const lastSeen = row.content.lastSeen || 0;
                // Online jeśli w Realtime LUB aktywny w ciągu ostatnich 60s (fallback)
                const isOnline = !!presenceState[username] || (now - lastSeen) < 60 * 1000;
                
                const dot = document.getElementById(`status-${username}`);
                if (dot) {
                    if (isOnline) dot.classList.add('online');
                    else dot.classList.remove('online');
                }
                
                const headerDot = document.getElementById(`header-status-${username}`);
                if (headerDot) {
                    if (isOnline) headerDot.classList.add('online');
                    else headerDot.classList.remove('online');
                }
            });
        }
    }

    // --- Chat & Friends Logic ---

    async function syncUserFriendsData() {
        if (!supabase || !currentUser) return;
        
        const { data, error } = await supabase
            .from('bubify_data')
            .select('content')
            .eq('id', `user_${currentUser}`)
            .single();
            
        if (data && data.content) {
            friendsList = data.content.friends || [];
            friendRequests = data.content.friendRequests || [];
            renderFriendList();
        }
    }

    function subscribeToUserUpdates() {
        if (!supabase || !currentUser) return;
        if (userSubscription) supabase.removeChannel(userSubscription);

        userSubscription = supabase
            .channel(`public:user_${currentUser}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bubify_data', filter: `id=eq.user_${currentUser}` }, payload => {
                if (payload.new && payload.new.content) {
                    friendsList = payload.new.content.friends || [];
                    friendRequests = payload.new.content.friendRequests || [];
                    blockedUsers = payload.new.content.blockedUsers || [];
                    renderFriendList();
                    if (document.getElementById('chat-view').classList.contains('active')) {
                        showToast('Zaktualizowano listę znajomych');
                    }
                }
            })
            .subscribe();
    }

    function initChatView() {
        renderFriendList();
        loadChat(activeChatId);
        isChatLoaded = true;
    }

    function renderFriendList() {
        const chatList = document.getElementById('chat-list');
        const requestsSection = document.getElementById('friend-requests-section');
        const requestsList = document.getElementById('friend-requests-list');
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        
        // Render Chat List (Global + Friends)
        chatList.innerHTML = '';
        
        // Global Chat Item
        const globalItem = document.createElement('div');
        globalItem.className = `chat-list-item ${activeChatId === 'global_chat' ? 'active' : ''}`;
        globalItem.innerHTML = `<div class="chat-avatar-small" style="background: linear-gradient(135deg, #fa2d48, #ff2d55);"></div> Globalny Chat`;
        globalItem.onclick = () => loadChat('global_chat');
        chatList.appendChild(globalItem);

        // Friends Items
        friendsList.forEach(friend => {
            const friendItem = document.createElement('div');
            // Generate private chat ID: sort usernames alphabetically to ensure uniqueness regardless of who opens it
            const chatId = [currentUser, friend].sort().join('_'); 
            const fullChatId = `chat_${chatId}`;
            const friendData = users[friend] || {};
            const avatarSrc = friendData.avatar || `https://placehold.co/40x40/333/999?text=${friend.charAt(0)}`;
            
            friendItem.className = `chat-list-item ${activeChatId === fullChatId ? 'active' : ''}`;
            friendItem.innerHTML = `
                <img src="${avatarSrc}" class="chat-avatar-small">
                ${friend}
                <div class="status-dot" id="status-${friend}"></div>
            `;
            friendItem.onclick = () => loadChat(fullChatId, friend);
            friendItem.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showFriendContextMenu(e, friend);
            });
            chatList.appendChild(friendItem);
        });

        // Render Blocked Users
        if (blockedUsers.length > 0) {
            const blockedHeader = document.createElement('div');
            blockedHeader.style.cssText = 'padding: 10px 15px; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; margin-top: 10px;';
            blockedHeader.textContent = 'Zablokowani';
            chatList.appendChild(blockedHeader);

            blockedUsers.forEach(blockedUser => {
                const blockedItem = document.createElement('div');
                blockedItem.className = 'chat-list-item';
                blockedItem.style.opacity = '0.6';
                blockedItem.innerHTML = `
                    <div class="chat-avatar-small" style="background: #333;"></div>
                    ${blockedUser}
                    <button class="unblock-btn" style="margin-left:auto; background:none; border:none; color:var(--accent-color); cursor:pointer; font-size:11px;">Odblokuj</button>
                `;
                blockedItem.querySelector('.unblock-btn').onclick = (e) => { e.stopPropagation(); unblockUser(blockedUser); };
                chatList.appendChild(blockedItem);
            });
        }

        // Render Requests
        const validRequests = friendRequests.filter(req => !blockedUsers.includes(req));
        if (validRequests.length > 0) {
            requestsSection.style.display = 'block';
            requestsList.innerHTML = '';
            validRequests.forEach(reqUser => {
                const reqItem = document.createElement('div');
                reqItem.className = 'request-item';
                reqItem.innerHTML = `
                    <span>${reqUser}</span>
                    <div class="request-actions">
                        <button class="request-btn accept" title="Akceptuj"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                        <button class="request-btn reject" title="Odrzuć"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                    </div>
                `;
                reqItem.querySelector('.accept').onclick = () => handleFriendRequest(reqUser, true);
                reqItem.querySelector('.reject').onclick = () => handleFriendRequest(reqUser, false);
                requestsList.appendChild(reqItem);
            });
        } else {
            requestsSection.style.display = 'none';
        }
        
        // Zaktualizuj statusy po przerysowaniu listy
        updateFriendsStatuses();
    }

    function updateTypingIndicator(presenceState) {
        const indicator = document.getElementById('typing-indicator');
        if (!indicator) return;

        const typingUsers = [];
        for (const key in presenceState) {
            if (key !== currentUser && presenceState[key][0]?.is_typing) {
                typingUsers.push(key);
            }
        }

        if (typingUsers.length === 0) {
            indicator.innerHTML = '';
        } else {
            const text = typingUsers.length > 2 ? 'Kilka osób pisze...' : `${typingUsers.join(', ')} pisze...`;
            indicator.innerHTML = `
                <div class="typing-bubble">
                    <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
                </div>
                <span style="font-size: 11px; color: var(--text-secondary);">${text}</span>`;
        }
    }

    // Chat Pagination State
    let currentChatMessages = [];
    let renderedMessageCount = 0;
    const MESSAGES_PER_PAGE = 20;
    let animatedMessageIds = new Set();

    async function loadChat(chatId, chatName = null) {
        if (!supabase) {
            document.getElementById('chat-messages-container').innerHTML = '<div style="text-align:center; color:#666; margin-top:20px;">Brak połączenia z bazą danych.</div>';
            return;
        }
        
        activeChatId = chatId;
        animatedMessageIds.clear();
        
        // Wyczyść poprzedni interwał (Polling)
        if (chatPollingInterval) clearInterval(chatPollingInterval);

        // Reset typing state on chat switch
        clearTimeout(typingTimeout);
        isTyping = false;
        updateTypingIndicator({}); // Clear indicator
        
        // Update Header
        const headerBar = document.getElementById('chat-header-bar');
        if (chatId === 'global_chat') {
            headerBar.innerHTML = `Globalny Chat`;
        } else {
            const friendName = chatName || chatId.replace('chat_', '').replace(currentUser, '').replace('_', '');
            const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            const friendData = users[friendName] || {};
            const avatarSrc = friendData.avatar || `https://placehold.co/40x40/333/999?text=${friendName.charAt(0)}`;

            headerBar.innerHTML = `<img src="${avatarSrc}" class="chat-avatar-small"> <span>${friendName}</span> <div class="status-indicator" id="header-status-${friendName}"></div>`;
            updateFriendsStatuses();
        }

        // Update Active Class in List
        document.querySelectorAll('.chat-list-item').forEach(item => item.classList.remove('active'));
        // Simple heuristic to find the active item in DOM
        const listItems = document.getElementById('chat-list').children;
        for (let item of listItems) {
            if (chatId === 'global_chat' && item.textContent.includes('Globalny Chat')) item.classList.add('active');
            else if (chatName && item.textContent.includes(chatName)) item.classList.add('active');
        }

        const chatContainer = document.getElementById('chat-messages-container');
        chatContainer.innerHTML = '<div style="text-align:center; color:#888; margin-top:20px;">Ładowanie...</div>';

        // 1. Pobierz historię
        const { data, error } = await supabase
            .from('bubify_data')
            .select('content')
            .eq('id', chatId)
            .single();

        let encryptedContent = [];
        if (data && data.content) {
            encryptedContent = data.content;
        } else if (error && error.code === 'PGRST116') {
            // Nie znaleziono - utwórz pusty rekord
            await supabase.from('bubify_data').insert({ id: chatId, content: [] });
        }

        // Store raw encrypted for comparison and saving
        rawChatMessages = JSON.parse(JSON.stringify(encryptedContent));
        
        // Create working copy for display (will be decrypted)
        currentChatMessages = JSON.parse(JSON.stringify(encryptedContent));

        // Zapobiegaj animacji przy pierwszym ładowaniu historii (oznacz jako już wyświetlone)
        currentChatMessages.forEach(msg => animatedMessageIds.add(msg.id));

        // Mark unread messages as read (Update RAW/ENCRYPTED array to save back)
        let hasUnread = false;
        rawChatMessages.forEach(msg => {
            if (msg.user !== currentUser && msg.status !== 'read') {
                msg.status = 'read';
                hasUnread = true;
            }
        });
        
        // Sync status to display array
        currentChatMessages.forEach(msg => {
            if (msg.user !== currentUser && msg.status !== 'read') {
                msg.status = 'read';
            }
        });

        if (hasUnread) {
            // Save ENCRYPTED content
            await supabase.from('bubify_data').update({ content: rawChatMessages }).eq('id', chatId);
        }

        renderedMessageCount = MESSAGES_PER_PAGE;
        renderChatMessages(currentChatMessages.slice(-renderedMessageCount));
        scrollToBottom();
        setupScrollPagination();

        // 2. Polling (Zamiast Realtime - odświeżanie co 3 sekundy)
        if (chatSubscription) await supabase.removeChannel(chatSubscription);
        chatSubscription = null;

        chatPollingInterval = setInterval(async () => {
            if (!activeChatId) return;
            
            const { data } = await supabase
                .from('bubify_data')
                .select('content')
                .eq('id', activeChatId)
                .single();

            if (data && data.content) {
                const newMessages = data.content;
                if (JSON.stringify(newMessages) !== JSON.stringify(currentChatMessages)) {
                    if (newMessages.length > currentChatMessages.length) {
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.user !== currentUser) {
                            playNotificationSound();
                        }
                    }
                    currentChatMessages = newMessages;
                    if (typeof rawChatMessages !== 'undefined') rawChatMessages = JSON.parse(JSON.stringify(newMessages));
                    renderChatMessages(currentChatMessages.slice(-renderedMessageCount));
                }
            }
        }, 3000);
    }

    function setupScrollPagination() {
        const chatContainer = document.getElementById('chat-messages-container');
        chatContainer.onscroll = () => {
            if (chatContainer.scrollTop === 0 && renderedMessageCount < currentChatMessages.length) {
                const oldHeight = chatContainer.scrollHeight;
                renderedMessageCount += MESSAGES_PER_PAGE;
                renderChatMessages(currentChatMessages.slice(-renderedMessageCount));
                // Restore scroll position
                chatContainer.scrollTop = chatContainer.scrollHeight - oldHeight;
            }
        };
    }

    function playNotificationSound() {
        notificationSound.play().catch(e => console.log("Audio play failed", e));
    }

    function renderChatMessages(messages) {
        const chatContainer = document.getElementById('chat-messages-container');
        chatContainer.innerHTML = '';
        
        if (!Array.isArray(messages)) {
            messages = [];
        }
        
        if (!messages || messages.length === 0) {
            chatContainer.innerHTML = '<div style="text-align:center; color:#666; margin-top:20px;">Brak wiadomości. Rozpocznij rozmowę!</div>';
            return;
        }

        if (renderedMessageCount < currentChatMessages.length) {
            const loadMore = document.createElement('div');
            loadMore.className = 'load-more-trigger';
            loadMore.textContent = 'Przewiń, aby załadować starsze wiadomości';
            chatContainer.appendChild(loadMore);
        }

        messages.forEach(msg => {
            const div = document.createElement('div');
            const isMe = msg.user === currentUser;
            div.className = `chat-message ${isMe ? 'sent' : 'received'}`;
            div.dataset.messageId = msg.id;
            
            // Dodaj animację tylko dla nowych wiadomości (których nie ma w zestawie animatedMessageIds)
            if (!animatedMessageIds.has(msg.id)) {
                div.classList.add('animate-in');
                animatedMessageIds.add(msg.id);
            }
            
            let senderHtml = '';
            if (!isMe) {
                senderHtml = `<div style="font-size:10px; color:rgba(255,255,255,0.5); margin-bottom:2px;">${msg.user}</div>`;
            }

            const timeString = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : '';

            // Status Icon
            let statusIcon = '';
            if (isMe) {
                const statusColor = msg.status === 'read' ? '#4cd964' : 'rgba(255,255,255,0.3)';
                // Double tick for delivered/read, single for sent
                const ticks = msg.status === 'read' || msg.status === 'delivered' ? 
                    '<path d="M18 6L7 17l-5-5"/><path d="M22 10l-7.5 7.5L13 16"/>' : 
                    '<path d="M20 6L9 17l-5-5"/>';
                
                statusIcon = `<svg class="message-status-icon" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ticks}</svg>`;
            }

            // Reactions
            let reactionsHtml = '';
            if (msg.reactions) {
                const reactionBadges = Object.entries(msg.reactions)
                    .filter(([_, users]) => users.length > 0)
                    .map(([emoji, users]) => {
                        const count = users.length > 1 ? ` ${users.length}` : '';
                        return `<span class="reaction-badge" title="${users.join(', ')}">${emoji}${count}</span>`;
                    })
                    .join('');
                
                if (reactionBadges) {
                    reactionsHtml = `<div class="message-reactions">${reactionBadges}</div>`;
                }
            }

            const actionsHtml = `
                <div class="message-actions">
                    <button class="action-btn reaction-btn" title="Dodaj reakcję">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    ${isMe ? `
                    <button class="action-btn delete-msg-btn" title="Usuń">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>` : ''}
                </div>
            `;
            
            div.innerHTML = `
                ${senderHtml}
                <div class="chat-message-content">${msg.text}</div>
                ${reactionsHtml}
                <div class="chat-message-footer">
                    <span>${timeString}</span>
                    ${statusIcon}
                </div>
                ${actionsHtml}
            `;
            
            div.addEventListener('click', (e) => {
                if (e.target.closest('.delete-msg-btn')) return;
                
                // Zamknij inne otwarte wiadomości
                const openMsg = chatContainer.querySelector('.chat-message.show-info');
                if (openMsg && openMsg !== div) {
                    openMsg.classList.remove('show-info');
                }

                div.classList.toggle('show-info');
            });

            div.querySelector('.reaction-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                showGlobalReactionPicker(msg.id, div);
            });

            if (isMe) {
                div.querySelector('.delete-msg-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Na pewno usunąć wiadomość?')) deleteChatMessage(msg.id);
                });
            }

            chatContainer.appendChild(div);
        });
    }

    async function toggleReaction(msgId, emoji) {
        const msgIndex = currentChatMessages.findIndex(m => m.id === msgId);
        if (msgIndex === -1) return;

        const msg = currentChatMessages[msgIndex];
        if (!msg.reactions) msg.reactions = {};
        if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

        const userIndex = msg.reactions[emoji].indexOf(currentUser);
        if (userIndex === -1) {
            msg.reactions[emoji].push(currentUser);
        } else {
            msg.reactions[emoji].splice(userIndex, 1);
        }

        // Optimistic update
        renderChatMessages(currentChatMessages.slice(-renderedMessageCount));

        // Update Encrypted/Raw and Save
        const rawMsgIndex = rawChatMessages.findIndex(m => m.id === msgId);
        if (rawMsgIndex !== -1) {
            const rawMsg = rawChatMessages[rawMsgIndex];
            if (!rawMsg.reactions) rawMsg.reactions = {};
            if (!rawMsg.reactions[emoji]) rawMsg.reactions[emoji] = [];
            
            const rawUserIndex = rawMsg.reactions[emoji].indexOf(currentUser);
            if (rawUserIndex === -1) {
                rawMsg.reactions[emoji].push(currentUser);
            } else {
                rawMsg.reactions[emoji].splice(rawUserIndex, 1);
            }
            
            await supabase.from('bubify_data').update({ content: rawChatMessages }).eq('id', activeChatId);
        }
    }

    async function sendChatMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        
        if (!currentUser) {
            showToast('Musisz być zalogowany, aby pisać.');
            return;
        }

        const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            user: currentUser,
            text: text,
            timestamp: new Date().toISOString(),
            status: 'delivered', // Assume delivered once saved
            reactions: {}
        };
        
        // Aktualizacja lokalna (natychmiastowa)
        currentChatMessages.push(newMessage);
        if (typeof rawChatMessages !== 'undefined') rawChatMessages.push(newMessage);
        
        renderChatMessages(currentChatMessages.slice(-renderedMessageCount));
        scrollToBottom();
        
        input.value = ''; 
        
        clearTimeout(typingTimeout);
        if (isTyping) {
            isTyping = false;
            if (chatSubscription && chatSubscription.state === 'joined') {
                chatSubscription.track({ is_typing: false });
            }
        }

        // Zapis do bazy w tle
        try {
            const { data } = await supabase
                .from('bubify_data')
                .select('content')
                .eq('id', activeChatId)
                .single();
                
            let messages = (data && data.content) ? data.content : [];
            messages.push(newMessage);
            
            if (messages.length > 500) messages = messages.slice(-500);
            
            await supabase
                .from('bubify_data')
                .upsert({ id: activeChatId, content: messages });
        } catch (e) {
            console.error("Błąd wysyłania:", e);
        }
    }

    function scrollToBottom() {
        const chatContainer = document.getElementById('chat-messages-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function deleteChatMessage(messageId) {
        if (!supabase || !activeChatId) return;

        // Optimistic UI: Ukryj wiadomość natychmiast
        const btn = document.querySelector(`.delete-msg-btn[data-message-id="${messageId}"]`);
        const msgElement = btn ? btn.closest('.chat-message') : null;
        if (msgElement) {
            msgElement.style.opacity = '0.3';
        }

        try {
            const { data, error } = await supabase.from('bubify_data').select('content').eq('id', activeChatId).single();
            if (error) throw error;

            if (data && data.content) {
                const messages = data.content;
                const updatedMessages = messages.filter(msg => String(msg.id) !== String(messageId));
                
                if (updatedMessages.length < messages.length) {
                    const { error: updateError } = await supabase.from('bubify_data').upsert({ id: activeChatId, content: updatedMessages });
                    if (updateError) throw updateError;
                    
                    addAdminLog('Usunięto wiadomość na czacie', `Chat ID: ${activeChatId}`);
                    showToast('Wiadomość usunięta.');
                }
            }
        } catch (e) {
            console.error("Błąd podczas usuwania wiadomości:", e);
            showToast("Nie udało się usunąć wiadomości.");
            if (msgElement) {
                msgElement.style.opacity = '1';
            }
        }
    }

    // --- Friend Management Functions ---
    document.getElementById('add-friend-btn').addEventListener('click', async () => {
        const friendName = prompt("Podaj nazwę użytkownika, którego chcesz dodać:");
        if (!friendName || friendName.trim() === "") return;
        if (friendName === currentUser) return showToast("Nie możesz dodać samego siebie.");
        if (friendsList.includes(friendName)) return showToast("Ten użytkownik jest już Twoim znajomym.");

        if (blockedUsers.includes(friendName)) {
            if (!confirm(`Użytkownik ${friendName} jest zablokowany. Czy chcesz go odblokować i wysłać zaproszenie?`)) return;
            await unblockUser(friendName);
        }

        // 1. Check if user exists (by checking global_users list in local storage or fetching)
        // Since we sync global_users to localStorage on login, we can check there first
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        if (!users[friendName]) {
            // Try fetching fresh list just in case
            await syncDown(null);
            const freshUsers = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            if (!freshUsers[friendName]) return showToast("Użytkownik nie istnieje.");
        }

        // 2. Add to target user's friendRequests
        try {
            // Fetch target user data
            const { data: targetData } = await supabase
                .from('bubify_data')
                .select('content')
                .eq('id', `user_${friendName}`)
                .single();
            
            let targetContent = (targetData && targetData.content) ? targetData.content : {};
            let targetRequests = targetContent.friendRequests || [];
            
            if (targetRequests.includes(currentUser)) {
                return showToast("Zaproszenie zostało już wysłane.");
            }
            
            if (targetContent.friends && targetContent.friends.includes(currentUser)) {
                // Naprawa asymetrii: Oni mają nas, my nie mamy ich. Dodaj ich do nas.
                const { data: myData } = await supabase.from('bubify_data').select('content').eq('id', `user_${currentUser}`).single();
                let myContent = (myData && myData.content) ? myData.content : {};
                myContent.friends = myContent.friends || [];
                
                if (!myContent.friends.includes(friendName)) {
                    myContent.friends.push(friendName);
                    await supabase.from('bubify_data').upsert({ id: `user_${currentUser}`, content: myContent });
                    
                    friendsList = myContent.friends;
                    renderFriendList();
                    return showToast("Zsynchronizowano znajomość. Użytkownik dodany.");
                }
                return showToast("Jesteście już znajomymi.");
            }

            targetRequests.push(currentUser);
            targetContent.friendRequests = targetRequests;

            const { error } = await supabase
                .from('bubify_data')
                .upsert({ id: `user_${friendName}`, content: targetContent });

            if (error) throw error;
            showToast(`Wysłano zaproszenie do ${friendName}`);
        } catch (e) {
            console.error(e);
            showToast("Błąd podczas wysyłania zaproszenia.");
        }
    });

    async function handleFriendRequest(requester, accepted) {
        try {
            // 1. Update Current User (Remove request, add friend if accepted)
            const { data: myData } = await supabase.from('bubify_data').select('content').eq('id', `user_${currentUser}`).single();
            let myContent = myData.content || {};
            
            myContent.friendRequests = (myContent.friendRequests || []).filter(u => u !== requester);
            if (accepted) {
                myContent.friends = (myContent.friends || []);
                if (!myContent.friends.includes(requester)) myContent.friends.push(requester);
            }
            
            await supabase.from('bubify_data').upsert({ id: `user_${currentUser}`, content: myContent });

            // Aktualizuj lokalny stan natychmiast
            friendsList = myContent.friends || [];
            friendRequests = myContent.friendRequests || [];
            renderFriendList();

            // 2. Update Requester (Add friend if accepted)
            if (accepted) {
                const { data: reqData } = await supabase.from('bubify_data').select('content').eq('id', `user_${requester}`).single();
                let reqContent = reqData.content || {};
                reqContent.friends = (reqContent.friends || []);
                if (!reqContent.friends.includes(currentUser)) reqContent.friends.push(currentUser);
                
                await supabase.from('bubify_data').upsert({ id: `user_${requester}`, content: reqContent });
                showToast(`Dodano ${requester} do znajomych!`);
            } else {
                showToast("Odrzucono zaproszenie.");
            }
        } catch (e) {
            console.error(e);
            showToast("Wystąpił błąd.");
        }
    }

    async function removeFriend(friendName) {
        if (!confirm(`Czy na pewno chcesz usunąć ${friendName} ze znajomych?`)) return;
        
        friendsList = friendsList.filter(f => f !== friendName);
        renderFriendList();
        await syncUp();
        
        // Próba usunięcia nas z listy znajomego
        try {
            const { data: theirData } = await supabase.from('bubify_data').select('content').eq('id', `user_${friendName}`).single();
            if (theirData && theirData.content) {
                let content = theirData.content;
                if (content.friends && content.friends.includes(currentUser)) {
                    content.friends = content.friends.filter(f => f !== currentUser);
                    await supabase.from('bubify_data').update({ content: content }).eq('id', `user_${friendName}`);
                }
            }
        } catch (e) { console.error("Błąd usuwania u znajomego", e); }
        
        showToast(`Usunięto ${friendName} ze znajomych.`);
    }

    async function blockUser(friendName) {
        if (!confirm(`Czy na pewno chcesz zablokować użytkownika ${friendName}?`)) return;
        
        if (!blockedUsers.includes(friendName)) {
            blockedUsers.push(friendName);
        }
        
        if (friendsList.includes(friendName)) {
            friendsList = friendsList.filter(f => f !== friendName);
            // Usuń nas z ich listy
            try {
                const { data: theirData } = await supabase.from('bubify_data').select('content').eq('id', `user_${friendName}`).single();
                if (theirData && theirData.content) {
                    let content = theirData.content;
                    if (content.friends && content.friends.includes(currentUser)) {
                        content.friends = content.friends.filter(f => f !== currentUser);
                        await supabase.from('bubify_data').update({ content: content }).eq('id', `user_${friendName}`);
                    }
                }
            } catch (e) { console.error(e); }
        }
        
        renderFriendList();
        await syncUp();
        showToast(`Zablokowano użytkownika ${friendName}.`);
    }

    async function unblockUser(friendName) {
        blockedUsers = blockedUsers.filter(u => u !== friendName);
        renderFriendList();
        await syncUp();
        showToast(`Odblokowano użytkownika ${friendName}.`);
    }

    // --- Friend Context Menu ---
    const friendContextMenu = document.createElement('div');
    friendContextMenu.className = 'context-menu';
    friendContextMenu.style.cssText = `
        position: fixed;
        background: #1c1c1e;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 5px;
        display: none;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        min-width: 150px;
    `;
    friendContextMenu.innerHTML = `
        <div class="ctx-item" id="ctx-remove-friend" style="padding: 8px 12px; cursor: pointer; color: #fff; font-size: 13px; border-radius: 4px;">Usuń znajomego</div>
        <div class="ctx-item" id="ctx-block-user" style="padding: 8px 12px; cursor: pointer; color: #ff453a; font-size: 13px; border-radius: 4px;">Zablokuj</div>
    `;
    document.body.appendChild(friendContextMenu);

    friendContextMenu.querySelectorAll('.ctx-item').forEach(item => {
        item.addEventListener('mouseenter', () => item.style.background = '#2c2c2e');
        item.addEventListener('mouseleave', () => item.style.background = 'transparent');
    });

    let currentCtxFriend = null;

    function showFriendContextMenu(e, friendName) {
        e.preventDefault();
        currentCtxFriend = friendName;
        
        friendContextMenu.style.display = 'block';
        let top = e.clientY;
        let left = e.clientX;
        if (top + friendContextMenu.offsetHeight > window.innerHeight) top -= friendContextMenu.offsetHeight;
        if (left + friendContextMenu.offsetWidth > window.innerWidth) left -= friendContextMenu.offsetWidth;
        friendContextMenu.style.top = `${top}px`;
        friendContextMenu.style.left = `${left}px`;
    }

    document.getElementById('ctx-remove-friend').addEventListener('click', () => {
        if (currentCtxFriend) removeFriend(currentCtxFriend);
        friendContextMenu.style.display = 'none';
    });

    document.getElementById('ctx-block-user').addEventListener('click', () => {
        if (currentCtxFriend) blockUser(currentCtxFriend);
        friendContextMenu.style.display = 'none';
    });

    document.getElementById('chat-send-btn').addEventListener('click', sendChatMessage);
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
    chatInput.addEventListener('input', () => {
        if (chatSubscription && chatSubscription.state === 'joined') {
            if (!isTyping) {
                isTyping = true;
                chatSubscription.track({ is_typing: true });
            }
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => { isTyping = false; if (chatSubscription && chatSubscription.state === 'joined') { chatSubscription.track({ is_typing: false }); } }, 2000);
        }
    });

    // --- Przełączanie i zapamiętywanie motywu ---
    function applyTheme(theme) {
        // Domyślnie jest motyw standardowy (bez dodatkowej klasy)
        if (theme === 'vampire') {
            body.classList.add('theme-vampire');
        } else {
            body.classList.remove('theme-vampire');
        }
    }

    userDropdownTheme.addEventListener('click', () => {
        body.classList.toggle('theme-vampire');
        const newTheme = body.classList.contains('theme-vampire') ? 'vampire' : 'default';
        localStorage.setItem(getStorageKey('musicPlayerTheme'), newTheme);
        // Motyw jest lokalny, ale można go też synchronizować: githubSyncUp();
    });

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return 'LIVE';
        const minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        if (secs < 10) {
            secs = '0' + secs;
        }
        return `${minutes}:${secs}`;
    }

    // --- Zarządzanie playlistami ---
    function loadPlaylists() {
        const storedPlaylists = localStorage.getItem(getStorageKey('bubify_playlists'));
        if (storedPlaylists) {
            playlists = JSON.parse(storedPlaylists);
            if (!playlists['Radio']) playlists['Radio'] = [];
        } else {
            playlists = { 'Ulubione': [], 'Radio': [] };
        }
        
        const storedMetadata = localStorage.getItem(getStorageKey('bubify_playlist_metadata'));
        if (storedMetadata) {
            playlistMetadata = JSON.parse(storedMetadata);
        } else {
            playlistMetadata = {};
        }

        // 'Wszystkie utwory' jest efemeryczna i zawsze tworzona od nowa
        playlists['Wszystkie utwory'] = [];
    }

    function savePlaylists() {
        const playlistsToSave = { ...playlists };
        // Nie zapisujemy auto-generowanej playlisty
        delete playlistsToSave['Wszystkie utwory'];
        localStorage.setItem(getStorageKey('bubify_playlists'), JSON.stringify(playlistsToSave));        
        syncUp(); // Synchronizacja po każdej zmianie playlisty
    }

    function savePlaylistMetadata() {
        localStorage.setItem(getStorageKey('bubify_playlist_metadata'), JSON.stringify(playlistMetadata));
        // syncUp(); // Metadata też jest synchronizowana w savePlaylists (bo wywołujemy to często razem), ale można dodać też tu.
    }

    function togglePlaylistManager() {
        body.classList.toggle('playlist-manager-open');
    }

    function createPlaylist() {
        const name = prompt('Wprowadź nazwę nowej playlisty:');
        if (name && name.trim() !== '') {
            const trimmedName = name.trim();
            if (playlists[trimmedName]) {
                showToast('Playlista o tej nazwie już istnieje!');
            } else {
                playlists[trimmedName] = [];
                savePlaylists();
                populatePlaylistManager();
            }
        }
    }

    function deletePlaylist(name) {
        if (confirm(`Czy na pewno chcesz usunąć playlistę "${name}"? Tej operacji nie można cofnąć.`)) {
            if (activePlaylistName === name) {
                setActivePlaylist('Wszystkie utwory');
            }
            delete playlists[name];
            delete playlistMetadata[name]; // Usuń też okładkę
            savePlaylists();
            populatePlaylistManager();
        }
    }

    function populatePlaylistManager() {
        playlistManagerList.innerHTML = '';
        
        const allKeys = Object.keys(playlists);
        const sortedKeys = [
            ...allKeys.filter(k => k === 'Wszystkie utwory'),
            ...allKeys.filter(k => k !== 'Wszystkie utwory')
        ];

        sortedKeys.forEach(name => {
            const li = document.createElement('li');
            li.classList.add('playlist-manager-item');
            
            // Dodaj miniaturkę okładki
            const img = document.createElement('img');
            img.classList.add('playlist-manager-cover');
            if (playlistMetadata[name] && playlistMetadata[name].cover) {
                img.src = playlistMetadata[name].cover;
            } else {
                const letter = name.charAt(0).toUpperCase();
                img.src = `https://placehold.co/60x60/333/999?text=${letter}`;
            }
            li.appendChild(img);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            if (name === 'Radio') {
                const liveBadge = document.createElement('span');
                liveBadge.textContent = 'LIVE';
                liveBadge.style.cssText = 'background-color: #ff453a; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-left: 8px; vertical-align: middle; letter-spacing: 0.5px;';
                nameSpan.appendChild(liveBadge);
            }
            nameSpan.style.flexGrow = '1'; // Wypchnij przycisk usuwania na prawo
            li.appendChild(nameSpan);

            if (name === activePlaylistName) li.classList.add('active');

            // Dodaj przycisk usuwania dla playlist, które można usunąć
            if (name !== 'Wszystkie utwory' && name !== 'Ulubione' && name !== 'Radio') {
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-playlist-btn');
                deleteBtn.title = `Usuń playlistę "${name}"`;
                deleteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Zapobiegaj przełączeniu playlisty po kliknięciu usuń
                    deletePlaylist(name);
                });
                li.appendChild(deleteBtn);
            }
            
            // Dodaj obsługę upuszczania utworów na playlistę
            addPlaylistDropListeners(li, name);

            li.addEventListener('click', () => {
                setActivePlaylist(name);
                togglePlaylistManager();
            });
            playlistManagerList.appendChild(li);
        });
    }

    // --- Zarządzanie dodawaniem/usuwaniem utworów ---
    function openAddToPlaylistView(song) {
        songForAction = song;
        addToPlaylistTitle.textContent = `Dodaj "${song.title}" do...`;
        populateAddToPlaylistView();
        body.classList.add('add-to-playlist-open');
    }

    function closeAddToPlaylistView() {
        body.classList.remove('add-to-playlist-open');
    }

    function populateAddToPlaylistView() {
        addToPlaylistList.innerHTML = '';
        let delayIndex = 0;

        // Opcja usunięcia, jeśli jesteśmy na customowej playliście
        if (activePlaylistName !== 'Wszystkie utwory' && activePlaylistName !== 'Ulubione' && activePlaylistName !== 'Radio') {
            const removeItem = document.createElement('li');
            removeItem.classList.add('add-to-playlist-item', 'remove-item');
            removeItem.textContent = `Usuń z playlisty "${activePlaylistName}"`;
            removeItem.addEventListener('click', removeSongFromCurrentPlaylist);
            removeItem.style.animationDelay = `${delayIndex++ * 0.05}s`;
            addToPlaylistList.appendChild(removeItem);
        }

        // Lista playlist do których można dodać utwór
        Object.keys(playlists)
            .filter(name => name !== 'Wszystkie utwory' && name !== 'Radio')
            .forEach(name => {
                const li = document.createElement('li');
                li.classList.add('add-to-playlist-item');
                li.textContent = name;
                li.addEventListener('click', () => addSongToPlaylist(name));
                li.style.animationDelay = `${delayIndex++ * 0.05}s`;
                addToPlaylistList.appendChild(li);
            });
    }

    function addSongToPlaylist(playlistName) {
        if (!songForAction || !playlists[playlistName]) return;

        if (playlistName === 'Radio') {
            showToast('Nie można dodawać utworów do playlisty Radio.');
            return;
        }

        const songUrl = songForAction.audio;
        if (!playlists[playlistName].includes(songUrl)) {
            playlists[playlistName].push(songUrl);
            savePlaylists();
        }
        showToast(`Dodano do playlisty "${playlistName}"`);
        closeAddToPlaylistView();
    }

    function removeSongFromCurrentPlaylist() {
        if (!songForAction || activePlaylistName === 'Wszystkie utwory' || activePlaylistName === 'Ulubione') return;

        const songUrl = songForAction.audio;
        const index = playlists[activePlaylistName].indexOf(songUrl);
        if (index > -1) {
            playlists[activePlaylistName].splice(index, 1);
            savePlaylists();
            setActivePlaylist(activePlaylistName); // Odśwież widok
        }
        closeAddToPlaylistView();
    }

    // Funkcja pobierająca utwory (wydzielona, aby wywołać po zalogowaniu)
    function fetchSongs() {
    fetch('https://api.github.com/repos/bearsleeping/Muzyka/contents/')
      .then(res => res.json())
      .then(files => {
          allSongs = files
              .filter(f => f.name.endsWith('.mp3'))
              .map(f => {
                  const name = f.name.replace(/\.mp3$/, '');
                  const parts = name.split(' - ');
                  const artist = parts.length > 1 ? parts[0].trim() : 'Nieznany artysta';
                  const title = parts.length > 1 ? parts[1].trim() : name;
                  
                  return {
                      title: title,
                      artist: artist,
                      duration: '0:00',
                      cover: 'https://placehold.co/100x100/2c2c2e/ffffff?text=?', // Placeholder
                      audio: f.download_url
                  };
              });
          
          // Dodaj stacje radiowe
          const radioStations = [
              {
                  title: 'RMF FM',
                  artist: 'Radio Live',
                  duration: 'LIVE',
                  cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/RMF_FM_logo.svg/2048px-RMF_FM_logo.svg.png',
                  audio: 'https://rs101-krk.rmfstream.pl/rmf_fm'
              },
              {
                  title: 'Radio ZET',
                  artist: 'Radio Live',
                  duration: 'LIVE',
                  cover: 'https://uk.radio.net/175/radiozetnarower.png?version=ee97e7de3eb06f56d34af61f4765a1a81b52f180',
                  audio: 'https://n-6-6.dcs.redcdn.pl/sc/o2/Eurozet/live/audio.livx'
              }
            , {
                  title: 'Eska',
                  artist: 'Radio Live',
                  duration: 'LIVE',
                  cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP4UqE6zwVmNVmDC7CM4U7oiZfBmKm4SpFuQ&s',
                  audio: 'https://waw.ic.smcdn.pl/2180-2.aac'
              }
            , {
                  title: 'Eska 2',
                  artist: 'Radio Live',
                  duration: 'LIVE',
                  cover: 'https://radiofm-online.com/files/polskie-radio/styles/180/public/logo/eska2.jpg?itok=k7l0r8DE',
                  audio: 'https://waw.ic.smcdn.pl/1380-1.aac'
              },
            {
                  title: 'Radio Olsztyn',
                  artist: 'Radio Live',
                  duration: 'LIVE',
                  cover: 'https://radiofm-online.com/files/polskie-radio/styles/media/public/logo/radio-olsztyn.jpg',
                  audio: 'https://rostr1.radioolsztyn.pl:8843/RO'
              },
            {
                  title: 'RMF Classic',
                  artist: 'Radio Live',
                  duration: 'LIVE',
                  cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/RMF_CLASSIC_-_logotyp.png/1200px-RMF_CLASSIC_-_logotyp.png',
                  audio: 'https://rs101-krk.rmfstream.pl/rmf_classic'
              },
            {
                  title: 'RMF MAXXX',
                  artist: 'Radio Live',
                  duration: 'LIVE',
                  cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/RMF_MAXX.png/1200px-RMF_MAXX.png?20220927141656 2x',
                  audio: 'https://rs203-krk.rmfstream.pl/rmf_maxxx_wlc'
              },
            {
                  title: 'PR Radio Katowice',
                  artist: 'Radio Live',
                  duration: 'LIVE',
                  cover: 'https://images.seeklogo.com/logo-png/19/1/polskie-radio-katowice-logo-png_seeklogo-194811.png',
                  audio: 'https://stream4.nadaje.com:9213/radiokatowice'
              }
          ];

          radioStations.forEach(station => {
              allSongs.push(station);
              if (!playlists['Radio'].includes(station.audio)) playlists['Radio'].push(station.audio);
          });

          // Wypełnij playlistę "Wszystkie utwory"
          playlists['Wszystkie utwory'] = allSongs.filter(s => s.duration !== 'LIVE').map(s => s.audio);

          // Ustaw aktywną playlistę (ostatnio używaną lub domyślną)
          const lastActivePlaylist = localStorage.getItem(getStorageKey('bubify_lastActivePlaylist')) || 'Wszystkie utwory';
          setActivePlaylist(playlists[lastActivePlaylist] ? lastActivePlaylist : 'Wszystkie utwory');

          // Przywróć ostatnio odtwarzany utwór i czas
          const lastSongUrl = localStorage.getItem(getStorageKey('bubify_lastSong'));
          const lastTime = localStorage.getItem(getStorageKey('bubify_lastTime'));
          
          if (lastSongUrl) {
              const index = songs.findIndex(s => s.audio === lastSongUrl);
              if (index !== -1) {
                  currentSongIndex = index;
                  loadSong(currentSongIndex);
                  if (lastTime) {
                      audio.currentTime = parseFloat(lastTime);
                  }
              }
          }

          fetchAlbumCovers(); // Pobierz okładki w tle
      })
      .catch(err => console.error("Błąd podczas pobierania listy utworów:", err));
    }
    
    // --- Obsługa okładek playlist ---
    function resizeAndSaveCover(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 300; // Ograniczenie rozmiaru do 300px
                let width = img.width;
                let height = img.height;
                
                // Skalowanie z zachowaniem proporcji
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Kompresja do JPEG 70% jakości
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                
                if (!playlistMetadata[activePlaylistName]) playlistMetadata[activePlaylistName] = {};
                playlistMetadata[activePlaylistName].cover = dataUrl;
                savePlaylistMetadata();
                playlistCoverImg.src = dataUrl;
                populatePlaylistManager(); // Odśwież listę playlist, aby pokazać nową okładkę
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }

    function setActivePlaylist(name) {
        if (!playlists[name]) {
            console.error(`Playlista "${name}" nie istnieje.`);
            return;
        }
        activePlaylistName = name;
        searchInput.value = ''; // Wyczyść wyszukiwarkę przy zmianie playlisty
        
        // Generuj tablicę `songs` dla aktywnej playlisty
        const songUrls = playlists[activePlaylistName];
        songs = songUrls.map(url => allSongs.find(s => s.audio === url)).filter(Boolean);

        playlistTitleEl.textContent = activePlaylistName;
        
        // Ustawianie okładki playlisty
        if (playlistMetadata[name] && playlistMetadata[name].cover) {
            playlistCoverImg.src = playlistMetadata[name].cover;
        } else {
            // Domyślna okładka (placeholder z pierwszą literą)
            const letter = name.charAt(0).toUpperCase();
            playlistCoverImg.src = `https://placehold.co/300x300/333/999?text=${letter}`;
        }

        // Pokaż/ukryj możliwość edycji okładki (tylko dla własnych playlist)
        if (name !== 'Wszystkie utwory' && name !== 'Radio') {
            playlistCoverOverlay.style.display = 'flex';
            playlistCoverOverlay.onclick = () => playlistCoverInput.click();
        } else {
            playlistCoverOverlay.style.display = 'none';
            playlistCoverOverlay.onclick = null;
        }
        
        // Pokaż/ukryj przycisk edycji
        if (name !== 'Wszystkie utwory' && name !== 'Radio') {
            editPlaylistBtn.style.display = 'flex';
        } else {
            editPlaylistBtn.style.display = 'none';
        }

        populatePlaylist();
        populatePlaylistManager();

        if (songs.length > 0) {
            loadSong(0);
        } else {
            // Wyczyść interfejs, jeśli playlista jest pusta
            document.querySelector('.song-title').textContent = 'Playlista jest pusta';
            document.querySelector('.song-artist').textContent = '...';
            document.querySelector('.album-cover img').src = 'https://placehold.co/100x100/2c2c2e/ffffff?text=?';
            durationEl.textContent = '0:00';
            currentTimeEl.textContent = '0:00';
            progress.style.width = '0%';
            audio.src = '';
            if (isPlaying) pauseSong();
        }
        localStorage.setItem(getStorageKey('bubify_lastActivePlaylist'), name);
    }

    function populatePlaylist() {
        songListEl.innerHTML = '';
        const favoriteUrls = new Set(playlists['Ulubione']);
        const isCustomPlaylist = activePlaylistName !== 'Wszystkie utwory';
        const searchTerm = searchInput.value.toLowerCase();

        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.classList.add('song-item');
            
            if (searchTerm) {
                const title = song.title.toLowerCase();
                const artist = song.artist.toLowerCase();
                if (!title.includes(searchTerm) && !artist.includes(searchTerm)) {
                    li.style.display = 'none';
                }
            }

            li.setAttribute('draggable', 'true');
            li.dataset.index = index;
            const isFavorite = favoriteUrls.has(song.audio);

            let actionButtonHtml;
            if (isCustomPlaylist) {
                actionButtonHtml = `
                    <button class="delete-song-btn" title="Usuń z playlisty">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                `;
            } else {
                actionButtonHtml = `
                    <button class="more-options-btn" title="Dodaj do playlisty">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </button>
                `;
            }

            li.innerHTML = `
                <div class="song-number">${index + 1}</div>
                <div class="song-thumbnail"><img src="${song.cover}" alt="Okładka"></div>
                <div class="song-item-info">
                    <div class="song-item-title">${song.title}</div>
                    <div class="song-item-artist">${song.artist}</div>
                </div>
                <div class="song-item-duration">${song.duration}</div>
                <div class="song-item-actions">
                    <button class="favorite-btn ${isFavorite ? 'is-favorite' : ''}">
                        <svg class="icon-heart-empty" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        <svg class="icon-heart-filled" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                    ${actionButtonHtml}
                </div>
            `;
            li.querySelector('.song-item-info').addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
                body.classList.remove('queue-open'); // Dodatkowo zamyka kolejkę po wyborze utworu
                queueBtn.classList.remove('active');
            });
            li.querySelector('.favorite-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(song);
            });
            if (isCustomPlaylist) {
                li.querySelector('.delete-song-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeSongFromPlaylist(index);
                });
            } else {
                li.querySelector('.more-options-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    openAddToPlaylistView(song);
                });
            }
            addDragAndDropListeners(li);
            songListEl.appendChild(li);
        });
    }

    function loadSong(index) {
        if (!songs[index]) return;
        const song = songs[index];
        document.querySelector('.song-title').textContent = song.title;
        document.querySelector('.song-artist').textContent = song.artist;
        document.querySelector('.album-cover img').src = song.cover;
        durationEl.textContent = song.duration;

        audio.src = song.audio;

        // Sprawdzenie artysty i dodanie/usunięcie klasy dla cienia
        albumCover.classList.remove('type-o-negative-glow', 'rammstein-glow');
        
        const artistLower = song.artist.toLowerCase();
        if (artistLower.includes('type o negative')) {
            albumCover.classList.add('type-o-negative-glow');
        } else if (artistLower.includes('rammstein')) {
            albumCover.classList.add('rammstein-glow');
        }

        document.querySelectorAll('.song-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`.song-item:nth-child(${index + 1})`)?.classList.add('active');

        // Aktualizacja stanu przycisku ulubionych w głównym odtwarzaczu
        if (playlists['Ulubione'].includes(song.audio)) {
            favoritePlayerBtn.classList.add('is-favorite');
        } else {
            favoritePlayerBtn.classList.remove('is-favorite');
        }

        // Zresetuj i potencjalnie rozpocznij animację obrotu dla nowego utworu
        cancelAnimationFrame(animationFrameId);
        currentRotation = 0;
        albumCover.style.transform = 'rotate(0deg)';
        if (isPlaying) {
            animationFrameId = requestAnimationFrame(rotateCover);
        }

        // Aktualizacja metadanych dla Media Session API - Chodzi o okładkę na panelu powiadomień
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                album: 'Bubify',
                artwork: [
                    { src: song.cover, sizes: '96x96', type: 'image/jpeg' },
                    { src: song.cover, sizes: '512x512', type: 'image/jpeg' },
                ]
            });
        }
    }

    function togglePlay() {
        if(isPlaying) pauseSong(); else playSong();
    }

    function playSong() {
        if(!audio.src) return;
        isPlaying = true;
        body.classList.add('playing'); // Ta klasa kontroluje teraz widoczność ikony
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(rotateCover);
        audio.play();
        
        // Zwiększ licznik odtworzeń dla użytkownika
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            if (users[currentUser]) {
                users[currentUser].plays = (users[currentUser].plays || 0) + 1;
                
                // --- NOWOŚĆ: Historia odtworzeń (dla filtrowania po dacie) ---
                if (!users[currentUser].playHistory) users[currentUser].playHistory = [];
                const currentSong = songs[currentSongIndex];
                if (currentSong && currentSong.duration !== 'LIVE') {
                    users[currentUser].playHistory.push({
                        timestamp: Date.now(),
                        artist: currentSong.artist,
                        title: currentSong.title
                    });
                    // Opcjonalnie: Limit historii (np. ostatnie 2000 utworów), aby nie przepełnić localStorage
                    if (users[currentUser].playHistory.length > 2000) users[currentUser].playHistory.shift();
                }

                // Statystyki utworów
                if (!users[currentUser].songStats) users[currentUser].songStats = {};
                if (currentSong && currentSong.duration !== 'LIVE') {
                    const songKey = `${currentSong.artist} - ${currentSong.title}`;
                    users[currentUser].songStats[songKey] = (users[currentUser].songStats[songKey] || 0) + 1;
                }

                localStorage.setItem('bubify_users', JSON.stringify(users));
            }
        }

        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
    }

    function pauseSong() {
        isPlaying = false;
        body.classList.remove('playing');
        cancelAnimationFrame(animationFrameId);
        audio.pause();
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "paused";
        }
    }

    function nextSong() {
        if (songs.length === 0) return;
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function prevSong() {
        if (songs.length === 0) return;
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        if(isPlaying) playSong();
    }

    function fetchAlbumCovers() {
        allSongs.forEach((song, index) => {
            if (song.artist === 'Nieznany artysta' || song.artist === 'Radio Live') return;

            const searchTerm = encodeURIComponent(`${song.artist} ${song.title}`);
            const url = `https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=1`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        const coverUrl = data.results[0].artworkUrl100.replace('100x100', '600x600');
                        allSongs[index].cover = coverUrl;

                        // Aktualizacja okładki w odtwarzaczu (jeśli to ten utwór)
                        if (songs[currentSongIndex] === song) {
                            document.querySelector('.album-cover img').src = coverUrl;
                            // Zaktualizuj również okładkę w Media Session
                            if ('mediaSession' in navigator && navigator.mediaSession.metadata) {
                                navigator.mediaSession.metadata.artwork = [
                                    { src: coverUrl, sizes: '96x96', type: 'image/jpeg' },
                                    { src: coverUrl, sizes: '512x512', type: 'image/jpeg' },
                                ]; 
                            }
                        }

                        // Aktualizacja okładki na liście (jeśli jest widoczna)
                        const listItems = document.querySelectorAll('.song-item');
                        listItems.forEach(item => {
                            const idx = item.dataset.index;
                            if (songs[idx] === song) {
                                const img = item.querySelector('.song-thumbnail img');
                                if (img) img.src = coverUrl;
                            }
                        });
                    }
                })
                .catch(err => console.warn(`Nie udało się pobrać okładki dla: ${song.title}`, err));
        });
    }

    function toggleFavorite(songToToggle) {
        if (songToToggle.duration === 'LIVE') {
            showToast('Nie można dodać stacji radiowej do Ulubionych.');
            return;
        }

        const favoritePlaylist = playlists['Ulubione'];
        const songUrl = songToToggle.audio;
        const songIndexInFavorites = favoritePlaylist.indexOf(songUrl);

        if (songIndexInFavorites > -1) {
            favoritePlaylist.splice(songIndexInFavorites, 1);
        } else {
            favoritePlaylist.push(songUrl);
        }

        // Aktualizuj przycisk w głównym odtwarzaczu, jeśli zmieniamy aktualnie graną piosenkę
        if (songs[currentSongIndex] && songs[currentSongIndex].audio === songUrl) {
            favoritePlayerBtn.classList.toggle('is-favorite');
        }
        
        savePlaylists();
        // Odśwież widok, aby zaktualizować serduszka
        if (activePlaylistName === 'Ulubione') {
            setActivePlaylist('Ulubione'); // Pełne odświeżenie, jeśli jesteśmy na liście ulubionych
        } else {
            populatePlaylist(); // Tylko odświeżenie serduszek w bieżącym widoku
        }
    }

    function toggleQueue() {
        body.classList.toggle('queue-open');
        queueBtn.classList.toggle('active');
    }

    function cycleRepeatMode() {
        repeatMode = (repeatMode + 1) % 3;
        updateRepeatUI();
        localStorage.setItem(getStorageKey('bubify_repeat'), repeatMode);
        syncUp(); // Synchronizuj tryb powtarzania
    }

    function updateRepeatUI() {
        if (repeatMode === 0) { // None
            repeatBtn.classList.remove('active');
            iconRepeatAll.style.display = 'block';
            iconRepeatOne.style.display = 'none';
        } else if (repeatMode === 1) { // All
            repeatBtn.classList.add('active');
            iconRepeatAll.style.display = 'block';
            iconRepeatOne.style.display = 'none';
        } else { // One (repeatMode === 2)
            iconRepeatAll.style.display = 'none';
            iconRepeatOne.style.display = 'block';
        }
    }

    function rotateCover() {
        if (!isPlaying) return;
        currentRotation += 0.1; // Dostosuj prędkość obrotu
        albumCover.style.transform = `rotate(${currentRotation}deg)`;
        animationFrameId = requestAnimationFrame(rotateCover);
    }

    function updateVolumeSlider() {
        const percentage = (volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min) * 100;
        volumeSlider.style.setProperty('--volume-progress', `${percentage}%`);
    }

    // --- Funkcjonalność przewijania (skreczowania) na desktop i mobile ---
    let isScrubbing = false;
    let wasPlayingBeforeScrub = false;
    let albumCoverCenterX, albumCoverCenterY;
    let lastAngle = 0;

    function handleScrubStart(e) {
        if (!audio.duration) return;
        e.preventDefault(); // Zapobiega domyślnym akcjom, np. zaznaczaniu tekstu lub przewijaniu strony na mobile

        isScrubbing = true;
        wasPlayingBeforeScrub = isPlaying;
        if (wasPlayingBeforeScrub) {
            pauseSong();
        }

        // Oblicz środek okładki
        const rect = albumCover.getBoundingClientRect();
        albumCoverCenterX = rect.left + rect.width / 2;
        albumCoverCenterY = rect.top + rect.height / 2;

        // Pobierz pozycję wskaźnika (mysz lub dotyk)
        const pointerX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const pointerY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        // Ustaw kąt początkowy do obliczania różnicy w ruchu
        lastAngle = Math.atan2(pointerY - albumCoverCenterY, pointerX - albumCoverCenterX);

        body.classList.add('scrubbing');
        progress.style.transition = 'none'; // Wyłącz płynną animację paska postępu dla natychmiastowej reakcji
    }

    function handleScrubMove(e) {
        if (!isScrubbing) return;
        e.preventDefault();

        const pointerX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const pointerY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const currentAngle = Math.atan2(pointerY - albumCoverCenterY, pointerX - albumCoverCenterX);
        let deltaAngle = currentAngle - lastAngle;

        // Poprawka na "przeskakiwanie" kąta z +180 na -180 stopni i odwrotnie
        if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
        if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

        const deltaAngleDeg = deltaAngle * (180 / Math.PI);

        // Zaktualizuj obrót wizualny, dodając zmianę
        currentRotation += deltaAngleDeg;
        albumCover.style.transform = `rotate(${currentRotation}deg)`;

        // Zaktualizuj czas utworu na podstawie zmiany kąta
        const timePerDegree = 15 / 360; // Czułość: 15 sekund utworu na pełny obrót (360 stopni)
        const timeChange = deltaAngleDeg * timePerDegree;
        let newTime = audio.currentTime + timeChange;
        if (newTime < 0) newTime = 0;
        if (newTime > audio.duration) newTime = audio.duration;
        audio.currentTime = newTime;

        // Zapisz aktualny kąt na potrzeby następnego ruchu
        lastAngle = currentAngle;
    }

    function handleScrubEnd() {
        if (!isScrubbing) return;
        isScrubbing = false;
        body.classList.remove('scrubbing');
        progress.style.transition = 'width 0.1s linear'; // Włącz ponownie animację paska
        if (wasPlayingBeforeScrub) playSong();
    }

    // --- Funkcjonalność przewijania (skreczowania) na PASKU POSTĘPU ---
    let isProgressScrubbing = false;

    function setSongPosition(e) {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        // Dla zdarzeń dotykowych użyj pierwszego punktu dotyku
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const offsetX = clientX - rect.left;
        const width = rect.width;
        let newTime = (offsetX / width) * audio.duration;

        // Ogranicz wartość do zakresu od 0 do czasu trwania utworu
        if (newTime < 0) newTime = 0;
        if (newTime > audio.duration) newTime = audio.duration;

        audio.currentTime = newTime;
    }

    function handleProgressScrubStart(e) {
        e.preventDefault();
        isProgressScrubbing = true;
        progress.style.transition = 'none'; // Wyłącz płynną animację dla natychmiastowej reakcji
        body.classList.add('scrubbing');
        setSongPosition(e); // Ustaw pozycję od razu po kliknięciu
    }

    function handleProgressScrubMove(e) {
        if (!isProgressScrubbing) return;
        e.preventDefault();
        setSongPosition(e);
    }

    function handleProgressScrubEnd() {
        if (!isProgressScrubbing) return;
        isProgressScrubbing = false;
        progress.style.transition = 'width 0.1s linear'; // Włącz ponownie animację paska
        body.classList.remove('scrubbing');
    }

    // Dodanie nasłuchiwaczy dla paska postępu (zastępuje stary 'click')
    progressBar.addEventListener('mousedown', handleProgressScrubStart);
    progressBar.addEventListener('touchstart', handleProgressScrubStart, { passive: false });

    // Nasłuchiwacze na całym dokumencie, aby przeciąganie działało płynnie
    document.addEventListener('mousemove', handleProgressScrubMove);
    document.addEventListener('touchmove', handleProgressScrubMove, { passive: false });

    document.addEventListener('mouseup', handleProgressScrubEnd);
    document.addEventListener('touchend', handleProgressScrubEnd);

    audio.addEventListener('timeupdate', () => {
        if(!audio.duration) return;
        const progressPercent = (audio.currentTime/audio.duration)*100;
        progress.style.width = `${progressPercent}%`;

        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        if (audio.duration) {
            const formattedDuration = formatTime(audio.duration);
            durationEl.textContent = formattedDuration;
            
            if (songs[currentSongIndex]) {
                songs[currentSongIndex].duration = formattedDuration;
                const songItem = songListEl.querySelector(`.song-item:nth-child(${currentSongIndex + 1})`);
                if (songItem) songItem.querySelector('.song-item-duration').textContent = formattedDuration;
            }
        }
    });

    audio.addEventListener('ended', () => {
        if (repeatMode === 2) { // Powtarzaj jeden
            audio.currentTime = 0;
            playSong();
        } else if (repeatMode === 1) { // Powtarzaj wszystko
            nextSong();
        } else { // Bez powtarzania
            if (currentSongIndex < songs.length - 1) {
                nextSong();
            } else {
                // Koniec listy, zatrzymaj odtwarzanie
                pauseSong();
                audio.currentTime = 0;
            }
        }
    });
    playBtn.addEventListener('click', togglePlay);
    document.querySelector('.prev-btn').addEventListener('click', prevSong);
    document.querySelector('.next-btn').addEventListener('click', nextSong);
    queueBtn.addEventListener('click', toggleQueue);
    repeatBtn.addEventListener('click', cycleRepeatMode);
    managePlaylistsBtn.addEventListener('click', togglePlaylistManager);
    closePlaylistManagerBtn.addEventListener('click', togglePlaylistManager);
    createPlaylistBtn.addEventListener('click', createPlaylist);
    closeAddToPlaylistBtn.addEventListener('click', closeAddToPlaylistView);
    addToPlaylistView.addEventListener('click', (e) => {
        if (e.target === addToPlaylistView) closeAddToPlaylistView();
    });
    favoritePlayerBtn.addEventListener('click', () => {
        if (songs[currentSongIndex]) toggleFavorite(songs[currentSongIndex]);
    });
    
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const items = songListEl.querySelectorAll('.song-item');
        items.forEach(item => {
            const title = item.querySelector('.song-item-title').textContent.toLowerCase();
            const artist = item.querySelector('.song-item-artist').textContent.toLowerCase();
            if (title.includes(term) || artist.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    playlistCoverInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            resizeAndSaveCover(e.target.files[0]);
        }
    });

    // --- Obsługa modala edycji playlisty ---
    let tempCoverDataUrl = null;

    editPlaylistBtn.addEventListener('click', () => {
        editModalNameInput.value = activePlaylistName;
        if (activePlaylistName === 'Ulubione' || activePlaylistName === 'Radio') {
            editModalNameInput.disabled = true;
            editModalNameInput.title = "Nie można zmienić nazwy playlisty systemowej";
        } else {
            editModalNameInput.disabled = false;
            editModalNameInput.title = "";
        }
        
        if (playlistMetadata[activePlaylistName] && playlistMetadata[activePlaylistName].cover) {
            editModalCoverImg.src = playlistMetadata[activePlaylistName].cover;
        } else {
            const letter = activePlaylistName.charAt(0).toUpperCase();
            editModalCoverImg.src = `https://placehold.co/300x300/333/999?text=${letter}`;
        }
        tempCoverDataUrl = null;
        editPlaylistModal.classList.add('open');
    });

    function closeEditModal() {
        editPlaylistModal.classList.remove('open');
    }

    editModalCancelBtn.addEventListener('click', closeEditModal);
    editModalCoverWrapper.addEventListener('click', () => editModalFileInput.click());

    editModalFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxSize = 300;
                    let width = img.width;
                    let height = img.height;
                    if (width > height) { if (width > maxSize) { height *= maxSize / width; width = maxSize; } }
                    else { if (height > maxSize) { width *= maxSize / height; height = maxSize; } }
                    canvas.width = width; canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    tempCoverDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    editModalCoverImg.src = tempCoverDataUrl;
                }
                img.src = ev.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    editModalSaveBtn.addEventListener('click', () => {
        const newName = editModalNameInput.value.trim();
        if (!newName) return showToast("Nazwa nie może być pusta");
        
        // Zmiana nazwy
        if (newName !== activePlaylistName && activePlaylistName !== 'Ulubione' && activePlaylistName !== 'Radio') {
            if (playlists[newName]) return showToast("Playlista o tej nazwie już istnieje");
            
            // Kopiowanie danych
            playlists[newName] = playlists[activePlaylistName];
            if (playlistMetadata[activePlaylistName]) {
                playlistMetadata[newName] = playlistMetadata[activePlaylistName];
            }
            
            // Usuwanie starej playlisty
            delete playlists[activePlaylistName];
            delete playlistMetadata[activePlaylistName];
            
            activePlaylistName = newName;
        }

        // Aktualizacja okładki
        if (tempCoverDataUrl) {
            if (!playlistMetadata[activePlaylistName]) playlistMetadata[activePlaylistName] = {};
            playlistMetadata[activePlaylistName].cover = tempCoverDataUrl;
        }

        savePlaylists();
        savePlaylistMetadata();
        setActivePlaylist(activePlaylistName); // Odśwież widok
        closeEditModal();
    });

    // --- Drag & Drop Logic ---
    let dragStartIndex;

    function addDragAndDropListeners(item) {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
        item.addEventListener('dragend', dragEnd);
    }

    function dragStart() {
        dragStartIndex = +this.dataset.index;
        this.classList.add('dragging');
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }

    function dragLeave(e) {
        // Usuń klasę tylko jeśli kursor wychodzi poza element (a nie wchodzi w jego dziecko)
        if (!this.contains(e.relatedTarget)) {
            this.classList.remove('drag-over');
        }
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragDrop() {
        const dragEndIndex = +this.dataset.index;
        swapItems(dragStartIndex, dragEndIndex);
        this.classList.remove('drag-over');
    }
    
    function dragEnd() {
        this.classList.remove('dragging');
        document.querySelectorAll('.song-item').forEach(item => item.classList.remove('drag-over'));
    }

    function swapItems(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        
        const playlist = playlists[activePlaylistName];
        const itemToMove = playlist.splice(fromIndex, 1)[0];
        playlist.splice(toIndex, 0, itemToMove);
        
        if (activePlaylistName !== 'Wszystkie utwory') {
            savePlaylists();
        }
        
        // Odśwież widok zachowując stan odtwarzacza
        // Musimy ręcznie zaktualizować tablicę songs i currentSongIndex
        const currentSongUrl = songs[currentSongIndex] ? songs[currentSongIndex].audio : null;
        const songUrls = playlists[activePlaylistName];
        songs = songUrls.map(url => allSongs.find(s => s.audio === url)).filter(Boolean);

        if (currentSongUrl) {
            const newIndex = songs.findIndex(s => s.audio === currentSongUrl);
            if (newIndex !== -1) currentSongIndex = newIndex;
        }

        populatePlaylist();
        
        // Przywróć podświetlenie aktywnego utworu
        if (songs[currentSongIndex]) {
             document.querySelectorAll('.song-item').forEach(item => item.classList.remove('active'));
             document.querySelector(`.song-item:nth-child(${currentSongIndex + 1})`)?.classList.add('active');
        }
    }

    function addPlaylistDropListeners(item, playlistName) {
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            item.classList.add('drag-over-playlist');
        });
        item.addEventListener('dragleave', () => {
            item.classList.remove('drag-over-playlist');
        });
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.classList.remove('drag-over-playlist');
            handleDropOnPlaylist(playlistName);
        });
    }

    function handleDropOnPlaylist(targetPlaylistName) {
        if (dragStartIndex === undefined || dragStartIndex === null) return;
        
        const songToAdd = songs[dragStartIndex];
        if (!songToAdd) return;

        if (targetPlaylistName === 'Radio') {
            showToast('Nie można dodawać utworów do playlisty Radio.');
            return;
        }

        if (songToAdd.duration === 'LIVE' && (targetPlaylistName === 'Ulubione' || targetPlaylistName === 'Wszystkie utwory')) {
            showToast('Nie można dodawać stacji radiowych do playlisty "' + targetPlaylistName + '".');
            return;
        }

        const songUrl = songToAdd.audio;
        
        if (targetPlaylistName === 'Wszystkie utwory' || !playlists[targetPlaylistName]) return;

        if (playlists[targetPlaylistName].includes(songUrl)) {
            showToast(`Utwór "${songToAdd.title}" znajduje się już na playliście "${targetPlaylistName}".`);
            return;
        }

        playlists[targetPlaylistName].push(songUrl);
        savePlaylists();
        
        if (targetPlaylistName === activePlaylistName) {
             const songUrls = playlists[activePlaylistName];
             songs = songUrls.map(url => allSongs.find(s => s.audio === url)).filter(Boolean);
             populatePlaylist();
        }
    }

    function removeSongFromPlaylist(index) {
        if (activePlaylistName === 'Wszystkie utwory') return;
        
        playlists[activePlaylistName].splice(index, 1);
        savePlaylists();
        
        const songUrls = playlists[activePlaylistName];
        songs = songUrls.map(url => allSongs.find(s => s.audio === url)).filter(Boolean);
        
        // Aktualizuj currentSongIndex, aby podświetlenie zostało na właściwym utworze
        if (songs.length > 0 && audio.src) {
             const newIndex = songs.findIndex(s => s.audio === audio.src);
             if (newIndex !== -1) currentSongIndex = newIndex;
        }

        populatePlaylist();
        
        if (songs[currentSongIndex] && audio.src === songs[currentSongIndex].audio) {
             document.querySelectorAll('.song-item').forEach(item => item.classList.remove('active'));
             document.querySelector(`.song-item:nth-child(${currentSongIndex + 1})`)?.classList.add('active');
        }
    }

    volumeSlider.addEventListener('input', (e) => {
        const vol = e.target.value / 100;
        audio.volume = vol;
        updateVolumeSlider();
        localStorage.setItem(getStorageKey('bubify_volume'), vol);
    });
    audio.volume = volumeSlider.value / 100;
    updateVolumeSlider();

    // --- Global Reaction Picker ---
    const globalReactionPicker = document.createElement('div');
    globalReactionPicker.className = 'reaction-picker';
    globalReactionPicker.innerHTML = `
        <span class="reaction-option" data-emoji="❤️">❤️</span>
        <span class="reaction-option" data-emoji="👍">👍</span>
        <span class="reaction-option" data-emoji="😂">😂</span>
        <span class="reaction-option" data-emoji="😮">😮</span>
        <span class="reaction-option" data-emoji="😢">😢</span>
        <span class="reaction-option" data-emoji="🔥">🔥</span>
        <span class="reaction-option" data-emoji="🎉">🎉</span>
        <span class="reaction-option" data-emoji="🤔">🤔</span>
    `;
    document.body.appendChild(globalReactionPicker);

    let currentReactionMessageId = null;

    globalReactionPicker.querySelectorAll('.reaction-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            if (currentReactionMessageId) {
                toggleReaction(currentReactionMessageId, e.target.dataset.emoji);
                globalReactionPicker.classList.remove('show');
            }
        });
    });

    function showGlobalReactionPicker(messageId, messageDiv) {
        currentReactionMessageId = messageId;
        const rect = messageDiv.getBoundingClientRect();
        
        globalReactionPicker.style.display = 'flex';
        globalReactionPicker.style.visibility = 'hidden';
        const pickerRect = globalReactionPicker.getBoundingClientRect();
        globalReactionPicker.style.display = '';
        globalReactionPicker.style.visibility = '';
        
        globalReactionPicker.classList.add('show');
        
        let top = rect.bottom + 8;
        if (top + pickerRect.height > window.innerHeight) {
            top = rect.top - pickerRect.height - 8;
        }
        
        let left = rect.left + (rect.width / 2) - (pickerRect.width / 2);
        if (left < 10) left = 10;
        if (left + pickerRect.width > window.innerWidth - 10) left = window.innerWidth - pickerRect.width - 10;
        
        globalReactionPicker.style.top = `${top}px`;
        globalReactionPicker.style.left = `${left}px`;
    }

    // Obsługa prawego przycisku myszy dla reakcji (Context Menu)
    const chatMessagesContainer = document.getElementById('chat-messages-container');
    chatMessagesContainer.addEventListener('contextmenu', (e) => {
        const messageDiv = e.target.closest('.chat-message');
        if (messageDiv) {
            e.preventDefault();
            globalReactionPicker.classList.remove('show');
            if (messageDiv.dataset.messageId) {
                showGlobalReactionPicker(messageDiv.dataset.messageId, messageDiv);
            }
        }
    });

    // Zamykanie pickerów reakcji przy kliknięciu gdziekolwiek indziej
    const closeReactionPickers = (e) => {
        if (!e.target.closest('.reaction-picker')) {
            globalReactionPicker.classList.remove('show');
            friendContextMenu.style.display = 'none';
        }
    };

    document.addEventListener('click', closeReactionPickers);
    document.addEventListener('contextmenu', (e) => {
        if (!e.target.closest('.chat-message')) closeReactionPickers(e);
    });

    // Nasłuchiwanie na zdarzenia myszy i dotyku dla okładki
    albumCover.addEventListener('mousedown', handleScrubStart);
    albumCover.addEventListener('touchstart', handleScrubStart, { passive: false });

    // Nasłuchiwanie na całym dokumencie, aby przeciąganie działało nawet po wyjechaniu kursorem/palcem poza okładkę
    document.addEventListener('mousemove', handleScrubMove);
    document.addEventListener('touchmove', handleScrubMove, { passive: false });

    document.addEventListener('mouseup', handleScrubEnd);
    document.addEventListener('touchend', handleScrubEnd);

    // Zapisywanie stanu odtwarzania (utwór i czas)
    function savePlaybackState() {
        if (songs[currentSongIndex]) {
            localStorage.setItem(getStorageKey('bubify_lastSong'), songs[currentSongIndex].audio);
            localStorage.setItem(getStorageKey('bubify_lastTime'), audio.currentTime);
        }
    }

    window.addEventListener('beforeunload', savePlaybackState);
    window.addEventListener('pagehide', savePlaybackState); // Dla mobilnych przeglądarek
    audio.addEventListener('pause', savePlaybackState);

    // Integracja z Media Session API (sterowanie z belki systemowej / ekranu blokady)
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', playSong);
        navigator.mediaSession.setActionHandler('pause', pauseSong);
        navigator.mediaSession.setActionHandler('previoustrack', prevSong);
        navigator.mediaSession.setActionHandler('nexttrack', nextSong);
    }

    // Globalny listener klawiatury dla play/pause
    document.addEventListener('keydown', (e) => {
        // Użyj spacji do odtwarzania/pauzowania, chyba że fokus jest na polu tekstowym
        if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault(); // Zapobiegaj przewijaniu strony po naciśnięciu spacji
            togglePlay();
        }
    });

    // Sprawdź status logowania na starcie
    if (supabase) {
        supabase.auth.onAuthStateChange((event, session) => {
            // Ignoruj INITIAL_SESSION jeśli mamy token w URL (czekamy na SIGNED_IN po przetworzeniu hasha)
            if (event === 'INITIAL_SESSION' && !session && window.location.hash && window.location.hash.includes('access_token')) {
                return;
            }

            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                checkLogin(session);
                // Wyczyść URL po pomyślnym logowaniu OAuth
                if (session && window.location.hash && window.location.hash.includes('access_token')) {
                    window.history.replaceState(null, null, window.location.pathname);
                }
            } else if (event === 'SIGNED_OUT') {
                checkLogin(null);
            }
        });
    } else {
        checkLogin();
    }

});
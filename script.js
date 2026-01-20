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
    // Dodatkowa obsługa dla nowego Safari (pasek adresu na dole)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', setViewportHeight);
    }

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
    
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userProfileName = document.getElementById('user-profile-name');
    const userDropdown = document.getElementById('user-dropdown');
    const userDropdownAccount = document.getElementById('user-dropdown-account');
    const userDropdownTheme = document.getElementById('user-dropdown-theme');
    const userDropdownLogout = document.getElementById('user-dropdown-logout');

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
    const authView = document.getElementById('auth-view');
    const authDiscordBtn = document.getElementById('auth-discord-btn');
    
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
        'kino-view': document.getElementById('kino-view')
    };

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

            // Ukryj odtwarzacz w widokach Kino
            if (targetId === 'kino-view') {
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

    // Obsługa logowania przez Discord (przeniesione z login.js)
    if (authDiscordBtn) {
        authDiscordBtn.addEventListener('click', async () => {
            try {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'discord',
                    options: {
                        redirectTo: window.location.origin + window.location.pathname // Powrót na tę samą stronę
                    }
                });
                if (error) throw error;
            } catch (e) {
                showToast('Błąd Discord: ' + e.message);
            }
        });
    }

    // Funkcja pobierająca dane z Supabase (Logowanie / Start)
    async function syncDown(specificUser = null) {
        if (!supabase) return false;

        try {
            // 1. Synchronizacja global_users (jeśli specificUser to 'global' lub null)
            if (specificUser === 'global' || specificUser === null) {
                 const { data: globalData, error: globalError } = await supabase
                    .from('bubify_data')
                    .select('content')
                    .eq('id', 'global_users')
                    .maybeSingle();
                 
                 if (!globalError && globalData && globalData.content) {
                     // Merge z lokalnymi, żeby nie stracić np. sesji
                     const localUsers = JSON.parse(localStorage.getItem('bubify_users') || '{}');
                     const merged = { ...localUsers, ...globalData.content };
                     localStorage.setItem('bubify_users', JSON.stringify(merged));
                 }
                 if (specificUser === 'global') return true;
            }

            const targetUser = (specificUser === 'global' || specificUser === null) ? currentUser : specificUser;
            if (!targetUser) return false;

            // 2. Synchronizacja danych użytkownika
            const { data, error } = await supabase
                .from('bubify_data')
                .select('content')
                .eq('id', `user_${targetUser}`)
                .maybeSingle();

            if (error) throw error;

            if (data && data.content) {
                const content = data.content;
                
                // Przywracanie playlist
                if (content.playlists) {
                    localStorage.setItem(`${targetUser}_bubify_playlists`, JSON.stringify(content.playlists));
                }
                
                // Przywracanie metadanych (okładki playlist)
                if (content.playlistMetadata) {
                    localStorage.setItem(`${targetUser}_bubify_playlist_metadata`, JSON.stringify(content.playlistMetadata));
                }

                // Przywracanie ustawień
                if (content.settings) {
                    if (content.settings.volume) localStorage.setItem(`${targetUser}_bubify_volume`, content.settings.volume);
                    if (content.settings.repeat) localStorage.setItem(`${targetUser}_bubify_repeat`, content.settings.repeat);
                    if (content.settings.theme) localStorage.setItem(`${targetUser}_musicPlayerTheme`, content.settings.theme);
                }

                console.log('Pobrano dane z Supabase dla:', targetUser);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Błąd synchronizacji (Down):', e);
            return false;
        }
    }

    // Funkcja wysyłająca dane do Supabase (Zapis)
    async function syncUp() {
        if (!supabase || !currentUser) return false;
        
        try {
            // 1. Zapisz listę użytkowników (globalną) - Bezpieczny Merge
            const { data: serverGlobal } = await supabase
                .from('bubify_data')
                .select('content')
                .eq('id', 'global_users')
                .maybeSingle();
            
            const serverUsers = serverGlobal?.content || {};
            const localUsers = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            const mergedUsers = { ...serverUsers, ...localUsers };

            const { error: usersError } = await supabase
                .from('bubify_data')
                .upsert({ id: 'global_users', content: mergedUsers });
            
            if (usersError) throw usersError;

            // 2. Zapisz dane użytkownika (playlisty, ulubione, ustawienia)
            const playlistsToSave = { ...playlists };
            delete playlistsToSave['Wszystkie utwory']; // Tego nie synchronizujemy
            
            const dataToSync = {
                playlists: playlistsToSave,
                playlistMetadata: playlistMetadata,
                settings: {
                    volume: localStorage.getItem(getStorageKey('bubify_volume')),
                    repeat: localStorage.getItem(getStorageKey('bubify_repeat')),
                    theme: localStorage.getItem(getStorageKey('musicPlayerTheme'))
                },
                lastSynced: new Date().toISOString()
            };

            const { error: userError } = await supabase
                .from('bubify_data')
                .upsert({ id: `user_${currentUser}`, content: dataToSync });
            
            if (userError) throw userError;

            console.log('Wysłano dane do Supabase');
            return true;
        } catch (e) {
            console.error('Błąd synchronizacji (Up):', e);
            return false;
        }
    }

    let isPlaying = false;
    let currentSongIndex = 0;
    const audio = document.createElement('audio'); // Zmiana na element DOM
    audio.preload = 'auto'; // Wymuś buforowanie
    document.body.appendChild(audio); // Dodanie do DOM zapobiega usypianiu w tle
    let currentRotation = 0;
    let animationFrameId = null;
    let repeatMode = 0; // 0: none, 1: all, 2: one
    let songForAction = null; // Przechowuje utwór do operacji (dodaj/usuń)
    let currentUser = null; // Aktualnie zalogowany użytkownik
    let tempAvatarDataUrl = null;
    let adminChartInstance = null;
    let adminArtistChartInstance = null;
    let lastSavedTime = 0; // Zmienna do optymalizacji zapisu stanu

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

        // --- OPTYMALIZACJA: Szybki start (Desktop/Mobile) ---
        // Sprawdź localStorage przed odpytaniem serwera.
        // Jeśli mamy zapisanego użytkownika, ładujemy go natychmiast.
        const storedUser = localStorage.getItem('bubify_current_user');
        if (storedUser && !explicitSession) {
            console.log('Szybki start z pamięci lokalnej dla:', storedUser);
            authView.classList.add('hidden'); // Ukryj logowanie natychmiast
            
            // Załaduj interfejs użytkownika od razu
            await loginUser(storedUser);

            // Weryfikacja sesji w tle (nie blokuje interfejsu)
            if (supabase) {
                supabase.auth.getSession().then(({ data }) => {
                    if (data.session) console.log('Sesja zweryfikowana w tle.');
                });
            }
            return; // Kończymy funkcję, nie czekamy na resztę
        }

        if (supabase && !session) {
            const { data } = await supabase.auth.getSession();
            session = data.session;
        }

        if (session && session.user) {
            sessionFound = true;
            authView.classList.add('hidden'); // Ukryj ekran logowania
            
            // 1. Pobierz aktualną bazę użytkowników, aby sprawdzić powiązania
            await syncDown('global'); 
            let users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
            
            let username = null;
            const email = session.user.email;
            
            // 2. Spróbuj znaleźć użytkownika po emailu (dla Discorda i logowania mailem)
            if (email) {
                const foundKey = Object.keys(users).find(k => users[k].email && users[k].email.toLowerCase() === email.toLowerCase());
                if (foundKey) username = foundKey;
            }

            let isNewUser = false;
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
                isNewUser = true;
                
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
                showToast(`Zalogowano jako: ${username}`);
            } else {
                // Dla istniejących użytkowników, aktualizuj profil z Discorda przy każdym logowaniu
                let profileUpdated = false;
                if (session.user.app_metadata.provider === 'discord') {
                    const discordName = session.user.user_metadata.full_name || session.user.user_metadata.name;
                    const discordAvatar = session.user.user_metadata.avatar_url;

                    // Wprowadzamy pole `displayName`, aby nie zmieniać klucza `username`
                    if (discordName && (!users[username].displayName || users[username].displayName !== discordName)) {
                        users[username].displayName = discordName;
                        profileUpdated = true;
                    }
                    if (discordAvatar && users[username].avatar !== discordAvatar) {
                        users[username].avatar = discordAvatar;
                        profileUpdated = true;
                    }
                }
                
                if (profileUpdated) {
                    localStorage.setItem('bubify_users', JSON.stringify(users));
                    await syncUp();
                    showToast('Profil zaktualizowany z Discorda!');
                    }
                }

            // Jeśli użytkownik jest już zalogowany w tej sesji, nie przeładowuj
            if (currentUser === username) return;

            await loginUser(username);

            // Dla nowych użytkowników wymuś natychmiastową synchronizację, aby utworzyć rekord w bazie
            // if (isNewUser) {
            //     await syncUp();
            // }
        }

        if (!sessionFound) {
            authView.classList.remove('hidden'); // Pokaż ekran logowania
            localStorage.removeItem('bubify_current_user');
        }
    }

    async function loginUser(username) {
        currentUser = username;
        localStorage.setItem('bubify_current_user', username);
        
        const users = JSON.parse(localStorage.getItem('bubify_users') || '{}');
        const userData = users[username] || {};
        const displayName = userData.displayName || username;
        userProfileName.textContent = displayName;

        // Pokaż przycisk admina jeśli to admin
        const userRole = localStorage.getItem('bubify_user_role');
        if (username === 'Administrator' || userRole === 'admin') {
            adminDropdownItem.style.display = 'flex';
        }

        // Sprawdź czy to pierwsze logowanie na tym urządzeniu (brak danych lokalnych)
        const hasLocalData = localStorage.getItem(getStorageKey('bubify_playlists'));
        const lastSyncTime = localStorage.getItem(getStorageKey('bubify_last_sync_time'));
        const now = Date.now();
        const shouldSync = !lastSyncTime || (now - parseInt(lastSyncTime) > 5 * 60 * 1000); // Synchronizacja co 5 minut

        let syncPromise = Promise.resolve(false);

        if (supabase) {
            if (!hasLocalData) {
                // Brak danych lokalnych - wymuś oczekiwanie na pobranie
                showToast('Pobieranie profilu...');
                await syncDown(username);
                localStorage.setItem(getStorageKey('bubify_last_sync_time'), now);
            } else if (shouldSync) {
                // Są dane lokalne, ale minął czas - pobierz w tle
                syncPromise = syncDown(username).then(result => {
                    if (result) localStorage.setItem(getStorageKey('bubify_last_sync_time'), Date.now());
                    return result;
                });
            } else {
                console.log('Pominięto synchronizację profilu (dane są aktualne).');
            }
        }

        // 1. Załaduj dane (teraz już mogą być zaktualizowane jeśli czekaliśmy)
        loadPlaylists();
        applyTheme(localStorage.getItem(getStorageKey('musicPlayerTheme')));
        
        // Załaduj głośność i powtarzanie
        const savedVolume = localStorage.getItem(getStorageKey('bubify_volume'));
        if (savedVolume !== null) {
            const vol = parseFloat(savedVolume);
            audio.volume = vol;
            volumeSlider.value = vol * 100;
            updateVolumeSlider();
        }
        const savedRepeat = localStorage.getItem(getStorageKey('bubify_repeat'));
        if (savedRepeat !== null) {
            repeatMode = parseInt(savedRepeat);
            updateRepeatUI();
        }

        // 2. Pobierz utwory natychmiast (niezależnie od synchronizacji profilu)
        if (allSongs.length === 0) {
            fetchSongs();
        } else {
            const lastActivePlaylist = localStorage.getItem(getStorageKey('bubify_lastActivePlaylist')) || 'Wszystkie utwory';
            setActivePlaylist(playlists[lastActivePlaylist] ? lastActivePlaylist : 'Wszystkie utwory');
        }

        // Załaduj awatar (lokalnie)
        if (userData.avatar) {
            updateHeaderAvatar(userData.avatar);
        } else {
            resetHeaderAvatar();
        }

        // 3. Obsługa synchronizacji w tle (jeśli nie czekaliśmy)
        if (supabase && hasLocalData) {
            syncPromise.then(success => {
                if (success) {
                    // Odśwież dane po pobraniu z serwera
                    const updatedUsers = JSON.parse(localStorage.getItem('bubify_users') || '{}');
                    if (updatedUsers[username] && updatedUsers[username].avatar) {
                        updateHeaderAvatar(updatedUsers[username].avatar);
                    }
                    
                    loadPlaylists(); // Przeładuj playlisty (mogły dojść nowe z chmury)
                    applyTheme(localStorage.getItem(getStorageKey('musicPlayerTheme'))); // Zaaplikuj motyw z chmury
                    
                    // Odśwież widok aktualnej playlisty (np. Ulubione lub własna)
                    if (activePlaylistName && playlists[activePlaylistName]) {
                        const songUrls = playlists[activePlaylistName];
                        songs = songUrls.map(url => allSongs.find(s => s.audio === url)).filter(Boolean);
                        populatePlaylist();
                    }

                    // Zaktualizuj stan serduszka w odtwarzaczu dla aktualnego utworu
                    if (songs[currentSongIndex]) {
                        const currentUrl = songs[currentSongIndex].audio;
                        if (playlists['Ulubione'] && playlists['Ulubione'].includes(currentUrl)) {
                            favoritePlayerBtn.classList.add('is-favorite');
                        } else {
                            favoritePlayerBtn.classList.remove('is-favorite');
                        }
                    }
                    
                    // Jeśli jesteśmy na liście playlist, odśwież ją
                    if (document.body.classList.contains('playlist-manager-open')) {
                        populatePlaylistManager();
                    }
                }
            });
        }

        // if (supabase) {
        //     subscribeToUserUpdates();
        //     initGlobalPresence();
        //     startHeartbeat();
        // }
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
            authView.classList.remove('hidden'); // Pokaż ekran logowania zamiast przekierowania
            // Opcjonalnie: wyczyść widok playera
            pauseSong();
        }
    }


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
        const displayName = userData.displayName || currentUser;

        accountUsernameDisplay.textContent = displayName;
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
            if (!playlists['Ulubione']) playlists['Ulubione'] = [];
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
        // FIX: Jeśli utwory są już w pamięci (allSongs), nie czyść playlisty, tylko ją odtwórz
        if (allSongs.length > 0) {
            playlists['Wszystkie utwory'] = allSongs.filter(s => s.duration !== 'LIVE').map(s => s.audio);
            
            // FIX: Przywróć stacje radiowe do playlisty Radio, jeśli zniknęły po przeładowaniu z localStorage
            const radioStations = allSongs.filter(s => s.duration === 'LIVE');
            if (!playlists['Radio']) playlists['Radio'] = [];
            
            radioStations.forEach(station => {
                if (!playlists['Radio'].includes(station.audio)) {
                    playlists['Radio'].push(station.audio);
                }
            });
        } else {
            playlists['Wszystkie utwory'] = [];
        }
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

    // Funkcja pomocnicza do konfiguracji UI po załadowaniu utworów (z cache lub API)
    function setupSongsAfterFetch() {
        // Wypełnij playlistę "Wszystkie utwory"
        playlists['Wszystkie utwory'] = allSongs.filter(s => s.duration !== 'LIVE').map(s => s.audio);

        // Upewnij się, że playlista Radio zawiera stacje (w przypadku ładowania z cache)
        if (!playlists['Radio']) playlists['Radio'] = [];
        allSongs.filter(s => s.duration === 'LIVE').forEach(station => {
            if (!playlists['Radio'].includes(station.audio)) playlists['Radio'].push(station.audio);
        });

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
                // Tylko jeśli utwór nie jest jeszcze załadowany (unikamy resetu przy aktualizacji danych)
                if (audio.src !== lastSongUrl) {
                    loadSong(currentSongIndex);
                    if (lastTime) {
                        audio.currentTime = parseFloat(lastTime);
                    }
                }
                // Jeśli utwór jest już załadowany, loadSong zaktualizuje tylko UI (dzięki zmianom w loadSong)
                else {
                    loadSong(currentSongIndex);
                }
            }
        }
    }

    // Funkcja pobierająca utwory (wydzielona, aby wywołać po zalogowaniu)
    function fetchSongs() {
        // 1. Próba załadowania z pamięci podręcznej (dla natychmiastowego startu po odświeżeniu)
        const cachedSongs = localStorage.getItem('bubify_cached_songs');
        if (cachedSongs && allSongs.length === 0) {
            try {
                allSongs = JSON.parse(cachedSongs);
                setupSongsAfterFetch();
                console.log('Załadowano utwory z pamięci podręcznej.');
            } catch (e) {
                console.error('Błąd odczytu cache utworów:', e);
            }
        }

        // Pokaż loader jeśli lista jest pusta
        if (allSongs.length === 0) {
            songListEl.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-secondary);">Ładowanie biblioteki...</div>';
        }

    fetch('https://api.github.com/repos/bearsleeping/Muzyka/contents/')
      .then(res => {
          if (!res.ok) {
              if (res.status === 403) throw new Error('Limit zapytań GitHub przekroczony. Spróbuj później.');
              throw new Error(`Błąd API: ${res.status}`);
          }
          return res.json();
      })
      .then(files => {
          if (!Array.isArray(files)) throw new Error('Nieprawidłowy format danych.');

          const fetchedSongs = files
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

          // Połącz pobrane utwory ze stacjami radiowymi
          allSongs = [...fetchedSongs, ...radioStations];
          
          // Zapisz do cache na przyszłość
          localStorage.setItem('bubify_cached_songs', JSON.stringify(allSongs));

          // Skonfiguruj UI (odśwież listę, jeśli coś się zmieniło)
          setupSongsAfterFetch();

          fetchAlbumCovers(); // Pobierz okładki w tle
      })
      .catch(err => {
          console.error("Błąd podczas pobierania listy utworów:", err);
          // Jeśli mamy dane z cache, nie pokazuj błędu użytkownikowi, tylko w konsoli
          if (allSongs.length === 0) {
              showToast(err.message || "Błąd pobierania utworów");
              songListEl.innerHTML = `<div style="padding:20px; text-align:center; color:#ff453a;">${err.message}<br>Spróbuj odświeżyć stronę.</div>`;
          }
      });
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

        // Zapobiegaj resetowaniu odtwarzania, jeśli utwór jest już załadowany
        if (audio.src !== song.audio) {
            audio.src = song.audio;
            // Zresetuj obrót tylko przy zmianie utworu
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            currentRotation = 0;
            albumCover.style.transform = 'rotate(0deg)';
        }

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
        if (isPlaying && !animationFrameId) {
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

        // Zapisuj stan co 5 sekund, aby zapobiec utracie postępu przy uśpieniu/odświeżeniu karty przez przeglądarkę
        if (isPlaying && Math.abs(audio.currentTime - lastSavedTime) > 5) {
            savePlaybackState();
            lastSavedTime = audio.currentTime;
        }
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
        // 1. Nasłuchuj zmian stanu (np. po przetworzeniu tokena z URL)
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                checkLogin(session);
                if (session && window.location.hash && window.location.hash.includes('access_token')) {
                    window.history.replaceState(null, null, window.location.pathname);
                }
            } else if (event === 'SIGNED_OUT') {
                checkLogin(null);
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('Sesja Supabase została odświeżona w tle.');
            }
        });

        // 2. Sprawdź sesję inicjalną (dla odświeżenia strony i powrotu z OAuth)
        supabase.auth.getSession().then(({ data: { session } }) => {
            // Wywołujemy checkLogin. Jeśli jest hash w URL, funkcja checkLogin (zaktualizowana powyżej)
            // wstrzyma się z pokazywaniem formularza logowania do momentu zdarzenia SIGNED_IN.
            checkLogin(session);
        });

        // 3. Automatyczne odświeżanie sesji w tle
        // Sprawdza ważność tokena co 10 minut i odświeża go w razie potrzeby
        setInterval(async () => {
            const { error } = await supabase.auth.getSession();
            if (error) console.error('Błąd odświeżania sesji:', error);
        }, 10 * 60 * 1000);
    } else {
        checkLogin();
    }

});
// Gestione preferiti in localStorage

const STORAGE_KEY = 'favoritesByUser';
const LEGACY_STORAGE_KEY = 'favorites';
const UPDATE_EVENT = 'favorites:update';
const GUEST_KEY = 'guest';

function getCurrentUserKey() {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      return GUEST_KEY;
    }

    const user = JSON.parse(rawUser);
    if (user && typeof user === 'object') {
      if (user.id != null) {
        return `user:${user.id}`;
      }
      if (user.email) {
        return `email:${user.email}`;
      }
    }
  } catch (err) {
    console.error('Impossibile determinare la chiave utente per i preferiti:', err);
  }

  return GUEST_KEY;
}

function loadFavoritesStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Impossibile leggere la mappa dei preferiti:', err);
  }

  // Migrazione da vecchio formato (array unico)
  try {
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyFavorites = JSON.parse(legacyRaw);
      if (Array.isArray(legacyFavorites)) {
        const store = { [getCurrentUserKey()]: legacyFavorites };
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        return store;
      }
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Impossibile migrare i preferiti legacy:', err);
  }

  return {};
}

function dispatchFavoritesUpdate(favorites) {
  try {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: favorites }));
  } catch (err) {
    // In ambienti senza window (ad es. test), ignora
  }
}

function saveFavoritesStore(store, favoritesForUser) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Impossibile salvare i preferiti:', err);
  }
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  dispatchFavoritesUpdate(favoritesForUser);
}

export function getFavorites() {
  const store = loadFavoritesStore();
  const key = getCurrentUserKey();
  const favorites = store[key];
  return Array.isArray(favorites) ? favorites : [];
}

export function addFavorite(film) {
  const store = loadFavoritesStore();
  const key = getCurrentUserKey();
  const favorites = Array.isArray(store[key]) ? [...store[key]] : [];

  const index = favorites.findIndex((f) => f.id === film.id);
  if (index >= 0) {
    favorites[index] = { ...favorites[index], ...film };
  } else {
    favorites.push(film);
  }

  store[key] = favorites;
  saveFavoritesStore(store, favorites);
  return true;
}

export function removeFavorite(id) {
  const store = loadFavoritesStore();
  const key = getCurrentUserKey();
  const favorites = Array.isArray(store[key]) ? store[key] : [];
  const filtered = favorites.filter((f) => f.id !== id);

  if (filtered.length === favorites.length) {
    return;
  }

  if (filtered.length > 0) {
    store[key] = filtered;
  } else {
    delete store[key];
  }

  saveFavoritesStore(store, filtered);
}

export function isFavorite(id) {
  return getFavorites().some((f) => f.id === id);
}

export function subscribeToFavorites(callback) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event) => {
    callback(event.detail ?? getFavorites());
  };

  window.addEventListener(UPDATE_EVENT, handler);
  return () => window.removeEventListener(UPDATE_EVENT, handler);
}

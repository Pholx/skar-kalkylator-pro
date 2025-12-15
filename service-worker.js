// Service Worker Cache-konfiguration
const CACHE_NAME = 'cutting-data-pro-cache-v1.0.0'; 
// OBS! Uppdatera versionsnumret varje gång du gör en ändring i filerna nedan!

// Lista över alla filer som ska cachas initialt (App Shell)
const urlsToCache = [
    // Rötfiler (Index och Ikon)
    '/Milling_Drilling_Cutting_Data_Calculators/', // Startsidans rot (viktig för offline-stöd)
    '/Milling_Drilling_Cutting_Data_Calculators/index.html',
    '/Milling_Drilling_Cutting_Data_Calculators/manifest.json',
    '/Milling_Drilling_Cutting_Data_Calculators/icon-192.png',
    
    // CSS och JS (Kalkylatorgemensamt)
    '/Milling_Drilling_Cutting_Data_Calculators/kalkylatorer/style.css',
    
    // Kalkylatorer (HTML och specifik JS)
    '/Milling_Drilling_Cutting_Data_Calculators/kalkylatorer/Drilling_Data_Calculator-Pro.html',
    '/Milling_Drilling_Cutting_Data_Calculators/kalkylatorer/Milling_Data_Calculator-Pro.html',
    '/Milling_Drilling_Cutting_Data_Calculators/kalkylatorer/Face_Milling_Data_Calculator-Pro.html',
    '/Milling_Drilling_Cutting_Data_Calculators/kalkylatorer/Chamfer_Data_Calculator-Pro.html',
    '/Milling_Drilling_Cutting_Data_Calculators/kalkylatorer/T-slot_Milling_Data_Calculator-Pro.html',
    
    // Lägg till alla JS-filer som innehåller rådata (exempelvis drilling_tool_data.js)
    '/Milling_Drilling_Cutting_Data_Calculators/kalkylatorer/drilling_tool_data.js', 
    // ... Lägg till andra JS-filer här ...
];

/* * 1. INSTALLATION: Cachning av alla filer i urlsToCache
 * Körs första gången service workern registreras.
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Filer cachade framgångsrikt');
                return cache.addAll(urlsToCache);
            })
    );
});

/* * 2. AKTIVERING: Tar bort gamla cacher
 * Detta säkerställer att användare får den senaste versionen av appen.
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Tar bort gammal cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/* * 3. HÄMTNING/FETCH: Serverar cachade filer
 * Försöker först hitta resursen i cachen. Om den inte hittas, hämtas den från nätverket.
 */
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Returnerar cachad kopia om den finns
                if (response) {
                    return response;
                }
                
                // Om den inte finns i cachen, hämta från nätverket
                return fetch(event.request);
            })
    );
});
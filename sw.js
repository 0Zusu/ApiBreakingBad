
//elementos de la pagina que iran cambiando con el tiempo
const APP_SHELL = [
    
    "index.html",
    "css/style.css",
    "img/logobb.jpg",
    "js/init.js"
];
//elementos que nunca cambiaran
const APP_SHELL_INMUTABLE =[
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@10"
];
const CACHE_ESTATICO = "cache-estatico-v1";
const CACHE_INMUTABLE = "cache-inmutable-v1";
//instalacion
self.addEventListener('install',e=>{
    //se ira cambiando con fetch
    const cacheEstatico = caches.open(CACHE_ESTATICO).then(cache=>cache.addAll(APP_SHELL));
    //no se cambia
    const cacheInmutable = caches.open(CACHE_INMUTABLE).then(cache=>cache.addAll(APP_SHELL_INMUTABLE));
    e.waitUntil(Promise.all([cacheEstatico,cacheInmutable]));
});
//activacion (por inspecionador de elementos)
self.addEventListener('activate', e=> {
    console.log("SW activado");
});

self.addEventListener('fetch',e=>{
    const response = caches.match(e.request).then(res=>{
        //si la peticion esta en el cache o no es una peticion a la api retorna la peticion desde el cache
        if(res && !e.request.url.includes("/api")){
            return res;
        }
        //si no esta o es una peticion a la api se hace la peticion a internet y aparte se guarda en el cache
        else
        {
            const pInternet = fetch(e.request).then(newRes=>{
                if(newRes.ok || newRes.type=='opaque'){
                    return caches.open("cache-dinamico-v1").then(cache=>{
                        cache.put(e.request,newRes.clone());
                        return newRes.clone();
                    });
                }
                //si no encuentra nada en internet se retorna el error
                else{
                    console.log(newRes);
                    return newRes;
                }
                //si es una peticion a la api y estamos offline retorna lo guardado en cache
            }).catch(error=>caches.match(e.request));
            return pInternet;
        }
    });
    e.respondWith(response);
});
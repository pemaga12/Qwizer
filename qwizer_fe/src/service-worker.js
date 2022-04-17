/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules


import { clientsClaim } from 'workbox-core';
import { precacheAndRoute} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {NetworkOnly } from 'workbox-strategies';
import {BackgroundSyncPlugin} from 'workbox-background-sync';

/*
  Some developers want to be able to publish a new service worker and have it control 
  already-open web pages as soon as soon as it activates, which will not happen by default.
*/

clientsClaim();

/*
  Precachear los ficheros estaticos, es decir los que estaran en la capeta build, que es la que
  se usa para desplegar el proyecto en produccion(index.html,.css,.js...) para el funcionamiento de la app
*/
precacheAndRoute(self.__WB_MANIFEST); //cachea cuando el service worker se esta instalando

precacheAndRoute([
  {url: '/service-worker.js', revision: null},
  {url:'/manifest.json', revision:null}
]);


/*
  // This allows the web app to trigger skipWaiting via
  // registration.waiting.postMessage({type: 'SKIP_WAITING'})
  
    self.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
      }
    });
*/

// Customizacion del service worker

/*
Si no hay conexion cuando el usuario va ha enviar el test,
cachear esa peticion y cuando haya conexion enviarla.
*/

const sentTestUrl = "http://127.0.0.1:8000/api/response";

const bgSyncPlugin = new BackgroundSyncPlugin('test-post-requests', {
  maxRetentionTime: 24 * 60, // Reintentar por un maximo de 24h
});

registerRoute(
  sentTestUrl,
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);




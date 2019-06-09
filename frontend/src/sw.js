'use strict';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('log', event.data.json());
  const { title, options } = event.data.json();
  const promiseChain = self.registration.showNotification(title, options);

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (event) => {
  console.log('log', event);
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  const promiseChain = () => { console.log('log', 'will do something'); };
  event.waitUntil(promiseChain);
});
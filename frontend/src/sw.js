self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  if (event.data) {
    console.log('log', event.data.json());
    const { title, options } = event.data.json();
    const promiseChain = self.registration.showNotification(title, options);

    event.waitUntil(promiseChain);
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('log', 'Changed', event);
});

self.addEventListener('notificationclick', (event) => {
  console.log('log', event);
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  const promiseChain = () => { console.log('log', 'will do something'); };
  event.waitUntil(promiseChain);
});

const { clients, skipWaiting, registration } = self as any;

self.addEventListener('install', (event: any) => {
  skipWaiting();
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event: any) => {
  if (event.data) {
    console.log('log', event.data.json());
    const { title, options } = event.data.json();

    const promiseChain = registration.showNotification(title, options);

    event.waitUntil(promiseChain);
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener('pushsubscriptionchange', (event: any) => {
  console.log('log', 'Changed', event);
});

self.addEventListener('notificationclick', (event: any) => {
  console.log('log', event);
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  const promiseChain = () => { console.log('log', 'will do something'); };
  event.waitUntil(promiseChain);
});
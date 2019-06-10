function PushNotification (key) {
  this.publicAppKey = key;
};

PushNotification.prototype = {
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },
  isPushNotificationSupported() {
    if (
      ('serviceWorker' in navigator)
      && ('PushManager' in window)
      && ('Notification' in window)
    ) return true;
    return false;
  },
  getUserPermission() {
    return Notification.requestPermission()
  },
  registerServiceWorker() {
    return navigator.serviceWorker.register('sw.js').then(() => {
      return navigator.serviceWorker.ready.then((registration) => {
        return registration;
      })
    })
    .catch((err) => {
      console.error('Unable to register service worker.', err);
    });
  },
  getUserSubscription(registration) {
    return registration.pushManager.getSubscription();
  },
  subscribeUser(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(this.publicAppKey),
    };

    return registration.pushManager.subscribe(subscribeOptions);
  },
  saveUserSubscription(subscription) {
    return fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(subscription),
  })
  .then(response => { return response.json() });
  },
  async init() {
    if (!this.isPushNotificationSupported()) throw new Error('Push Notifications not supported');

    const registration = await this.registerServiceWorker();
    await this.getUserSubscription(registration);
    const permission = await this.getUserPermission();
    try {
      const userSubscription = await this.subscribeUser(registration);
      const saveSubscription = await this.saveUserSubscription(userSubscription);
      console.log(saveSubscription);
    } catch (error) {
      console.error(error)
    }
  }
}

const publicKey = 'BLHomlXcVXssh9XdJ7YamMtrarFj7MdOoH8g7H5WSMnfepsjZ595OtRD626S6GACbfVICoHsBvVYf7Ht7HNW4pQ';
const pn = new PushNotification(publicKey);
pn.init();

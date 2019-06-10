import axios from 'axios';

class PushNotification {
  constructor(key) {
    this.publicAppKey = key;
  }

  static urlBase64ToUint8Array(base64String) {
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
  }

  isPushNotificationSupported() {
    if (
      ('serviceWorker' in window.navigator)
      && ('PushManager' in window)
      && ('Notification' in window)
    ) return true;
    return false;
  }

  getUserPermission() {
    return Notification.requestPermission()
  }

  registerServiceWorker() {
    navigator.serviceWorker.register('sw.js');
    return navigator.serviceWorker.ready.then((registration) => {
      console.log('log', 'Service worker successfully registered.');
      return registration;
    }).catch((err) => {
      console.error('Unable to register service worker.', err);
    });
  }

  // listenForPermissionChange = (registration) => {
  //   if ('permissions' in navigator) {
  //     navigator.permissions.query({ name:'notifications' })
  //       .then((notificationPermission) => {
  //         notificationPermission.onchange = async () => {
  //           console.log("User decided to change his seettings. New permission: " + notificationPermission.state);
  //           if (notificationPermission.state !== 'granted') {
  //             await this.unSubscribeUser(registration);
  //           }
  //         };
  //       });
  //   }
  // }

  getUserSubscription(registration) { return registration.pushManager.getSubscription(); }

  subscribeUser(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: this.constructor.urlBase64ToUint8Array(this.publicAppKey),
    };

    return registration.pushManager.subscribe(subscribeOptions);
  }

  unSubscribeUser(registration) {
    return registration.pushManager.getSubscription().then((subscription) => {
      console.log('log', subscription);
      return subscription.unsubscribe().then((successful) => {
        console.log('log', 'You\'ve successfully unsubscribed');
      }).catch((e) => {
        console.log('log', 'Something happened', e);
      })
    })
  }

  saveUserSubscription(subscription) {
    return axios({
      method: 'post',
      url: 'http://localhost:3000/api/subscribe',
      data: subscription,
    });
  }

  deleteUserSubscription(subscription) {
    return axios({
      method: 'post',
      url: 'http://localhost:3000/api/unsubscribe',
      data: subscription,
    });
  }

  async init() {
    if (!this.isPushNotificationSupported()) throw new Error('Push Notifications not supported');

    const registration = await this.registerServiceWorker();
    const currentSubscription = await this.getUserSubscription(registration);
    if (currentSubscription === null) {
      const permission = await this.getUserPermission(registration);
      console.log('log', 'Permission is ', permission);
      try {
        if (permission === 'granted') {
          try {
            const subscription = await this.subscribeUser(registration);
            console.log('log', subscription);
            const response = await this.saveUserSubscription(subscription);
            console.log('log', response);
          } catch (error) {
            console.error(error)
          }
        }
      } catch(error) {
        console.log('log', 'User didn\'t allow push notifications', error);
      }
    } else {
      console.log('log', 'User already subscribed', currentSubscription);
    }
  }
}

const publicKey = 'BO_M3z26lxo2P1sz7Colb-WtgjoNA5acgECPiZ8czKs9GLlat1AF-HZtwrzZ5iSKyoyA4GyRGNp8y0YlxhLqho4';
const pn = new PushNotification(publicKey);
pn.init();

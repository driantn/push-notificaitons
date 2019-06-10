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
    return new Promise((resolve, reject) => {
      if (Notification.permission === 'granted') resolve('granted');
      Notification.requestPermission().then(result => {
        if ('granted' === result) return resolve(result);
        return reject(result);
      });
    });
  }

  registerServiceWorker() {
    return navigator.serviceWorker.register('sw.js').then(() => {
      return navigator.serviceWorker.ready.then((registration) => {
        console.log('log', 'Service worker successfully registered.');
        return registration;
      })
    })
    .catch((err) => {
      console.error('Unable to register service worker.', err);
    });
  }

  onSubscriptionChange() {

  }

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
      return subscription.unsubscribe().then((successful) => {
        console.log('log', 'You\'ve successfully unsubscribed');
      }).catch(function(e) {
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

  deleteUserSubscription() {

  }

  async init() {
    if (!this.isPushNotificationSupported()) throw new Error('Push Notifications not supported');

    const registration = await this.registerServiceWorker();
    const currentSubscription = await this.getUserSubscription(registration);
    if (currentSubscription === null) {
      const permission = await this.getUserPermission(registration);
      if (permission === 'granted') {
        console.log('log', 'Permission is ', permission);
        try {
          const subscription = await this.subscribeUser(registration);
          console.log('log', subscription);
          const response = await this.saveUserSubscription(subscription);
          console.log('log', response);
        } catch (error) {
          console.error(error)
        }
      } else {
        console.log('log', 'User didn\'t allow push notifications');
      }
    } else {
      console.log('log', 'User already subscribed', currentSubscription);
    }

    // this.registerServiceWorker().then(registration => {
    //   console.log('log', registration);
    //   this.getUserSubscription(registration)
    //     .then(subscription => {
    //       if (subscription === null) {
    //         this.getUserPermission()
    //           .then(result => {
    //             console.log('log', 'User permission is', result);
    //             this.subscribeUser(registration)
    //               .then(pushSub => {
    //                 console.log('log', 'User subscribed now', JSON.stringify(pushSub));
    //                 this.saveUserSubscription(pushSub)
    //                   .then(response => {
    //                     console.log('log', 'Server response', response);
    //                   })
    //               })
    //               .catch(error => {
    //                 console.log('log', 'Something happened while subscribing', error);
    //               })
    //           })
    //           .catch(error => {
    //             console.log('log', 'User didn\'t allow push notifications', error);
    //           });
    //       } else {
    //         console.log('log', 'User already subscribed', subscription);
    //       }
    //   });
    // });
  }
}

const publicKey = 'BO_M3z26lxo2P1sz7Colb-WtgjoNA5acgECPiZ8czKs9GLlat1AF-HZtwrzZ5iSKyoyA4GyRGNp8y0YlxhLqho4';
const pn = new PushNotification(publicKey);
pn.init();

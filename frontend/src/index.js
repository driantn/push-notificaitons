import axios from 'axios';
// import runtime from 'serviceworker-webpack-plugin/lib/runtime';

class PushNotification {
  constructor(key) {
    this.publicAppKey = key;
  }

  static urlBase64ToUint8Array = (base64String) => {
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

  isPushNotificationSupported = () => {
    if (
      ('serviceWorker' in window.navigator)
      && ('PushManager' in window)
      && ('Notification' in window)
    ) return true;
    return false;
  }

  getUserPermission = () => {
    return new Promise((resolve, reject) => {
      if (Notification.permission === 'granted') resolve('granted');
      Notification.requestPermission().then(result => {
        if ('granted' === result) return resolve(result);
        return reject(result);
      });
    });
  }

  registerServiceWorker = () => {
    return navigator.serviceWorker.register('sw.js')
      .then(() => {
        return navigator.serviceWorker.ready.then((registration) => {
          console.log('log', 'Service worker successfully registered.');
          return registration;
        })
        .catch((err) => {
          console.error('Unable to register service worker.', err);
        });
      });
  }

  // registerServiceWorker = () => {
  //   return new Promise((resolve, reject) => {
  //     return navigator.serviceWorker.register('sw.js')
  //       .then(() => {
  //         return navigator.serviceWorker.ready.then((registration) => {
  //           console.log('log', 'Service worker successfully registered.');
  //           return resolve(registration);
  //         })
  //         .catch((err) => {
  //           console.error('Unable to register service worker.', err);
  //           return reject(err);
  //         });
  //       });
  //   });
  // }

  onSubscriptionChange = () => {

  }

  getUserSubscription = (registration) => registration.pushManager.getSubscription();

  subscribeUser = (registration) => {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: this.constructor.urlBase64ToUint8Array(this.publicAppKey),
    };

    console.log('log', subscribeOptions);

    return registration.pushManager.subscribe(subscribeOptions);
  }

  unSubscribeUser = (registration) => {
    return registration.pushManager.getSubscription().then((subscription) => {
      return subscription.unsubscribe().then((successful) => {
        console.log('log', 'You\'ve successfully unsubscribed');
      }).catch(function(e) {
        console.log('log', 'Something happened', e);
      })
    })
  }

  saveUserSubscription = (subscription) => {
    return axios({
      method: 'post',
      url: 'http://localhost:3000/api/subscribe',
      data: subscription,
    });
    // return axios.post('http://localhost:3000/api/subscribe', JSON.stringify(subscription))
  }

  deleteUserSubscription = () => {

  }

  init = () => {
    if (!this.isPushNotificationSupported()) throw new Error('Push Notifications not supported');

    this.registerServiceWorker().then(registration => {
      console.log('log', registration);
      this.getUserSubscription(registration)
        .then(subscription => {
          if (subscription === null) {
            this.getUserPermission()
              .then(result => {
                console.log('log', 'User permission is', result);
                this.subscribeUser(registration)
                  .then(pushSub => {
                    console.log('log', 'User subscribed now', JSON.stringify(pushSub));
                    this.saveUserSubscription(pushSub)
                      .then(response => {
                        console.log('log', 'Server response', response);
                      })
                  })
                  .catch(error => {
                    console.error('log', 'Something happened while subscribing', error);
                  })
              })
              .catch(error => {
                console.log('log', 'User didn\'t allow push notifications', error);
              });
          } else {
            console.log('log', 'User already subscribed', subscription);
          }
      });
    });
  }
}

const publicKey = 'BJ2zYDjFYIQQVmTu2F8Ppa05_QYPwMaYeAPQNJtownxLAZ7T0gtVw8gLQrwF2_BXQFkDCN2ST1mSfinvC3WhUSc';
const pn = new PushNotification(publicKey);
pn.init();


// const isPushNotificationSupported = () => {
//   if (
//     ('serviceWorker' in navigator)
//     && ('PushManager' in window)
//     && ('Notification' in window)
//   ) return true;
//   return false;
// };

// const registerServiceWorker = () => {
//   return new Promise((resolve, reject) => {
//     return navigator.serviceWorker.register('/sw.js')
//     .then((registration) => {
//       console.log('log', 'Service worker successfully registered.');
//       return resolve(registration);
//     })
//     .catch((err) => {
//       console.error('Unable to register service worker.', err);
//       return reject(err);
//     });
//   });
// };

// const getUserPermission = () => {
//   return new Promise((resolve, reject) => {
//     if (Notification.permission === "granted") resolve('granted');
//     Notification.requestPermission().then(result => {
//       if ('granted' === result) return resolve(result);
//       return reject(result);
//     });
//   });
// };

// if (isPushNotificationSupported()) {
//   registerServiceWorker().then(registration => {
//     console.log('log', registration);
//     getUserPermission().then(result => {
//       console.log('log', 'User permission is', result);
//     })
//   });
// }
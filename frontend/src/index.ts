
import PermissionManager from './managers/PermissionManager';
import SubscriptionManager from './managers/SubscriptionManager';
import DatabaseManager from './managers/DatabaseManager';
import BrowserUtils from './managers/BrowserUtils';

const utils = new BrowserUtils();
const permissionManager = new PermissionManager();
const subscriptionManager = new SubscriptionManager();
const databaseManager = new DatabaseManager();

class PushNotification {
  publicAppKey: string;

  constructor(key: string) {
    this.publicAppKey = key;
  }

  async init() {
    if (!utils.isPushNotificationSupported()) throw new Error('Push Notifications not supported');

    const registration = await utils.registerServiceWorker('./sw-bundle.js');
    const currentSubscription = await subscriptionManager.getUserSubscription(registration as ServiceWorkerRegistration);
    if (currentSubscription === null) {
      const permission = await permissionManager.getNotificationPermission();
      console.log('log', 'Permission is ', permission);
      try {
        if (permission === 'granted') {
          try {
            const subscription = await subscriptionManager.subscribeUser(registration as ServiceWorkerRegistration, this.publicAppKey);
            console.log('log', subscription);
            const response = await databaseManager.saveUserSubscription(subscription as PushSubscription);
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


import PermissionManager from './managers/PermissionManager';
import SubscriptionManager from './managers/SubscriptionManager';
import UserManager from './managers/UserManager';
import BrowserUtils from './managers/BrowserUtils';

const utils = new BrowserUtils();
const permissionManager = new PermissionManager();
const subscriptionManager = new SubscriptionManager();
const userManager = new UserManager();

class PushNotification {
  publicAppKey: string;

  constructor(key: string) {
    this.publicAppKey = key;
  }

  async subscribeUser(registration: ServiceWorkerRegistration) {

  }

  async init() {
    if (!utils.isPushNotificationSupported()) throw new Error('Push Notifications not supported');

    const registration = await utils.registerServiceWorker('./sw-bundle.js');
    const currentSubscription = await subscriptionManager.getUserSubscription(registration as ServiceWorkerRegistration);
    if (currentSubscription === null) {
      const permission = await permissionManager.getNotificationPermission();
      console.log('log', 'Permission is ', permission);
      if (permission === 'granted') {
        try {
          const subscription = await subscriptionManager.subscribeUser(registration as ServiceWorkerRegistration, this.publicAppKey);
          const response = await userManager.saveUserSubscription(subscription as PushSubscription);
          console.log('log', 'User saved to database: ', response.data.subscription.endpoint);
        } catch (error) {
          console.error(error)
        }
      }
    } else {
      console.log('log', 'User already subscribed', currentSubscription);
      // renew subscription if we're within 5 days of expiration
      if (currentSubscription.expirationTime && (Date.now() > currentSubscription.expirationTime - 432000000)) {
        const newSubscription = subscriptionManager.renewSubscription(registration as ServiceWorkerRegistration, this.publicAppKey);
        // TODO: delete old user subscription
        if (!!newSubscription) await userManager.saveUserSubscription((newSubscription as any) as PushSubscription);
      }
    }
  }
}

const publicKey = 'BO_M3z26lxo2P1sz7Colb-WtgjoNA5acgECPiZ8czKs9GLlat1AF-HZtwrzZ5iSKyoyA4GyRGNp8y0YlxhLqho4';
const pn = new PushNotification(publicKey);
pn.init();

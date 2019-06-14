import BrowserUtils from './BrowserUtils';

const utils = new BrowserUtils();

export default class SubscriptionManager {
  public getUserSubscription(registration: ServiceWorkerRegistration): Promise<PushSubscription | null> {
    return registration.pushManager.getSubscription();
  }

  public subscribeUser(registration: ServiceWorkerRegistration, publicKey: string): Promise<PushSubscription> {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: utils.urlBase64ToUint8Array(publicKey),
    };

    return registration.pushManager.subscribe(subscribeOptions);
  }

  public async unSubscribeUser(registration: ServiceWorkerRegistration): Promise<Boolean> {
    const subscription = await this.getUserSubscription(registration);
    console.log('log', subscription);
    return (subscription as PushSubscription).unsubscribe();
  }

  public async renewSubscription(registration: ServiceWorkerRegistration, publicKey: string): Promise<PushSubscription | Boolean> {
    const unsubscribed = await this.unSubscribeUser(registration as ServiceWorkerRegistration);
    if (unsubscribed) {
      return this.subscribeUser(registration as ServiceWorkerRegistration, publicKey);
    }
    return false;
  }
}
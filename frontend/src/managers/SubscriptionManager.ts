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

  public async unSubscribeUser(currentSubscription: PushSubscription, registration: ServiceWorkerRegistration): Promise<Boolean> {
    console.log('log', currentSubscription);
    return currentSubscription.unsubscribe();
  }

  public async renewSubscription(currentSubscription: PushSubscription, registration: ServiceWorkerRegistration, publicKey: string): Promise<PushSubscription | Boolean> {
    const unsubscribed = await this.unSubscribeUser(currentSubscription, registration as ServiceWorkerRegistration);
    if (unsubscribed) {
      return this.subscribeUser(registration as ServiceWorkerRegistration, publicKey);
    }
    return false;
  }
}
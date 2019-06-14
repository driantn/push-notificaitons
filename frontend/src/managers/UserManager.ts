import axios, { AxiosResponse } from 'axios';
import BrowserUtils from './BrowserUtils';

const utils = new BrowserUtils();

export default class UserManager {
  public saveUserSubscription(subscription: PushSubscription): Promise<AxiosResponse> {
    return axios({
      method: 'post',
      url: 'http://localhost:3000/api/subscribe',
      data: { subscription, device: utils.getBrowser() },
    });
  };

  public deleteUserSubscription(subscription: PushSubscription): Promise<AxiosResponse> {
    return axios({
      method: 'post',
      url: 'http://localhost:3000/api/unsubscribe',
      data: subscription,
    });
  }
}
import axios from 'axios';

export default class DatabaseManager {
  public saveUserSubscription(subscription: PushSubscription): Promise<Object> {
    return axios({
      method: 'post',
      url: 'http://localhost:3000/api/subscribe',
      data: subscription,
    });
  };

  public deleteUserSubscription(subscription: PushSubscription): Promise<Object> {
    return axios({
      method: 'post',
      url: 'http://localhost:3000/api/unsubscribe',
      data: subscription,
    });
  }
}
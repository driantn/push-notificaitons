
require('dotenv').config();
import webpush from 'web-push';
import { Router } from 'express';
import model from '../models/subscription';

const router = Router();

const vapidKeys = {
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
};

webpush.setVapidDetails(
  'mailto:driantn@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Subscribe user
router.post('/subscribe', async (req, res, next) => {
  const subscription = await model.save(req.body);
  res.json(subscription);
});

// Unsubscribe user
router.post('/unsubscribe', async (req, res, next) => {
  console.log('log', req.body);
  await model.delete(req.body);
  res.json({ status: 'user unsubscribed' });
});

// send push notification
router.post('/send', async (req, res, next) => {
  const allSubscriptions = await model.getAll();
  for (let item in allSubscriptions) {
    console.log('log', item);
    const payload = JSON.stringify(req.body);
    const options = { TTL: 60, contentEncoding: 'aes128gcm' };
    webpush.sendNotification(JSON.parse(allSubscriptions[item].subscription), payload, options)
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid: ', err);
      } else {
        console.log('log', err);
      }
    });
  }
  res.json({ status: 'user unsubscribed' });
});

export default router;
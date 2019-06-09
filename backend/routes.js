
require('dotenv').config();
import uuidv4 from 'uuid/v4';
import webpush from 'web-push';
import { Router } from 'express';

const router = Router();

const inMermoryDB = [];
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
  inMermoryDB.push({ id: uuidv4(), subscription: req.body })
  res.json({ status: req.body });
});

// Unsubscribe user
router.post('/unsubscribe', async (req, res, next) => {
  console.log('log', req.body);
  res.json({ status: 'user unsubscribed' });
});

// send push notification
router.post('/send', async (req, res, next) => {
  for (let item in inMermoryDB) {
    webpush.sendNotification(inMermoryDB[item].subscription, JSON.stringify(req.body))
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid: ', err);
      } else {
        throw err;
      }
    });
    // await webpush.sendNotification(inMermoryDB[item].subscription, JSON.stringify(req.body));
  }
  res.json({ status: 'user unsubscribed' });
});

export default router;
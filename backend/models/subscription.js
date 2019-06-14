import Sequelize from 'sequelize';

const sequelize = new Sequelize('mainDB', null, null, {
  dialect: "sqlite",
  storage: './database/db.sqlite3',
});

const schema = {
  subscription: Sequelize.JSON,
  device: Sequelize.STRING
};

const UserSubscription = sequelize.define('user-subscription', schema);

UserSubscription.save = ({ subscription, device }) => UserSubscription.create({ subscription, device });

UserSubscription.getAll = () => UserSubscription.findAll({ raw: true });

UserSubscription.getItem = (itemId) => UserSubscription.findById(itemId);

UserSubscription.delete = (subscription) => UserSubscription.destroy({
  where: {
     subscription: subscription
  }
});

export default UserSubscription;
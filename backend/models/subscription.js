import Sequelize from 'sequelize';

const sequelize = new Sequelize('mainDB', null, null, {
  dialect: "sqlite",
  storage: './database/db.sqlite3',
});

const schema = {
  userSubscription: Sequelize.JSON,
};

const UserSubscription = sequelize.define('user-subscription', schema);

UserSubscription.save = (userSubscription) => UserSubscription.create({ userSubscription });

UserSubscription.getAll = () => UserSubscription.findAll({ raw: true });

UserSubscription.getItem = (itemId) => UserSubscription.findById(itemId);

UserSubscription.delete = (itemId) => UserSubscription.destroy({
  where: {
     id: itemId
  }
});

export default UserSubscription;
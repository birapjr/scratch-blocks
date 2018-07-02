module.exports = function(sequelize, DataTypes) {
  var counter = sequelize.define('counter', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'counter_sys',
    classMethods: {
      /**
       * Get the counter next value
       * @param {String} name The counter name
       * 
       * @returns {Integer} The next counter value
       */
      async getNext(name) {
        let nextValue;
        await sequelize.transaction(async transaction => {
          //Find count in db
          let counterInDB = await counter.findOne({
            where: {
              name: name
            }
          }, {transaction});
          if (counterInDB) {
            nextValue = 1 + counterInDB.value;
            counterInDB.value = nextValue;
            await counterInDB.save({transaction});
          }
          else {
            await counter.create({
              name: name,
              value: 1
            }, {transaction});
            nextValue = 1;
          }
        });
        return nextValue;
      },
      /**
       * Reset a counter to its start value
       * @param {String} name The counter name
       */
      async reset(name) {
        await sequelize.transaction(async t => {
          //Find count in db
          let counterInDB = await counter.findOne({
            where: {
              name: name
            }
          }, {transaction: t});
          if (counterInDB) {
            //reset
            counterInDB.value = counterInDB.startValue;
            await counterInDB.save({transaction: t});
          }
          else {
            throw new Error(`Counter ${name} do not exists`);
          }
        });
      }
    }
  });
  return counter;
};
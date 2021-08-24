/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('payments', {
    id: 'id',
    purchaseId: {
      type: 'integer',
      notNull: true
    },
    expirationDate: {
      type: 'timestamp',
      notNull: true
    },
    amount: {
      type: 'integer',
      notNull: true
    },
    feeNumber: {
      type: 'integer',
      notNull: true
    }
  })
};

/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.alterColumn(
    'payments',
    'amount',
    {
      type: 'numeric'
    }
  )
};

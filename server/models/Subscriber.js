const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriberSchema = mongoose.Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true } // 만든 날짜와 업데이트한 날짜를 표시해 준다.
);

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

module.exports = { Subscriber };

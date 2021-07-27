const express = require('express');
const router = express.Router();

const { Comment } = require('../models/Comment');

//=================================
//             Comment
//=================================

router.post('/saveComment', (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    // writer의 정보를 모두 가져오려면 항상 populate를 사용했지만 save할 경우엔 사용할 수 가 없다.
    // => Comment 모델을 가져와서 id를 통해 populate에 접근해야 한다.
    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

module.exports = router;

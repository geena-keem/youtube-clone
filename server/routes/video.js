const express = require('express');
const router = express.Router();
const multer = require('multer');

// const { Video } = require('../models/Video');
const { auth } = require('../middleware/auth');

// STORAGE MULTER CONFIG (OPTION)
var storage = multer.diskStorage({
  destination: (req, file, cd) => {
    // destination: 파일을 업로드하면 어디에 파일을 저장할지를 지정.
    cd(null, 'uploads/');
  },
  filename: (req, file, cd) => {
    cd(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cd) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cd(res.status(400).end('only mp4 is allowed'), false);
    }
    cd(null, true);
  },
});

const upload = multer({ storage: storage }).single('file'); // 파일은 하나만 처리할 수 있게!

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
  // 비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
      // json형식으로 에러를 출력! (success가 false이고 err메세지도 같이 출력되게)
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
    // 업로드 성공시 uploads폴더에 저장되도록 url을 지정
  });
});

module.exports = router;

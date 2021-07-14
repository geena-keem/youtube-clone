const express = require('express');
const router = express.Router();
const multer = require('multer');

const { Video } = require('../models/Video');
const { auth } = require('../middleware/auth');
var ffmpeg = require('fluent-ffmpeg');

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
  // ✔ 비디오를 서버에 저장
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

router.post('/uploadVideo', (req, res) => {
  // ✔ 비디오 정보들을 저장한다.
  const video = new Video(req.body); // 클라이언트에서 보낸 variables들이 request.body에 담겨있다.

  // 몽고디비에 저장한다.
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post('/thumbnail', (req, res) => {
  // ✔ 썸네일 생성 및 비디오 러닝타임 가져오기

  let filePath = '';
  let fileDuration = '';

  // ✔ 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    // ffprobe 멀티미디어 스트림으로부터 정보를 모으고 사람과 기계가 읽을 수 있게 프린트한다.
    console.dir(metadata); // 모든 메타데이터
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  // ✔ 썸네일 생성
  ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
      // 비디오 썸네일 파일 이름을 생성한다.
      console.log('Will generate' + filenames.join(', '));
      console.log(filenames);

      filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function () {
      // 썸네일을 생성 후 처리 (썸네일 저장, 파일이름 및 비디오 정보)
      console.log('Screenshots taken');
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on('error', function (err) {
      // 에러
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshot({
      // 스크린샷 옵션
      // count는 비디오의 20%, 40%, 60% 및 80%에서 스크린 샷을 찍는다.
      count: 3,
      folder: 'uploads/thumbnails',
      size: '298x238',
      // '%b': 입력 기본 이름 (확장자가 없는 파일 이름)
      filename: 'thumbnail-%b.png',
    });
});

module.exports = router;

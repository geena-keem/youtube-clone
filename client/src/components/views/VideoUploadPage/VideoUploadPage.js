import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const CategoryOptions = [
  { value: 0, label: 'Film & Animation' },
  { value: 1, label: 'Autos & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user); // redux state에 있는 user의 정보를 가져온다.

  const [VideoTitle, setVideoTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState('Film & Animation');

  const [FilePath, setFilePath] = useState('');
  const [Duration, setDuration] = useState('');
  const [ThumbnailPath, setThumbnailPath] = useState('');

  const onTitleChange = (e) => {
    // console.log(e.currentTarget.value);
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      // 헤더에 content-type을 설정해줘야 파일을 보낼 때 오류가 생기지 않는다.
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    // console.log(files);

    Axios.post('/api/video/uploadfiles', formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data);

        let variable = {
          url: response.data.filePath,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.filePath);

        Axios.post('/api/video/thumbnail', variable).then((response) => {
          if (response.data.success) {
            console.log(response.data);
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert('썸네일 생성에 실패했습니다.');
          }
        });
      } else {
        alert('비디오 업로드를 실패했습니다.');
      }
    });
  };

  const onSubmit = (e) => {
    // preventDefault: a태그나 submit태그는 누르게 되면 href를 통해 이동하거나
    //                 창이 새로고침하여 실행되는데 이러한 동작을 막아준다.
    e.preventDefault();

    const variables = {
      wirter: user.userData._id, // redux를 통해 가져온다.
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };
    Axios.post('/api/video/uploadVideo', variables).then((response) => {
      if (response.data.success) {
        console.log(response.data);

        // 메세지 창을 띄운 후 3초 뒤에 home으로 이동한다.
        message.success('성공적으로 업로드 했습니다.');
        setTimeout(() => {
          props.history.push('/');
        }, 3000);
      } else {
        alert('비디오 업로드에 실패했습니다.');
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Drop zone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={10000000}>
            {/* multiple은 파일 업로드 시 많이 올릴 것인지 하나만 올릴 것인지! 하나일 경우 false! */}
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
                  border: '1px solid lightgray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>

          {/* Thumbnail */}
          {/* 썸네일이 있을 때만 뜨게 끔 설정! */}
          {ThumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
      </Form>

      <br />
      <br />
      <label>Title</label>
      <Input onChange={onTitleChange} value={VideoTitle} />

      <br />
      <br />
      <label>Description</label>
      <TextArea onChange={onDescriptionChange} value={Description} />

      <br />
      <br />
      <select onChange={onPrivateChange}>
        {PrivateOptions.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <br />
      <br />
      <select onChange={onCategoryChange}>
        {CategoryOptions.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <br />
      <br />
      <Button type="primary" size="large" onClick={onSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default VideoUploadPage;

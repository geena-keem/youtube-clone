import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);

  const [LikesAciton, setLikesAciton] = useState(null);
  const [DislikesAciton, setDislikesAciton] = useState(null);

  let variable = {};

  // 비디오와 코멘트를 나누어 처리
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    // Like
    Axios.post('/api/like/getLikes', variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 좋아요를 받았는지
        setLikes(response.data.likes.length);

        // 내가 이미 좋아요를 눌렀는지
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikesAciton('liked');
          }
        });
      } else {
        alert('Likes 정보를 가져오지 못했습니다.');
      }
    });

    // Dislike
    Axios.post('/api/like/getDislikes', variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 싫어요를 받았는지
        setDislikes(response.data.dislikes.length);

        // 내가 이미 싫어요를 눌렀는지
        response.data.dislikes.map((dislikes) => {
          if (dislikes.userId === props.userId) {
            setDislikesAciton('disliked');
          }
        });
      } else {
        alert('Dislikes 정보를 가져오지 못했습니다.');
      }
    });
  }, []);

  return (
    <div>
      {/* Like */}
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikesAciton === 'liked' ? 'filled' : 'outlined'}
            onClick
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
      </span>

      {/* Dislike */}
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DislikesAciton === 'disliked' ? 'filled' : 'outlined'}
            onClick
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
      </span>
    </div>
  );
}

export default LikeDislikes;

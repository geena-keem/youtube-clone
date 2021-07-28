import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';

function SingleComment(props) {
  const user = useSelector((state) => state.user);

  const [OpenReply, setOpenReply] = useState(false); // 처음엔 답글창이 숨겨져 있어야 하기 때문에 false로 설정해준다.
  const [CommentValue, setCommentValue] = useState('');

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply); // 토글이 될 수 있게 처리한다!
  };

  const onHandleChange = (event) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id, // localstorage가 아닌 redux hook을 사용해서 가져오기!
      postId: props.postId,
      responseTo: props.comment._id,
    };

    Axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        // console.log(response.data.result);
        setCommentValue('');
        setOpenReply(false);
        props.refreshFunction(response.data.result);
      } else {
        alert('댓글을 저장하지 못했습니다.');
      }
    });
  };

  const actions = [
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];

  return (
    <div>
      {props.comment.writer && (
        <Comment
          actions={actions}
          author={props.comment.writer.name}
          avatar={<Avatar src={props.comment.writer.image} alt />}
          content={<p>{props.comment.content}</p>}
        />
      )}

      {/* OpenReply가 true일 때만 댓글 창이 보일 수 있게 처리! */}
      {OpenReply && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="댓글을 작성해 주세요"
          />
          <br />
          <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;

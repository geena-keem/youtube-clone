import Axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
  const user = useSelector((state) => state.user); // 리덕스 안에 있는 state.user에 접근

  const videoId = props.postId;

  const [commentValue, setCommentValue] = useState('');

  const handleClick = (event) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    // submit을 눌렀을 때 Refresh안되게!
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id, // localstorage가 아닌 redux hook을 사용해서 가져오기!
      postId: videoId,
    };

    Axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        // console.log(response.data.result);
        setCommentValue(''); // 입력 후 댓글창 초기화
        props.refreshFunction(response.data.result);
      } else {
        alert('댓글을 저장하지 못했습니다.');
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      {/* Comment Lists */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  postId={videoId}
                />
                <ReplyComment
                  refreshFunction={props.refreshFunction}
                  parentCommentId={comment._id}
                  commentLists={props.commentLists}
                  postId={videoId}
                />
              </React.Fragment>
            )
        )}

      <br />

      {/* Root Comment Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleClick}
          value={commentValue}
          placeholder="댓글을 작성해 주세요"
        />
        <br />
        <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;

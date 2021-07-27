import React, { useEffect, useState } from 'react';
import Axios from 'axios';

const Subscribe = (props) => {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let variable = { userTo: props.userTo };

    // DB에서 얼마나 많은 사람들이 해당 비디오 업로드한 유저를 구독하는지 구독자 수 정보 가져오기
    Axios.post('/api/subscribe/subscribeNumber', variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscriberNumber);
      } else {
        alert('구독자 수 정보를 받아오지 못했습니다.');
      }
    });

    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem('userId'),
    }; // userFrom은 웹사이트 개발자 도구 > Application > Local Storage > userId

    // 해당 비디오 업로드 한 유저를 구독하는지 정보 가져오기
    Axios.post('/api/subscribe/subscribed', subscribedVariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert('정보를 받아오지 못했습니다.');
        }
      }
    );
  }, []);

  const onSubscribe = () => {
    let subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    // 이미 구독 중이라면
    if (Subscribed) {
      Axios.post('/api/subscribe/unSubscribe', subscribeVariable).then(
        (response) => {
          if (response.data.success) {
            // 구독 취소
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert('구독 취소를 실패 했습니다.');
          }
        }
      );

      // 아직 구독 중이 아니라면
    } else {
      Axios.post('/api/subscribe/subscribe', subscribeVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert('구독을 실패 했습니다.');
          }
        }
      );
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
          borderRadius: '4px',
          borderStyle: 'none',
          color: 'white',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
        }}
        onClick={onSubscribe}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
};

export default Subscribe;

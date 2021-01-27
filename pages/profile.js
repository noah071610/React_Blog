import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import axios from 'axios';
import useSWR from 'swr'; // get 할때 편하게 action 만드라고 만든 next 라이브러리

import { END } from 'redux-saga';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const fetcher = url => axios.get(url, { withCredentials: true }).then(result => result.data);

function Profile() {
  const { me } = useSelector(state => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher,
  );
  const { data: followingsData, error: followingError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher,
  );

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  // }, []);

  const loadMoreFollowings = useCallback(() => setFollowingsLimit(prev => prev + 3), []);
  const loadMoreFollowers = useCallback(() => setFollowersLimit(prev => prev + 3), []);

  if (!me) {
    return 'loading profile now';
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>loading error occur</div>;
  }

  return (
    <>
      <Head>
        <title>My Profile | Blog</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="followingList"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="followerList"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
      </AppLayout>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async context => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Profile;

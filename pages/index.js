import { END } from 'redux-saga';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

function Home() {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector(
    state => state.post,
  );
  // = const mainPosts = useSelector(state => state.post.mainPosts)
  // = const {mainPosts} = useSelector(state => state.post)

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      // window.scrollY : 내가 스크롤한 길이
      // document.documentElement.clientHeight : 클라이언트가 보고있는 길이
      // document.documentElement.scrollHeight : 전체 페이지 길이
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: mainPosts[mainPosts.length - 1].id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading]);
  console.log('로드된 mainPosts에 속성값', mainPosts);
  return (
    <>
      <AppLayout>
        {me && <PostForm />}
        {mainPosts.map((
          post, // key는 index로 쓰지말자 (불변하면 가능)
        ) => (
          <PostCard key={post.id} post={post} />
        ))}
      </AppLayout>
    </>
  );
}

// 화면 그리기전에 먼저 실행, 순전히 프론트서버에서 실행 (쿠키는 브라우저에서 보내기 때문에 cors문제 생김)
export const getServerSideProps = wrapper.getServerSideProps(async context => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; // 다른사람이 내 정보를 받는 경우를 막기위해
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
}); // 이것을 store(reducer index)에 HYDRATE가 받음

export default Home;

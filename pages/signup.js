/* eslint-disable react/require-default-props */
import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
import { END } from 'redux-saga';
import Head from 'next/head';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const TextInput = ({ value }) => <div>{value}</div>;

TextInput.propTypes = {
  value: PropTypes.string,
};

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(state => state.user);

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/'); // push랑 다른점은 뒤로가기 했을때 그 페이지가 나오지 않음
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);
  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(`Sign up Success ${email},${nickname},${password}`);
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname }, // 이런식은 can become a req.body on the server part
    });
  }, [password, passwordCheck, term]);

  const onChangePasswordCheck = useCallback(
    e => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password],
  );

  const onChangeTerm = useCallback(e => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <AppLayout>
      <Head>
        <title>Sing up | Blog</title>
      </Head>
      <Form onFinish={onSubmit} style={{ padding: 10 }}>
        <TextInput value="135135" />
        <div>
          <label htmlFor="user-email">E-mail</label>
          <br />
          <Input name="user-email" type={email} value={email} required onChange={onChangeEmail} />
        </div>
        <div>
          <label htmlFor="user-nickname">Name</label>
          <br />
          <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
        </div>
        <div>
          <label htmlFor="user-password">Password</label>
          <br />
          <Input
            name="user-password"
            type="password"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">Password Check</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && <div style={{ color: 'red' }}>Passwords do not match.</div>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            Are you agree to the terms?
          </Checkbox>
          {termError && (
            <div style={{ color: 'red' }}>you have to agree to the terms and conditions.</div>
          )}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            Sign up
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

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
}); // 로그인 여부에 따라서 화면이 달라짐 즉 getstaticprops 는 쓰기 힘들다, 또 여기서도 적용을 꼭 해주어야 한다

export default Signup;

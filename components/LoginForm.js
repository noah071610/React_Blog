import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 2rem;
`;

function LoginForm() {
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector(state => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onSubmitForm = useCallback(
    () => {
      console.log(`Login Success`);
      dispatch(loginRequestAction({ email, password }));
    }, //= ==================1. Go to SAGA and REDUCER SAME TINE
    [email, password],
  );
  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">E-mail</label>
        <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">Password</label>
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          Login
        </Button>
        <Link href="/signup">
          <a>
            <Button>Sign Up</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
}

export default LoginForm;

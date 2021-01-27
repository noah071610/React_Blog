import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import useInput from '../hooks/useInput';

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  
  .ant-col:first-child {
      padding-left: 0 !important;
  }
  
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`; // ant scroll X 해결방법

const SearchInput = styled(Input.Search)`
  verticalalign: middle;
`;

// const style = useMemo(() => ({verticalAlign: 'middle'}), [])
// <SearchInput enterButton style={style}/>

function AppLayout({ children }) {
  const [searchInput, onChangeSearchInput] = useInput('');
  const { me } = useSelector(state => state.user);
  // redux로 뭉쳐놨으니 setState 와 props 값 삭제 ㄱㄴ
  // state 라고 써져있으나 사실상 reducer 불러오는거

  const onSearch = useCallback(() => Router.push(`/hashtag/${searchInput}`), [searchInput]);
  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>blog</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>profile</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>signup</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://youtube.com" target="_blank" rel="noreferrer noopener">
            Go Youtube
          </a>
        </Col>
      </Row>
    </div>
  );
}

AppLayout.propTypes = {
  children: propTypes.node.isRequired,
};

export default AppLayout;

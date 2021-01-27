import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { logoutRequestAction } from '../reducers/user';

function UserProfile() {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector(state => state.user);
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${me.id}`}>
            <a>
              Posts
              <br />
              {me.Posts.length}
            </a>
          </Link>
        </div>,
        <div key="following">
          <Link href="/profile">
            <a>
              Following
              <br />
              {me.Followings.length}
            </a>
          </Link>
        </div>,
        <div key="follower">
          <Link href="/profile">
            <a>
              Follower
              <br />
              {me.Followers.length}
            </a>
          </Link>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <Link href={`/user/${me.id}`}>
            <a>
              <Avatar>{me.nickname[0]}</Avatar>
            </a>
          </Link>
        }
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading}>
        Log out
      </Button>
    </Card>
  );
}

export default UserProfile;

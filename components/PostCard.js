/* eslint-disable react/jsx-wrap-multilines */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Popover, Button, Avatar, Comment, List } from 'antd';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  EllipsisOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import moment from 'moment'; // 날짜 설정 라이브러리
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import useToggle from '../hooks/useToggle';
import {
  LIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,
  RETWEET_REQUEST,
  UNLIKE_POST_REQUEST,
} from '../reducers/post';
import FollowButton from './FollowButton';

moment.locale('ko');

function PostCard({ post }) {
  const dispatch = useDispatch();
  const [commentFormOpened, onToggleComment] = useToggle('');
  const { removePostLoading } = useSelector(state => state.post);
  const { me } = useSelector(state => state.user);
  // const id = me && me.id;
  const id = me?.id;
  const onLike = useCallback(() => {
    if (!id) {
      return alert('you must login');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);
  const onUnLike = useCallback(() => {
    if (!id) {
      return alert('you must login');
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('you must login');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('you must login');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);
  const liked = post.Likers.find(v => v.id === id); // id는 me.id
  // v.id 가 (즉 Likers 에 id 가 없으면) undefined임으로 false
  return (
    <div>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined onClick={onRetweet} key="retweet" />,
          liked ? (
            <HeartTwoTone twoToneColor="red" key="heart" onClick={onUnLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="message" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>Edit</Button>
                    <Button type="danger" onClick={onRemovePost} loading={removePostLoading}>
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button>Sumit</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname} Retweet!` : null}
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
}

PostCard.propTypes = {
  // eslint-disable-next-line react/require-default-props
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    Images: PropTypes.arrayOf(PropTypes.any),
    Comments: PropTypes.arrayOf(PropTypes.any),
    imagePaths: PropTypes.array,
    postAdded: PropTypes.bool,
    Likers: PropTypes.arrayOf(PropTypes.object),
    Retweet: PropTypes.arrayOf(PropTypes.any),
    RetweetId: PropTypes.number,
    createdAt: PropTypes.any,
  }),
};

export default PostCard;

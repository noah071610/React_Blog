import { Button, Input, Form } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

function CommentForm({ post }) {
  const dispatch = useDispatch();
  const id = useSelector(state => state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector(state => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
      // props 로 가져온 post 와 const로 지정한 me.id
    });
  }, [commentText, id]);
  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button loading={addCommentLoading} style={{ zIndex: 1 }} type="primary" htmlType="submit">
          Submit!
        </Button>
      </Form.Item>
    </Form>
  );
}

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;

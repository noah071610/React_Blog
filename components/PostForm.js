import React, { useRef, useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { ADD_POST_REQUEST, REMOVE_IMAGE, UPLOAD_IMAGES_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const imageInput = useRef();
  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click(); // 내장 api
  }, [imageInput.current]);

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('Write content!');
    }
    const formData = new FormData(); // image 형식에서는 이렇게 폼데이터를 만들어 사용
    imagePaths.forEach(p => {
      // new FormData에 추가하는 과정
      formData.append('image', p); // req.body.image
    });
    formData.append('content', text); // req.body.content
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const onChangeImages = useCallback(e => {
    console.log('files on the list', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, file => {
      imageFormData.append('image', file);
    }); // e.target.files 이 불러와져서 [] 으로 감. 즉 f가 됨
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    }); // 미리 이미지를 서버에 보내는 행위
  }, []);

  const onRemoveImage = useCallback(
    index => () => {
      // 고차함수 모형, 즉 콜백이 두개 이럴땐 첫째 둘째 순서대로 애로우 2개
      dispatch({
        type: REMOVE_IMAGE,
        data: index,
      });
    },
    [],
  );

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="How you've been?"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>Upload Image</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">
          Go Submit
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`http://localhost:3065/${v}`} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>DELETE</Button>
              {/* 고차함수 */}
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;

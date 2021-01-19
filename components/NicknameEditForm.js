import { Form, Input } from 'antd';
import React from 'react';

const NicknameEditForm = () => (
  <Form style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }}>
    <Input.Search addonBefore="Nick Name" enterButton="Edit" />
  </Form>
);

export default NicknameEditForm;

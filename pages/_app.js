import React from 'react';
import propTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import wrapper from '../store/configureStore';

function App({ Component }) {
  // <Provider store={store}> no need because we are using next
  return (
    <>
      <Head>
        <title>Noah-Blog</title>
      </Head>
      <Component />
    </>
  );
}
App.propTypes = {
  Component: propTypes.elementType.isRequired,
};

export default wrapper.withRedux(App);

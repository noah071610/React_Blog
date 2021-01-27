import { applyMiddleware, createStore, compose } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';

import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas'; // SAGA

import reducer from '../reducers';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware]; // Before const middlewares = [];
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares)); // enhancer는 redux server 기능 향상, 배포용일때는 compose로 바꾸자
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga); // 서버 사이드 렌더링을 위해서
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;

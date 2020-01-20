import React, { useEffect } from 'react';
import phaseType from '../src/types/phaseType';
import { connect, useDispatch } from 'react-redux';
import client from '../src/client';
import Home from '../components/home';
import Chat from '../components/chat';
import { sendText } from '../src/actions';
import './index.scss';
const Index = props => {
  const { phase } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(client());
    return () => {};
  }, []);

  function submit(e) {
    const {
      target: { text }
    } = e;
    e.preventDefault();
    if (text.value) {
      dispatch(sendText(props, text.value));
      text.value = '';
    }
  }
  return (
    <div className='app' style={{ height: '98vh', padding: '1vh' }}>
      {(phase === phaseType.DISCONNECT || phase === phaseType.CONNECT || phase === phaseType.START) && <Home />}
      {(phase === phaseType.BEGIN || phase === phaseType.END) && <Chat />}
    </div>
  );
};
export default connect(state => state)(Index);

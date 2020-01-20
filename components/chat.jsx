import { connect, useDispatch } from 'react-redux';
import { useRef, useEffect } from 'react';
import { ACTION } from '../src/store';
import phaseType from '../src/types/phaseType';
import { end, sendText } from '../src/actions';
import './chat.scss';
import ChatItem from './chatItem';
const Chat = ({ phase, socket, roomID, message, chatControl: { follow, hasNew } }) => {
  const dispatch = useDispatch();
  const form = useRef(null);
  const body = useRef(null);
  const checkBox = useRef(null);
  const submit = e => {
    const {
      current: { text }
    } = form;
    e.preventDefault();
    if (text.value === '') return;
    if (text.value) {
      dispatch(sendText({ phase, socket, roomID, message }, text.value));
      text.value = '';
    }
  };
  const handleScroll = ({ target: { scrollTop, scrollHeight, clientHeight } }) => {
    const bottom = scrollHeight - scrollTop === clientHeight;
    if (bottom) {
      dispatch({ type: ACTION.CHATCONTROL, payload: { follow: true, hasNew: false } });
    } else {
      dispatch({ type: ACTION.CHATCONTROL, payload: { follow: false, hasNew } });
    }
  };
  useEffect(() => {
    if (follow) {
      body.current.scrollTop = body.current.scrollHeight;
    } else {
      dispatch({ type: ACTION.CHATCONTROL, payload: { follow, hasNew: true } });
    }
    return () => {};
  }, [message]);
  return (
    <div className='chat'>
      <div className='head'>
        <h5>{`Yuki`}</h5>
      </div>
      <div ref={body} className='body' onScroll={handleScroll}>
        <div ref={checkBox} className='chatBox'>
          {message.map((x, i) => (
            <ChatItem key={`t${i}`} item={x} />
          ))}
        </div>
      </div>
      <div className='leg'>
        <div className='functions emp'></div>
        <div className='block'></div>
        {!follow && (
          <button
            className='functions'
            onClick={() => {
              body.current.scrollTop = body.current.scrollHeight;
            }}
          >
            To bottom
          </button>
        )}
        <div className='block'></div>
        <button
          className='functions'
          onClick={() => {
            dispatch(end({ phase, socket, roomID }, phase === phaseType.END ? true : false));
          }}
        >
          {phase === phaseType.BEGIN ? 'Disconnect' : 'Leave'}
        </button>
      </div>
      <div className='foot'>
        <form ref={form} className='message-form' onSubmit={submit}>
          <textarea
            onKeyDown={x => {
              if (x.keyCode === 13) {
                submit(x);
              }
            }}
            disabled={phase !== phaseType.BEGIN}
            autoComplete='off'
            name='text'
            placeholder={phase === phaseType.BEGIN ? 'Type something...' : 'Chat ended'}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

const mapToProps = ({ phase, socket, roomID, message, chatControl }) => ({ phase, socket, roomID, message, chatControl });

export default connect(mapToProps)(Chat);

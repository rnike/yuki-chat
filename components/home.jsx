import { connect, useDispatch } from 'react-redux';
import phaseType from '../src/types/phaseType';
import { start, end } from '../src/actions';
import './home.scss';
import { version } from '../package.json';
const Home = ({ phase, socket, roomID }) => {
  const dispatch = useDispatch();
  const handelClick = () => {
    switch (phase) {
      case phaseType.CONNECT:
        dispatch(start({ phase, socket }));
        break;
      case phaseType.START:
        dispatch(end({ phase, socket, roomID }, true));
        break;
      default:
        break;
    }
  };
  return (
    <div className='home'>
      <h1>Yuki</h1>
      <h2>{phase === phaseType.START ? 'Looking for person to chat with...' : 'Random chat service'}</h2>
      <div className='button' onClick={handelClick}>
        {phase === phaseType.DISCONNECT ? 'Loading' : phase === phaseType.CONNECT ? 'Start' : phase === phaseType.START ? 'Cancel' : ''}
      </div>
      <a href='https://github.com/yum650350/yuki-chat' target='_blank' rel='noopener noreferrer' className='foot'>
        <div>{`v ${version}`}</div>
        <div>source</div>
      </a>
    </div>
  );
};

const mapToProps = ({ phase, socket, roomID }) => ({ phase, socket, roomID });

export default connect(mapToProps)(Home);

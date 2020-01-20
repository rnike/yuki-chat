import './chatItem.scss';
export default ({ item: { from, time, data } }) => (
  <div className={`chatItem ${from}`}>
    <div className='text'>{data}</div>
    <div className='time'>{time}</div>
  </div>
);

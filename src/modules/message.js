module.exports = (from, type, data) => ({ from: from, type: type, data: data, time: getFormattedDate() });

function getFormattedDate() {
  var date = new Date();
  var str = date.getHours() + ':' + date.getMinutes();
  return str;
}

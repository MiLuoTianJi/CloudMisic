const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//毫秒转秒
const changeMSToS=function (time_s) {
  if (time_s && Object.prototype.toString.call(time_s)=='object Number') {
    let sesult=time_s/1000

  }else{
    console.log('参数有误');
  }
}
module.exports = {
  formatTime: formatTime,
  changeMSToS:changeMSToS
}

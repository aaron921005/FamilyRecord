// 工具函数

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('.') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 将一维数组转为二维数组
function listToMatrix(list, elementPerSubArray) {
  let matrix = [], i, k;

  for (i = 0, k = -1; i < list.length; i += 1) {
    if (i % elementPerSubArray === 0) {
      k += 1;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}

function timecha(datestr) {

  var douhao = datestr.replace(/-/g, ',').replace(/ /g, ',').replace(/:/g, ',');
  ////console.log(douhao);
  var y1 = parseInt(douhao.split(',')[0]);
  var y2 = parseInt(douhao.split(',')[1]) - 1;
  var y3 = parseInt(douhao.split(',')[2]);
  var y4 = parseInt(douhao.split(',')[3]);
  var y5 = parseInt(douhao.split(',')[4]);
  var y6 = parseInt(douhao.split(',')[5]);
  var date1 = new Date(y1, y2, y3, y4, y5, y6);
  var date2 = new Date();    //结束时间  
  var date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数    
  ////console.log(date3);

  //------------------------------  

  //计算出相差天数  
  var days = Math.floor(date3 / (24 * 3600 * 1000))

  //计算出小时数  

  var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  
  var hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000)
  if (hours < 10)
    hours = '0' + hours;
  if (minutes < 10)
    minutes = '0' + minutes;
  if (seconds < 10)
    seconds = '0' + seconds;
  ////console.log(days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒");
  if (days != 0)
    return days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒";
  if (hours != 0)
    return hours + "小时 " + minutes + " 分钟" + seconds + " 秒";
  if (minutes != 0)
    return minutes + " 分钟" + seconds + " 秒";
  if (seconds != 0)
    return seconds + " 秒";
}
function timechatime(datestr1, datestr2) {

  var douhao1 = datestr1.replace(/-/g, ',').replace(/ /g, ',').replace(/:/g, ',');
  var y11 = parseInt(douhao1.split(',')[0]);
  var y21 = parseInt(douhao1.split(',')[1]) - 1;
  var y31 = parseInt(douhao1.split(',')[2]);
  var y41 = parseInt(douhao1.split(',')[3]);
  var y51 = parseInt(douhao1.split(',')[4]);
  var y61 = parseInt(douhao1.split(',')[5]);
  var date1 = new Date(y11, y21, y31, y41, y51, y61);

  var douhao2 = datestr2.replace(/-/g, ',').replace(/ /g, ',').replace(/:/g, ',');
  var y12 = parseInt(douhao2.split(',')[0]);
  var y22 = parseInt(douhao2.split(',')[1]) - 1;
  var y32 = parseInt(douhao2.split(',')[2]);
  var y42 = parseInt(douhao2.split(',')[3]);
  var y52 = parseInt(douhao2.split(',')[4]);
  var y62 = parseInt(douhao2.split(',')[5]);
  var date2 = new Date(y12, y22, y32, y42, y52, y62);

  var date3 = date1.getTime() - date2.getTime();   //时间差的毫秒数     

  //------------------------------  

  //计算出相差天数  
  var days = Math.floor(date3 / (24 * 3600 * 1000))

  //计算出小时数  

  var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  
  var hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000)
  if (hours < 10)
    hours = '0' + hours;
  if (minutes < 10)
    minutes = '0' + minutes;
  return hours + "时 " + minutes + " 分";
}

//小于10前面加0
function add0(value) {
  return (value < 10 ? '0' + value : value);
}

//小时和分钟小于10，前面加0
function timeadd0(hours, minute) {
  return add0(hours) + ":" + add0(minute);
}

//月份和日期小于10，前面加0
function dateadd0(value) {
  var y = value.split('/')[0];
  var m = value.split('/')[1];
  var d = value.split('/')[2];
  return y + "-" + add0(m) + "-" + add0(d);
}
module.exports = {
  formatTime: formatTime,
  listToMatrix: listToMatrix,
  timecha: timecha,
  timechatime: timechatime,
  timeadd0: timeadd0,
  dateadd0: dateadd0,
}
// baby.js

const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    //宝宝信息
    baby: null,

    //用户id
    userid: '1',

    //宝宝id
    user_babyid: '1',

    //宝宝姓名
    name: 'baby',

    //宝宝性别
    sex: '0',

    //日期
    date: '',

    //时间
    time: '',

    //毫升
    number: 60,

    //喂奶信息列表
    nurseList: null,

    //距离上次喂奶时间
    beforetimeTime: null,

    //距离上次喂奶时间
    beforetime: '',

    //现有时间累加
    timeleijiaInterval: null,

    //updatecurtime
    updatecurtimeInterval: null,
  },
  onLoad: function (params) {
    var myDate = new Date();
    this.setData({ 'name': params["name"], 'sex': params["sex"], 'userid': params["userid"], 'user_babyid': params["user_babyid"], 'date': util.dateadd0(myDate.toLocaleDateString()), 'time': util.timeadd0(myDate.getHours(), myDate.getMinutes()) });
    this.getNurseList();
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  slider4change: function (e) {
    this.setData({
      number: e.detail.value
    })
  },
  bindSave: function (e) {
    wx.showLoading({
      title: '提交中...'
    })
    var that = this;
    var myDate = new Date();
    wx.request({
      url: app.globalData.url + 'index.php?c=user_babynurse&a=apiadd',
      method: 'POST',
      data: {
        userid: that.data.userid,
        user_babyid: that.data.user_babyid,
        time: that.data.date + ' ' + that.data.time,
        number: that.data.number,
        remarks: that.data.remarks,
        createtime: util.formatTime(myDate)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          that.getNurseList();
        } else {
          wx.hideToast();
        }

      }
    })
  },
  getNurseList: function (e) {
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user_babynurse&a=apibyuserid',
      method: 'GET',
      data: {
        userid: that.data.userid,
        user_babyid: that.data.user_babyid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          //处理返回的喂奶列表
          for (var i = 0; i < res.data.length - 1; i++) {
            res.data[i].shijiacha = util.timechatime(res.data[i].time, res.data[i + 1].time);
            //当前毫升数矫正为最近一次喂奶毫升数
            if (i == 0)
              that.setData({ 'number': res.data[i].number });
          }

          that.setData({ 'nurseList': res.data });
          that.setData({ 'beforetimeTime': res.data[0].time });
          // 取消倒计时
          clearInterval(that.data.timeleijiaInterval);
          clearInterval(that.data.updatecurtimeInterval);


          // 设定倒计时
          that.setData({ 'timeleijiaInterval': setInterval(that.timeleijia, 1000) });
          that.setData({ 'updatecurtimeInterval': setInterval(that.updatecurtime, 30000) });

        } else {

        }
        wx.hideToast();

      }
    })
  },
  //距离上次喂奶间隔时间--倒计时查询
  timeleijia: function () {
    var that = this;
    var result = util.timecha(that.data.beforetimeTime);
    if (result != undefined)
      that.setData({ 'beforetime': result, });
    else
      that.setData({ 'beforetime': '这是undefined-' + that.data.beforetimeTime, });
  },
  //喂奶日期和时间--倒计时矫正
  updatecurtime: function () {
    var that = this;
    var myDate = new Date();
    that.setData({ 'date': util.dateadd0(myDate.toLocaleDateString()), 'time': util.timeadd0(myDate.getHours(), myDate.getMinutes()) });
  },

  //确定添加喂奶记录提示
  openConfirm_add: function (res) {
    var that = this;
    wx.showModal({
      title: '确认提示',
      content: '亲爱的宝妈\r\n' + res.currentTarget.dataset.tip + '\r\n您确定添加喂奶记录吗？',
      confirmText: "确定哦",
      cancelText: "我点错啦",
      success: function (res) {
        if (res.confirm) {
          that.bindSave();
        } else {
          // 用户点击取消操作
        }
      }
    });
  },
  openAlert: function () {
    wx.showModal({
      content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  }
})

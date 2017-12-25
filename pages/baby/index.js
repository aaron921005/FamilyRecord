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

    indexRed: 0,

    endDate:null,
    endTime:null,
  },
  onLoad: function (params) {
    var myDate = new Date();
    this.setData({ 'name': params["name"], 'sex': params["sex"], 'userid': params["userid"], 'user_babyid': params["user_babyid"], 'date': util.dateadd0(myDate.toLocaleDateString()), 'time': util.timeadd0(myDate.getHours(), myDate.getMinutes()) });
    this.getNurseList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

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
          // wx.showModal({
          //   title: 'aaron提示',
          //   content: '添加成功',
          //   showCancel: false,
          //   success: function (res) {
          //     if (res.confirm) {
          //       console.log('用户点击确定')
          //     }
          //   }
          // });
          that.getNurseList();
        }

      }
    })
  },
  getNurseList: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user_babynurse&a=apibyuseridasc',
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
          for (var i = res.data.length - 1; i > 0; i--) {
            res.data[i].shijiacha = util.timechatime(res.data[i].time, res.data[i - 1].time);
            res.data[i].time = res.data[i].time.replace(":00","");
            //当前毫升数矫正为最近一次喂奶毫升数
            if (i == res.data.length - 1)
              that.setData({ 'number': res.data[i].number });
          }

          that.setData({ 'nurseList': res.data });
          that.setData({ 'beforetimeTime': res.data[res.data.length - 1].time+":00" });
          // 取消倒计时
          clearInterval(that.data.timeleijiaInterval);
          clearInterval(that.data.updatecurtimeInterval);


          // 设定倒计时
          that.setData({ 'timeleijiaInterval': setInterval(that.timeleijia, 1000) });
          that.setData({ 'updatecurtimeInterval': setInterval(that.updatecurtime, 30000) });


          that.setData({ 'indexRed': res.data.length - 1 });
          console.log(res.data.length);

          var bottom=setInterval(function(){
            wx.pageScrollTo({
              scrollTop: res.data.length*32+300
            });
            clearInterval(bottom);
          }, 100) 

        } else {

        }

      }
    })
  },
  //距离上次喂奶间隔时间--倒计时查询
  timeleijia: function () {
    var that = this;
    var result = util.timecha(that.data.beforetimeTime);
    if (result != undefined)
      that.setData({ 'beforetime': result, });
    // that.setData({ 'beforetime': result, 'endDate': '2017-08-08', 'endTime': '08:15', });
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
      title: 'aaron提示',
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
      title: 'aaron提示',
      content: '添加成功',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
        }
      }
    });
  }
})

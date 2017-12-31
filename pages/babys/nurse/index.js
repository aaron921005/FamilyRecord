// pages/babys/nurse/index.js
const util = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _user: null,
    baby: null,
    date: '2017-12-25',
    time: '08:45',
    beforetime:'',
    timeleijiaInterval:null,
    // numberlist: [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300],
    number: 120,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.get_user(result => {
      that.setData({ _user: result });
      that.getInitbabynurse();
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getInitbabynurse();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  // 初始化宝宝喂奶
  getInitbabynurse: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user_baby&a=apibyuserid',
      method: 'GET',
      data: {
        userid: that.data._user.user.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          for (var i = 0; i < res.data.length; i++) {
            var nurse = res.data[i].babynurse[res.data[i].babynurse.length - 1];
            var time = nurse.time;
            var myDate = new Date();
            res.data[i].lastdate = time.split(' ')[0];
            res.data[i].lasttime = time.split(' ')[1];
            res.data[i].lastnumber = nurse.number;
            res.data[i].currentdate = util.dateadd0(myDate.toLocaleDateString());
            res.data[i].currenttime = util.timeadd0(myDate.getHours(), myDate.getMinutes());
            res.data[i].currentnumber = nurse.number;
           
          }
          that.setData({ 'baby': res.data });
          // 取消倒计时
          clearInterval(that.data.timeleijiaInterval);
          that.setData({ 'timeleijiaInterval': setInterval(that.leijia, 1000) });
        } else {

        }

      }
    })
  },
  leijia: function () {
    var that=this;
    for (var i = 0; i < that.data.baby.length; i++) {
      var nurse = that.data.baby[i].babynurse[that.data.baby[i].babynurse.length - 1];
      var time = nurse.time;
      var result = util.timecha(time);
      
      var obj = 'baby[' +i + '].beforetime';
      this.setData({
        [obj]: result
      })
    }
  },

  bindDateChange: function (e) {
    var obj = 'baby[' + e.currentTarget.dataset.index + '].currentdate';
    this.setData({
      [obj]: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    var obj = 'baby[' + e.currentTarget.dataset.index + '].currenttime';
    this.setData({
      [obj]: e.detail.value
    })
  },

  slider4change: function (e) {
    var obj = 'baby[' + e.currentTarget.dataset.index + '].currentnumber';
    this.setData({
      [obj]: e.detail.value
    })
  },
  //确定添加喂奶记录提示
  openConfirm_add: function (res) {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var baby = that.data.baby[index];
    wx.showModal({
      title: 'aaron提示',
      content: '亲爱的宝妈\r\n' + baby.name + '在' + baby.currentdate + ' ' + baby.currenttime + '吃了' + baby.currentnumber + '毫升\r\n您确定添加喂奶记录吗？',
      confirmText: "确定哦",
      cancelText: "我点错啦",
      success: function (res) {
        if (res.confirm) {
          that.bindSave(index);
        } else {
          // 用户点击取消操作
        }
      }
    });
  },

  bindSave: function (index) {
    var that = this;
    var baby = that.data.baby[index];
    var myDate = new Date();
    wx.request({
      url: app.globalData.url + 'index.php?c=user_babynurse&a=apiadd',
      method: 'POST',
      data: {
        userid: that.data._user.user.id,
        user_babyid: baby.id,
        time: baby.currentdate + ' ' + baby.currenttime,
        number: baby.currentnumber,
        remarks: that.data.remarks,
        createtime: util.formatTime(myDate)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          wx.showModal({
            title: 'aaron提示',
            content: '添加成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.getInitbabynurse();
              }
            }
          });
        }
      }
    })
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
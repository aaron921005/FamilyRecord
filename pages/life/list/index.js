// pages/life/list/index.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _user: null,
    lifeList: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.get_user(result => {
      that.setData({_user:result});
      that.getAlllife();
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this;
    that.getAlllife();

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

  // 加载所以生活
  getAlllife: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=userlife&a=apiall',
      method: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.Success) {
          for (var i in res.data.data) {
            res.data.data[i].files = res.data.data[i].files.split(';');
          }
          that.setData({
            lifeList: res.data.data
          });
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

})
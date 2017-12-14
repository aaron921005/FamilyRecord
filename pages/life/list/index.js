// pages/life/list/index.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _user: null,
    lifeList: null,
    init: false,//初始化为false，随后改为true
    more: true,
    initPage: 1,
    initPageSize: 10,
    page: 0,
    pageSize: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.get_user(result => {
      that.setData({ _user: result });
      that.getInitlife();
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
    var that = this;
    // if (that.data.init)
    //   app.get_user(result => {
    //     that.setData({ _user: result });
    //     that.getInitlife();
    //   })
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
    that.setData({ page: that.data.initPage, pageSize: that.data.initPageSize });
    that.getInitlife();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.more) {
      that.setData({ page: that.data.page + 1 });
      that.getMorelife();
    } 

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 初始化生活
  getInitlife: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=userlife&a=apiall',
      method: 'GET',
      data: {
        'page': that.data.initPage,
        'pageSize': that.data.initPageSize
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
    that.setData({ page: that.data.initPage, pageSize: that.data.initPageSize, init: true, more: true });
  },

  // 加载更多生活
  getMorelife: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=userlife&a=apiall',
      method: 'GET',
      data: {
        'page': that.data.page,
        'pageSize': that.data.pageSize
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
            lifeList: that.data.lifeList.concat(res.data.data),
          });
        } else
          that.setData({ more: false });
      }
    })
  },
})
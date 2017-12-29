// pages/media/audio/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioList: [],
    currentaudio: null,
    audioCtx: null,
    initPage: 1,
    initPageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getAll();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
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

  bofang: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentaudio: that.data.audioList[index],
    });
    setTimeout(function () {
      that.audioCtx.play()
    }, 200)
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },

  // 获取音乐列表
  getAll: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=audio&a=apiAll',
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
          that.setData({
            audioList: res.data.data,
            currentaudio: res.data.data[0],
          });
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
    that.setData({ page: that.data.initPage, pageSize: that.data.initPageSize, init: true, more: true });
  },
})
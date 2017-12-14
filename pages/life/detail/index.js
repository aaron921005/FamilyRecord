// pages/life/detail/index.js
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:new Object(),
    
  },
  onLoad: function (params) {
    this.setData({ 'detail.id': params["id"] });
    this.detail(this.data.detail.id);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.detail(this.data.detail.id);

  },

  //查询生活详情，通过id
  detail: function (id) {
    var that = this;

    wx.request({
      url: app.globalData.url + 'index.php?c=userlife&a=apibyid',
      method: 'GET',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.Success) {
          res.data.data.files = res.data.data.files.split(';');
          that.setData({ detail: res.data.data, });
        } else {
          //查询失败
          wx.showModal({
            content: '记录不存在',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')

              }
            }
          });
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新

      }
    })
  },

  //图片预览
  imgYulan: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }

})
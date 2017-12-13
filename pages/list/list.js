// index.js
// 宝宝聚合页

const config = require("../../config");

var app = getApp();

Page({

  data: {
    // 宝宝列表
    // TODO 从server端拉取
    Babies: null,

    // 是否显示loading
    showLoading: false,

    // loading提示语
    loadingMessage: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getBabies();
  },

  /**
   * 获取宝宝列表
   * 目前为本地缓存数据 + 本地假数据
   * TODO 从服务端拉取
   */
  getBabies() {
    var that = this;
    app.getBabyList(list => {
      that.setData({Babies: list});
    })
  },

  // 查看详情
  showDetail(event) {
    wx.navigateTo({
      url: '../baby/baby?id=' + event.currentTarget.dataset.id + '&name=' + event.currentTarget.dataset.name + '&userid=' + event.currentTarget.dataset.userid + '&sex=' + event.currentTarget.dataset.sex + '&user_babyid=' + event.currentTarget.dataset.user_babyid,
    });
  }
})

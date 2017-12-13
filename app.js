// app.js

const config = require('config');
const diaries = require('demo/diaries');
const url = require('utils/url.js');

App({

  onLaunch: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            success: (res_user) => {
              that.globalData.userInfo = res.userInfo;
              //获取openid
              wx.request({
                url: that.globalData.url + 'index.php?c=wx&a=wxUserDetail',
                data: {
                  code: res.code,
                  encryptedData: res_user.encryptedData,
                  iv: res_user.iv
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function (res) {
                  that.globalData.useropenid = res.data.openid;
                  wx.setStorageSync('openId', res.data.openId);
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  // 获取用户信息
  getUserInfo: function (cb) {
    var that = this;

    if (this.globalData.userInfo) {
      typeof cb == 'function' && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        success: (res) => {
          that.globalData.userInfo = res.userInfo;
          typeof cb == 'function' && cb(that.globalData.userInfo);
        }
      })
    }
  },

  // 获取本地全部宝宝列表
  getBabyList(cb) {
    var that = this;

    if (this.globalData.systemuserbaby) {
      typeof cb == 'function' && cb(this.globalData.systemuserbaby);
    } else {
      // let list = [];

      // this.getLocalDiaries(storage => {
      //   // 本地缓存数据
      //   for (var k in storage) {
      //     list.push(storage[k]);
      //   }
      // });

      // // 本地假数据
      // list.push(...diaries.diaries);
      // that.globalData.BabyList = list;
      // typeof cb == 'function' && cb(that.globalData.BabyList)
    }
  },

  // 获取本地宝宝缓存
  getLocalDiaries(cb) {
    var that = this;

    if (this.globalData.localDiaries) {
      typeof cb == 'function' && cb(this.globalData.localDiaries);
    } else {
      wx.getStorage({
        key: config.storage.BabyListKey,
        success: (res) => {
          that.globalData.localDiaries = res.data;
          typeof cb == 'function' && cb(that.globalData.localDiaries);
        },
        fail: (error) => {
          that.globalData.localDiaries = {};
          typeof cb == 'function' && cb(that.globalData.localDiaries);
        }
      });
    }
  },

  // 获取当前设备信息
  getDeviceInfo: function (callback) {
    var that = this;

    if (this.globalData.deviceInfo) {
      typeof callback == "function" && callback(this.globalData.deviceInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.deviceInfo = res;
          typeof callback == "function" && callback(that.globalData.deviceInfo)
        }
      })
    }
  },

  globalData: {
    // 设备信息，主要用于获取屏幕尺寸而做适配
    deviceInfo: null,

    // 本地宝宝缓存列表 + 假数据
    // TODO 真实数据同步至服务端，本地只做部分缓存
    BabyList: null,

    // 本地宝宝缓存
    localDiaries: null,

    // 用户信息
    userInfo: null,

    // 用户openid
    useropenid: null,

    // 系统用户信息
    systemuser: null,

    systemuserbaby: new Array(),

    // 接口路径
    url: url,
  }

})

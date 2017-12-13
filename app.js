// app.js

const config = require('config');
const url = require('utils/url.js');

App({

  onLaunch: function () {
    var that = this;

  },
  //获取用户信息
  get_user: function (obj) {
    var that = this;
    if (that.globalData._user.length > 0) {
      typeof obj == 'function' && obj(that.globalData._user);

    }else{
      that.getOpenid(obj);
    }
  },

  //获取用户Openid
  getOpenid: function (obj) {
    var that = this;
    if (that.globalData._user.wx != null) {
      that.searchUserExist(obj);
      return false;
    }
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            success: (res_user) => {
              that.globalData._user.wx = res_user.userInfo;
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
                  that.globalData._user.wx.openid = res.data.openid;
                  that.searchUserExist(obj);
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

  // 查询用户是否存在
  searchUserExist: function (obj) {
    var that = this;
    wx.request({
      url: that.globalData.url + 'index.php?c=user&a=apiexist',
      method: 'GET',
      data: {
        openid: that.globalData._user.wx.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (!res.data) {
          that.createUser();
        } else {
          that.globalData._user.user = res.data;
          typeof obj == 'function' && obj(that.globalData._user);
          // wx.showModal({
          //   title: 'aaron提示',
          //   content: res.data.remarks,
          //   showCancel: false
          // });
        }
      }
    })
  },

  // 给用户建档
  createUser: function (obj) {
    var that = this;
    wx.request({
      url: that.globalData.url + 'index.php?c=user&a=apiadd',
      method: 'POST',
      data: {
        username: that.globalData._user.wx.nickName,
        password: '123456',
        admin: 'user',
        wxname: that.globalData._user.wx.nickName,
        openid: that.globalData.userOpenid,
        sex: (that.globalData._user.wx.gender == 1 ? '男' : '女')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          that.searchUserExist(obj);
        } else {
          console.log('开户失败！' + res.errMsg)
        }

      }
    })
  },


  globalData: {

    // 用户信息
    _user: [],

    // 接口路径
    url: url,
  }

})

// pages/life/add/index.js
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: null,
    upload_picture_list: [],
    content: '',
    files: '',
    remarks: '',
    isAgree: false,
  },
  onLoad: function (params) {
    this.setData({ userid: params["userid"] });
    console.log(params["userid"]);
  },
  uploadpic: function (e) {
    var that = this;
    var upload_picture_list = that.data.upload_picture_list
    wx.chooseImage({
      count: 3, // 默认9，这里显示一次选择相册的图片数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFiles = res.tempFiles
        //循环把图片加入上传列表
        for (var i in tempFiles) {
          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
        }
        that.setData({
          upload_picture_list: upload_picture_list,
        })
        //循环把图片上传到服务器 并显示进度
        for (var j in upload_picture_list) {
          if (upload_picture_list[j]['upload_percent'] == 0) {
            that.upload_file_server(that, upload_picture_list, j)
          }
        }
      }
    })
  },


  upload_file_server: function (that, upload_picture_list, j) {
    console.log("开始上传" + j + "图片到服务器：")
    console.log(upload_picture_list[j])
    var that = this;
    var upload_task = wx.uploadFile({
      url: app.globalData.url + 'index.php?c=userUpload&a=Save', //需要用HTTPS，同时在微信公众平台后台添加服务器地址
      filePath: upload_picture_list[j]['path'],//上传的文件本地地址
      name: 'file',
      formData: { 'userid': that.data.userid, 'content': that.data.content, 'remarks': that.data.remarks },//附近数据，这里为路径
      success: function (res) {
        var data = JSON.parse(res.data) //字符串转化为JSON
        if (data.Success == true) {
          var filename = app.globalData.url + data.SaveName
          upload_picture_list[j]['path_server'] = filename
        }
        that.setData({
          upload_picture_list: upload_picture_list
        })
        console.log("图片上传" + j + "到服务器完成：")
        console.log(upload_picture_list[j])
      }
    })
    upload_task.onProgressUpdate((res) => {
      // console.log('上传进度', res.progress)
      // console.log('已经上传的数据长度', res.totalBytesSent)
      // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      upload_picture_list[j]['upload_percent'] = res.progress
      console.log('第' + j + '个图片上传进度：' + upload_picture_list[j]['upload_percent'])
      console.log(upload_picture_list)
      that.setData({
        upload_picture_list: upload_picture_list
      })

    })
  },
  contentBlur: function (e) {
    this.setData({
      content: e.detail.value
    })

  },

  //同意条款、不同意条款
  isAgreeFun: function (e) {
    var that = this;
    that.setData({ 'isAgree': !that.data.isAgree });
  },
  AddLifeFun: function (e) {
    var that = this;
    if (that.data.content == '') {
      wx.showModal({
        content: '请输入发表的内容',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }
      });
    } else if (!that.data.isAgree) {
      wx.showModal({
        content: '请阅读并同意《相关条款》',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }
      });
    } else {
      wx.showLoading({
        title: '提交中...'
      })
      that.setData({
        files: '',
      })
      for (var i in that.data.upload_picture_list) {
        if (that.data.upload_picture_list[i]['upload_percent'] == 100) {
          that.setData({
            files: that.data.files + that.data.upload_picture_list[i]['path_server'] + ';',
          })
        }
      }
      var that = this;
      var myDate = new Date();
      wx.request({
        url: app.globalData.url + 'index.php?c=userlife&a=lifeSave',
        method: 'POST',
        data: {
          userid: that.data.userid,
          content: that.data.content,
          files: that.data.files,
          remarks: that.data.remarks,
          createtime: util.formatTime(myDate)
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.Success) {
            wx.hideToast();
            //添加成功
            wx.showModal({
              content: '添加成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击确定')

                  //返回
                  wx.navigateBack();
                }
              }
            });
          } else {
            //添加失败
            wx.hideToast();
          }

        }
      })

    }
  },
 
})
// mine.js

// 自定义标签
var iconPath = "../../images/icons/"
var tabs = [
  {
    "icon": iconPath + "baby.png",
    "iconActive": iconPath + "babyHL.png",
    "title": "宝宝",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "生活.png",
    "iconActive": iconPath + "生活HL.png",
    "title": "生活",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "like.png",
    "iconActive": iconPath + "likeHL.png",
    "title": "喜欢",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "more.png",
    "iconActive": iconPath + "moreHL.png",
    "title": "更多",
    "extraStyle": "border:none;",
  },
]

var app = getApp();

Page({

  // data
  data: {
    // 展示的tab标签
    tabs: tabs,

    // 当前选中的标签
    currentTab: "tab1",

    // 高亮的标签索引
    highLightIndex: "0",

    // 模态对话框样式 
    modalShowStyle: "",

    // 待新建的宝宝姓名
    babyname: "",
    // 待新建的宝宝出生日期
    babybirthdate: "",
    // 待新建的宝宝性别
    babysex: "",
    babysexarray: ['男孩', '女孩'],
    // 待新建的宝宝身高
    babyheight: "",
    // 待新建的宝宝体重
    babyweight: "",
    // 待新建的宝宝备注
    babyremarks: "",

    // TODO 用户信息
    userInfo: "",

    babynum: 0,

    systemuser: null,

    systemuserbaby: null,

    systemUserlife: null,
  },
  onLoad: function (options) {
    this.tab1();
  },
  // 隐藏模态框
  hideModal() {
    this.setData({ modalShowStyle: "" });
  },

  // 清除宝宝档案标题
  clearTitle() {
    this.setData({ babyname: "" });
  },

  onShow: function () {
    this.hideModal();
    this.clearTitle();
  },

  // 点击tab项事件
  touchTab: function (event) {
    var tabIndex = parseInt(event.currentTarget.id);
    var template = "tab" + (tabIndex + 1).toString();

    this.setData({
      currentTab: template,
      highLightIndex: tabIndex.toString()
    });

    if (tabIndex == 0)
      this.tab1();
    if (tabIndex == 1)
      this.tab2();
    if (tabIndex == 2)
      this.tab3();
    if (tabIndex == 3)
      this.tab4();
  },

  // 点击新建宝宝档案按钮
  touchAdd: function (event) {
    this.setData({
      modalShowStyle: "opacity:1;pointer-events:auto;"
    })
  },

  // 新建宝宝档案
  touchAddNew: function (event) {
    wx.showLoading({
      title: '提交中...'
    })
    this.searchBabyExist();
  },

  // 取消输入
  touchCancel: function (event) {
    this.hideModal();
    this.clearTitle();
  },

  // 宝宝姓名输入事件
  babynameInput: function (event) {
    this.setData({
      babyname: event.detail.value,
    })
  },

  //宝宝出生日期改变事件
  babybirthdateChange: function (event) {
    this.setData({
      babybirthdate: event.detail.value
    })
  },

  //宝宝性别改变事件
  babysexChange: function (event) {
    var that = this;
    this.setData({
      babysex: that.data.babysexarray[event.detail.value]
    })
  },

  // 宝宝身高输入事件
  babyheightInput: function (event) {
    this.setData({
      babyheight: event.detail.value,
    })
  },

  // 宝宝体重输入事件
  babyweightInput: function (event) {
    this.setData({
      babyweight: event.detail.value,
    })
  },

  // 宝宝备注输入事件
  babyremarksInput: function (event) {
    this.setData({
      babyremarks: event.detail.value,
    })
  },
  // 查询用户是否存在
  searchUserExist: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user&a=apiexist',
      method: 'GET',
      data: {
        openid: app.globalData.useropenid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (!res.data) {
          that.createUser();
        } else {
          app.globalData.systemuser = res.data;
          that.setData({ systemuser: res.data });
          that.searchUserAllBaby();
        }
      }
    })
  },
  // 给用户建档
  createUser: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user&a=apiadd',
      method: 'POST',
      data: {
        username: app.globalData.userInfo.nickName,
        password: '123456',
        admin: 'user',
        wxname: app.globalData.userInfo.nickName,
        openid: app.globalData.useropenid,
        sex: (app.globalData.userInfo.gender == 1 ? '男' : '女')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          wx.showToast({
            title: '建档成功',
            icon: 'succes',
            duration: 2000,
            mask: true
          });
          that.searchUserExist();
        } else {
          wx.hideToast();
        }

      }
    })
  },
  // 查询宝宝是否存在
  searchBabyExist: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user_baby&a=apiexist',
      method: 'GET',
      data: {
        userid: app.globalData.systemuser.id,
        name: that.data.babyname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (!res.data) {
          that.createBaby();
        } else {
          app.globalData.systemuserbaby[that.data.babynum] = res.data;//把新添加的宝宝放入缓存
          that.setData({ systemuserbaby: app.globalData.systemuserbaby });
          that.hideModal();
          wx.hideToast();
        }
      }
    })
  },
  // 给宝宝建档
  createBaby: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user_baby&a=apiadd',
      method: 'POST',
      data: {
        userid: app.globalData.systemuser.id,
        name: that.data.babyname,
        birthdate: that.data.babybirthdate,
        sex: that.data.babysex,
        height: that.data.babyheight,
        weight: that.data.babyweight,
        remarks: that.data.babyremarks
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          wx.showToast({
            title: '建档成功',
            icon: 'succes',
            duration: 2000,
            mask: true
          });
          that.searchBabyExist();
        } else {
          wx.hideToast();
        }

      }
    })
  },
  // 查询用户所有的宝宝
  searchUserAllBaby: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user_baby&a=apibyuserid',
      method: 'GET',
      data: {
        userid: app.globalData.systemuser.id,
        name: that.data.babyname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          that.setData({
            babynum: res.data.length
          });
          app.globalData.systemuserbaby = res.data;//把新添加的宝宝放入缓存
          that.setData({ systemuserbaby: res.data });
          wx.hideToast();
        }
      }
    })
  },
  //宝宝喂奶情况
  babynurse: function (event) {
    wx.navigateTo({
      url: '../baby/baby?id=' + event.currentTarget.dataset.id + '&name=' + event.currentTarget.dataset.name + '&userid=' + event.currentTarget.dataset.userid + '&sex=' + event.currentTarget.dataset.sex + '&user_babyid=' + event.currentTarget.dataset.user_babyid,
    });
  },

  //初始化
  tab1: function (event) {
    var that = this;
    app.getUserInfo(info => {
      that.setData({
        'userInfo': info
      });
      that.searchUserExist();
    });
  },

  // 我的设置 
  mineSet: function (event) {
    //app.globalData.systemuser.id
    wx.showModal({
      content: '设置我的信息',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },
  openAlert: function () {
    wx.showModal({
      content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },

  //添加生活
  addLife: function (event) {
    var that = this;
    wx.navigateTo({
      url: '../life/add/index?&userid=' + that.data.systemuser.id,
    });
  },
  // 查询用户所有的生活
  tab2: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=userlife&a=apibyuserid',
      method: 'GET',
      data: {
        userid: app.globalData.systemuser.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.Success) {
          for (var i in res.data.data){
            res.data.data[i].files = res.data.data[i].files.split(';');
          }
          that.setData({
            systemUserlife: res.data.data
          });
        }
      }
    })
  },

  tab3:function(e){

  },

  tab4: function (e) {

  },



})





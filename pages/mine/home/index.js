// mine.js

// 自定义标签
var iconPath = "/images/icons/"
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
    _user: new Object(),

    wx:null,

    // 展示的tab标签
    tabs: tabs,

    // 当前选中的标签
    currentTab: "tab1",

    // 高亮的标签索引
    highLightIndex: "0",

    // 模态对话框样式 
    modalShowStyle: "",

    curbaby: {
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

      babynum: 0,

    },
    tab2page: 1,
    tab2pageSize: 5,



    systemuser: null,

    systemuserbaby: null,

    systemUserlife: null,
  },
  onLoad: function (options) {
    var that = this;
    app.get_user(result => {
      that.setData({ '_user.wx': result.wx, '_user.user': result.user ,wx:result.wx,});
      that.tab1();
      that.tab2();
      that.tab3();
      that.tab4();
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

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
  // 隐藏模态框
  hideModal() {
    this.setData({ modalShowStyle: "" });
  },

  // 取消输入
  touchCancel: function (event) {
    this.hideModal();
    
  },
  // 新建宝宝档案
  addBaby: function (event) {
    this.searchBabyExist();
    
  },

  // 宝宝姓名输入事件
  babynameInput: function (event) {
    this.setData({
      'curbaby.babyname': event.detail.value,
    })
  },

  //宝宝出生日期改变事件
  babybirthdateChange: function (event) {
    this.setData({
      'curbaby.babybirthdate': event.detail.value
    })
  },

  //宝宝性别改变事件
  babysexChange: function (event) {
    var that = this;
    this.setData({
      'curbaby.babysex': that.data.curbaby.babysexarray[event.detail.value]
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

  // 查询宝宝是否存在
  searchBabyExist: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=user_baby&a=apiexist',
      method: 'GET',
      data: {
        userid: that.data._user.user.id,
        name: that.data.curbaby.babyname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (!res.data) {
          that.createBaby();
        } else {
          wx.showModal({
            title: 'aaron提示',
            content: '已经存在宝宝：' + that.data.curbaby.babyname,
            showCancel: false
          });
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
        userid: that.data._user.user.id,
        name: that.data.curbaby.babyname,
        birthdate: that.data.curbaby.babybirthdate,
        sex: that.data.curbaby.babysex,
        height: that.data.curbaby.babyheight,
        weight: that.data.curbaby.babyweight,
        remarks: that.data.curbaby.babyremarks
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data) {
          wx.showModal({
            title: 'aaron提示',
            content: '宝宝开户成功',
            showCancel: false
          });
          that.hideModal();
          that.tab1();
        } else {
          console.log('宝宝开户失败！' + res.errMsg)
        }

      }
    })
  },

  //宝宝喂奶详情
  babynurse: function (event) {
    wx.navigateTo({
      url: '../../baby/index?id=' + event.currentTarget.dataset.id + '&name=' + event.currentTarget.dataset.name + '&userid=' + event.currentTarget.dataset.userid + '&sex=' + event.currentTarget.dataset.sex + '&user_babyid=' + event.currentTarget.dataset.user_babyid,
    });
  },


  // 我的设置 
  mineSet: function (event) {
    
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


  // 宝宝
  tab1: function (event) {

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
          that.setData({ '_user.baby': res.data, 'curbaby.babynum': res.data.length, });
        }
      }
    })
  },

  // 生活
  tab2: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'index.php?c=userlife&a=apibyuserid',
      method: 'GET',
      data: {
        'userid': that.data._user.user.id,
        'page': that.data.tab2page,
        'pageSize': that.data.tab2pageSize
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
            '_user.life': res.data.data
          });
        }
      }
    })
  },

  //喜欢
  tab3: function (e) {

  },

  //更多
  tab4: function (e) {

  },



})





// pages/media/audio/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioList: [{
      audioPoster: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000000jE4g74VS43p.jpg?max_age=2592000',
      audioName: '成都',
      audioAuthor: '赵雷',
      audioSrc: 'http://dl.stream.qqmusic.qq.com/C400000FR5GV0lwW18.m4a?vkey=C29C824FC9D849A9E73CE86B0BFC456088F90A8E206F08B02EDD9FF4650364403306470F0E0FA2BCF4D6DAE92EEA766D769C2F5AF27D6738&guid=680171713&uin=0&fromtag=66',
    }, {
      audioPoster: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000003RMaRI1iFoYd.jpg?max_age=2592000',
      audioName: '告白气球',
      audioAuthor: '周杰伦',
      audioSrc: 'http://dl.stream.qqmusic.qq.com/C400003OUlho2HcRHC.m4a?vkey=813A01538364F4935BBFF3C0323323E44B76B08D6C48D038246B0634AEF7538A4EBBD6A4F42BD07AD7BCF12F3083820D06406DD52D6E90E5&guid=680171713&uin=0&fromtag=66',
    }, {
      audioPoster: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000003W45rC3ob4SX.jpg?max_age=2592000',
      audioName: '带你去旅行',
      audioAuthor: '校长',
      audioSrc: 'http://dl.stream.qqmusic.qq.com/C400003tbRjy4V1wRt.m4a?vkey=F9627BDF15F18D0EF2BC0E4869C7856D61035FBE1505885DC4D5402B7A45B5B6B07B9C970B879A9080C756495BCA901DD1CDD7DD0E6BCC9D&guid=680171713&uin=0&fromtag=66',
    },{
      audioPoster: 'http://qukufile2.qianqian.com/data2/pic/7c0e4039955b69c7e6117743f79d5585/559949681/559949681.jpg@s_1,w_300,h_300',
      audioName: '一生所爱',
      audioAuthor: '莫文蔚',
      audioSrc: 'http://zhangmenshiting.qianqian.com/data2/music/4bd05c8f056b8c4435101d2d2d076628/559950052/559950052.mp3?xcode=09cfd12ca9daf9a02c25efac0ddd93cf',
    }, {
      audioPoster: 'http://qukufile2.qianqian.com/data2/pic/260368391/260368391.jpg@s_0,w_300',
      audioName: '大王叫我来巡山',
      audioAuthor: '贾乃亮',
      audioSrc: 'http://zhangmenshiting.qianqian.com/data2/music/57a8cbc4b8e45f7e66ececd916730db3/257539247/257539247.mp3?xcode=6b32472587322681afe7b73b41f866fe',
    }],
    currentaudio:{
      audioPoster: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000000jE4g74VS43p.jpg?max_age=2592000',
      audioName: '成都',
      audioAuthor: '赵雷',
      audioSrc: 'http://dl.stream.qqmusic.qq.com/C400000FR5GV0lwW18.m4a?vkey=C29C824FC9D849A9E73CE86B0BFC456088F90A8E206F08B02EDD9FF4650364403306470F0E0FA2BCF4D6DAE92EEA766D769C2F5AF27D6738&guid=680171713&uin=0&fromtag=66'
    },
    audioCtx:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that=this;
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentaudio: that.data.audioList[index],
    });
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
})
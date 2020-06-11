//app.js
App({
  onLaunch: function () {
    // this.globalData.musicList=wx.getStorageSync("musicList") || []
    console.log(wx.getStorageSync("musicList"));
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    //即将播放的歌曲id
    id:'',
    //当前正在的歌曲详情
    songInfo:{},
    //背景音乐播放器
    backgroundAudioManager:{},
    //播放列表
    musicList:[],
    //info界面的样式，由type决定
    infoType:''
  }
})
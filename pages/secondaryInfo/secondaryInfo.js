import api from '../../api/api.js'
let app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoType:'',
    songList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.infoType,options.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  //请求数据
  getData:function (type,data) {
    let arr=[
      {type:'singer',apiFn:'getSongsBySinger',data:{id:data},path:'hotSongs'},
      {type:'songOrder',apiFn:'getSongsBySongOrder',data:{id:data},path:'playlist',secondaryPath:'tracks'},
      {type:'ranking',apiFn:'getTopList',data:{idx:data},path:'playlist',secondaryPath:'tracks'},
    ]
    arr.map(item=>{
      if (item.type==type) {
        api[item.apiFn](item.data).then(res=>{
          let resList=[]
          if (item.secondaryPath) {
            resList=res[item.path][item.secondaryPath]
          }else{
            resList=res[item.path]
          }
          let songList=resList.map(v=>{
                let singer=''
                //歌手可能不止一个
                v.ar.map((k,i)=>{
                  singer+=i==v.ar.length-1?k.name:k.name+' / '
                })
                return {
                  ...v,
                  singer:singer+' - '+v.al.name
                }
            })
          this.setData({
            songList: songList
          })
        })
      }
    })
    // if (type=='singer') {
    //   api.getSongsBySinger({id:id}).then(res=>{
    //     let songList=res.hotSongs.map(v=>{
    //           let singer=''
    //           //歌手可能不止一个
    //           v.ar.map((k,i)=>{
    //             singer+=i==v.ar.length-1?k.name:k.name+' / '
    //           })
    //           return {
    //             ...v,
    //             singer:singer+' - '+v.al.name
    //           }
    //       })
    //     this.setData({
    //       songList: songList
    //     })
    //   })
    // }
    // if (type=='songOrder') {
    //   api.getSongsBySongOrder({id:id}).then(res=>{
    //     let songList=res.playlist.tracks.map(v=>{
    //           let singer=''
    //           //歌手可能不止一个
    //           v.ar.map((k,i)=>{
    //             singer+=i==v.ar.length-1?k.name:k.name+' / '
    //           })
    //           return {
    //             ...v,
    //             singer:singer+' - '+v.al.name
    //           }
    //       })
    //     this.setData({
    //       songList: songList
    //     })
    //   })
    // }
  },

  //前往播放页面
  goToPlay:function (event) {
    app.globalData.id=event.currentTarget.dataset.id
    wx.switchTab({
      url: "../play/play",
    })
  },
})
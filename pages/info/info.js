import api from '../../api/api.js'
let app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //由Type来决定页面的样式
    infoType:'',
    //MV列表
    MVList:[],
    //歌手榜
    singerList:[],
    //歌单列表
    songOrderList:[],
    //排行榜
    rankingList:[],
    //最新音乐
    newSongsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      infoType:app.globalData.infoType
    })
    //获取数据
    this.getData()
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

  //获取数据
  getData:async function () {
    //根据type来请求
    let infoType=this.data.infoType
    if (infoType=='singer') {
      api.getSonger({}).then(res => {
        this.setData({
          singerList: res.list.artists.slice(0, 100)
        })
      })
    }
    if (infoType=='songOrder') {
      api.getsongsheet({order: 'hot'}).then(res => {
        this.setData({
          songOrderList: res.playlists,
        })
      })
    }
    if (infoType=='ranking') {
      let rankingList=[]
      for (let i = 0; i < 4; i++) {
        let res=await this.getRankingList({idx:i})
        if (res) {
          let rankingListItem={
            ...res.playlist,
            idx:i,
            showSongsList:res.playlist.tracks.slice(0,3)
          }
          rankingListItem.showSongsList=rankingListItem.showSongsList.map(v=>{
            let singer=''
            v.ar.map((k,i)=>{
              singer+=i==v.ar.length-1?k.name:k.name+' / '
            })
            return {
              ...v,
              singer:singer
            }
          })
          rankingList.push(rankingListItem)
        }
      }
      console.log(rankingList);
      
      this.setData({
        rankingList:rankingList
      })
    }
    if (infoType=='MV') {
      api.getNewMv({}).then(res => {
        this.setData({
          MVList:res.data,
        })
      })
    }
    if (infoType=='newSongs') {
      api.getNewSong({}).then(res => {
        this.setData({
          newSongsList:res.result
        })
      })
    }
  },

  //排行榜需要请求四次
  getRankingList:function (data) {
    return new Promise((resolve,reject)=>{
      api.getTopList(data).then(res=>{
        resolve(res)
      }).catch(err=>{
        resolve(false)
      })
    })
  },

  //点击item
  clickItem:function (event) {
    let data=event.currentTarget.dataset.data
    wx.navigateTo({
      url: `../secondaryInfo/secondaryInfo?data=${data}&infoType=${this.data.infoType}`,
    })
  },

  //前往MV播放
  goToMV:function (event) {
    let id=event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../MV/MV?id=${id}`,
    })
  },

  //前往播放页面
  goToPlay:function (event) {
    app.globalData.id=event.currentTarget.dataset.id
    wx.switchTab({
      url: "../play/play",
    })
  },
})
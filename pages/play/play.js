import api from '../../api/api.js'
let app=getApp()
let backgroundAudioManager = wx.getBackgroundAudioManager()
console.log(backgroundAudioManager.src);

if (backgroundAudioManager.src) {
  
}
backgroundAudioManager.title = wx.getStorageSync("musicList")[0]?wx.getStorageSync("musicList")[0].title:"Sour Candy"
backgroundAudioManager.singer = wx.getStorageSync("musicList")[0]?wx.getStorageSync("musicList")[0].singer:"Lady Gaga/BLACKPINK - Chromatica"
backgroundAudioManager.coverImgUrl  = wx.getStorageSync("musicList")[0]?wx.getStorageSync("musicList")[0].picUrl:"https://p2.music.126.net/hPCvLRx5TxSWul9YY5n6sA==/109951165023441548.jpg"
backgroundAudioManager.src = wx.getStorageSync("musicList")[0]?wx.getStorageSync("musicList")[0].src:"http://m10.music.126.net/20200609181058/081e18703250af15bcb5ae133ce47ee9/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/2687158303/2c0a/fc3f/31bc/9008459c57d35bcd1c0f425b6504a1c1.mp3"
app.globalData.backgroundAudioManager=backgroundAudioManager
app.globalData.backgroundAudioManager.pause()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前歌曲信息
    songInfo:{},
    //播放列表
    musicList:[],
    //正在播放
    isPlay:false,
    playType:'list_play',
    playTypeList:[
      {hanlderName:'list_play',src:'../../assets/images/list_play.png',className:'button-bar-list_play',hidden:false},
      {hanlderName:'cycle_list_play',src:'../../assets/images/cycle_list_play.png',className:'button-bar-cycle_list_play',hidden:true},
      {hanlderName:'cycle_single_play',src:'../../assets/images/cycle_single_play.png',className:'button-bar-cycle_single_play',hidden:true},
      {hanlderName:'random_play',src:'../../assets/images/random_play.png',className:'button-bar-random_play',hidden:true},
    ],
    //节流函数的开始
    timeStart:0,
    //进度条的位置(红柱的长度)
    progressBarWidth:0,
    //进度条的节点信息
    progressBarPosition:[],
    nowClientX:0,
    newClientX:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      songInfo:app.globalData.songInfo,
      musicList:app.globalData.musicList,
    })
    app.globalData.backgroundAudioManager.pause()
    this.changePlayType('list_play')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that=this
    const query = wx.createSelectorQuery()
    query.select('#progressBar').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      that.setData({
        progressBarPosition:res
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.id) {
      let ids=this.data.musicList.map(v=>v.id)
      //有ID，并且是新的ID
      if (ids.indexOf(app.globalData.id)==-1) {
        this.createPlayerFn(app.globalData.id)
      }
      //是已经有的ID，
      if (ids.indexOf(app.globalData.id)!=-1) {
        // 并且不是当前歌曲,做切歌操作
        if (app.globalData.id!=this.data.songInfo.id) {
          this.createBackgroundAudioManager(this.data.musicList[ids.indexOf(app.globalData.id)])
        }else{ //就是当前歌曲,不做操作
          return
        }
      }
    }else{//刚进入没选歌，从下方Bar点进来
      if (app.globalData.backgroundAudioManager.src) {
        return
      }
      if (this.data.musicList.length>0) {
        //创建播放器
        this.createBackgroundAudioManager(this.data.musicList[0],false)
      }else{
        wx.showToast({
          title: '播放列表为空，请添加歌曲',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
          //   wx.switchTab({
          //     url: "../discover/discover",
          // })
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    }
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
  
  //请求播放地址和歌曲详情
  createPlayerFn:async function (id) {
    let resPlayURL=await api.getPlayURL({id:id}),//先拿到播放地址
        resSongInfo=await api.getPlayDtail({ids:id}) //再拿歌曲详情(拿封面)
    if (resPlayURL.code==200 && resSongInfo.code==200) {
      //当前歌曲播放信息
      let singer=''
      //歌手可能多个
      resSongInfo.songs[0].ar.map((item,index)=>{
        singer+=index==resSongInfo.songs[0].ar.length-1?item.name:item.name+'/'
      })
      let songInfo={
        id:id,
        title:resSongInfo.songs[0].name,
        singer:singer+' - '+resSongInfo.songs[0].al.name,//歌手/歌手/歌手-专辑
        src:resPlayURL.data[0].url,
        picUrl:resSongInfo.songs[0].al.picUrl,
        songTime_ms:resSongInfo.songs[0].dt,//单位毫秒
        songTime_s:resSongInfo.songs[0].dt/1000,//单位毫秒
      }
      //创建播放器
      this.createBackgroundAudioManager(songInfo)
      app.globalData.musicList.push(songInfo)
      this.setData({
        songInfo:songInfo,
        musicList:app.globalData.musicList,
        isPlay:true
      })
      wx.setStorageSync("musicList",this.data.musicList)
    }else{

    }
  },

  //控制播放
  playControlFn:function (event) {
    let hanlderName=event.currentTarget.dataset.hanldername

    //----------------------第一个图标  调整播放模式--------------------
    if (hanlderName=='list_play' || hanlderName=='cycle_list_play' || hanlderName=='cycle_single_play' || hanlderName=='random_play') {
      let newhanlderName=''
      //点击的是列表播放 (逻辑应设置为下一个，即列表循环)
      if (hanlderName=='list_play') newhanlderName='cycle_list_play'
      //点击的是列表循环 (逻辑应设置为下一个，即单曲循环)
      if (hanlderName=='cycle_list_play') newhanlderName='cycle_single_play'
      //点击的是单曲循环 (逻辑应设置为下一个，即随机播放)
      if (hanlderName=='cycle_single_play') newhanlderName='random_play'
      //点击的是随机播放 (逻辑应设置为下一个，即列表播放)
      if (hanlderName=='random_play') newhanlderName='list_play'

      this.changePlayType(newhanlderName)
      return
    }
    // -------------------------------------------

    //上一曲,下一曲
    if (hanlderName=='prev' || hanlderName=='next') {
      this.switchMusic(hanlderName)
    }

    //播放
    if (hanlderName=='play') {
      if (app.globalData.backgroundAudioManager.src) {
        app.globalData.backgroundAudioManager.play()
      }else{
        this.createBackgroundAudioManager(this.data.songInfo)
      }
      this.setData({
        isPlay:true
      })
      return
    }

    //暂停
    if (hanlderName=='pause') {
      app.globalData.backgroundAudioManager.pause()
      this.setData({
        isPlay:false
      })
      return
    }

    //列表
    if (hanlderName=='list') {
      wx.navigateTo({
        url: '../musicList/musicList',
      })
      return
    }
  },

  //上下曲切歌逻辑
  switchMusic:function (type) {
    let musicList=this.data.musicList,
        nowIndex=this.getNowPlayIndex(),
        playType=this.data.playType,
        newIndex=null
    console.log(musicList);
    console.log(nowIndex);
    console.log(type);
    console.log(playType);
    
    if (musicList.length<=1) {
      return
    }
    //随机播放(点上一曲或者下一曲哪个按钮都没联系，随机切)
    if (playType=='random_play') {
      //获取一个小于播放列表length的随机数并且不等于当前播放的index
      let getRandomNum=function getRandomNumFn(index) {
            newIndex=Math.floor(Math.random()*musicList.length)
          if (newIndex==index) {
              getRandomNumFn(index)
          } else {
              return newIndex
          }
      }
      getRandomNum(nowIndex)
    }
    //其他三个是正常的上一曲和下一曲
    if (playType=='list_play' || playType=='cycle_list_play' || playType=='cycle_single_play') {
      //上一首
      if (type=="prev") {
        // 如果是第一首，上一首切换到最后一首
        if (nowIndex==0) {
          newIndex=musicList.length-1
        }else{ //正常上一首
          newIndex=nowIndex-1
        }
      }
      //下一首
      if (type=="next") {
        // 如果是最后一首，下一首切换到第一首
        if (nowIndex==musicList.length-1) {
          newIndex=0
        }else{ //正常下一首
          newIndex=nowIndex+1
        }
      }
    }
    console.log(musicList[nowIndex].title);
    
    console.log(musicList[newIndex].title);
    
    this.createBackgroundAudioManager(musicList[newIndex])
  },

  //切换播放模式
  changePlayType:function (playType) {
    let playTypeList=this.data.playTypeList
    //设置新的图标显示和播放模式
    this.setData({
      playTypeList:playTypeList.map(v=>{
        return {
          ...v,
          hidden:v.hanlderName==playType?false:true
        }
      }),
      playType:playType
    })
    //改变自然播放完毕后的逻辑
    app.globalData.backgroundAudioManager.onEnded(()=>{
      console.log('in');
      
      let nowIndex=this.getNowPlayIndex(),
          musicList=this.data.musicList
      //列表播放
      if (playType=='list_play') {
        //如果是最后一首，自然播放完毕后放完直接暂停
        if (nowIndex==musicList.length-1) {
          app.globalData.backgroundAudioManager.pause()
          this.setData({
            isPlay:false
          })
          return
        }
        //如果不是最后一首，自然播放完毕后调用正常下一首
        this.switchMusic('next')
      }
      //列表循环,随机播放
      if (playType=='cycle_list_play' || playType=='random_play') {
        //自然播放完毕后调用正常下一首
        this.switchMusic('next')
      }
      //单曲循环
      if (playType=='cycle_single_play') {
        //自然播放完毕后无需切歌，直接重复当前
        this.createBackgroundAudioManager(musicList[nowIndex])
      }
    })
  },

  //获取当前播放的歌的index
  getNowPlayIndex:function () {
    let musicList=this.data.musicList,
        result=null
    musicList.map((item,index)=>{
      if (item.id==this.data.songInfo.id) {
        result=index
      }
    })
    return result
  },

  //创建背景音乐播放器
  createBackgroundAudioManager:function (songInfo,isPlay=true) {
    app.globalData.backgroundAudioManager.title = songInfo.title
    app.globalData.backgroundAudioManager.singer = songInfo.singer
    if (isPlay) app.globalData.backgroundAudioManager.src = songInfo.src
    if (this.data.isPlay==true || isPlay) {
      //监听播放进度
      let that=this
      app.globalData.backgroundAudioManager.onTimeUpdate(()=>{
        this.throttle('timeStart',this.onTimeUpdateThrottle(app.globalData.backgroundAudioManager.duration,app.globalData.backgroundAudioManager.currentTime),that,1000)()
      })
    }
    app.globalData.songInfo=songInfo
    this.setData({
      songInfo:songInfo,
      isPlay:this.data.isPlay==true?true:isPlay
    })
  },
 
  //获取歌词
  getLiric:function () {
    // api.getLiric({id:this.data.songInfo.id}).then(res=>{
    //   console.log(res);
    // })
  },

  //拖动白点
  touchmoveFn:function (event) {
    let nowClientX=this.data.nowClientX,
        newClientX=this.data.newClientX
    if (nowClientX!=newClientX) {
      this.setData({
        nowClientX:newClientX
      })
      this.nowProgressPosition(newClientX)
    }
  },
  //点击进度条
  clickProgressBar:function (event) {
    this.nowProgressPosition(event.detail.x)
  },
  //获取当前触摸点的X轴位置
  mainBarTouchmoveFn:function (event) {
    this.throttle('timeStart',this.mainBarTouchmoveFnThrottle(event),this,500)()
  },
  //获取当前触摸点的X轴位置（节流）
  mainBarTouchmoveFnThrottle:function (event) {
    //因为要节流，所以把具体函数要return返上去,不然节流函数的callback拿不到方法
    return function () {
      this.setData({
        newClientX:event.touches[0].clientX
      })
    }
  },
  //跟随播放进度，进度条自动移动
  onTimeUpdateThrottle:function (duration,currentTime) {
    return function () {
      this.setData({
        progressBarWidth:(currentTime/duration)*100+'%'
      })
    }
  },
  //节流
  throttle:function (keyNmae,callback,newThis,delay=1000) {
    let timeStart=newThis.data[keyNmae]
    return function () {
      let timeEnd=Date.now(),
          args=arguments
      if (timeEnd-timeStart>=delay) {
        callback.apply(newThis,args)
        newThis.setData({
          [keyNmae]:timeEnd
        })
      }
    }
  },
  //算出进度条现在的位置
  nowProgressPosition:function (click_X) {
    let progressBarPosition=this.data.progressBarPosition[0]
    //点击的X轴-进度条的X轴获得现在红条的宽度，再除以进度条宽度，得到width的百分比宽度
    let progressBarWidth=((click_X-progressBarPosition.left)/progressBarPosition.width)
    this.setData({
      progressBarWidth:progressBarWidth*100+'%'
    })
    let currentTime=progressBarWidth*app.globalData.backgroundAudioManager.duration
    app.globalData.backgroundAudioManager.seek(currentTime)
  }
})
import api from '../../api/api.js'
let app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //头部标签
    headerType:'recommended',
    //轮播图
    swiperList:[],
    //个性推荐的四个导航
    recommendedNavList:[
      {name:'推荐MV',src:'../../assets/images/MV.png',type:'MV'},
      {name:'歌手榜',src:'../../assets/images/singer.png',type:'singer'},
      {name:'歌单',src:'../../assets/images/song.png',type:'songOrder'},
      {name:'排行榜',src:'../../assets/images/ranking.png',type:'ranking'},
    ],
    //最新音乐
    allNewMusicList:[],//全部最新音乐
    homeNewMusicList:[],//首页展示六个
    //精选歌单
    allChoicenessList:[],//全部精选歌单
    homeChoicenessList:[],//首页展示六个
    //推荐MV
    allRecommendedMVList:[],//全部推荐MV
    homeRecommendedMVList:[],//首页展示六个
    //精选电台
    allStationList:[],//全部精选电台
    homeStationList:[],//首页展示六个
    //最新专辑
    allLatestAlbumList:[],//全部最新专辑
    homeLatestAlbumList:[],//首页展示六个
    //主播电台的四个导航
    stationNavList:[
      {name:'电台分类',src:'../../assets/images/classification.png',type:'classification'},
      {name:'推荐节目',src:'../../assets/images/show.png',type:'show'},
      {name:'付费精品',src:'../../assets/images/boutique.png',type:'boutique'},
      {name:'精选电台',src:'../../assets/images/choiceness.png',type:'choiceness'},
    ],
    // 主播电台同一个接口，根据type区分
    stationList:[
      {type:2001,allList:[],homeList:[],title:'创作|翻唱'},   //创作|翻唱
      {type:10002,allList:[],homeList:[],title:'D|电子'},   //3D|电子
      {type:3,allList:[],homeList:[],title:'情感调频'},   //情感调频
      {type:2,allList:[],homeList:[],title:'音乐故事'},   //音乐故事
      {type:3001,allList:[],homeList:[],title:'二次元'},   //二次元
      {type:10001,allList:[],homeList:[],title:'有声书'},   //有声书
      {type:7,allList:[],homeList:[],title:'广播剧'},   //广播剧
      {type:6,allList:[],homeList:[],title:'美文读物'},   //美文读物
      {type:8,allList:[],homeList:[],title:'相声曲艺'},   //相声曲艺
      {type:11,allList:[],homeList:[],title:'人文历史'},   //人文历史
      {type:5,allList:[],homeList:[],title:'脱口秀'},   //脱口秀
      {type:4,allList:[],homeList:[],title:'娱乐|影视'},   //娱乐|影视
      {type:13,allList:[],homeList:[],title:'外语世界'},   //外语世界
      {type:453050,allList:[],homeList:[],title:'知识技能'},   //知识技能
      {type:14,allList:[],homeList:[],title:'亲子宝贝'},   //亲子宝贝
      {type:4001,allList:[],homeList:[],title:'校园|教育'},   //校园|教育
      {type:453051,allList:[],homeList:[],title:'商业财经'},   //商业财经
      {type:453052,allList:[],homeList:[],title:'科技科学'},   //科技科学
      {type:12,allList:[],homeList:[],title:'路途|城市'},   //路途|城市
      // {//创作|翻唱
      //     type:2001,
      //     allCreateCoversList:[],//全部创作|翻唱
      //     homeCreateCoversList:[],//首页展示
      // },
      // {//3D|电子
      //     type:10002,
      //     all3dElectronicList:[],//全部3D|电子
      //     home3dElectronicList:[],//首页展示
      // },
      // {//情感调频
      //     type:3,
      //     allEmotionalFMList:[],//全部情感调频
      //     homeEmotionalFMList:[],//首页展示
      // },
      // {//音乐故事
      //     type:2,
      //     allMusicStoryList:[],//全部音乐故事
      //     homeMusicStoryList:[],//首页展示
      // },
      // {//二次元
      //     type:3001,
      //     all2dList:[],//全部二次元
      //     home2dList:[],//首页展示
      // },
      // {//有声书
      //     type:10001,
      //     allAudioBookList:[],//全部有声书
      //     homeAudioBookList:[],//首页展示
      // },
      // {//广播剧
      //     type:7,
      //     allRadioList:[],//全部广播剧
      //     homeRadioList:[],//首页展示
      // },
      // {//美文读物
      //     type:6,
      //     allProseReadingList:[],//全部美文读物
      //     homeProseReadingList:[],//首页展示
      // },
      // {//相声曲艺
      //     type:8,
      //     allCrosstalkQuYiList:[],//全部相声曲艺
      //     homeCrosstalkQuYiList:[],//首页展示
      // },
      // {//人文历史
      //     type:11,
      //     allHumanHistoryList:[],//全部人文历史
      //     homeHumanHistoryList:[],//首页展示
      // },
      // {//脱口秀
      //     type:5,
      //     allTalkShowList:[],//全部脱口秀
      //     homeTalkShowList:[],//首页展示
      // },
      // {//娱乐|影视
      //     type:4,
      //     allEntertainmentMoviesList:[],//全部娱乐|影视
      //     homeEntertainmentMoviesList:[],//首页展示
      // },
      // {//外语世界
      //     type:13,
      //     allForeignLanguageWorldList:[],//全部外语世界
      //     homeForeignLanguageWorldList:[],//首页展示
      // },
      // {//知识技能
      //     type:453050,
      //     allKnowledgeSkillsList:[],//全部知识技能
      //     homeKnowledgeSkillsList:[],//首页展示
      // },
      // {//亲子宝贝
      //     type:14,
      //     allParentsBabyList:[],//全部亲子宝贝
      //     homeParentsBabyList:[],//首页展示
      // },
      // {//校园|教育
      //     type:4001,
      //     allCampusEducationList:[],//全部校园|教育
      //     homeCampusEducationList:[],//首页展示
      // },
      // {//商业财经
      //     type:453051,
      //     allCommerceFinanceList:[],//全部商业财经
      //     homeCommerceFinanceList:[],//首页展示
      // },
      // {//科技科学
      //     type:453052,
      //     allScienceTechnologyList:[],//全部科技科学
      //     homeScienceTechnologyList:[],//首页展示
      // },
      // {//路途|城市
      //     type:12,
      //     allWayCityList:[],//全部路途|城市
      //     homeWayCityList:[],//首页展示
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取轮播图
    this.getSwiperList()
    //获取最新音乐
    this.getNewMusicList()
    // 获取精选歌单
    this.getChoicenessList()
    // 获取推荐MV
    this.getRecommendedMVList()
    // 获取精选电台
    this.getStationList()
    // 获取最新专辑
    this.getHomeLatestAlbumList()
    //主播电台同一个接口，根据type区分
    // this.getStationAllData()
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

  //点击输入框
  clickSearchBar:function () {
    wx.navigateTo({
      url: "../search/search",
    })
  },

  //切换头部标签
  checkHeaderType:function (event) {
    this.setData({
      headerType:event.currentTarget.dataset.headerType
    })
  },

  //获取轮播图
  getSwiperList:function () {
    api.getBanner({type: 2}).then(res => {
      this.setData({
        swiperList: res.banners
      })
    })
  },
  //-------------------个性推荐-------------------------
  // 获取最新音乐
  getNewMusicList:function () {
    api.getNewSong({}).then(res => {
      this.setData({
        allNewMusicList: res.result,
        homeNewMusicList: res.result.slice(0, 6)
      })
    })
  },
  // 获取精选歌单
  getChoicenessList:function () {
    api.getsongsheet({order: 'hot'}).then(res => {
      this.setData({
        allChoicenessList: res.playlists,
        homeChoicenessList: res.playlists.slice(0, 6)
      })
    })
  },
  //获取推荐MV
  getRecommendedMVList:function () {
    api.getRecommendMV({}).then(res => {
      this.setData({
        allRecommendedMVList:res.result,
        homeRecommendedMVList: res.result.slice(0, 4)
      })
    })
  },
  // 获取精选电台
  getStationList:function () {
    api.getDjRadios({}).then(res => {
      this.setData({
        allStationList: res.djRadios,
        homeStationList: res.djRadios.slice(0, 6)
      })
    })
  },
  // 获取最新专辑
  getHomeLatestAlbumList:function () {
    api.getNewEst({}).then(res => {
      this.setData({
        allLatestAlbumList: res.albums,
        homeLatestAlbumList: res.albums.slice(0, 6)
      })
    })
  },

  //-------------------主播电台-------------------------
  //主播电台同一个接口，根据type区分
  getStationAllData:async function () {
    let stationList=this.data.stationList
    for (let i = 0; i < stationList.length; i++) {
      let newData=await this.asyncGetStationData(stationList[i].type)
      if (newData) {
        stationList[i].allList=newData.allList
        stationList[i].homeList=newData.homeList
      }
    }
    this.setData({
      stationList:stationList
    })
  },
  //异步请求主播电台
  asyncGetStationData:function (type) {
    return new Promise((resolve,reject)=>{
      api.getRecommendType({type: type}).then(res=>{
        resolve({
          allList:res.djRadios,
          homeList:res.djRadios.slice(0,3)
        })
      }).catch(err=>{
        resolve(false)
      })
    })
  },
  //换一换
  changeItem:function (event) {
    let stationList=this.data.stationList,
        index=event.currentTarget.dataset.index,
        allList=stationList[index].allList
    //从全部列表里面随便切换三个出来展示
    //先拿三个随机数出来
    let randomArr=this.RandomFn(allList.length,3)
    if (randomArr && randomArr.length>0) {
      stationList=stationList.map((v,i)=>{
        return {
          ...v,
          homeList:i==index?[].concat(allList[randomArr[0]],allList[randomArr[1]],allList[randomArr[2]]):v.homeList
        }
      })
      this.setData({
        stationList:stationList
      })
    }else{
      wx.showToast({
        title: '已经没有更多了',
        icon: 'none',
      });
    }
  },
  //取随机数出来
  RandomFn:function (max,num) {
    if (max<num) { //防爆栈
      return false
    }
    let arr=[]
    let getRandomNum=function getRandomNumFn(max,num) {
      if (arr.length==num) {
        return
      }else{
        let newRandom=Math.floor(Math.random()*max)
        if (arr.indexOf(newRandom)==-1 && arr.length<num) {
            arr.push(newRandom)
        }
        getRandomNumFn(max,num)
      }
    }
    getRandomNum(max,num)
    return arr
  },
  //-----------------公共方法-----------------------------
  //前往播放页面
  goToPlay:function (event) {
    app.globalData.id=event.currentTarget.dataset.id
    wx.switchTab({
      url: "../play/play",
    })
  },
  //前往info页面
  goToInfo:function (event) {
    app.globalData.infoType=event.currentTarget.dataset.type
    wx.navigateTo({
      url: "../info/info",
    })
  },
  //点击歌单
  goToSongOrder:function (event) {
    let data=event.currentTarget.dataset.data
    wx.navigateTo({
      url: `../secondaryInfo/secondaryInfo?data=${data}&infoType=songOrder`,
    })
  },
  //前往MV播放
  goToMV:function (event) {
    let id=event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../MV/MV?id=${id}`,
    })
  },
})
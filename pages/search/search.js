import api from '../../api/api.js'

Page({
    data:{
        inputValue:'',
        //热门搜索
        hotLabelList:[],
        //搜索历史
        historyList:[],
        //搜索框输入
        isInput:false,
        // 搜索框确认
        isSearch:false,
        //默认搜索
        defaultSearch:'',
        //搜索建议
        suggestionsList:[],
        //搜索结果
        resultsList:[],
        
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        this.setData({
            historyList:wx.getStorageSync("historyList") || []
        })
        //获取热门便签
        this.getHotLabel()
    },

    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {

    },

    // 生命周期函数--监听页面显示
    onShow: function () {

    },

    // 生命周期函数--监听页面隐藏
    onHide: function () {

    },

    // 生命周期函数--监听页面卸载
    onUnload: function () {

    },

    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {

    },

    // 页面上拉触底事件的处理函数
    onReachBottom: function () {

    },

    // 用户点击右上角分享
    onShareAppMessage: function () {

    },

    //获取热门标签
    getHotLabel:function () {
        api.gethotsongs({type:'new'}).then(res=>{
            if (res.result.hots && res.result.hots.length>0) {
                let hotLabelList=res.result.hots.map(v=>{
                    return v.first
                })
                this.setData({
                    hotLabelList:hotLabelList,
                    defaultSearch:hotLabelList[0]
                })
            }
        })
    },

    //搜索框输入
    inputFn:function (event) {
        this.setData({
            isInput:event.detail.value===''?false:true,
            isSearch:false,
            suggestionsList:[]
        })
        if (event.detail.value) {
            //获取搜索建议
            api.searchSuggest({ keywords: event.detail.value ,type:'mobile'}).then(res=>{
                if(res.result.allMatch && res.result.allMatch.length>0){
                    this.setData({
                        suggestionsList:res.result.allMatch.map(v=>{
                            return v.keyword
                        })
                    })
                }
            })
        }
    },

    //点击搜索建议
    clickSuggestionFn:function (event) {
        this.setData({
            inputValue:event.currentTarget.dataset.target
        })
        this.getSongs()
    },

    //搜索框确认
    confirmFn:function (event) {
        if (event.detail.value==='' && this.data.defaultSearch) {
            this.setData({
                inputValue:this.data.defaultSearch,
            })
        }
        this.getSongs()
    },

    //获取搜索结果
    getSongs:function () {
        
        api.searchResult({ keywords: this.data.inputValue, type: 1, limit: 100, offset:2 }).then(res=>{
            let historyList=this.data.historyList
            if (historyList.indexOf(this.data.inputValue)==-1) {
                historyList.push(this.data.inputValue)
            }
            if (res.result.songs && res.result.songs.length>0) {
                this.setData({
                    resultsList:res.result.songs.map(v=>{
                        let singer=''
                        //歌手可能不止一个
                        v.artists.map(k=>{
                            singer+=k==v.artists.length?k.name:k.name+'/'
                        })
                        return {
                            ...v,
                            singer:singer+' - '+v.album.name
                        }
                    }),
                    isSearch:true,
                    isInput:false,
                    historyList:historyList
                })
                wx.setStorageSync("historyList", historyList);
            }
        })
    },

    //前往播放页面
    goPlayFn:function (event) {
        getApp().globalData.id=event.currentTarget.dataset.target.id
        wx.switchTab({
            url: "../play/play",
        })
    },

    //清除历史记录
    clearFn:function () {
        this.setData({
            historyList:[]
        })
        wx.setStorageSync("historyList",[])
    }
})
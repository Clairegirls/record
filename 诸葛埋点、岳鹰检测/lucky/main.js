var app = new Vue({
  el: "#app",
  data: {
    default_url: getApi(),
    ajaxData: {
      uid: parseInt(getQueryString("uid")),
      token: getQueryString("token"),
      lang: getQueryString("lang")
    },
    gold_reward:{},
    head_reward:{},
    todayRank:[],
    historyRank:[],
    switchI:1,
    myRank:{},
    time:'00:00:00',
    dataJson :{},
    todayRankShow:[],
    switchMore:true,
    startAct:false,
    lang:'en',
    start_time_format: '',
    end_time_format: '',
    framebox:false
  },
  created: function () {
    zhuge.track('LuckyGiftEvent');
    zhuge.track('LuckyGiftEventSource', {
      sub_id: getQueryString("source")
    })
    this.getLang()
    this.gameReward()
    this.todayRankList()
    this.historyRankList()
    this.gameInfo()

  },

  methods: {
    checkWebp: function(imgSrc){
      return isSupportedWebp?imgSrc:imgSrc.replace('/webp', '/jpg')
    },
    getCoin: function(coin,k_coin){
      return coin>1000000?k_coin:coin
    },
    todaySwitchMore: function(list,tid,imgId){
      this.todayRankShow = this.switchMore?list:list.slice(3,10)
      var text = $('#'+tid)
      var img = $('#'+imgId)
      if(this.switchMore){
        text.text(this.dataJson.collect)
        img.css("transform", "rotate(180deg)");
      }else{
        text.text(this.dataJson.more)
        img.css("transform", "rotate(360deg)");
      }
      this.switchMore = !this.switchMore
    },
    historySwitchMore: function(list,index,tid,imgId){
      var switchMore = this.historyRank[index].switchMore
      var items = this.historyRank[index].items
      this.historyRank[index].now_items = switchMore?items.slice(3,items.length):items.slice(3,5)
      var text = $('#'+tid)
      var img = $('#'+imgId)
      if(switchMore){
        text.text(this.dataJson.collect)
        img.css("transform", "rotate(180deg)");
      }else{
        text.text(this.dataJson.more)
        img.css("transform", "rotate(360deg)");
      }
      this.historyRank[index].switchMore = !this.historyRank[index].switchMore
    },
    getLang: function(){
      var mylang;
      if (this.ajaxData.lang == "zh-CN") {
        mylang = "zh-CN";
      } else if (this.ajaxData.lang == 'zh-TW') {
        mylang = "zh-TW";
      }else if (this.ajaxData.lang == 'es') {
        mylang = "es";
      } else{
        mylang = 'en'
      }
      this.lang = mylang
      $.ajax({
        type: "GET",
        url: './lang/' + mylang + '.json?v=202210261418',
        dataType: "json",
        success: function (json) {
          this.dataJson = json
        }.bind(this)
      });
    },
    timestampToTime: function(res) {
      var hours = parseInt((res % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((res % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = (res % (1000 * 60)) / 1000;
      hours = hours < 10 ? ('0' + hours) : hours;
      minutes = minutes < 10 ? ('0' + minutes) : minutes;
      seconds = seconds < 10 ? ('0' + seconds) : seconds;
      var miao = Number(seconds).toFixed(0);
      if(miao < 10){
          miao = "0" + miao
      }
      if(hours <=0 && minutes <= 0 && miao <= 0) {
          clearTimeout(timer)
      }
      // console.log(hours + ":" + minutes + ":" + miao)
      this.time = hours + ":" + minutes + ":" + miao
    },
    getRank: function(rank){
      return rank<10?('0'+rank):rank
    },
    // 男生女生----等级
    girlCharm: function (level) {
      return level >= 0 && level < 20 ? '0-19' : level >= 20 && level < 40 ? '20-39' :
        level >= 40 && level < 60 ? '40-59' : level >= 60 && level < 80 ? '60-79' :
          level >= 80 && level <= 100 ? '80-100' : ''
    },
    boyEnergy: function (level) {
      return level >= 0 && level < 10 ? '0-9' : level >= 10 && level < 20 ? '10-20' :
        level >= 20 && level < 30 ? '21-29' : level >= 30 && level < 40 ? '30-39' :
          level >= 40 && level < 50 ? '40-49' : level >= 50 && level < 60 ? '50-59' :
            level >= 60 && level < 70 ? '60-69' : level >= 70 && level < 80 ? '70-79' :
              level >= 80 && level < 90 ? '80-89' : level >= 90 && level <= 100 ? '90-100' : ''
    },
    //活动玩法今日排行
    todayRankList: function() {
      var that = this;
      that.ajaxData.id = 'luck_gift1';
      $.ajax({
        url: that.default_url + "/games/ActivityDetails/luckyKingItemTodayList",
        type: "GET",
        data: that.ajaxData,
        dataType: "json",
        cache: false,
        success: function (data) {
          if (data.code==1) {
            if(data.data){
              that.todayRank = data.data.rank
              that.todayRankShow = data.data.rank.slice(3,10)
              that.myRank = data.data.my_rank
            }
          } else {
            Toast(data.msg)
          }
        }
      })
    },
    //活动玩法历史排行
    historyRankList: function() {
      var that = this;
      that.ajaxData.id = 'luck_gift1';
      $.ajax({
        url: that.default_url + "/games/ActivityDetails/luckyKingItemHistoryList",
        type: "GET",
        data: that.ajaxData,
        dataType: "json",
        cache: false,
        success: function (data) {
          if (data.code==1) {
            if(data.data){
              that.historyRank = data.data||[]
              var len = that.historyRank.length
              for(var i=0;i<len;i++){
                var item = that.historyRank[i]
                that.$set(item,'now_items',item.items.slice(3,5))
                that.$set(item,'switchMore',true)
              }
              // if(that.historyRank.length>0){
              //   that.historyRank.forEach(item => {
              //     that.$set(item,'now_items',item.items.slice(3,5))
              //     that.$set(item,'switchMore',true)
              //   });
              // }
            }
          } else {
            Toast(data.msg)
          }
        }
      })
    },
    threeRank: function(list){
      var arr = list.slice(0,3)
      return arr
    },
    //玩法详情信息
    gameInfo: function() {
      var that = this;
      that.ajaxData.id = 'luck_gift1';
      $.ajax({
        url: that.default_url + "/games/ActivityDetails/luckyKingItemInfo",
        type: "GET",
        data: that.ajaxData,
        dataType: "json",
        cache: false,
        success: function (data) {
          if (data.code==1) {
            if(data.data){
              that.start_time_format = data.data.start_time_format;
              that.end_time_format = data.data.end_time_format.substr(3);

              var start = that.formatTime(data.data.start_time)
              var end = that.formatTime(data.data.end_time)
              if(new Date().getTime()<end&&new Date().getTime()>start){
                that.startAct = true
                // 当天最大时间戳
                var d = new Date();
                d.setHours(23);
                d.setMinutes(59);
                d.setSeconds(59);
                d.setMilliseconds(999);
                var endtime = d.getTime();
                var timer = setInterval(function () {
                  //当前时间戳
                  var starttime = new Date().getTime();
                  that.timestampToTime(endtime - starttime);
                }, 1000)
            }
            }
          } else {
            Toast(data.msg)
          }
        }
      })
    },
    formatTime: function(timestampStr){
      if(timestampStr.toString().length<11){
        return timestampStr * 1000;
      }else{
        return timestampStr
      }
    },
    //玩法奖励
    gameReward: function() {
      var that = this;
      that.ajaxData.id = 'luck_gift1';
      $.ajax({
        url: that.default_url + "/games/ActivityDetails/luckyKingItemReward",
        type: "GET",
        data: that.ajaxData,
        dataType: "json",
        cache: false,
        success: function (data) {
          if (data.code==1) {
            if(data.data){
              that.gold_reward = data.data.gold_reward
              that.head_reward = data.data.head_reward
            }
          } else {
            Toast(data.msg)
          }
        }
      })
    },
    // 领取奖励
    // /games/ActivityDetails/luckyKingItemReceiveReward
    getReward: function() {
      var that = this;
      that.ajaxData.id = 'luck_gift1';
      $.ajax({
        url: that.default_url + "/games/ActivityDetails/luckyKingItemReceiveReward",
        type: "GET",
        data: that.ajaxData,
        dataType: "json",
        cache: false,
        success: function (data) {
          if (data.code==1) {
            if(data.data){
              that.todayRankList()
              that.framebox = true
            }
          } else {
            Toast(data.msg)
          }
        }
      })
    },
    openRuleModal: function () {
      $('#rule_box').css('display','block')
      window.disabledScroll();
    },
    closeRuleModal: function () {
      $('#rule_box').css('display','none')
      window.enableScroll();
    }
  }
})

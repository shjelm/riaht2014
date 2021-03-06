var Reflux = require('reflux'),
    actions = require('../actions'),
    _ = require('lodash'),
    moment = require('moment'),
    messages = {
      newchatmessageloaded: ["New chat message by %S","net","username"],
      chatdataloaded: ["Loaded chat data","net"],
      initlogin: ["Started login sequence","loc"],
      finishlogin: ["Logged in as %S","net"],
      initlogout: ["Started logout sequence","loc"],
      finishlogout: ["Finished logout","net"],
      error: ["Error: %S","error"],
      userdataloaded: ["User data received","net"],
      updateuserfieldsuccess: ["Updated user data field","net"],
      adduserlistitemsuccess: ["Added list item","net"],
      deleteuserfieldsuccess: ["Deleted user field","net"]
    };

module.exports = Reflux.createStore({
  init: function(){
    this.messages = [];
    this.addMessage = _.bind(this.addMessage,this);
    for (var m in messages){
      this.listenTo(actions[m],_.partial(this.addMessage,messages[m]));
    }
    this.listenTo(actions.clearlog,function(){this.trigger((this.messages=[]));}.bind(this));
  },
  addMessage: function(def,data){
    var stamp = moment().format('HH:mm:ss:SS'),
        msg = def[0].replace("%S",(data||{})[def[2]]||data);
    this.trigger((this.messages = [[stamp,msg,def[1]]].concat(this.messages)));
  }
});
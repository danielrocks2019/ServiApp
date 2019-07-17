var valid = {
    checkparams: function(refobj, evalueobj) {
        if(Object.keys(refobj).sort().toString() == Object.keys(evalueobj).sort().toString()){
          return true;
        }
        return false;
    },
    checkfullname: function(fullname){
      var revtam = /\w{3,}/;
      if(revtam.test(fullname)){
        return true;
      }
      return false;
    },
    checkemail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(re.test(email)){
        return true;
      }
      return false;
    },
    checkpassword: function(password){
      var revtam = /\w[a-zA-z0-9]{7,}/;
      var revchar = /\w[A-z]{1,}/;
      var revnums = /\d{1,}/;
      if(revtam.test(password) && revchar.test(password) &&revnums.test(password)){
        return true;
      }
      return false;
    },
    checkcel: function(cel){
      var rev = /\w[0-9]{7,7}/;
      if(cel.match(rev) == null){
        return false;
      }
      return true;
    },
    checknameproduct : function (title){
      title.toString();
      if(title.length < 3){
        return false;
      }
      return true;
    },
  
  };
  module.exports = valid;
  
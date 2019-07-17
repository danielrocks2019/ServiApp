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
  };
  module.exports = valid;
  
const mongoose=require('../connect');

const user={
        nombre:String
};

const modeluser=mongoose.model('userprueba',user);

module.exports=modeluser;
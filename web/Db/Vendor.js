var mongoose=require("mongoose");
var VendorSchema=new mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    address: {
        type:String,
        required: true
    },
    pincode: {
        type:String,
        required: true,
        unique: true
    },
    experience: {
        type:String,
        required: true
    },
    Manufature: {
        type:Object
    },
    Estimate: {
        type:Object
    },

    
},{ timestamps: true });
module.exports=mongoose.model("vendors", VendorSchema);
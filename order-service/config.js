const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    orderId:{
        type:Number,
        required:true
        
    },
    orderStatus:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required:true
    },
    orderDate:{
        type:Date,
        required:true
    }
})

const model = mongoose.model('orderDetails', schema)

module.exports = model
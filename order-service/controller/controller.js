const {Kafka, Partitioners} = require('kafkajs')
const kafka = new Kafka({
    clientId:'Manikanta03',
    brokers:['localhost:9092']
})

async function handleOrders(){
    
}
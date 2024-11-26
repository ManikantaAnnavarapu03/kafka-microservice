const {Kafka, Partitioners}  = require('kafkajs')
const bcrypt = require('bcrypt')
const db = require('../config.js')
const kafka = new Kafka({
    clientId:'Manikanta03',
    brokers:['localhost:9092']
})

async function handleUser(){
    const consumer = kafka.consumer({groupId:'user-handle-group'})
    await consumer.connect()
    console.log("consumer connected")
    await consumer.subscribe({topic:'user-reqq-topic', fromBeginning:true})
    await consumer.run({
        eachMessage: async({topic, partition, message}) => {
            const userMessage = JSON.parse(message.value.toString())
            console.log(userMessage)
            if(userMessage.action === "login"){
                var result = ''
                const data = await db.query('select * from userdata where username = ?', [userMessage.data.username])
                const producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner})
                await producer.connect()
                console.log("producer connected")
                await producer.send({
                    topic:'user-ress-topic',
                    messages:[{
                        value:JSON.stringify(data)
                    }]
                })
                await producer.disconnect()
                console.log("producer disconnected")
            }
        }
    })
}

module.exports = {handleUser}

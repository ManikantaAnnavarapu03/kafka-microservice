const {Kafka, Partitioners}  = require('kafkajs')
const bcrypt = require('bcrypt')
const db = require('../config.js')
const kafka = new Kafka({
    clientId:'Manikanta03',
    brokers:['localhost:9092']
})

async function handleUser(){
    try{
    const consumer = kafka.consumer({groupId:'user-handle-group', autoCommit:true})
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
                console.log(data)
                if(data[0].length == 0){
                    result = "user not found"
                }
                else if(bcrypt.compare(userMessage.data.password, data[0][0].password)){
                    result = "user valid"
                }
                else{
                    result = "password incorrect"
                }
                const producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner})
                await producer.connect()
                console.log("producer connected")
                await producer.send({
                    topic:'user-ress-topic',
                    messages:[{
                        value:JSON.stringify(result)
                    }]
                })
                await producer.disconnect()
                console.log("producer disconnected")
            }
            else if(userMessage.action == "signup"){
                const {name, username, password} = userMessage.data
                const hashPassword = await bcrypt.hash(password, 10)
                const data = await db.query("insert into userdata values(?, ?, ?)", [name, username, hashPassword])
                var result = ""
                if(data.affectedRows >= 1){
                    result = "user created"
                }
                else{
                    result = "user not created"
                }
                console.log(result)
                const producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner})
                await producer.connect()
                console.log("producer connected")
                await producer.send({
                    topic:'user-ress-topic',
                    messages:[{
                        value:JSON.stringify(result)
                    }]
                })
                await producer.disconnect()
                console.log("producer disconnected")
            }
        }
    })
}catch(error){
    console.log(error)
}
}

module.exports = {handleUser}

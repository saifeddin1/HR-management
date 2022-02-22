
const { Kafka } = require('kafkajs');
const File = require('./models/File');
var ObjectId = require('mongodb').ObjectId;


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092', 'localhost:9092']
  })
  
  const consumer = kafka.consumer({ groupId: 'kafka' })
  
  
const run = async (req ,res) => {
    
    await consumer.connect()
    await consumer.subscribe({ topic: 'test', fromBeginning: true })
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
       
       
        
        const obj = JSON.parse(message.value);
        console.log(obj)
        try{
            
              const response= await File.updateOne( {"userId": ObjectId(obj._id)}, {$set:obj}, {upsert: true})
              console.log("hi")
              if(response){
                  console.log("no bromblem jawak feez fez")
              }
              else{
                  console.log('barsha bromblem ye kebdi')
              }
                }catch(e){
                    console.log("catch : "+e)
                }
          //  }
       
      },
    })
   
      
    }
  
  
  module.exports = run;
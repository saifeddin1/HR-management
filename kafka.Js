
const { Kafka } = require('kafkajs');
const File = require('./models/File');
var ObjectId = require('mongodb').ObjectId;
const logger = require('./config/logger').logger


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092', 'localhost:9092']
  })
  
  const consumer = kafka.consumer({ groupId: 'kafka' })
  
  
const run = async (req ,res) => {
    
    await consumer.connect()
    await consumer.subscribe({ topic: 'my-topic2', fromBeginning: true })
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
       
       
        console.log("****************** wsouuul mena zeda******************")
        const obj = JSON.parse(message.value);
        
        try{
            
              const response= await File.updateOne( {"userId": ObjectId(obj._id)}, {$set:obj}, {upsert: true})
              logger.info(response)
              if(response){
                  logger.info("Executing wihout problems")
              }
              else{
                  logger.info('Something went wrong')
              }
                }catch(e){
                    logger.info("catch : "+e)
                }
          
       
      },
    })
   
      
    }
  
  
  module.exports = run;
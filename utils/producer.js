
const { Kafka } = require('kafkajs');



const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092","localhost:9093"],
});

const producer = kafka.producer();

 exports.updateUser = async (res) => {

  
  // Producing
   console.log("u*********************** sent %%%%%%****** ",res)
   console.log("update file ******",res)
   try{

   
    await producer.connect();
     await producer.send({
      topic: `my-topic7`,
      messages:[{ value: JSON.stringify(res)}] ,
     

    });
    console.log("producer is working")
  }catch(e){
    console.log("error", e)
  }  

  }
  
  






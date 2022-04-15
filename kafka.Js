
const { Kafka } = require('kafkajs');
const File = require('./models/File');
var ObjectId = require('mongodb').ObjectId;
const logger = require('./config/logger').logger

const { v4: uuidv4 } = require('uuid');

function makeRef(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'kafka3' })


const run = async (req, res) => {

  await consumer.connect()
  await consumer.subscribe({ topic: 'my-topic2', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {


      console.log("****************** wsouuul mena zeda******************")
      const obj = JSON.parse(message.value);

      try {
        console.log(obj);
        const response = await File.updateOne({ "userId": ObjectId(obj._id) }, {
          $set: {
            ...obj, userRef: `${obj?.type}-${makeRef(3)}`, profile: {
              fullname: obj.username, proEmail: obj.email
            }
          }
        }, { upsert: true })
        logger.info(response)
        if (response) {
          logger.info("Executing wihout problems")
        }
        else {
          logger.info('Something went wrong')
        }
      } catch (e) {
        logger.info("catch : " + e)
      }


    },
  })



}


module.exports = run;


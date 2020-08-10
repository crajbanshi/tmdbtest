#!/usr/bin/env node
import amqp from 'amqplib';
// import amqp from 'amqplib/callback_api';
// const CONN_URL = 'amqp://esoqxmmu:ZL4Wax0Inkw3UYKVc7_EvqPtgQz3SdKG@cougar.rmq.cloudamqp.com/esoqxmmu';
const CONN_URL = process.env.RABBITMQ_CONN_URL;
let ch = null;
let msg = "test"

let conn = amqp.connect(CONN_URL);
console.log(" rabbitmq connected");

let rcon = async () => {
    let queueName = process.env.RABBITMQ_QUEUENAME;
    
    let channel = await (await conn).createChannel();
    
    return channel;
}



process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});


export default rcon;
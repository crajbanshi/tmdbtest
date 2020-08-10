import { amqpconnection } from '../../config';

var publishmsg = async (req, res, next) => {

  let queueName = process.env.RABBITMQ_QUEUENAME;
  let message = req.query.message;
  let channel = await amqpconnection();
  channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, new Buffer.from(message));

  var data = {
    status: true,
    data: { message: "Send " + message }
  }
  res.send(data);
  res.end();

}

export default { publishmsg };


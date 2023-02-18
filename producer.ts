import amqp from 'amqp-connection-manager';

// common setting
const rabbitUrl = 'amqp://localhost:5672';
const exchangeName = 'eexxchange';
const queueName = 'qquueue';

// producer setting
/** 要發送的內容 */
const msgContent = new Date().toLocaleTimeString();
/** 這個內容要等幾秒後，consumer 才能 ack */
const msgProcessSeconds = Number(process.argv[2]);
const msg = {
  content: msgContent,
  processSeconds: msgProcessSeconds,
};

// create connection
const connection = await amqp.connect([rabbitUrl]);
connection.on('connect', () => {
  console.log('Successfully connect to rabbitmq');
});
connection.on('connectFailed', (error) => {
  console.error('Can not connect to rabbitmq');
  console.error(error);
  process.exit(1);
});

// create channel
const channel = connection.createChannel();
await channel.addSetup(() => {
  return Promise.all([
    // assert exchange
    channel.assertExchange(exchangeName, 'direct'),
    // assert queue
    channel.assertQueue(queueName, { durable: true }),
    // bind exchange and queue
    channel.bindQueue(queueName, exchangeName, queueName),
  ]);
});

// publish message to exchange
await channel.publish(exchangeName, queueName, JSON.stringify(msg));

connection.close();

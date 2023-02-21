import amqp from 'amqp-connection-manager';

// common setting
const rabbitUrl = 'amqp://localhost:5672';
const exchangeName = 'eexxchange';
const queueName = 'qquueue';

// consumer setting
const consumerName = process.argv[2] || 'consumer';
const prefetchAmount = Number(process.argv[3]) || 1;

// create connection
const connection = await amqp.connect([rabbitUrl]);
connection.on('connect', () => {
  console.log('Successfully connect to rabbitmq');
  console.log(`My name is: ${consumerName}`);
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
    channel.assertQueue(queueName, {
      durable: true,
      // arguments: {
      //   'x-single-active-consumer': true,
      // },
    }),
    // bind exchange and queue
    channel.bindQueue(queueName, exchangeName, queueName),
  ]);
});

channel.consume(
  queueName,
  (msg) => {
    const parsedMsg = JSON.parse(msg.content.toString()) as {
      content: string;
      processSeconds: number;
    };
    console.log(`- ${consumerName} receive: ${parsedMsg.content}`);
    console.log(`--- Waiting Seconds: ${parsedMsg.processSeconds}`);
    setTimeout(() => {
      console.log(`----- ${parsedMsg.content} is finished.`);
      channel.ack(msg);
    }, parsedMsg.processSeconds * 1000);
  },
  { prefetch: prefetchAmount, noAck: false },
);

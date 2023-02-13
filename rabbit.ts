import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import amqplib from 'amqplib';

// create connection
const rabbitUrl = 'localhost:5672';
const connection = await amqp.connect(rabbitUrl);

// create channel
const channel = connection.createChannel();

// assert exchange
// const exchangeName = 'eexxchange';
// const exchange = await channel.assertExchange(exchangeName, 'fanout');

// assert queue
const queueName = 'qquueue';
await channel.assertQueue(queueName);

// publish message to exchange
channel.publish(queueName, '', '123');

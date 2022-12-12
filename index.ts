import event from 'events';

const test = new event.EventEmitter();

test.addListener('test', () => console.log('fire'));

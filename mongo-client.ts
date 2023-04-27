import mongoose from 'mongoose';

const mongodb_url = 'mongodb://root:chatbot12345@192.168.118.54:27017/ray-test?authSource=admin&w=1';

try {
  await mongoose.connect(mongodb_url);
} catch (error) {
  console.error(error);
  process.exit(1);
}

export default mongoose;

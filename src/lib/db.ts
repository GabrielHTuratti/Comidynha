import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://yPestiss:devJunior_J8hgFJylHkbGkGc9@financydb.jz0yv.mongodb.net/?retryWrites=true&w=majority&appName=FinancyDB"

if (!MONGODB_URI) {
  throw new Error('faltou o URI do mongodb ai chapa');
}
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached = (global as { mongoose?: MongooseCache }).mongoose || { 
  conn: null, 
  promise: null 
};

(global as unknown as { mongoose: MongooseCache }).mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {dbName: "MDB_Comydinha"}).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
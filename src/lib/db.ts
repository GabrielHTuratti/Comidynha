import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://yPestiss:devJunior_J8hgFJylHkbGkGc9@financydb.jz0yv.mongodb.net/?retryWrites=true&w=majority&appName=FinancyDB"

if (!MONGODB_URI) {
  throw new Error('faltou o URI do mongodb ai chapa');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {dbName: "MDB_Comydinha"}).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
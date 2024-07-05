import mongoose, { connect } from "mongoose";

const connection = () => {
  mongoose.connect(
    `mongodb+srv://Cluster22955:123Lazuardi.@cluster22955.mxxqrt0.mongodb.net/`,
    { dbName: `wegodevform` }
  );

  const conn = mongoose.connection;
  conn.on(`error`, console.error.bind(console, "connection error"));
  conn.once("open", () => {
    console.log("connected to MongoDB");
  });
};

export default connection;

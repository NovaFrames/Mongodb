const connectDB = require("../db");
const { ObjectId } = require("mongodb");

// CREATE
exports.createUser = async (req, res) => {
  const db = await connectDB();
  const result = await db.collection("users").insertOne(req.body);
  res.json(result);
};

// READ ALL
exports.getUsers = async (req, res) => {
  const db = await connectDB();
  const users = await db.collection("users").find().toArray();
  res.json(users);
};

// UPDATE
exports.updateUser = async (req, res) => {
  const db = await connectDB();
  const id = req.params.id;

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );

  res.json(result);
};

// DELETE
exports.deleteUser = async (req, res) => {
  const db = await connectDB();
  const id = req.params.id;

  const result = await db.collection("users").deleteOne({
    _id: new ObjectId(id)
  });

  res.json(result);
};

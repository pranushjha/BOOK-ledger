require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const collections = ['items', 'customers', 'sales', 'payments', 'receipts', 'meta'];
const models = {};
for (const name of collections) {
  const schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    value: mongoose.Schema.Types.Mixed
  }, { strict: false, timestamps: true, collection: name });
  models[name] = mongoose.model(name, schema);
}

function clean(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  delete obj._id;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mongoState: mongoose.connection.readyState });
});

app.get('/api/:collection', async (req, res) => {
  try {
    const Model = models[req.params.collection];
    if (!Model) return res.status(404).json({ error: 'Unknown collection' });
    const docs = await Model.find({}).lean();
    res.json(docs.map(clean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/:collection/:id', async (req, res) => {
  try {
    const Model = models[req.params.collection];
    if (!Model) return res.status(404).json({ error: 'Unknown collection' });
    const value = { ...req.body, id: req.params.id };
    const doc = await Model.findOneAndUpdate(
      { id: req.params.id },
      { $set: value },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(clean(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/:collection/:id', async (req, res) => {
  try {
    const Model = models[req.params.collection];
    if (!Model) return res.status(404).json({ error: 'Unknown collection' });
    await Model.deleteOne({ id: req.params.id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/next-bill', async (req, res) => {
  try {
    const Model = models.meta;
    const doc = await Model.findOneAndUpdate(
      { id: 'billSeq' },
      { $inc: { value: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({ billNo: `INV-${String(doc.value || 1).padStart(4, '0')}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Book Detail running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

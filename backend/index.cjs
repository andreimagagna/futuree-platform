const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Configure Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://YOUR_SUPABASE_URL.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'
);

app.get('/api/leads', async (req, res) => {
  const { data, error } = await supabase.from('leads').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/leads', async (req, res) => {
  const { data, error } = await supabase.from('leads').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.get('/api/companies', async (req, res) => {
  const { data, error } = await supabase.from('companies').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/profiles', async (req, res) => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.listen(4000, () => {
  console.log('Backend rodando na porta 4000');
});

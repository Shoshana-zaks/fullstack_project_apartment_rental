const mongoose = require('mongoose');

const uri = 'mongodb+srv://syrzaks:OnbMTTi2BcDud3g4@cluster0.yjeon.mongodb.net/';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

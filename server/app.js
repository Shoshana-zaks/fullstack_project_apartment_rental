import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRouter from './routers/category.js';
import cityRouter from './routers/city.js';
import advertiserRouter from './routers/advertiser.js';
import apartmentRouter from './routers/apartment.js';
import { checkToken } from './middlewares/checkToken.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.use('/category', categoryRouter);
app.use('/city', cityRouter);
app.use('/advertiser', advertiserRouter);
app.use('/apartment', apartmentRouter);

console.log(process.env.URI);
mongoose.connect(process.env.URI)
    .then(() => {
        console.log('Connected to MongoDB! 🚀');
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    })
    .catch(err => console.error('Could not connect to MongoDB:', err));

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import "dotenv/config";
import routes from './src/routes/index.js';
import dotenv from 'dotenv';
dotenv.config();
import tmdbConfig from './src/tmdb/tmdb.config.js';
const { getUrl } = tmdbConfig;

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", routes);
 
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connected');
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log("TMDB_BASE_URL:", process.env.TMDB_BASE_URL);
            console.log("TMDB_KEY:", process.env.TMDB_KEY);
            console.log("URL:", getUrl("genre/movie/list"));
            console.log("URL:", getUrl("search/movie", { query: "batman", page: 1 }));
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
});

 

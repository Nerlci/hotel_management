import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.send("Hello, world!");
});

app.get("/echo", async (req, res) => {
    res.send(req.body);
});

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});

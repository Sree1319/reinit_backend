require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const questionSchema = new mongoose.Schema({
    text: String,
    category: String,
    answers: [{ text: String }]
});

const Question = mongoose.model('Question', questionSchema);

// Get questions by category
app.get('/questions', async (req, res) => {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const questions = await Question.find(filter);
    res.json(questions);
});

// Post new question
app.post('/questions', async (req, res) => {
    const { text, category } = req.body;
    const newQuestion = new Question({ text, category, answers: [] });
    await newQuestion.save();
    res.json(newQuestion);
});

// Post new answer
app.post('/questions/:id/answers', async (req, res) => {
    const { text } = req.body;
    const question = await Question.findById(req.params.id);
    question.answers.push({ text });
    await question.save();
    res.json(question);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

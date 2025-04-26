const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/prathamesh');
const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connected");
});

// models
const donationSchema = new mongoose.Schema({
    name: String,
    age: String,
    bloodtype: String,
    phone: String,
    location: String
});
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isApproved: { type: Boolean, default: false }
});

const Donation = mongoose.model('datas', donationSchema);
const User = mongoose.model('users', userSchema);

// HTML routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/donate', (req, res) => res.sendFile(path.join(__dirname, 'donate.html')));
app.get('/inventory', (req, res) => res.sendFile(path.join(__dirname, 'inventory.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));

// Register
app.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.redirect('/login.html');
});

// Login
app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.send('Invalid login');
    if (!user.isApproved) return res.send('Wait for admin approval');

    res.redirect('/');
});

// Donation
app.post('/post', async(req, res) => {
    const { name, age, bloodtype, phone, location } = req.body;
    const donation = new Donation({ name, age, bloodtype, phone, location });
    await donation.save();
    res.send("Form submission successful");
});

// API for frontend fetch
app.get('/get-inventory', async(req, res) => {
    const data = await Donation.find();
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server up at http://localhost:${port}`);
});
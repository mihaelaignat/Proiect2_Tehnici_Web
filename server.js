const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3222;


app.use(cors({
  origin: '*' 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.send('Serverul este în funcțiune.'); 
});
let feedbackData = [];
let loggedIn = false;




app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Pentru dezvoltare, secure ar trebui să fie false; setează-l true pentru HTTPS
}));

const users = [
  { email: 'email@example.com', password: 'parola' }
];

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    req.session.user = user;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Email sau parola incorecte!' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ success: false, message: 'Logout nereușit!' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

app.get('/status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});







app.post('/submit-feedback', (req, res) => {
  const feedback = req.body; // Obține feedback-ul trimis în corpul cererii
  feedbackData.push(feedback); // Adaugă feedback-ul în array

  // Trimite un răspuns către client pentru a confirma primirea datelor
  res.send(`
      <html>
          <head>
              <title>Confirmare Feedback</title>
              <style>
                body {
                  padding: 30px;
                  margin-top: 30px;
                  background-color: burlywood;
                  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                  justify-content: space-between;
                  margin-bottom: -10px;
                }
              </style>
          </head>
          <body>
              <h1>Mulțumim pentru feedback!</h1>
              <p>Feedback-ul tău a fost primit cu succes.</p>
              
          </body>
      </html>
  `);
});

// Endpoint pentru afișarea feedback-ului
app.get('/feedback', (req, res) => {
  // Afișează feedback-ul salvat în baza de date sau array
  const feedbackList = feedbackData.map(feedback => {
      return `
          <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px;">
              <p><strong>Opțiune:</strong> ${feedback['like-option']}</p>
              <p><strong>Rating:</strong> ${feedback.rating}</p>
          </div>
      `;
  }).join('');

  const htmlResponse = `
      <html>
          <head>
              <title>Feedback</title>
          </head>
          <body>
              <h1>Feedback</h1>
              ${feedbackList}
          </body>
      </html>
  `;

  res.send(htmlResponse);
});

app.post('/comment', (req, res) => {
  if (loggedIn) {
      const { comment } = req.body;
      fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
          if (err) {
              res.status(500).send('Eroare la citirea fișierului JSON.');
              return;
          }
          let commentsData = JSON.parse(data);
          commentsData.comments.push({ user: "Anonim", comment: comment });
          fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(commentsData, null, 2), (err) => {
              if (err) {
                  res.status(500).send('Eroare la scrierea fișierului JSON.');
                  return;
              }
              res.json({ success: true });
          });
      });
  } else {
      res.json({ success: false, message: 'Trebuie să fii autentificat pentru a adăuga un comentariu.' });
  }
});

app.get('/comments', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Eroare la citirea fișierului JSON.');
          return;
      }
      res.send(data);
  });
});

app.listen(port, () => {
  console.log(`Serverul rulează la adresa http://localhost:${port}`);
});

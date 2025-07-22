const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path')
var url = require('url');
const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;
const publicVapidKey = 'BOFksJcHCqeIbmYQ4IkNFBgJqUNy65_6GGEO7tI6xSylxg_sRE9E-BFlgvv2hlxpMTef81QpZxc5ECcVjqXkV0k';
const privateVapidKey = 'UGn4Uzkr9b5p7wde7omXjVVEIdvImeBhnT_a2NQ9ZHc';

webpush.setVapidDetails(
  
"mailto: <pojeesahil@gmail.com>",
"BOFksJcHCqeIbmYQ4IkNFBgJqUNy65_6GGEO7tI6xSylxg_sRE9E-BFlgvv2hlxpMTef81QpZxc5ECcVjqXkV0k",
"UGn4Uzkr9b5p7wde7omXjVVEIdvImeBhnT_a2NQ9ZHc"

);

let subscription;
app.post('/subscribe',bodyParser.json(), (req, res) => {
 
  subscription = req.body;
  res.status(201).json({});
  
  const payload = JSON.stringify({ title: 'Subscribed!', body: 'You will now receive updates.' });

  webpush.sendNotification(subscription, payload).catch(err => console.error(err));
});
app.get('/query', (req, res) => {
console.log(req.body.query);
res.render("index");
});
// Send test push every 60 sec (for demo)
setInterval(() => {
  
  if (subscription) {
    const payload = JSON.stringify({ title: 'Reminder', body: 'This is your scheduled notification!' });
    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
  }
}, 20000);

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');
  app.use(bodyParser.json());
app.get('/', (req, res) => {
  
  res.render('index');
});

app.get('/api', (req, res) => {
  var requrl = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl,
});
  res.json({"msg": requrl});
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})

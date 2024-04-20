require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const connectMongoDB = require('./connection');
const Blog = require('./models/blog');
const {checkForAuthenticationCookie} = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8080;

//const mongoUrl = 'mongodb://127.0.0.1:27017/myblog';
const mongoUrl = process.env.MONGO_URL;

connectMongoDB(mongoUrl)
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.static(path.resolve('./')));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({});

  return res.render('home', {
    user: req.user,
    blogs: allBlogs,
  });
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on port:${PORT}`);
});

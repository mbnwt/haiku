// express
const express = require('express');
const bodyParser= require('body-parser');
const expressVue = require('express-vue');
const path = require('path');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

// database
const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');
const db = low('./src/db/db.json', { storage: fileAsync });

// controllers
const ArticleController = require('./src/controllers/ArticleController');
const UserController = require('./src/controllers/UserController');

// passport setup
passport.use(new Strategy((username, password, cb) => {
    UserController.getUser(username, function(err, user) {
        if (err) console.log("NO USER");
        if (!user) return cb(null, false);
        if (user.password != password) return cb(null, false);
        return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
    cb(null, user.username);
});

passport.deserializeUser(function(username, cb) {
    UserController.getUser(username, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

// app setup
const app = express();

// view engine
app.engine('vue', expressVue);
app.set('view engine', 'vue');
app.set('views', path.join(__dirname, '/views'));
app.set('vue', { 
    componentsDir: path.join(__dirname, '/views/components'),
    defaultLayout: 'layout' 
});
app.use('/', express.static(path.join(__dirname, 'views')));

// logging, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'vvYoiGSQ190p8nct0OSi', resave: false, saveUninitialized: false }));

// initialize Passport and restore authentication state from session.
app.use(passport.initialize());
app.use(passport.session());


// routes
// get
app.get('/', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.render('haiku', { 
        data: { haiku: ArticleController.list(), user: req.user },
        vue: {
            components: ['myheader']
        }
    });
});

app.get('/haiku/:username', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.render('haiku', { 
        data: { 
            haiku: ArticleController.listByAuthor(req.params.username), 
            user: req.user
        }, 
        vue: {
            components: ['myheader']
        }
    });
});

app.get('/favorites/:username', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.render('haiku', { 
        data: { 
            haiku: ArticleController.getArticle(UserController.getFavorites(req.params.username)), 
            user: req.user
        }, 
        vue: {
            components: ['myheader']
        }
    });
});

app.get('/deleteHaiku/:id', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    ArticleController.deleteArticle(req.params.id);
    res.redirect(req.get('referer'));
});

app.get('/addHaiku', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.render('addHaiku', { 
        data: { user: req.user },
        vue: {
            components: ['myheader']
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login', { 
        data: { user: req.user },
        vue: {
            components: ['myheader']
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register', { 
        data: { user: req.user },
        vue: {
            components: ['myheader']
        }
    });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        data: { user: req.user },
        vue: {
            components: ['myheader']
        }
    });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// post
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

app.post('/register', (req, res) => {
    UserController.addUser(req.body);
    res.redirect('/login');
});

app.post('/haiku', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    req.body.user = req.user.username;
    ArticleController.addArticle(req.body);
    res.redirect('/');
});

app.post('/comment/:id&:comment', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {

    ArticleController.addComment(req.params.id, req.params.comment, req.user.username);
});

app.post('/favorite/:username&:articleId', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {

    UserController.addFavorite(req.params.username, req.params.articleId);
});

// start listening
db.defaults({ articles: [], users: [] })
    .write()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is listening on 3000');
        });
    });
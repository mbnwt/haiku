const low = require('lowdb');
const db = low('./src/db/db.json');


exports.list = () => {

    return db.get('users').value();
};

exports.getUser = (username, cb) => {

    process.nextTick(function() {
        let user = db.get('users')
                     .find({ username: username })
                     .value();
        if (user) {
            cb(null, user);
        } else {
            cb(new Error('User ' + username + ' does not exist'));
        }
    });
};

exports.addUser = (user) => {

    if(user.username && user.email && user.password) {
        db.get('users')
          .push({ 
              username: user.username, 
              email: user.email, 
              password: user.password,
              favorites: []
          })
          .write();
    }
};

exports.addFavorite = (username, articleId) => {

    articleId = parseInt(articleId);
    let favorites = db.get('users')
      .find({ username: username })
      .get('favorites')
      .value();
    
    if(favorites.indexOf(articleId) !== -1) {
        favorites.splice(favorites.indexOf(articleId), 1);
    } else {
        favorites.push(articleId);
    }

    db.get('users')
      .find({ username: username })
      .assign({ favorites: favorites })
      .write();
    
    return favorites;
};

exports.getFavorites = (username) => {

    return db.get('users')
             .find({ username: username })
             .get('favorites')
             .value();
};


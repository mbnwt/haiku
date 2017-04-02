const low = require('lowdb');
const db = low('./src/db/db.json');


exports.list = () => {

    return db.get('articles').value();
};

exports.listByAuthor = (author) => {
    
    return db.get('articles')
             .filter({ author: author })
             .value();
};

exports.addArticle = (body) => {

    let lastArticle = db.get('articles').last().value();
    let nextId = lastArticle ? lastArticle.id + 1 : 0;

    let article = {
        id: nextId,
        title: body.title, 
        content: body.content,
        author: body.user,
        comments: [],
        timestamp: new Date()
    };

    db.get('articles')
      .push(article)
      .write();
};


exports.getArticle = (articleId) => {
    
    articleId = articleId.map(id => parseInt(id));
    return db.get('articles')
             .value()
             .filter(a => articleId.indexOf(a.id) !== -1);
};

exports.deleteArticle = (articleId) => {

    db.get('articles').remove({ id: parseInt(articleId) }).write();
};

exports.addComment = (articleId, comment, username) => {

    db.get('articles')
      .find({ id: parseInt(articleId) })
      .get('comments')
      .push({
          content: comment,
          author: username,
          timestamp: new Date()
      })
      .write();
};

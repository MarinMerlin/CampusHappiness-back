const Sequelize = require('sequelize');
const id_generator = require('../../custom_module/id_generator');

const defaultImageURL = "https://images.unsplash.com/photo-1504465039710-0f49c0a47eb7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a9b2c6e54342b63487ce461a5ee9872&auto=format&fit=crop&w=675&q=80";
const postConstructor = function (sequelize) {
  const Post = sequelize.define('post', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    text: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    imageURL: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    linkURL: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
  }, {
    timestamps: true,
  });

  Post.addPost = function (post) {
    return new Promise(function (resolve) {
      if (!post.imageURL) {
        post.imageURL = defaultImageURL;
      }
      Post.sync().then(() => {
        Post.create({
          id: id_generator(),
          title: post.title,
          text: post.text,
          imageURL: post.imageURL,
          linkURL: post.linkURL,
        }).then(() => {
          resolve();
        });
      });
    });
  };
  return Post;
};

module.exports = postConstructor;
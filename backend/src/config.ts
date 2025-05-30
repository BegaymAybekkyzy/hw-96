const config = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  db: 'mongodb://localhost/cocktail-recipe',
};

export default config;

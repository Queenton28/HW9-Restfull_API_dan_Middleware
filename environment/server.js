const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await db.users.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await db.users.findByPk(jwtPayload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

app.use(passport.initialize());

app.use('/api', userRoutes);
app.use('/api', movieRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    logger.info('Server is running on port 3000');
  });
});

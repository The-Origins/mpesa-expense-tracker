const client = require("../config/redis");
const addToCache = require("../utils/redis/addToCache");
const db = require("./db");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.public_key.replace(/\\n/g, "\n"),
  algorithms: ["RS256"],
};

const strategy = new JWTstrategy(options, (payload, done) => {
  const now = Date.now() / 1000;
  if (now > payload.exp) {
    return done(new Error(`Token Expired`), null);
  }

  const cacheKey = `${payload.sub}`;
  client
    .get(cacheKey)
    .then((cachedUserData) => {
      if (cachedUserData) {
        return done(null, JSON.parse(cachedUserData));
      } else {
        db.collection("users")
          .doc(payload.sub)
          .get()
          .then((user) => {
            if (!user.exists) {
              return done(null, false, {
                message: `No user with these credetials`,
              });
            }
            const data = { id: user.id, ...user.data() };
            addToCache(cacheKey, data);

            return done(null, data);
          });
      }
    })
    .catch((err) => done(err, null));
});

module.exports = (passport) => {
  passport.use(strategy);
};

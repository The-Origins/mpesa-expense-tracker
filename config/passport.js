const db = require("./db");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.public_key,
  algorithms: ["RS256"],
};

const strategy = new JWTstrategy(options, (payload, done) => {
  db.collection("users")
    .doc(payload.sub)
    .get()
    .then((user) => {
        if(!user.exists)
        {
            return done(null, false)
        }
        return done(null, {id:user.id, ...user.data(),})
    })
    .catch((err) => done(err, null));
});

module.exports = (passport) => {
  passport.use(strategy);
};

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user= await User.findOne({googleId:profile.id});

        if (!user) {
            user = await User.create({
                googleId:profile.id,
                email:profile.emails[0].value,
                name:profile.displayName,
                username:profile.displayName.replace(/\s+/g,"").toLowerCase(),
                phone:"0000000000",
                password:null,
            });
        }

        return done(null,user);
      } catch (error) {
        return done(error,null);
      }
    }
  )
);

passport.serializeUser((user,done)=>{
    done(null,user?.id);
});

passport.deserializeUser(async(id,done)=>{
    const user= await User.findById(id);
    done(null,user);
});


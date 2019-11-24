const JwtStrategy = require('passport-jwt').Strategy
const passport = require('passport')
const Profile = require('../modal/profile')
const Admin = require('../modal/admin')
const mySecretKey = require('../key/database').secret

module.exports = cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['token'];
    }
    return token;
};

module.exports = function(){
var opts = {};
  opts.jwtFromRequest = cookieExtractor; // check token in cookie
  opts.secretOrKey = mySecretKey;
  passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
        Profile.findById(jwt_payload.id)
        .then((user)=>{
            if(user){
                return done(null, user)
            }else{
                Admin.findById(jwt_payload.id)
                .then((user)=>{
                    if(user){
                        return done(null, user)
                    }
                    return done(null, false)
                })
                .catch((error)=>{
                    console.log(error)
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }))
}
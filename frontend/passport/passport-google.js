"use strict";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;


passport.use(
	new GoogleStrategy(
		{
			clientID: "1",
			clientSecret: "2",
			callbackURL: "http://localhost:8080/auth/google/callback",
			passReqToCallback: true
		},
		(req, accessToken, refreshToken, profile, done) => {
			axios
				.post(global.REST_API + "/user_register_gg", {
					data: req.body
				})
				.then(res => {
					if (res.data.user != null) {
						return done(null, res.data.user);
					} else {
						return done(null, false, { message: res.data.error });
					}
				})
				.catch(error => {
					return done(null, false, { message: error });
				});
		}
	)
);

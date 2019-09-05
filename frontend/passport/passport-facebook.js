"use strict";

const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;



passport.use(
	new FacebookStrategy(
		{
			clientID: "1",
			clientSecret: "2",
			profileFields: ["email", "displayName", "photos"],
			callbackURL: "http://localhost:8080/auth/facebook/callback",
			passReqToCallback: true
		},
		(req, token, refreshToken, profile, done) => {
			axios
				.post(global.REST_API + "/user_register_fb", {
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

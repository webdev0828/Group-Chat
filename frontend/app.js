const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require("http");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { Users } = require("./helpers/UsersClass");
const { Global } = require("./helpers/Global");
const compression = require("compression");
const helmet = require("helmet");

global.REST_API = "http://localhost:8080";

const container = require("./container");
const axios = require("axios");

container.resolve(function(users, _, admin, home, group, results, privatechat, profile, interests, news) {
	const app = SetupExpress();

	function SetupExpress() {
		const app = express();
		const server = http.createServer(app);
		server.listen(process.env.PORT || 3000, function() {
			console.log("Listening on port 3000");
		});
		ConfigureExpress(app);
		const router = require("express-promise-router")();
		users.SetRouting(router);
		admin.SetRouting(router);
		home.SetRouting(router);
		group.SetRouting(router);
		results.SetRouting(router);
		privatechat.SetRouting(router);
		profile.SetRouting(router);
		interests.SetRouting(router);
		news.SetRouting(router);

		app.use(router);

		app.use(function(req, res) {
			res.render("404");
		});
	}

	function ConfigureExpress(app) {
		app.use(compression());
		app.use(helmet());

		require("./passport/passport-local");
		require("./passport/passport-facebook");
		require("./passport/passport-google");

		app.use(express.static("public"));
		app.use(cookieParser());
		app.set("view engine", "ejs");
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		app.use(validator());

		app.use(
			session({
				secret: "addyourownsecretkey",
				resave: false,
				saveUninitialized: false
			})
		);

		app.use(flash());

		app.use(passport.initialize());
		app.use(passport.session());

		app.locals._ = _;
	}
});

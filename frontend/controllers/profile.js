const axios = require("axios");

module.exports = function(aws) {
	return {
		SetRouting: function(router) {
			router.get("/settings/profile", this.getProfilePage);

			router.post("/userupload", aws.Upload.any(), this.userUpload);
			router.post("/settings/profile", this.postProfilePage);

			router.get("/profile/:name", this.overviewPage);
			router.post("/profile/:name", this.overviewPostPage);
		},

		getProfilePage: function(req, res) {
			axios
				.get(global.REST_API+"/settings/profile", { params: { user: req.user } })
				.then(resp => {
					res.render("user/profile", {
						title: "Footballkik - Profile",
						user: resp.data.user,
						data: resp.data.result1,
						chat: resp.data.result2
					});
					// response.data.user[0].token = response.data.token;
					// done(null, response.data);
				})
				.catch(error => {
					console.log("error: " + error);
					// done(null, false, { message: error });
				});
		},

		postProfilePage: function(req, res) {
			axios
				.post(global.REST_API+"/settings/profile", { data: req.body, user: req.user })
				.then(response => {
					var result = response.data;
					console.log("7777777777777", result);
					res.json(result);
				})
				.catch(error => {
					console.log("error: " + error);
					// done(null, false, { message: error });
				});
		},

		userUpload: function(req, res) {
			axios
				.post(global.REST_API + "/userupload", req)
				.then(response => {})
				.catch(error => {
					console.log("error: " + error);
				});
		},

		overviewPage: function(req, res) {
			console.log("ooooooooooooooooooooooooooo");
			const name = req.params.name;
			axios
				.get(global.REST_API+"/profile/" + name, { params: { user: req.user } })
				.then(response => {
					var result = response.data;
					res.render("user/overview", {
						title: result.title,
						user: result.user,
						data: result.data,
						chat: result.chat
					});
				})
				.catch(error => {
					console.log("error: " + error);
					// done(null, false, { message: error });
				});
		},

		overviewPostPage: function(req, res) {
			console.log("fffffffffffffffffffffff");
			axios
				.post(global.REST_API+"/profile/", { data: req.body, user: req.user })
				.then(response => {
					var result = response.data;
					console.log("7777777777777", result);
					res.json(result);
				})
				.catch(error => {
					console.log("error: " + error);
					// done(null, false, { message: error });
				});
		}
	};
};

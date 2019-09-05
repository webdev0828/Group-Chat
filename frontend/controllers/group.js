const axios = require("axios");

module.exports = function() {
	return {
		SetRouting: function(router) {
			router.get("/group/:name", this.groupPage);
			router.post("/group/:name", this.groupPostPage);

			router.get("/logout", this.logout);
		},

		groupPage: function(req, res) {
			const name = req.params.name;
			axios
				.get(global.REST_API+"/group/" + name, { params: { user: req.user } })
				.then(response => {
					var result = response.data;
					res.render("groupchat/group", {
						title: result.title,
						user: result.user,
						groupName: result.groupName,
						data: result.data,
						chat: result.chat,
						groupMsg: result.groupMsg
					});
					// response.data.user[0].token = response.data.token;
					// done(null, response.data);
				})
				.catch(error => {
					console.log("error: " + error);
					// done(null, false, { message: error });
				});
		},

		groupPostPage: function(req, res) {
			console.log("44444444444444", req.user);
			const name = req.params.name;
			axios
				.post(global.REST_API+"/group/" + name, { data: req.body, user: req.user })
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

		logout: function(req, res) {
			req.logout();
			req.session.destroy(err => {
				res.redirect("/");
			});
		}
	};
};

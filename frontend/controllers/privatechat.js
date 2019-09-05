const axios = require("axios");

module.exports = function() {
	return {
		SetRouting: function(router) {
			router.get("/chat/:name", this.getchatPage);
			router.post("/chat/:name", this.chatPostPage);
		},

		getchatPage: function(req, res) {
			const name = req.params.name;
			axios
				.get(global.REST_API+"/chat/" + name, { params: { user: req.user } })
				.then(response => {
					var result = response.data;
					res.render("private/privatechat", {
						title: result.title,
						user: result.user,
						data: result.data,
						chat: result.chat,
						chats: result.chats,
						name: result.name
					});
					// response.data.user[0].token = response.data.token;
					// done(null, response.data);
				})
				.catch(error => {
					console.log("error: " + error);
					// done(null, false, { message: error });
				});
		},

		chatPostPage: function(req, res, next) {
			const name = req.params.name;
			axios
				.post(global.REST_API+"/chat/" + name, { data: req.body, user: req.user })
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

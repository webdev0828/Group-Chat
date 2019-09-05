module.exports = function(async, Users, Message) {
	return {
		PostRequest: function(req, res, url) {
			console.log(req.body);
			async.parallel(
				[
					function(callback) {
						if (req.body.data.receiverName) {
							console.log("arriveddddddddddd");
							Users.update(
								{
									username: req.body.data.receiverName,
									"request.userId": { $ne: req.body.user._id },
									"friendsList.friendId": { $ne: req.body.user._id }
								},
								{
									$push: {
										request: {
											userId: req.body.user._id,
											username: req.body.user.username
										}
									},
									$inc: { totalRequest: 1 }
								},
								(err, count) => {
									callback(err, count);
									// res.send({
									// 	data: count
									// })
								}
							);
						}
					},

					function(callback) {
						if (req.body.data.receiverName) {
							Users.update(
								{
									username: req.body.user.username,
									"sentRequest.username": { $ne: req.body.data.receiverName }
								},
								{
									$push: {
										sentRequest: {
											username: req.body.data.receiverName
										}
									}
								},
								(err, count) => {
									callback(err, count);
								}
							);
						}
					}
				],
				(err, results) => {
					//res.redirect(url);
					res.send({
						data: "success"
					})
				}
			);

			async.parallel(
				[
					//This function is updated for the receiver of the friend request when it is accepted
					function(callback) {
						if (req.body.data.senderId) {
							Users.update(
								{
									_id: req.body.user._id,
									"friendsList.friendId": { $ne: req.body.data.senderId }
								},
								{
									$push: {
										friendsList: {
											friendId: req.body.data.senderId,
											friendName: req.body.data.senderName
										}
									},
									$pull: {
										request: {
											userId: req.body.data.senderId,
											username: req.body.data.senderName
										}
									},
									$inc: { totalRequest: -1 }
								},
								(err, count) => {
									callback(err, count);
									
								}
							)
						}
					},

					//This function is updated for the sender of the friend request when it is accepted by the receiver
					function(callback) {
						if (req.body.data.senderId) {
							Users.update(
								{
									_id: req.body.data.senderId,
									"friendsList.friendId": { $ne: req.body.user._id }
								},
								{
									$push: {
										friendsList: {
											friendId: req.body.user._id,
											friendName: req.body.user.username
										}
									},
									$pull: {
										sentRequest: {
											username: req.body.user.username
										}
									}
								},
								(err, count) => {
									callback(err, count);
								}
							);
						}
					},

					function(callback) {
						if (req.body.data.user_Id) {
							Users.update(
								{
									_id: req.body.user._id,
									"request.userId": { $eq: req.body.data.user_Id }
								},
								{
									$pull: {
										request: {
											userId: req.body.data.user_Id
										}
									},
									$inc: { totalRequest: -1 }
								},
								(err, count) => {
									callback(err, count);
								}
							);
						}
					},

					function(callback) {
						if (req.body.data.user_Id) {
							Users.update(
								{
									_id: req.body.data.user_Id,
									"sentRequest.username": { $eq: req.body.user.username }
								},
								{
									$pull: {
										sentRequest: {
											username: req.body.user.username
										}
									}
								},
								(err, count) => {
									callback(err, count);
								}
							);
						}
					},

					function(callback) {
						if (req.body.data.chatId) {
							Message.update(
								{
									_id: req.body.data.chatId
								},
								{
									isRead: true
								},
								(err, done) => {
									callback(err, done);
								}
							);
						}
					}
				],
				(err, results) => {
					//res.redirect(url);
					res.send({
						data: "success"
					})
				}
			);
		}
	};
};

const router = require("express").Router();

const userController = require("../controllers/userController");
// const authController = require("../controllers/authController");

const { isValidToken, renewToken } = require("../middlewares/protector");


router.use(isValidToken); // Validates token for all routes
router.use(renewToken)


router.get("/get-users", userController.getUsers);
router.get("/get-friend-requests", userController.getFriendRequests);
router.get("/get-friends", userController.getFriends);
router.get("/get-friends", userController.getFriends);
router.post("/mark-notification-as-read", userController.markNotificationAsRead);
router.post("/remove-notification", userController.removeNotification);



module.exports = router;
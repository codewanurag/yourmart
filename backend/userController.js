const User = require("../models/userModel");

// FOLLOW / UNFOLLOW USER

const followUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFollowing = currentUser.following.includes(
      targetUser._id
    );

    if (alreadyFollowing) {
      // UNFOLLOW

      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);

      await currentUser.save();
      await targetUser.save();

      return res.json({
        message: "Unfollowed user",
      });
    } else {
      // FOLLOW

      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);

      await currentUser.save();
      await targetUser.save();

      return res.json({
        message: "Followed user",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  followUser,
};

module.exports.getCurrentUserId = (req, res) => {
    return req.user.user?._id
}
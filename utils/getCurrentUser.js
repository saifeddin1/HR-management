module.exports.getCurrentUserId = (req, res) => {
    return req.user._id
}
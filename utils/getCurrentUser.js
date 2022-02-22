module.exports.getCurrentUserId = (req, res) => {
    console.log('😁😁😁😁', req.user)
    return req.user._id
}
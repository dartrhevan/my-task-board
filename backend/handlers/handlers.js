
const User = require('../model/User');

function getUserData(req, res) {
    res.send({login: req.user.login, email: req.user.email});
}

function checkAuthenticated(req, res, next) {
    if(req.user)
        next();
    else
        res.send({error: "Not authenticated"});
}

function checkWsAuthenticated(ws, req, next) {
    if(req.user)
        next();
    else {
        ws.send({error: "Not authenticated"});
        ws.disconnect();
    }
}

function checkNotAuthenticated(req, res, next) {
    if(!req.user)
        next();
    else
        res.send({error: "Already authenticated"});
}

function logout(req, res) {
    req.logOut();
    res.send('{}');
}

const objectIdLength = 12;

function findUser(req, resp) {
    const identifier = decodeURI(req.query.identifier);
    const conditions = [{login: identifier },
        {email: identifier }];
    if(identifier.length === objectIdLength)
        conditions.push({_id:  identifier});
    console.log(identifier);

    User.findOne({$or: conditions}, (err, user) =>
        resp.json({error: (!user || !user._id) ? err || "Such user hasn't been found." : undefined, result: user ? user._id : undefined}));

}

module.exports = { getUserData, checkAuthenticated, checkNotAuthenticated, logout, checkWsAuthenticated, findUser };

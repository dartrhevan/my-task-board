
const Board = require('../model/Board');
const Column = require('../model/Column');
const mongoose = require('mongoose');
const getBoard = require('./getBoard');
const sendBoardData = require("./sendBoardData");
const boardSockets = {};//All sockets for detailed board page

function standardResend(boardId, err)  {
    if(err)
        console.log(err);
    sendData(boardId)
}

function getDetailedBoard(boardId, userId) {
    return getBoard(boardId, { _id: mongoose.Types.ObjectId(boardId) })
        .then(async b => {
            console.log(b);
            if(b[0].creatorId._id.toString() !== userId.toString() && b[0].members.find(m => m._id === userId) === -1)
                return {"error": "Wrong boardId"};
            const columns = await Column.find({ boardId: mongoose.Types.ObjectId(boardId)})
                    .populate('tasks', 'name _id workerId description done endDate')
                    .exec()
                    .then(c => Column.populate(c, {path: 'tasks.workerId', select: "login"}))
                    .catch(e => console.log(e));
            return {board: b[0], columns: columns};
        })
}

function detailedBoardWSHandler(ws, req) {
    const boardId = req.params.id;
    const userId = req.user._id.toString();
    //save the sockets
    if(boardSockets[boardId])
        //Due to each user has multiple boards we have to store for each boardId own dictionary similar to boardListSockets
        boardSockets[boardId][userId] = ws;
    else
        boardSockets[boardId] = {[userId]: ws};
    console.log(boardId);
    getDetailedBoard(boardId, req.user._id)
        .then(data => ws.send(JSON.stringify(data)));

    ws.on('message', msg => replyDetailedBoardMessage(msg, boardId, userId));
    ws.on('close', () => closeDetailedBoard(boardId, userId));
}

function closeDetailedBoard(boardId, userId) {
    // remove ws
    if(boardSockets[boardId] && boardSockets[boardId][userId])
        delete boardSockets[boardId][userId];
    if(boardSockets[boardId] && !Object.keys(boardSockets[boardId]).length)//if there is no users seeing this board, remove it from dictionary
        delete boardSockets[boardId];
}

function addNewObject(data , boardId) {
    const entity = new mongoose.connection.models[data.collection]();
    console.log(data.object.date);
    for (const f in data.object)
        entity[f] = f.endsWith('Id') ?
            new mongoose.Types.ObjectId(data.object[f]) :
            data.object[f];
    entity.save()
        .then(e => data.parent ? mongoose.connection.models[data.parent.collection]
            .findByIdAndUpdate(data.parent.id , {$addToSet: {[data.parent.field]: e._id}} ,
                {useFindAndModify: false}, standardResend.bind(null, boardId)) : sendData(boardId))
        .catch(e => console.log(e));
}
/** Object may be Task or Column */
function deleteObject(data , boardId) {
    mongoose.connection.models[data.collection]
        .findByIdAndRemove(data._id , {useFindAndModify: false} , (err , obj) => {
            if (err)
                console.log(err);
            if (data.children)
                mongoose.connection.models[data.children.collection]
                    .deleteMany({_id: {$in: obj[data.children.field]}} , {} ,err => console.log(err || ''));
            data.parent ? mongoose.connection.models[data.parent.collection]
                .findByIdAndUpdate(data.parent.id , {$pull: {[data.parent.field]: obj._id}} ,
                    {useFindAndModify: false} , standardResend.bind(null, boardId)) : sendData(boardId)
        })
}

function updateObject(data , boardId) {
    const resend = standardResend.bind(null, boardId);
    mongoose.connection.models[data.collection].findByIdAndUpdate(data._id , data.object , {useFindAndModify: false} , (err) => {
        if (err)
            console.log(err);
        if (data.parent && data.parent.oldId !== data.parent.id) {
            mongoose.connection.models[data.parent.collection]
                .findByIdAndUpdate(data.parent.oldId , {$pull: {[data.parent.field]: data._id}} ,
                    {useFindAndModify: false}, resend);
            mongoose.connection.models[data.parent.collection]
                .findByIdAndUpdate(data.parent.id , {$addToSet: {[data.parent.field]: data._id}} ,
                    {useFindAndModify: false} , resend);
        } else
            sendData(boardId)
    })
}

function handleObject(data , boardId) {
    if(data.newMemberId)
        Board.findByIdAndUpdate(boardId, {$addToSet: {members: data.newMemberId}},
            {useFindAndModify: false}, standardResend.bind(null, boardId));
    else if (data._id) {
        if (data.object)
            updateObject(data , boardId);
        else
            deleteObject(data , boardId);
    }
    else //creation
        addNewObject(data , boardId);
}

function replyDetailedBoardMessage(msg, boardId) {
    console.log(msg);
    const data = JSON.parse(msg);
    if(data instanceof Array)
        for (let d of data)
            handleObject(d , boardId);
    else
        handleObject(data , boardId);
}

function sendData(boardId) {
    Board.findById(boardId, (err, board) =>
        sendBoardData(board.members, boardSockets[boardId], getDetailedBoard.bind(null, boardId)))
}

module.exports = detailedBoardWSHandler;

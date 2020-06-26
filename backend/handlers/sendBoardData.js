
const getBoard = require('./getBoard');

function sendBoardData(members , sockets, getData = getBoard) {
    members.forEach(m => {
        const id = m._id.toString();
        if (sockets[id])
        getData(m._id)
            .then(r => sockets[id].send(JSON.stringify(r)))
            .catch(e => console.log(e));
    });
}

module.exports = sendBoardData;

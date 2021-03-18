/**
 * 
 * @param {object} obj
 * @param {string} obj.room
 * @param {string} obj.date
 * @param {string} obj.game
 * @param {string} obj.stakes
 * @param {string} obj.handId
 * @param {string} obj.blinds
 * @param {string} obj.tableName
 * @param {boolean} obj.isTournament
 * @param {object} obj.sessionProgress
 * @param {number} obj.sessionProgress.current
 * @param {number} obj.sessionProgress.count
 * @param {number} obj.tableMax
 * @param {string} obj.cashSign 
 */
export const MainInfo = function ({
    room,
    date,
    game,
    stakes,
    handId,
    blinds,
    tableName,
    isTournament,
    sessionProgress,
    tableMax,
    cashSign
}) {

    return {
        room,
        date,
        game,
        stakes,
        handId,
        blinds,
        tableName,
        isTournament,
        sessionProgress,
        tableMax,
        cashSign
    };
}

export const MainInfoT = MainInfo({});
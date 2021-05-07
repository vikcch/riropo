import { head, rear } from "@/scripts/units/fns";

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getRoom = lines => {

    // PokerStars Hand #206007536567: ...

    /** @type {string} */
    const firstLine = head(lines);

    return head(firstLine.split(' '));
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getDate = lines => {

    // ... - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]

    /** @type {string} */
    const firstLine = head(lines);

    const match = firstLine.match(/\d{4}\/\d{2}\/\d{2}/);

    return head(match);
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getGame = lines => {

    // PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - ...
    // PokerStars Hand #223692675464: Tournament #3108826330, €9+€1 EUR Hold'em No Limit -
    // PokerStars Hand #114439478289:  Omaha Pot Limit ($0.01/$0.02 USD) - 2014/04/07 16:22:45 WET [2014/04/07 11:22:45 ET]
    // PokerStars Hand #224556861132: Tournament #3144375700, 8500+1500 Hold'em No Limit - Match Round I, Level I (10/20) - 2021/03/07 16:00:37 WET [2021/03/07 11:00:37 ET]
    // PokerStars Hand #224557424912: Tournament #3144288090, 17000+3000 Omaha Pot Limit - Match Round I, Level I (10/20) - 2021/03/07 16:16:18 WET [2021/03/07 11:16:18 ET]

    /** @type {string} */
    const firstLine = head(lines);

    if (firstLine.includes("Hold'em No Limit")) return "Hold'em No Limit";

    const isTournament = firstLine.includes('Tournament #');

    if (isTournament) {

        const commaIndex = firstLine.indexOf(',');
        const dashIndex = firstLine.indexOf('-');

        // dirty => "€9+€1 EUR Hold'em No Limit"
        const dirty = firstLine.substring(commaIndex + 1, dashIndex).trim();

        const arrSplit = dirty.replace('Freeroll', '').split(' ');

        // Filtra as palavras que acabam em miniscula
        return arrSplit.filter(v => /[a-z]$/gm.test(v)).join(' ');

    } else {

        const colonIndex = firstLine.indexOf(':');
        const bracketIndex = firstLine.indexOf('(');

        return firstLine.substring(colonIndex + 1, bracketIndex).trim();
    }
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getStakes = lines => {

    // PokerStars Hand #223692675464: Tournament #3108826330, €9+€1 EUR Hold'em No Limit -
    // PokerStars Hand #114439478289:  Omaha Pot Limit ($0.01/$0.02 USD) - 2014/04/07 16:22:45 WET [2014/04/07 11:22:45 ET]

    /** @type {string} */
    const firstLine = head(lines);

    const isTournament = firstLine.includes('Tournament #');

    if (isTournament) {

        const commaIndex = firstLine.indexOf(',');
        const dashIndex = firstLine.indexOf('-');

        // dirty => "€9+€1 EUR Hold'em No Limit"
        const dirty = firstLine.substring(commaIndex + 1, dashIndex).trim();

        const arrSplit = dirty.split(' ');

        // Filtra as palavras que não acabam em miniscula
        const stakes = arrSplit.filter(v => !/[a-z]$/gm.test(v));

        return stakes.join(' ') || 'Freeroll';

    } else {

        const startIndex = firstLine.indexOf('(');
        const endIndex = firstLine.indexOf(')');

        return firstLine.substring(startIndex + 1, endIndex);
    }
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getHandId = lines => {

    // PokerStars Hand #206007536567: ...

    /** @type {string} */
    const firstLine = head(lines);

    const poundIndex = firstLine.indexOf('#');
    const colonIndex = firstLine.indexOf(':');

    return firstLine.substring(poundIndex + 1, colonIndex);
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getBlinds = lines => {

    // PokerStars Hand #223144757797: Tournament #3108828470, €9+€1 EUR Hold'em No Limit - Level XVI (1000/2000) - 2021/01/28 17:12:37 WET [2021/01/28 12:12:37 ET]
    // PokerStars Hand #114439478289:  Omaha Pot Limit ($0.01/$0.02 USD) - 2014/04/07 16:22:45 WET [2014/04/07 11:22:45 ET]

    /** @type {string} */
    const firstLine = head(lines);

    const startIndex = firstLine.indexOf('(');
    const endIndex = firstLine.indexOf(')');

    // dirty - tournament => "1000/2000"
    // dirty - cash (USD) => "$0.01/$0.02 USD"
    const dirty = firstLine.substring(startIndex + 1, endIndex);

    const ante = getAnteFormated(lines);
    const straddle = getStraddleFormated(lines);

    return head(dirty.split(' ')) + ante + straddle;
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getAnteFormated = lines => {

    const found = lines.find(x => /:\sposts\sthe\sante\s.*\d$/gm.test(x));

    if (!found) return '';

    return `(+${rear(found.split(' '))})`;
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getStraddleFormated = lines => {

    const found = lines.find(x => /:\sposts\sa\sstraddle\s.*\d$/gm.test(x));

    if (!found) return '';

    return `[${rear(found.split(' '))}]`;
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getTableName = lines => {

    // Table 'Holda III' 6-max Seat #2 is the button
    // Table '3108828470 6' 6-max Seat #1 is the button

    const secondeLine = lines[1];

    const startIndex = secondeLine.indexOf("'");
    const endIndex = secondeLine.lastIndexOf("'");

    return secondeLine.substring(startIndex + 1, endIndex);
};

/**
 * 
 * @param {string[]} lines
 * @returns {boolean}
 */
const getIsTournament = lines => {

    // PokerStars Hand #223144757797: Tournament #3108828470, €9+€1 EUR Hold'em No Limit - Level XVI (1000/2000) - 2021/01/28 17:12:37 WET [2021/01/28 12:12:37 ET]

    /** @type {string} */
    const firstLine = head(lines);

    return firstLine.includes('Tournament #');
};

/**
 * @param {string[]} lines
 * @returns {number}
 */
const getTableMax = lines => {

    // ...
    // Table 'Akiyama II' 6-max Seat #5 is the button

    const tableMaxLine = lines[1].replace('(Play Money) ', '');

    const match = tableMaxLine.match(/\d+(?=\-max\sSeat\s#\d+\sis\sthe\sbutton$)/gm)

    return Number(head(match));
};

/**
 * @param {string[]} lines
 * @returns {string}
 */
const getCashSign = lines => {

    // PokerStars Hand #223144757797: Tournament #3108828470, €9+€1 EUR Hold'em No Limit - Level XVI (1000/2000) - 2021/01/28 17:12:37 WET [2021/01/28 12:12:37 ET]
    // PokerStars Hand #114439478289:  Omaha Pot Limit ($0.01/$0.02 USD) - 2014/04/07 16:22:45 WET [2014/04/07 11:22:45 ET]

    /** @type {string} */
    const firstLine = head(lines);

    const startIndex = firstLine.indexOf('(');

    const value = firstLine.charAt(startIndex + 1);

    const isDigit = /\d/.test(value);

    return isDigit ? '' : value;
};


export default {

    getRoom,
    getDate,
    getGame,
    getStakes,
    getHandId,
    getBlinds,
    getTableName,
    getIsTournament,
    getTableMax,
    getCashSign
};
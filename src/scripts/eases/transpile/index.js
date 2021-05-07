import natural8 from './sites/natural8';

export default {

    /**
     * 
     * @param {string} log 
     */
    transpile(log) {

        // Natural8
        if (log.startsWith('Poker Hand #')) {

            // return natural8()

            return natural8(log);
        }

        return log;
    }
}
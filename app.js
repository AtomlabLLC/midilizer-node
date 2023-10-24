/**
 * SQLizer bridge that takes input from midi and converts it to a sql command
 * 2023 Atomlab LLC
 * This is a early work in progress to try things out.
 */

const Client = require('pg-native')
const easymidi = require('easymidi');
var term = require( 'terminal-kit' ).terminal ;

term.eraseDisplay();

const input = new easymidi.Input('IAC Driver Bus 1');  // Please update this according to your setup. 

class Timing {
    constructor() {
        this.lastDate = new Date;
        this.timeFrame = 0;
    }

    clock() {
        const newDate = new Date;
        this.timeFrame = newDate - this.lastDate;
        this.lastDate = newDate;
        term.moveTo(29,1).eraseLineAfter() // go to line 1 column 29
        term(this.timeFrame) // write the current timing between clocks
    }
}


const note = function(state, msg) {
    term.moveTo(29,3).eraseLineAfter() // go to line 3 column 29 and erase everthing
    term(state).moveTo(49,3) // then write the state
    term(msg.note).moveTo(69,3) // the note
    term(msg.velocity) // the velocity
}

const status = function(message) {
    term.moveTo(29, 2).eraseLineAfter() // go to line 2 column 29
    term(message) // and update the midi status
}

const timing = new Timing();

term.moveTo(1,1)
term("SQLizer bridge").moveTo(20,1)
term("Timing:").moveTo(20,2)
term("Status:")

var client = new Client()
client.connectSync('postgresql://sql:lizer@localhost:8889/sqlizer')

const noteOff = function(msg) {
    note("off", msg) // update status
    var rows = client.querySync('UPDATE oscillators SET otype=0 WHERE idx=0') // turn off tone generator
}

const noteOn = function(msg) {
    note("on", msg) // update status
    let a = 440 //frequency of A (coomon value is 440Hz)
    var frequency = (a / 32) * (2 ** ((msg.note - 9) / 12)) // calculate the frequency from the midi note integer
    var rows = client.querySync('UPDATE oscillators SET otype=3, freq='+frequency+' WHERE idx=0') // set the tone generator to the frequency 
}

input.on('noteoff', msg => noteOff(msg));
input.on('noteon', msg => noteOn(msg));
input.on('clock', () => timing.clock());
input.on('start', () => status('start'))
input.on('continue', () => status('continue'));
input.on('stop', () => status('stop'));
input.on('reset', () => status('reset'));

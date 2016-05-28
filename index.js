'use strict';
const midi = require('midi');

// Offset between MIDI note values and ASCII charCodes.
const KEY_OFFSET = 17;

// Max time delay between two keypresses to form a chord (in milliseconds).
const MAX_CHORD_DELAY = 16;

// MIDI status codes in decimal.
const STATUS_CODES = {
    128: 'UP',
    144: 'DOWN',
};

// Set up a new input.
const input = new midi.input();

const state = {
    keysDown: {
        _count: 0
    },
};

// How we mutate the state.
const action = {
    keyUp: function keyUp (key) {
        // const {keysDown} = state;
        const keysDown = state.keysDown;
        if (!keysDown[key]) {return};

        keysDown[key] = false;
        --keysDown._count;
    },

    keyDown: function keyDown (key) {
        // const {keysDown} = state;
        const keysDown = state.keysDown;
        if (keysDown[key]) {return};

        keysDown[key] = true;
        ++keysDown._count;
    },
};

// Print with a brief delay in case the user is actually trying to hit a chord.
let triggerTimeout = null;
function queueTrigger (trigger, key) {
    clearTimeout(triggerTimeout);
    triggerTimeout = setTimeout(function () {
        trigger();
        action.keyUp(key);
        triggerTimeout = null;
    }, MAX_CHORD_DELAY);
}

input.on('message', function(_, message) {
    // const [status, key, pressure] = message;
    // const {keysDown} = state;
    const status = message[0];
    const key = message[1];
    const pressure = message[2];
    const keysDown = state.keysDown;

    // Early exit for everything but keydown signals.
    const statusMsg = STATUS_CODES[status];
    if (statusMsg === 'UP') {
        return action.keyUp(key);
    } else if (statusMsg !== 'DOWN') {
        return;
    }

    action.keyDown(key);
    switch (keysDown._count) {
        case 1:
            // Type a character which charCode corresponding to the key's note.
            const upperChar = String.fromCharCode(key + KEY_OFFSET);
            const char = pressure > 95 ? upperChar : upperChar.toLowerCase();
            queueTrigger(() => process.stdout.write(char), key);
            break;
        case 2:
            // Type a space for any two-key chords.
            queueTrigger(() => process.stdout.write(' '), key);
            break;
        default:
            // If 3 or more keys are mashed, do nothing. FOR NOW!
            queueTrigger(() => {}, key);
    }

});

// Open the first available input port, YOLO.
input.openPort(0);

var findHumans = require('./find_humans');

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
    else{
    	console.log('Pass! ',message);
    }
}

var faces = [{
    x: 450,
    y: 450,
    width:100,
    height:100
},{
    x: 500,
    y: 500,
    width:120,
    height:120
}, {
    x: 300,
    y: 700,
    width:50,
    height:50
}]

var faces2 = [{
    x: 850,
    y: 899,
    width:0,
    height:0
},{
    x: 547,
    y: 498,
    width:0,
    height:0
}, {
    x: 348,
    y: 702,
    width:0,
    height:0
}]




var found = findHumans.closest(300, 300, faces);

// var facesMoved = findHumans.delta(faces, faces2);
assert(faces[1] == found,'Select face');
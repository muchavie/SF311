var t11 = require('./t11.js');


var a = t11.tdate(14, 101),
    b = t11.tdate(14, 1),
    c = t11.tdate(14, 10),
    d, e, f, g;

console.log(a);
console.log(b);
console.log(c);

try {
    d = t11.tdate(14, 1001);
} catch(e) {
    console.log(e);
}

try {
    f = t11.tdate(14, 'x');
} catch(e) {
    console.log(e);
}

try {
    g = t11.tdate(14, 10.1);
} catch(e) {
    console.log(e);
}


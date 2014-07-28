var forever = require('forever-monitor');

var child = new(forever.Monitor)('./lib/server.js', {
    max: 1,
    silent: true,
    pidFile: "nodepp.pid",
    logFile: "nodepp.log",
    outFile: "node-stout.log",
    errFile: "nodepp-sterr.log",
    options:['--registries', 'hexonet']

});
child.on('exit', function() {
    console.log("the program has exited.");
});

child.start();
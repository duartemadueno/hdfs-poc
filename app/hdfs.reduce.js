var Logger = require('bunyan');
var logger = new Logger({
  name: 'hdfs map',
  streams: [
    {
      path: 'logs/reduce.log',
      level: 'debug'
    }
  ]
});
/**
* Reducer chunk processing function.
* Reads STDIN
*/
function execute() {
    var chunk = process.stdin.read(); // Read a chunk
    if (chunk) {
        // Split it
        var lines = chunk.trim().split('\n');
        var totals = {};

        // Count words
        lines.forEach(line => {
            line = line.trim();

            var atom = line.split('\t');
            const number1Value = +atom[1];
            const number2Value = +atom[3] || 0;

            if (number1Value !== null) {
                if (!totals.number1) {
                    totals.number1 = 0;
                }

                totals.number1 += number1Value;
            }
            if (number2Value !== null) {
                if (!totals.number2) {
                    totals.number2 = 0;
                }

                totals.number2 += number2Value;
            }
        });

        // Emit results
        Object.keys(totals).forEach(number => {
            var total = totals[number];
            process.stdout.write(number + ' total:\t' + total + '\n');
        });
    }
}

process.stdin.setEncoding('utf8');
process.stdin.on('readable', execute); // Set STDIN processing handler 
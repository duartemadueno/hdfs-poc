
var Logger = require('bunyan');
var logger = new Logger({
  name: 'hdfs map',
  streams: [
    {
      path: 'logs/map.log',
      level: 'debug'
    }
  ]
});
/**
* Mapper chunk processing function.
* Reads STDIN
*/
let count = 0;
let lastUnsuccessfulLine = null
function execute() {
    var chunk = process.stdin.read(); // Read a chunk
    if (chunk !== null) {
        // Split it
        const objects = chunk.split('\n');
        logger.error('chunk execution - process id:', process.pid);

        const processLine = line => {
            try {
                let json = JSON.parse(line.toString());
                process.stdout.write('number1\t' + json.number1 + '\tnumber2\t ' + json.number2 + ' \n');
            } catch(e) {
                if (lastUnsuccessfulLine) {
                    processLine((lastUnsuccessfulLine + line).toString());
                    lastUnsuccessfulLine = null;
                } else {
                    lastUnsuccessfulLine = line;
                }
                logger.error('error', e);
                logger.error('error line', line);
            }
        }

        // Count words
        objects.forEach(object => {
            processLine(object);
        });
    }
}

logger.debug('--------------------------------------------------------------------------------------------------- init map');
process.stdin.setEncoding('utf8');
process.stdin.on('readable', execute); // Set STDIN processing handler
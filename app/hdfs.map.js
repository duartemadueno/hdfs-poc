
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
function execute() {
    var chunk = process.stdin.read(); // Read a chunk
    if (chunk !== null) {
        // Split it
        const objects = chunk.split('\n');

        // Count words
        objects.forEach(object => {
            try {
                let json = JSON.parse(object.toString());
                process.stdout.write('number1\t' + json.number1 + '\tnumber2\t ' + json.number2 + ' \n');
            } catch(e) {
                logger.error('error', e);
            }
        });
    }
}

logger.debug('--------------------------------------------------------------------------------------------------- init map');
process.stdin.setEncoding('utf8');
process.stdin.on('readable', execute); // Set STDIN processing handler
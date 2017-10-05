
const _ = require('lodash');
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
let lastUnsuccessfulLine = null;
const timeRangeIntervals = [5, 10, 15];
const maxTimeRange = _.max(timeRangeIntervals);
const availableLines = [];

function execute() {
    var chunk = process.stdin.read(); // Read a chunk
    if (chunk !== null) {
        // Split it
        const objects = chunk.split('\n');

        const processLine = line => {
            try {
                let json = JSON.parse(line.toString());
                _.each(timeRangeIntervals, interval => {
                    json['number1Calcs' + interval + 's'] = getCalculations(interval, 'number1');
                    json['number2Calcs' + interval + 's'] = getCalculations(interval, 'number2');
                });
                addToAvailableLines(json);
                process.stdout.write(JSON.stringify(json) + '\n');
            } catch (e) {
                if (lastUnsuccessfulLine) {
                    processLine((lastUnsuccessfulLine + line).toString());
                    lastUnsuccessfulLine = null;
                } else {
                    lastUnsuccessfulLine = line;
                }
                logger.debug('availableLines', availableLines);
                logger.debug('maxTimeRange', maxTimeRange);
            }
        }

        // Count words
        objects.forEach(object => {
            processLine(object);
        });
    }
}

function getCalculations(interval, field) {
    const start = interval < maxTimeRange ? maxTimeRange - interval - 1 : 0;
    const objects = availableLines.slice(start, (maxTimeRange - 1));
    return {
        max: _.maxBy(objects, object => object[field]),
        min: _.minBy(objects, object => object[field]),
        mean: _.meanBy(objects, object => object[field]),
        median: getMedian(_.map(objects, object => object[field])),
        range: _.map(objects, object => object[field])
    }
}

function getMedian(values) {
    if (values.length % 2 == 0) {
        return (values[values.length / 2] + values[values.length / 2 - 1]) / 2;
    } else {
        return values[Math.floor(values.length / 2)];
    }
}

function addToAvailableLines(line) {
    if (availableLines.length >= maxTimeRange) {
        availableLines.shift();
    }
    availableLines.push({ number1: line.number1, number2: line.number2 });
}

logger.debug('--------------------------------------------------------------------------------------------------- init map');
process.stdin.setEncoding('utf8');
process.stdin.on('readable', execute); // Set STDIN processing handler
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

const execute = () => {
    var chunk = process.stdin.read(); // Read a chunk
    if (chunk !== null) {
        // Split it
        const objects = chunk.split('\n');

        const processLine = line => {
            try {
                let json = JSON.parse(line.toString());
                if (availableLines.length > 0) {
                    _.each(timeRangeIntervals, interval => {
                        json['number1Calcs' + interval + 's'] = getCalculations(interval, 'number1');
                        json['number2Calcs' + interval + 's'] = getCalculations(interval, 'number2');
                    });
                }
                addToAvailableLines(json);
                process.stdout.write(JSON.stringify(json) + '\n');
            } catch (e) {
                if (lastUnsuccessfulLine) {
                    processLine((lastUnsuccessfulLine + line).toString());
                    lastUnsuccessfulLine = null;
                } else {
                    lastUnsuccessfulLine = line;
                }
            }
        }

        objects.forEach(object => {
            processLine(object);
        });
    }
}

const getCalculations = (interval, field) => {
    let start;
    let end;
    if (availableLines.length <= interval) {
        start = 0;
        end = _.max([availableLines.length - 1, 0]);
    } else {
        start = availableLines.length - interval - 1;
        end = availableLines.length - 1;
    }
    const objects = availableLines.slice(start, end + 1);
    const mapedField = _.map(objects, object => object[field]);
    return {
        max: _.max(mapedField),
        min: _.min(mapedField),
        mean: _.mean(mapedField),
        median: getMedian(mapedField),
        range: mapedField
    }
}

const getMedian = values => {
    values.sort((a, b) => a - b);
    if (values.length === 0) {
        return null;
    } else if (values.length % 2 == 0) {
        return (values[values.length / 2] + values[values.length / 2 - 1]) / 2;
    } else {
        return values[Math.floor(values.length / 2)];
    }
}

const addToAvailableLines = line => {
    if (availableLines.length >= maxTimeRange) {
        availableLines.shift();
    }
    availableLines.push({ number1: line.number1, number2: line.number2 });
}

logger.debug('--------------------------------------------------------------------------------------------------- init map');
process.stdin.setEncoding('utf8');
process.stdin.on('readable', execute); // Set STDIN processing handler
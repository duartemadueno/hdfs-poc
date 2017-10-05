const moment = require('moment');

const hdfsStorage = new require('./hdfs.storage');
const config = new require('./config');

const storage = new hdfsStorage();

const writeData = () => {
    let i = 0;
    const bulkData = [];
    let currentDate = moment();
    while (i < 100000) {
        i++;
        bulkData.push({
            number1: Math.random() * 100,
            number2: Math.random() * 100,
            date: currentDate.toString()
        });
        currentDate = moment(currentDate).add(1, 'seconds');
    }
    console.log(bulkData);

    storage.saveBulk(bulkData).then(success => {
        console.log(success);
    }).catch(error => {
        console.log(error);
    });
};

const readData = () => {
    storage.list().then(success => {
        console.log(success);
    }).catch(error => {
        console.log('readData', error);
    });
};

writeData();
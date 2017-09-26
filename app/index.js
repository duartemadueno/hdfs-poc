const hdfsStorage = new require('./hdfs.storage');
const config = new require('./config');

const storage = new hdfsStorage();

const writeData = () => {
    let i = 0;
    const bulkData = [];
    while (i < 10000) {
        i++;
        bulkData.push({
            number1: Math.random() * 100,
            number2: Math.random() * 100
        });
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
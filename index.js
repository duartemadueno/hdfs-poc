const hdfsStorage = new require('./app/hdfs.storage');


const data = { text: 'test', number: 0 };
const storage = new hdfsStorage();


const writeData = () => {
    storage.save(data).then(success => {
        console.log(success);
    }).catch(error => {
        console.log(error);
    });
};

const readData = () => {
    storage.list().then(success => {
        console.log(success);
    }).catch(error => {
        console.log(error);
    });
};

readData();
const hdfsStorage = new require('./hdfs.storage');
const config = new require('./config');

const storage = new hdfsStorage();

const writeData = () => {
    let i = 0;
    const createData = () => setTimeout(() => {
        i++;
        if (i < 10000) {
            createData();
        }
        const newData = {
            number1: Math.random() * 100,
            number2: Math.random() * 100
        };
        storage.save(newData).then(success => {
            console.log(success);
        }).catch(error => {
            console.log(error);
        });
    }, 500);
    createData();
};

const readData = () => {
    storage.list().then(success => {
        console.log(success);
    }).catch(error => {
        console.log('readData', error);
    });
};

writeData();
const Promise = new require('promise');

class hdfsTest {
    constructor() {
        this.hdfsFile = "/user/madueno/random.data";
        this.hdfs = new (require("node-webhdfs")).WebHDFSClient({ user: process.env.USER, namenode_host: "localhost", namenode_port: 9870 });
    }

    appendData(data) {
        const stringifiedData = this.stringifyAndAddNewLine(data);
        return new Promise((resolve, reject) => {
            this.hdfs.append(this.hdfsFile, stringifiedData, (error, success) => {
                if (error instanceof Error) {
                    if (error.exception === 'FileNotFoundException') {
                        return this.createFile(data)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject(error);
                    }
                } else {
                    resolve(success);
                }
            });
        });
    }

    createFile(data) {
        const stringifiedData = this.stringifyAndAddNewLine(data);
        return new Promise((resolve, reject) => {
            this.hdfs.create(this.hdfsFile, stringifiedData, (error, success) => {
                if (error instanceof Error) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });
    }

    stringifyAndAddNewLine(data) {
        return JSON.stringify(data) + '\n\r';
    }

    read() {
        return new Promise((resolve, reject) => {
            this.hdfs.open(this.hdfsFile, (error, success) => {
                if (error instanceof Error) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });
    }
}
const data = { text: 'test', number: 0 };
const test = new hdfsTest();

// test.appendData(data).then(success => {
//     console.log(success);
// }).catch(error => {
//     console.log(error);
// });
test.read().then(success => {
    console.log(success);
}).catch(error => {
    console.log(error);
});
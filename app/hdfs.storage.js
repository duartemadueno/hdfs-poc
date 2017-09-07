const Promise = require('promise');
const config = require('./config');
/**
 * useful links: 
 *  1. http://hadoop.apache.org/docs/r3.0.0-alpha4/hadoop-project-dist/hadoop-common/SingleCluster.html
 *  2. https://www.npmjs.com/package/node-webhdfs
 * 
 */
module.exports = class hdfsStorage extends baseStorage {
    constructor() {
        this.hdfsFile = config.storage.hdfs.file;
        this.hdfs = new (require("node-webhdfs")).WebHDFSClient(config.storage.hdfs.connection);
    }

    save(data) {
        const stringifiedData = this.stringifyAndAddNewLine(data);
        return new Promise((resolve, reject) => {
            this.hdfs.append(this.hdfsFile, stringifiedData, (error, success) => {
                if (error instanceof Error) {
                    if (error.exception === 'FileNotFoundException') {
                        return this.createFile(data)
                            .then(resolve)
                            .catch(reject);
                    } else if(error.message !== 'expected redirect') {
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

    list() {
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
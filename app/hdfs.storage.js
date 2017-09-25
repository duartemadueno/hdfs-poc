const Promise = require('promise');
const config = require('./config');
const _ = require('lodash');


/**
 * useful links: 
 *  1. http://hadoop.apache.org/docs/r3.0.0-alpha4/hadoop-project-dist/hadoop-common/SingleCluster.html
 *  2. https://www.npmjs.com/package/node-webhdfs
 */
module.exports = class HdfsStorage {
    /**
     * @param {string} storageType refers to config file where hdfs' file path is set for this instance
     */
    constructor(storageType) {
        console.info("Creating HDFS client with host: " + config.hdfs.connection.namenode_host + " and port: " + config.hdfs.connection.namenode_port);
        this.hdfsFile = config.hdfs.file;
        this.client = new (require("node-webhdfs")).WebHDFSClient(config.hdfs.connection);
    }

    /**
     * Saves data to file
     * 
     * Before saving, data is stringified
     * 
     * If file isn't created yet, this will create it automatically
     * @param {object} data data to add to the file
     */
    save(data) {
        const stringifiedData = this.stringifyAndAddNewLine(data);
        return this.appendTextToFile(stringifiedData);
    }

    /**
     * Saves an array of data to file
     * 
     * Before saving, entries are parsed into a new string line
     * 
     * If file isn't created yet, this will create it automatically
     * @param {array} dataList array of data to add to the file
     */
    saveBulk(dataList) {
        if (_.isArray(dataList)) {
            let stringifiedData = "";
            _.each(dataList, entry => {
                stringifiedData += this.stringifyAndAddNewLine(entry);
            });
            return this.appendTextToFile(stringifiedData);
        } else {
            return Promise.reject(Error("HDFS - expected an array for a bulk save"));
        }
    }

    /**
     * Appends text to file
     * @param {string} text 
     */
    appendTextToFile(text) {
        const fileLocation = this.hdfsFile;
        return new Promise((resolve, reject) => {
            let isFileNotFound = false;
            this.client.append(fileLocation, text, (error, success) => {
                if (error instanceof Error) {
                    if (error.exception === 'FileNotFoundException') {
                        isFileNotFound = true;z
                        return this.createFile(text)
                            .then(resolve)
                            .catch(reject);
                    }
                    // this case is a bit weird since the node-webhdfs return error twice. one for 'FileNotFound' and then another for 'expected redirect'
                    else if (error.message !== 'expected redirect' || (error.message === 'expected redirect' && !isFileNotFound)) {
                        reject(error);
                    }
                } else {
                    resolve(success);
                }
            });
        });
    }

    /**
     * Creates file and adds text to it
     * @param {string} text data parsed to string to insert in the file
     */
    createFile(text) {
        const fileLocation = this.hdfsFile;
        return new Promise((resolve, reject) => {
            this.client.create(fileLocation, text, (error, success) => {
                if (error instanceof Error) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });
    }

    /**
     * Deletes file
     * @param {string} file file location
     */
    deleteFile(file) {
        return new Promise((resolve, reject) => {
            this.client.del(file, (error, success) => {
                if (error instanceof Error) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });
    }

    /**
     * Parse data to string
     * @param {object} data 
     */
    stringifyAndAddNewLine(data) {
        return JSON.stringify(data) + '\n';
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
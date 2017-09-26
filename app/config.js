module.exports = {
    hdfs: {
        file: '/user/madueno/random.data',
        connection: {
            user: process.env.USER,
            namenode_host: 'localhost',
            namenode_port: 9870
        }
    }
};
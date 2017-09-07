module.exports = {
    storage: {
        hdfs: {
            file: '/users/madueno/random.data',
            connection: {
                user: process.env.USER,
                namenode_host: 'localhost',
                namenode_port: 9870
            }
        }
    }
};
# Hadoop's hdfs proof of concept using nodejs

Here's an example on how to use hdfs in a NodeJS application

These are the following requirements/steps and challenges


## Execution

TBD


## NodeJS

v6.11.2 (npm v5.3.0)

[webhdfs package](https://www.npmjs.com/package/node-webhdfs)


## Hadoop's HDFS

r3.0.0-alpha4
* [documentation](http://hadoop.apache.org/docs/r3.0.0-alpha4/index.html)
* [binary](http://www.apache.org/dyn/closer.cgi/hadoop/common/hadoop-3.0.0-alpha4/hadoop-3.0.0-alpha4.tar.gz)
* [setting a single node cluster](http://hadoop.apache.org/docs/r3.0.0-alpha4/hadoop-project-dist/hadoop-common/SingleCluster.html)

[Hadoop localhost overview](http://localhost:9870/dfshealth.html#tab-overview)

Enable webhdfs in `hadoop/wetc/hdfs-site.xml`. Add following entries to `configuration` node.

``` xml
<property>
  <name>dfs.webhdfs.enabled</name>
  <value>true</value>
</property>
<property>
  <name>dfs.support.append</name>
  <value>true</value>
</property>
```

#### Known issues

##### Case 1:

While tying to run start-dfs.sh:

* errors:
  - https://wiki.apache.org/hadoop/ConnectionRefused
  - org.apache.hadoop.hdfs.server.datanode.DataNode: Problem connecting to server
* solution:
  - re run `bin/hdfs namenode -format`
* cause:
  - happens when computer is shutdown and hdfs isn't stop properly

## Spark
### Python 
dependencies

`pip install dateutil`

`pip install numpy`

## OS

Ubuntu 16.04 LTS
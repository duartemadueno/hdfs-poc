# Hadoop's hdfs proof of concept using nodejs


repo that includes pocs 


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

Enable webhdfs in `hadoop/wetc/hdfs-site.xml`. Add following entries to `configuration` node:

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


## OS

Ubuntu 16.04 LTS
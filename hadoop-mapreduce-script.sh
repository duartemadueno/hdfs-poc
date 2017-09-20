# https://www.packtpub.com/books/content/introduction-using-nodejs-hadoops-mapreduce-jobs
# http://hadoop.apache.org/docs/r3.0.0-alpha4/hadoop-streaming/HadoopStreaming.html

bash mapred streaming \
   -Dmapreduce.job.maps=10 \
   -Dmapreduce.job.reduces=10 \
   -files ./app/hdfs.map.js,./app/hdfs.reduce.js \
   -mapper "node ./app/hdfs.map.js" \
   -reducer "node ./app/hdfs.reduce.js" \
   -input ./moby10b.txt \
   -output ./moby10b.out1
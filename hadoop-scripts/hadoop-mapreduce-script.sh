# https://www.packtpub.com/books/content/introduction-using-nodejs-hadoops-mapreduce-jobs
# http://hadoop.apache.org/docs/r3.0.0-alpha4/hadoop-streaming/HadoopStreaming.html
bash hadoop-scripts/hadoop-remove-mapreduce-files.sh

bash mapred streaming \
   -Dmapreduce.job.maps=10 \
   -files ./app/hdfs.map.js \
   -mapper "node ./app/hdfs.map.js" \
   -input ./random.data \
   -output ./step2
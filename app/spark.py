from pyspark import SparkContext, SparkConf

print(SparkConf)

conf = SparkConf().setAppName('spark test').setMaster('local[*]')
sc = SparkContext(conf=conf)


text_file = sc.textFile("hdfs://localhost:9000/user/madueno/random.data")
counts = text_file.flatMap(lambda line: line.split("\"")) \
             .map(lambda word: (word, 1)) \
             .reduceByKey(lambda a, b: a + b)
counts.saveAsTextFile("hdfs://localhost:9000/user/madueno/wordcount.out")
import json
import math
from pyspark import SparkContext, SparkConf
from dateutil.parser import parse
from operator import add
from pyspark.mllib.stat import Statistics

conf = SparkConf().setAppName('spark test')
sc = SparkContext(conf=conf)


def to_json(line):
    return json.loads(line)

def set_time_range(obj):
    date = parse(obj["date"])
    timeframe = (math.floor(date.second / 15) * 15)
    timeframedate = date.replace(second=int(timeframe))
    return [(str(timeframedate) + '-number1', obj["number1"]), \
            (str(timeframedate) + '-number2', obj["number2"])]

def main():
    text_file = sc.textFile("hdfs://localhost:9000/user/madueno/random.data")
    aTuple = (0,0) # As of Python3, you can't pass a literal sequence to a function.
    meanData = text_file.map(to_json) \
                .flatMap(set_time_range) \
                .aggregateByKey(aTuple, lambda a,b: (a[0] + b, a[1] + 1), lambda a,b: (a[0] + b[0], a[1] + b[1])) \
                .mapValues(lambda v: v[0]/v[1])

    meanData.saveAsTextFile("hdfs://localhost:9000/user/madueno/wordcount.out")

main()
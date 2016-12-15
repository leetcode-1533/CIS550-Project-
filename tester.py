#File test the validity of the questions in the NoSQL database
import MySQLdb
from pymongo import MongoClient
import pprint

db = MySQLdb.connect("olympicquiz.cziypygdpbbb.us-west-2.rds.amazonaws.com","shahanimesh94","shahanimesh94","olympic_quiz" )
cursor = db.cursor()

client = MongoClient('mongodb://kirasev:Kirasev101@ds159237.mlab.com:59237/sqlympics')
db2=client.sqlympics
cursor2 = db2.questions.find()
# x=[18963, 21598, 20551, 4647, 21600, 21597, 21590, 21589, 21026, 13038]
# names=["Micheal Phelps","Rafael Nadal", "Usain Bolt", "Istvan Pelle", "Dinara Safina", "Novak Djokovic", "Stanis Wawarinka","Roger Federer" ,"Ronaldhino", "Ronaldo Silva"]
for i in cursor2:
    pprint.pprint(i['question'])
    questionquery=i['questionquery']
    options=i['options']
    cursor.execute(questionquery)
    ans=cursor.fetchone()
    cursor.execute(options)
    opts=cursor.fetchall()
    print ans
    print opts
    #     res = db2.questions.insert_one({'question': question,'questionquery':questionquery,'options':options})
    #     print res
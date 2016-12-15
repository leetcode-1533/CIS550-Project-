#Files uses templates to create and update questions in the mongoDB
import MySQLdb
from pymongo import MongoClient
import pprint

db = MySQLdb.connect("olympicquiz.cziypygdpbbb.us-west-2.rds.amazonaws.com","shahanimesh94","shahanimesh94","olympic_quiz" )
cursor = db.cursor()

client = MongoClient('mongodb://kirasev:Kirasev101@ds159237.mlab.com:59237/sqlympics')
db2=client.sqlympics
cursor2 = db2.questions.find()
get_events="select DISTINCT country_name,code from Country C, belongs B where B.country_code=C.code"
cursor.execute(get_events)
result = cursor.fetchall()
# x=[18963, 21598, 20551, 4647, 21600, 21597, 21590, 21589, 21026, 13038]
# names=["Micheal Phelps","Rafael Nadal", "Usain Bolt", "Istvan Pelle", "Dinara Safina", "Novak Djokovic", "Stanis Wawarinka","Roger Federer" ,"Ronaldhino", "Ronaldo Silva"]
for i in result:
    print(i)
    question = "How many individuals have won an olympic medal from " + str(i[0]).capitalize() + "?"
    questionquery = "select count(athlete_id) as answer from belongs group by country_code having country_code='" + str(i[1]) + "' limit 1"
    options = "select DISTINCT count(athlete_id) as options from belongs group by country_code having country_code<>'" + str(i[1]) + "' and count(athlete_id)<>(select count(athlete_id) as answer from belongs group by country_code having country_code='" + str(i[1]) + "') order by rand() limit 3;"
    print question,questionquery,options
    cursor.execute(questionquery)
    ans=cursor.fetchone()
    cursor.execute(options)
    opts=cursor.fetchall()
    if ans and opts:
        print ans, opts
        res = db2.questions.insert_one({'question': question,'questionquery':questionquery,'options':options})
        print res
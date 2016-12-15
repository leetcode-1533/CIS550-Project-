#File to read the json push does name matching and pushes them to the DB

import csv
import time
import MySQLdb
import json

db = MySQLdb.connect("olympicquiz.cziypygdpbbb.us-west-2.rds.amazonaws.com","shahanimesh94","shahanimesh94","olympic_quiz" )
cursor = db.cursor()

# f = open('D:\SCMP\CIS550-Database and Info systems\Project\Records_Swimming.csv')
# csv_f=csv.reader(f)

with open('D:\SCMP\CIS550-Database and Info systems\Project\Records_Swimming.json') as data_file:
    data = json.load(data_file)


updated = 0
for row in data:
# for row in csv_f:
    #Event,Record,last_name, first_name,Nation,Year
    event=row[0]
    record=row[2]
    first_name=row[3]
    last_name =row[4]
    year=row[6]
    print row
    get_athlete="SELECT id, gender FROM Athlete WHERE first_name LIKE '"+first_name+"' and last_name LIKE '"+last_name+"'";
    try:
        # Execute the SQL command
        print get_athlete
        cursor.execute(get_athlete)
        # Commit your changes in the database
        result=cursor.fetchone()
        if result[1]=='Men':
            get_event="SELECT sport_id FROM Sport WHERE category='Aquatics' and event='"+event+" ' and gender_category='M' ";
        elif result[1]=='Women':
            get_event = "SELECT sport_id FROM Sport WHERE category='Aquatics' and event='" + event + " ' and gender_category='M' ";
        else:
            pass
        try:
            print get_event
            cursor.execute(get_event)
            event_id = cursor.fetchone()
            record_sql="INSERT INTO records(id,event_id, record, year) VALUES (%d,%d,'%s',%d)"%(result[0],event_id[0],str(record),int(year[0:4]))
            print record_sql
            try:
                cursor.execute(record_sql)
                db.commit()
                print row
                print "committed"
            except:
                db.rollback()
        except:
            pass
    except:
        pass
db.close()

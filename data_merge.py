#Updates the athletes table with the data scrapped from wikipedia.

import json
import MySQLdb

db = MySQLdb.connect("olympicquiz.cziypygdpbbb.us-west-2.rds.amazonaws.com","shahanimesh94","shahanimesh94","olympic_quiz" )
cursor = db.cursor()

with open('D:\SCMP\CIS550-Database and Info systems\Project\Athletes_bio_2.json') as data_file:
    data = json.load(data_file)
updated=0
for i in range(len(data)):
    a=[]
    print data[i]
    for j in data[i]:
        a.append(data[i][j].encode('utf-8'))
    # Prepare SQL query to INSERT a record into the database.
    sql = "UPDATE Athlete SET image='"+a[-1]+"', dob='"+a[0]+"' WHERE last_name= '"+a[2]+"' AND first_name='"+a[1]+"'";
    try:
        # Execute the SQL command
        cursor.execute(sql)
        # Commit your changes in the database
        db.commit()
        updated+=1
        print ("%d rows updated",updated)
    except:
        # Rollback in case there is any error
        db.rollback()

db.close()

#File is used for data cleaning remove special characters and re-formatting the data
import MySQLdb

db = MySQLdb.connect("olympicquiz.cziypygdpbbb.us-west-2.rds.amazonaws.com","shahanimesh94","shahanimesh94","olympic_quiz" )
cursor = db.cursor()
get_athelte="SELECT * FROM Athlete"
cursor.execute(get_athelte)
athletes=cursor.fetchall()
for i in athletes:
    print i
    j=[]
    j.append(i[0])
    if i[1]:
        j.append(i[1].capitalize())
    else:
        j.append(i[1])
    if i[2]:
        j.append(i[2].capitalize())
    else:
        j.append(i[2])
    j.append(i[3])
    j.append(i[4])
    if i[5]:
        j.append('https:'+i[5])
    else:
        j.append(i[5])
    j.append(i[6])
    print j
    update="UPDATE Athlete SET first_name='%s',image='%s',last_name='%s' WHERE id=%d"%(j[2],j[5],j[1],j[0])
    try:
        print update
        cursor.execute(update)
        db.commit()
    except:
        db.rollback()
db.close()


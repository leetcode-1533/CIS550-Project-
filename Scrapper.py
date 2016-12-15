# Scrapes the wikipedia for the name of every single athlete in the database and fetches the image and DOB

import mechanize
from bs4 import BeautifulSoup
import csv
import time

f = open('D:\SCMP\CIS550-Database and Info systems\Project\Athlete list.csv')
csv_f=csv.reader (f)


Athletes_bio=[]
count=0;
for row in csv_f:
    Athlete_bio = []
    count+=1
    F_name=row[2].title().replace (" ", "_")
    L_name = row[1].title().replace(" ", "_")
    Athlete_name=F_name+'_'+L_name
    link="https://en.wikipedia.org/wiki/"+Athlete_name
    br = mechanize.Browser()
    try:
        res = br.open(link)
    except (mechanize.HTTPError, mechanize.URLError) as e:
        Athlete_bio.append(e)
        continue
    result=res.read()
    soup=BeautifulSoup(result,"html.parser");
    # info=soup.find_all("img",class_="infobox vcard")
    # table = soup.find("table", { "class" : "wikitable sortable" })
    tab = soup.find("table", {"class": "infobox vcard"})
    if tab:
        Athlete_bio.append(row[1])
        Athlete_bio.append(row[2])
        rows = tab.findAll("tr");
        img=""
        dob=""
        for i in range(min(10,len(rows))):
            cells= rows[i].findAll("td")
            if len(cells):
                if cells[0].img:
                    if cells[0].img.has_attr("src") and (not img):
                       img=(cells[0].img.get("src")).encode('utf-8')
                if (cells[0].find("span", {"class": "bday"})):
                    dob=cells[0].find("span", {"class": "bday"}).string.encode('utf-8')
                if (cells[0].find({"class": "nickname"})):
                    nickname=cells[0].find({"class": "nickname"}).string.encode('utf-8')
        Athlete_bio.append(img)
        Athlete_bio.append(dob)
        out = open("D:\SCMP\CIS550-Database and Info systems\Project\Athletes_biodb.csv", 'ab')
        mywriter = csv.writer(out)
        mywriter.writerow(Athlete_bio)
        out.close()
        Athletes_bio.append(Athlete_bio)
        time.sleep(1)
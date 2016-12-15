#Scrapes the wikipedia for list of records
import mechanize
from bs4 import BeautifulSoup
import csv
import time

link="https://en.wikipedia.org/wiki/List_of_Olympic_records_in_swimming"
br = mechanize.Browser()
try:
    res = br.open(link)
except (mechanize.HTTPError, mechanize.URLError) as e:
    print "err"

result=res.read()
soup=BeautifulSoup(result,"html.parser");
table = soup.findAll("table", {"class": "wikitable"})
for tab in table:
    if tab:
        rows = tab.findAll("tr")
        for i in range(len(rows)-1):
            cells = rows[i+1].findAll(['th','td'])
            if cells:
                records = []
                for h in range(len(cells)):
                    if h<5:
                        if h==0:
                            event=cells[h].findAll("span")
                            records.append(event[-1].text.encode('utf-8'))
                            records.append(event[-1].find("a").text.encode('utf-8'))
                        elif cells[h].find("a"):
                            records.append(cells[h].find("a").text.encode('utf-8'))
                        elif cells[h].text:
                            records.append(cells[h].text[:-1].encode('utf-8'))
                        else:
                            pass
                out = open("D:\SCMP\CIS550-Database and Info systems\Project\Records_Swimming.csv", 'ab')
                mywriter = csv.writer(out)
                mywriter.writerow(records)
                out.close()
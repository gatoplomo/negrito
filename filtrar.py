import pandas as pd

from pathlib import Path

import os

import requests

import sys


#from flask import Flask
import json 
   

import openpyxl 
  
from openpyxl.chart import LineChart,Reference 


from datetime import date

from openpyxl import Workbook


from openpyxl.chart import (
    LineChart,
    Reference,
)


from openpyxl.chart.axis import DateAxis



# Setup flask server
#app = Flask(__name__) 
  



fecha=sys.argv[1]
b=sys.argv[2]
#c=sys.argv[3]

csv = pd.read_csv(r'C:/Users/DataDog/Documents/GitHub/negrito/Datos2/'+sys.argv[2]+'/'+fecha+'.csv')

df = pd.DataFrame(csv)
df.head()
# displaying the DataFrame
#display(df)

#print(df.iloc[0].date[11:13])

#data=[];



rows = len(df.axes[0])


df2=df.copy()


array=[0]

for i in range(0,rows-1,1):
    if(df.iloc[i].date[11:13] != df.iloc[i+1].date[11:13]):
        array.append(i+1)
#array.append(rows-1)

#print(df)
#print(df2)
#print(array)
df2=df2.iloc[array]
    



df2 = df2.to_json(orient='records')

print(df2)

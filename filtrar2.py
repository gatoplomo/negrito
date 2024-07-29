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

csv = pd.read_csv(r'/home/tom-s-lazo/Documentos/GitHub/negrito/Datos2/'+sys.argv[2]+'/'+fecha+'.csv',parse_dates =["date"], index_col ="date")

df = pd.DataFrame(csv)
df.head()
# displaying the DataFrame
#display(df)


data=[];
#print(len(df))
#print(df)






hola=df['lectura'].resample('10min').sum().rename_axis('date').reset_index()


hola['date'] = hola['date'].dt.strftime('%Y-%m-%d %H:%M:%S')
hola = hola.to_json(orient='records')

print(hola)
import pandas as pd

from pathlib import Path

import os


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
  



a=sys.argv[1]
b=sys.argv[2]
c=sys.argv[3]

csv = pd.read_csv(r'/home/tomas/Escritorio/negrito/Datos2/'+sys.argv[2]+'/'+a+'.csv')

df = pd.DataFrame(csv)
  
# displaying the DataFrame
#display(df)


data=[];

print(df)
print(len(df))

for i in range(len(df)):
    #print(df.loc[i])
    data.append(df.loc[i])

print(data)
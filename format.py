
# importing the modules
from IPython.display import display

import pandas as pd

from pathlib import Path

import os


import sys


a=sys.argv[1]
b=sys.argv[2]

csv = pd.read_csv(r'C:/Users/idcla/Documents/GitHub/propal/datos/'+sys.argv[2]+'/'+a+'.csv')

df = pd.DataFrame(csv)
  
# displaying the DataFrame
display(df)


# create excel writer object
writer = pd.ExcelWriter('C:/Users/idcla/Documents/GitHub/propal/datos/'+sys.argv[2]+'/'+a+'.xlsx')
# write dataframe to excel
df.to_excel(writer)
# save the excel
writer.save()
print('DataFrame is written successfully to Excel File.')



import graph.py

execfile("Script1.py")

cantidad=20;
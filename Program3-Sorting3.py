# Sorting 3
'''
Measure all 6 sorting algorithms by counting the number of compares.
Test on data ranging from size 8 to size 2k, by powers of 2.
Test on random data and on mostly sorted data.
(Make a new function to create mostly sorted data. Have it first call the MakeRandomData function, have Python sort it, then swap the first and last elements.)
Print all this data in organized tables, that you can then copy into Excel spreadsheets for making charts.
You will need to create two data sets, with 1 Excel chart for each.
The first data set and chart should plot Problem Size versus number of Compares when using Random data.
The second data set and chart should plot Problem Size versus number of Compares when using Mostly Sorted data instead of Random data.
To pass off, show the data sets and charts that illustrate compares for random and mostly sorted data. Be prepared to explain what they mean.

It is important to make the charts Log/Log. That is, modify your python code to print the Log of the Problem Size and the Log of the number of Comparisons.
Otherwise it will be really hard to see and interpret the results.
Also, make an effort to organize your python code to reduce repeating code as much as possible.
'''

import random
import numpy as np
import sys

#X = np.array([[-1, -1], [-2, -1], [-3, -2], [1, 1], [2, 1], [3, 2]])
#Y = np.array([1, 1, 1, 2, 2, 2])

from myfunctions import dateToint
from myfunctions import callReq
from pprint import pprint

symbol = input("Please enter Stock Symbol:").upper()
print("Studying " + str(symbol))

req = callReq(symbol, 'timesseries')
req2 = callReq(symbol, 'SMA')

data1 = req.json()['Time Series (Daily)']
data2 = req2.json()['Technical Analysis: SMA']

firstkey = next(iter(data1))

testArr = []
for a in data2:
    if a == firstkey:
        continue
    if a in data1:
        inputArr = []
        varA = int(float(data2[a]['SMA']) * 1000) # 200 day closing Value is 80.1234, change to remove decimal
        varB = int(float(data1[a]['4. close']) * 1000) #closing day value
        inputArr = [varA, varB]
        testArr.append(inputArr)
        #testArr.append(a)
        lastA = a
    else:
        break


print('first: ' + firstkey)
print('Last a: ' + lastA)

print('data1:' + str(len(data1)))
print('testArr:' + str(len(testArr)))

resultArr = []
for b in data2:
    if b == lastA:
        break
    else:
        resultArr.append(int(float(data1[b]['4. close']) * 10000))
        #resultArr.append(b)

print('Labels:' + str(len(resultArr)))
#pprint(resultArr)



#convert f

#pprint(data2)

# counter = 0
# for i in arr1:
#     temp = dateToint(i[0])
#     arr1[counter][0] = int(round(temp))
#     temp2 = float(arr1[counter][1])
#     arr1[counter][1] = int(round(temp2))
#     counter += 1

# k = 0
# for n in arr2:
#     temp = n * 100
#     arr2[k] = int(temp)
#     k += 1


X = np.array(testArr)
Y = np.array(resultArr)

from sklearn.naive_bayes import GaussianNB
clf = GaussianNB()
clf.fit(X, Y)

#get latest 200day closing value and closing day value
inA = input("Today's 200 day closing value (4 decimal points)").upper()
inB = input("Today's Closing value (4 decimal points)").upper()

inA = int(float(inA) * 1000)
inB = int(float(inB) * 1000)

print(clf.predict([[inA, inB]]))
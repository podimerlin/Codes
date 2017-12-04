import requests
import json

# Set the request parameters
url = 'https://stickybra.zendesk.com/api/v2/tickets.json'
user = 'apmdarryn@gmail.com'
pwd = 'S9141636j-'

# Do the HTTP get request
response = requests.get(url, auth=(user, pwd))

# Check for HTTP codes other than 200
if response.status_code != 200:
    print('Status:', response.status_code, 'Problem with the request. Exiting.')
    exit()

# Decode the JSON response into a dictionary and use the data
data = response.json()

tix = data['tickets']

for i in tix:
    print(i['status'])
    sender = i['via']['source']['from']
    if sender.has_key('name') and sender.has_key('address'):
        sName = sender['name']
        sAdd = sender['address']
        tixId = i['id']

        mailContent = (i['description'])

        print('name: ' , sName, '\n')
        print()
        print('email: ' , sAdd, '\n')
        print(mailContent)
        print('\n')


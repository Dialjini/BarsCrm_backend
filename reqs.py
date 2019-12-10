import requests

def getINNinfo(INN):
    auth_token = 'Token 00540a9e422662741a9882ccc4b786e75e367259'

    r = requests.post(url='https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
                      data='{"query": "{0}"}'.format(INN),
                      headers={'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': auth_token})
    print(r.json())
    return r.json()

def dateToint(dateString):
    from datetime import datetime
    from time import mktime

    dt = datetime.strptime(dateString, "%Y-%m-%d")
    ret = mktime(dt.timetuple())
    
    return ret

def callReq(symbol, func):
    import requests
    url    = 'https://www.alphavantage.co/query'
    apikey = 'PEXDLQ8MYRZERXYV'

    if func == 'timesseries':
        #payload = { 'apikey' : apikey, 'function' : 'TIME_SERIES_DAILY', 'symbol' : symbol }
        url += '?apikey=' + apikey + "&function=TIME_SERIES_DAILY&symbol=" + symbol 
    elif func == 'SMA':
        url += '?apikey=' + apikey + '&function=SMA&symbol=' + symbol + '&interval=daily&time_period=60&series_type=close'
    res = requests.get(url)
    return res
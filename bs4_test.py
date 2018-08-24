import re
from bs4 import BeautifulSoup

html_doc = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>

<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
<a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>

<p class="story">...</p>
"""
def run_Demo():
    #创建bs4对象
    soup = BeautifulSoup(html_doc,'html.parser',from_encoding='utf-8')
    
    #搜索全部a
    links = soup.find_all('a')
    for link in links:
        print(link.name,link['href'],link.get_text())
    
    #搜索lacie
    link_code = soup.find('a',href='http://example.com/lacie')
    print(link_code.name,link_code['href'],link_code.get_text())
    #正则匹配
    link_code = soup.find('a',href=re.compile(r'ill'))
    print(link_code.name,link_code['href'],link.get_text())
    #搜索p
    p_codes = soup.find_all('p')
    for p_code in p_codes:
        print(p_code.name,p_code.get_text())

if __name__ == "__main__":
    run_Demo()
        
    

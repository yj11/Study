from socket import *
import sys
import getpass
import os 
import zipfile
import requests
from threading import Thread
from bs4 import BeautifulSoup


def main():
    if len(sys.argv) < 3:
        print('argv is error')
        return
    HOST = sys.argv[1]
    PORT = int(sys.argv[2])
    s = socket()
    s.connect((HOST,PORT))

    while True:
        print('''
            ==========Welcome=========
            --1.注册   2.登录   3.退出--
            ==========================
            ''')
        try:
            cmd = int(input("输入选项(1,2or3)>>"))
        except Exception:
            print("命令错误")
            continue
        if cmd not in [1,2,3]:
            print("请输入正确选项")
            sys.stdin.flush() #清除标准输入
            continue
        elif cmd == 1:
            if do_register(s) == 0:
                print("注册成功!")
            else:
                print("注册失败!")
        elif cmd == 2:
            name = do_login(s)
            if name != 1:
                print("登录成功!")
                login(s,name)
            else:
                print("登录失败!")
        elif cmd == 3:
            s.send(b'E')
            sys.exit("谢谢使用")

def do_register(s):
    while True:
        name = input("User:")
        passwd = getpass.getpass()
        passwd1 = getpass.getpass("Confirm:")
        if (' ' in name) or (' ' in passwd):
            print('用户名或密码不许有空格')
            continue 
        if passwd != passwd1:
            print("密码不一致")
            continue 

        msg = 'R {} {}'.format(name,passwd)
        #发送请求
        s.send(msg.encode())
        #收到回复
        data = s.recv(128).decode()

        if data == 'OK':
            return 0
        elif data == "EXISTS":
            print("用户已存在")
            return 1
        else:
            return 1


def do_login(s):
    name = input("User:")
    passwd = getpass.getpass()
    msg = "L {} {}".format(name,passwd)
    s.send(msg.encode())
    data = s.recv(128).decode()

    if data == 'OK':
        return name
    else:
        print("用户名或密码不正确")
        return 1




        # 二级界面

def login(s,name):
    while True:
        print('''
            ==============查询界面====================
            --1.游戏库   2.全网游戏排名  3.人气   4.返回主页--
            ========================================
            ''')
        try:
            cmd = int(input("输入选项(1,2,3or4)>>"))
        except Exception:
            print("命令错误")
            continue
        if cmd not in [1,2,3,4]:
            print("请输入正确选项")
            sys.stdin.flush() #清除标准输入
            continue
        elif cmd == 1:
            do_query(s,name)
        elif cmd == 2:
            do_rank(s,name)
        elif cmd == 3:
            do_pop(s,name)
        elif cmd == 4:
            main()


def do_query(s,name):

    filename = input("游戏查询:")
    if filename == '##':
        login(s,name)
    msg = 'l {} {}'.format(name,filename)
    s.send(msg.encode())
    data = s.recv(128).decode()
    if data == 'OK':
        print("游戏存在")
        do_download(s,filename,name)
    elif data == 'Fail':
        print("游戏不存在请重新查询")
            

            # 下载
def do_download(s,filename,name):
    while True:
        try:
            choose = input("您是否需要下载游戏(Y/N):")
        except Exception:
            print("命令错误")
            continue
        if choose not in ["Y","N"]:
            print("请输入正确选项")
            sys.stdin.flush() #清除标准输入
            continue
            # 判断是否下载
        elif choose=="N":
            login(s,name)
        elif choose == "Y":
            msg = "G {}".format(filename)
            s.send(msg.encode())
            data=s.recv(1024).decode()
            if data == 'OK':
                print("开始下载")
            # 开始下载游戏
                try:
                    with zipfile.ZipFile("/home/tarena/game/%s"%filename) as zfile:
                        zfile.extractall(path="/home/tarena/game/")
                        print("下载成功")
                        os.system("")
                except zipfile.BadZipFile as e:
                    print (zfile_path+" is a bad zip file ,please check!")
                login(s,name)
            else:
                print("请重新查询")
                do_query(s,name)
        

#游戏排名
def do_rank(s,name):

    url = "http://www.doyo.cn/rank/wangluo/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36"
    }

    request = requests.get(url,params=headers).text
    soup = BeautifulSoup(request,'html.parser')

    nameList = soup.find_all(class_="name")
    for na in nameList:
            print(na.get_text())
    login(s,name)


#人气排名
def do_pop(s,name):
    #url
    url = "http://www.doyo.cn/rank/wangluo/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36"
    }

    request = requests.get(url,params=headers).text
    #用BeatutifulSoup 处理取到的html
    soup = BeautifulSoup(request,'html.parser')

    popList = soup.find_all(class_="popularity")
    for pop in popList:
        print(pop.get_text())
    login(s,name)



if __name__ == "__main__":
    main()

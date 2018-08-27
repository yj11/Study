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
                        zfile.extractall(path="/home/tarena/game")
                        print("下载成功")
                        print("启动游戏")
                        if filename == 'snake.zip':
                            os.system("python3 /home/tarena/game/snake/snake.py")
                        elif filename == 'plane.zip':
                            os.system("python3 /home/tarena/game/plane/plane.py")
                        elif filename == '2048.zip':
                            os.system("python3 /home/tarena/game/2048/2048.py")
                except zipfile.BadZipFile as e:
                    print (zfile_path+" is a bad zip file ,please check!")
                login(s,name)
            else:
                print("请重新查询")
                do_query(s,name)
            # filename=input("请输入文件名:")
            # msg = "G {}".format(filename)
            # s.send(msg.encode())
            # data=s.recv(1024).decode()
            # if data == 'OK':
            #     print("开始下载")

            #     fd = open(filename,'wb')
            #     while True:
            #         data = s.recv(1024)                
            #         if data == b"##":
            #             break                   
            #         fd.write(data)
            #     fd.close()
            #     print("%s 下载完成\n"%filename)
            # #游戏解压缩并自动安装
            #     if filename[-3:]!= "zip":
            #         break
            #     else:
                    #此处只能解压zip格式文件
                    # f = zipfile.ZipFile(filename,"w", zipfile.zlib.DEFLATED)
                    # print("解压成功")
                    # if os.path.isdir(filename+"_files"):
                    #     os.system("filename+'_files'")
                    #     pass
                    # else:
                    #     os.mkdir(filename+"_files")
                    #     for file in f.namelist():
                    #         f.extract(file,filename+"_files/")
                    # f.close()
                    # do_query(s,name)


           
           

            

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


def do_pop(s,name):
    url = "http://www.doyo.cn/rank/wangluo/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36"
    }

    request = requests.get(url,params=headers).text
    soup = BeautifulSoup(request,'html.parser')

    popList = soup.find_all(class_="popularity")
    for pop in popList:
        print(pop.get_text())
    login(s,name)

#def do_history(s,name):
    #while True:
        #word = input("游戏查询:")
        #if word == '##':
            #break

        #msg = 'H {} {}'.format(name,word)
        #s.send(msg.encode())
        #data = s.recv(128).decode()
        #if data == 'OK':
            #启动操作
            #print("启动游戏")
            #os.system(filename)
        #else:
            #print("无法启动")


if __name__ == "__main__":
    main()
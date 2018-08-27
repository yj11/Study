from socket import *
import os
import signal
import time
import pymysql
import sys


#文件库
FILE_PATH="/home/tarena/game/"
HOST='0.0.0.0'
PORT= 8002
ADDR=(HOST,PORT)


#主控制流程
def main():
    #数据库链接
    db=pymysql.connect('localhost','root','123456','dict')
    #创建套接字
    s=socket()
    s.setsockopt(SOL_SOCKET,SO_REUSEADDR,1)
    s.bind(ADDR)
    s.listen(5)

    #忽略子进程退出
    signal.signal(signal.SIGCHLD,signal.SIG_IGN)

    while True:
        try:
            c,addr=s.accept()
            print("Connect from",addr)
        except KeyboardInterrupt as e:
            s.close()
            sys.exit("服务器退出")
        except Exception as e:
            print(e)
            continue

        #创建子进程
        pid=os.fork()
        if pid<0:
            print("create process failed")
            c.close()
        elif pid==0:
            s.close()
            do_child(c,db)
        else:
            c.close()

def do_child(c,db):
    #循环接收请求
    while True:
        data=c.recv(128).decode()
        print("Request:",data)
        if (not data) or data[0] =='E':
            c.close()
            sys.exit(0)
        elif data[0]=='R':
            do_register(c,db,data)
        elif data[0]=='L':
            do_login(c,db,data)
        elif data[0]=='l':
            do_list(c,data)
        elif data[0]=='G':
            filename=data.split(' ')[-1]
            do_get(c,filename)

def do_register(c,db,data):
    l=data.split(' ')
    name=l[1]
    passwd=l[2]
    cursor =db.cursor()
    sql="select name from user where name='%s'"%name
    cursor.execute(sql)
    r=cursor.fetchone()
    if r!=None:
        c.send(b"EXISTS")
        return
    sql="insert into user(name,passwd) values('%s','%s')"%(name,passwd)
    try:
        cursor.execute(sql)
        db.commit()
        c.send(b'OK')
    except:
        c.send(b'FALL')
        db.rollback()
        return
    else:
        print("%s注册成功"%name)

def do_login(c,db,data):
    l=data.split(' ')
    name=l[1]
    passwd=l[2]
    cursor =db.cursor()
    sql="select name,passwd from user where name='%s' and passwd='%s'"%(name,passwd)
    cursor.execute(sql)
    r=cursor.fetchone()
    
    if r==None:
        c.send(b'FALL')
    else:
        c.send(b'OK') 

def do_list(c,data):
    #获取列表
    l=data.split(' ')
    filename=l[2]
    file_list=os.listdir(FILE_PATH)
    count=0
    for file in file_list:
        if filename==file:
            count=1
            break
        else:
            continue
    if count != 0:
        c.send(b'OK')
    else:
        c.send(b'Fail')
    #c.send(files.encode())

def do_get(c,filename):
    
    fd=open(FILE_PATH+filename,'rb')

    c.send(b"OK")
    time.sleep(0.1)

    while True:
        data=fd.read(1024)
        c.send(data)
        if not data:
            time.sleep(0.1)
            c.send(b"##")
            break
        c.send(data)
    print("文件发送完成")

if __name__=="__main__":
    main()      

from socket import *  
import os,sys 

#登录
def do_login(s,user,name,addr):
    if (name in user) or name == "管理员":
        s.sendto("该用户存在".encode(),addr)
        return
    s.sendto(b'OK',addr)
    #通知其他人
    msg = "\n欢迎　%s 进入聊天室"%name 
    for i in user:
        s.sendto(msg.encode(),user[i])
    #插入用户
    user[name] = addr

#聊天
def do_chat(s,user,name,text):
    msg = "\n%-4s 说:%s"%(name,text)
    for i in user:
        if i != name:
            s.sendto(msg.encode(),user[i])

#退出
def do_quit(s,user,name):
    del user[name]
    msg = '\n' + name + "离开了聊天室"
    for i in user:
        s.sendto(msg.encode(),user[i])

#用来处理客户端请求
def do_child(s):
    #存储结构　｛'zhangsan':('172.60.50.51',4576)｝
    user = {}

    #循环接受请求并处理
    while True:
        msg,addr = s.recvfrom(1024)
        msgList = msg.decode().split(' ') 

        #识别请求类别进行处理
        if msgList[0] == 'L':
            do_login(s,user,msgList[1],addr)
        elif msgList[0] == 'C':
            do_chat(s,user,msgList[1],\
                ' '.join(msgList[2:]))
        elif msgList[0] == 'Q':
            do_quit(s,user,msgList[1])

def do_parent(s,addr):
    while True:
        msg = input("管理员消息:")
        msg = 'C 管理员 ' + msg
        s.sendto(msg.encode(),addr)

# 创建套接字，创建链接，创建父子进程　功能函数调用
def main():
    #server address 
    ADDR = ('0.0.0.0',8888)
    #创建套接字　
    s = socket(AF_INET,SOCK_DGRAM)
    s.setsockopt(SOL_SOCKET,SO_REUSEADDR,1)
    s.bind(ADDR)

    #创建父子进程，分别处理请求和发送管理员消息
    pid = os.fork()

    if pid < 0:
        sys.exit("创建进程失败")
    elif pid == 0:
        #执行子进程功能
        do_child(s)
    else:
        #执行父进程功能
        do_parent(s,ADDR)

if __name__ == "__main__":
    main()
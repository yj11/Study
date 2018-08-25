from socket  import * 
import sys,os 
import signal 

#发送请求
def do_child(s,name,addr):
    while True:
        text = input("发言(quit退出):")
        #退出
        if text.strip() == 'quit':
            msg = 'Q ' + name 
            s.sendto(msg.encode(),addr)
            #从子进程中杀死父进程
            os.kill(os.getppid(),signal.SIGKILL)
            sys.exit("退出聊天室")
        #聊天
        else:
            msg = "C %s %s"%(name,text)
            s.sendto(msg.encode(),addr)

#接受服务器所有消息
def do_parent(s):
    while True:
        msg,addr = s.recvfrom(1024)
        print(msg.decode() + "\n发言(quit退出):",end="")

#创建套接字，创建父子进程，登录
def main():
    if len(sys.argv) < 3:
        print("argv is error")
        return 

    HOST = sys.argv[1]
    PORT = int(sys.argv[2])
    ADDR = (HOST,PORT)

    s = socket(AF_INET,SOCK_DGRAM)

    #启动客户端即需要登录
    while True:
        name = input("请输入姓名:")
        msg = "L " + name 
        #发送登录请求
        s.sendto(msg.encode(),ADDR)
        #判断是否可以登录
        data,addr = s.recvfrom(1024)
        if data.decode() == 'OK':
            print("@进入聊天室@")
            break
        else:
            #不能登录的原因
            print(data.decode())
    
    #创建父子进程用于发送和接受消息
    pid = os.fork()
    if pid < 0:
        sys.exit("创建子进程失败")
    elif pid == 0:
        do_child(s,name,ADDR)
    else:
        do_parent(s)



if __name__ == "__main__":
    main()
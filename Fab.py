# -*- coding: utf-8 -*-
"""
Created on Thu Jul 12 14:30:29 2018

@author: Administrator
"""

#1，1，2，3，5，8，13，21，34...
#f(n) = f(n-1)+f(n-2) n >= 2
#       1             n >= 0 n为自然数
def fab2(n):    
    # 给斐波那契数列的前两个元素赋初值
    # 同时利用index记录循环进行的下标位置
    index, a, b = 0,1,1 
    while index < n-2:
        a, b = b, a+b # 这里b的值等于f(n)
        index += 1
    return b   
##TODO:
##思考???：用yield(协程)来重新实现一遍这个方法???

for i in range(1,11):
    print(fab2(i))




        
        
        
        
        
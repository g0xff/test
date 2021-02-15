import gc
import sys
import math
import time
import copy
import scipy
import random

#gc.disable()

def win(a,p=1):
    lines = [
        slice(0,3,1),
        slice(3,6,1),
        slice(6,9,1),
        slice(0,9,3),
        slice(1,9,3),
        slice(2,9,3),
        slice(0,9,4),
        slice(2,7,2)
    ]

    for r in lines:
        if a[r] == [p,p,p]:
            return True
    return False

def tdex(aa):
    return int(''.join(map(str,aa)),3)

def bdex(aa):
    return int(''.join(map(str,aa)),2)

def dto(n,b=2,r=''):
    while n > 0:
        r = str(n%b) + r
        n //= b
    return [r,'0'][r=='']

def amean(a):
    r = 0
    cnt = 0
    for i in a:
        if i>0:
            r += i
            cnt += 1
    if cnt>0:
        return r/cnt
    else:
        return 0    

def onlyNum(aa,num):
    for i in aa:
        if i!=num:
            return True
    return False


def view(aa,bb):
    aa = list(dto(aa))
    bb = list(dto(bb))    
    aa = ['0']*(9-len(aa)) + aa
    bb = ['0']*(9-len(bb)) + bb    
    for i,n in enumerate(bb):
        if n=='1':
            aa[i] = '2'
    print(*['\n']+[n if i%3 else n+'\n' for i,n in enumerate(aa,1)], file=sys.stderr)
    pass

def bgo(aa):
    nb = bdex(aa)
    if win(aa,1): 
        tawin.append(nb)
        return 0

    for i in range(9):
        if aa[i]==0:
            bb = aa.copy()
            bb[i] = 1
            bgo(bb)

    return 0 

# ----- Main Function

def mmres(aa, bb):

    fb = ~(aa|bb)

    if fb == -1:
        return [2,2,2,2,2,2,2,2,2]
    elif isaFirsMove[aa] and bb==0:
        return aFirsMove[aa]
    elif isbFirsMove[bb] and aa==0:
        return bFirsMove[bb]

    res = [0,0,0,0,0,0,0,0,0]
    for i in range(9):
        if fb & (1<<i):

            cc = aa+(1<<i)
            if awin[cc]:
                res[i] = 5
                continue
            dd = bb+(1<<i)
            if awin[dd]:
                res[i] = 4
                continue


            n = mimax(bb,cc,1)
            res[i] = n

    return res[::-1]

def mimax(aa, bb, p):

    fb = ~(aa|bb)
    if fb==-512:
        return 2

    if p:
        best = 3
    else:
        best = 1

    for i in range(9):
        if fb & (1<<i):

            cc = aa+(1<<i)
            if p:
                if awin[cc]:
                    return 1

                n = mimax(bb,cc,0)

                if n == 1:
                    best = n
                    break
                elif n == 2:
                    best = n
            else:
                if awin[cc]:
                    return 3
                
                n = mimax(bb,cc,1)

                if n == 3:
                    best = n
                    break
                elif n == 2:
                    best = n
    return best


def fOldmimax(main, gc, p, c, st):

    if int(time.time()*1000-st)>90:
         return -1

    if c>2:
        return 1
    np = not p
    fb = ~(main[gc][p]|main[gc][np])
    if fb==-512:
        return 2

    if p:
        best = 3
    else:
        best = 1

    for i in range(9):
        if (fb & (1<<i)) and (not awin[main[gc][p]]):

            tmain = copy.deepcopy(main)
            tmain[gc][p] = main[gc][p]+(1<<i)

            if p:
                if awin[tmain[gc][p]]:
                    return 1

                n = fmimax(tmain, i, 0, c+1, st)
                if n == 1:
                    best = n
                    break
                elif n == 2:
                    best = n
                elif n==-1:
                    t = 0
            else:
                if awin[tmain[gc][p]]:
                    return 3
                
                n = fmimax(tmain, i, 1, c+1, st)
                if n == 3:
                    best = n
                    break
                elif n == 2:
                    best = n
                elif n==-1:
                    t = 0

    return best


def fmimax(main,gc,p,c,cntAll):

    #viewFull(main)
    #time.sleep(1)
    cntAll[0] += 1 #10%
    if c>7 or cntAll[0]>10000:
            return 2


    np = not p
    fb = ~(main[gc][p]|main[gc][np])
    if fb==-512:
        return 2.1

    if p:
        if 7 in (main[gc][p], main[gc][np]):
            return 0
        best = 3.1
    else:
        if 7 in (main[gc][p], main[gc][np]):
            return 4
        best = 0.9

    for i in range(9):
        if fb & (1<<i):

            save = main[gc][p]
            main[gc][p] = main[gc][p] + (1<<i)

            if p:
                if awin[main[gc][p]]:
                    best = 1
                    main[gc][p] = 7

                    if win([main[j][1]==7 for j in range(9)],1):
                        return -1
                        #todo проверка на глобал выигрыш

                n = min(fmimax(main, 8-i, 0, c+1,cntAll), best)
            else:
                if awin[main[gc][p]]:
                    best = 3
                    main[gc][p] = 7

                    if win([main[j][0]==7 for j in range(9)],1):
                        return 5


                n = max(fmimax(main, 8-i, 1, c+1,cntAll), best)
           
            main[gc][p] = save

    return best


# ----- Secondary functions

def one_move(aa, mBoard, vac):
    for i in range(vac):
        for j in input():
            tmp = 0
    mBoard[4][4] = 1
    #aa[0] = bdex(mBoard[0][::-1])
    aa[4] = bdex(mBoard[4])    
    print(4,4)
    return True



# ----- DB
tawin = []
bgo([0,0,0,0,0,0,0,0,0])
tawin = list(set(tawin))

awin = [False]*513
for i in tawin:
    awin[i] = True

bFirsMove = [[1]*9 for i in range(513)]
isbFirsMove = [False]*513
aFirsMove = [[1]*9 for i in range(513)]
isaFirsMove = [False]*513

for i in range(9):
    agc = mmres(0,bdex('1'+'0'*i))[::-1]
    tm = max(agc)
    for j,n in enumerate(agc):
        if n==tm:
            bFirsMove[int('1'+'0'*i,2)][j] = tm
            bFirsMove[int('1'+'0'*i,2)][8-i] = 0            
            isbFirsMove[int('1'+'0'*i,2)] = True            
for i in range(9):
    agc = mmres(bdex('1'+'0'*i),0)
    tm = max(agc)
    for j,n in enumerate(agc):
        if n==tm:
            aFirsMove[int('1'+'0'*i,2)][j] = tm
            aFirsMove[int('1'+'0'*i,2)][8-i] = 0            
            isaFirsMove[int('1'+'0'*i,2)] = True        


def maxNonNullInx(aa):
    rmax = -8
    for i,n in enumerate(aa):
        if n>rmax and n!=0:
            rmax = i
    return abs(rmax)


def fscan(aa,bb,atgc,btgc,gc,room,st):
    res = [0,0,0,0,0,0,0,0,0]
    agc = mmres(aa[gc],bb[gc])

    for i,n in enumerate(agc):
        if n>0:
            if n==5:
                if atgc[gc]==5:
                    res[i] = 99
                    continue                    

            if atgc[gc]==0:
                res[i] = 6-max(btgc)
                continue

            res[i] = n

    resBreak = res.copy()
    for i,n in enumerate(res):
        if int(time.time()*1000-st)>(40-room*20):
            return resBreak
            break

        if n>0 and atgc[i]>0 and btgc[i]>0:

            
            aat = aa.copy()
            aat[gc] = aat[gc]+(1<<(8-i))
            atgct = atgc
            if awin[aat[gc]]:
                atgct = atgc.copy()
                atgct[gc] = 1


            if room%2>0:
                resGo = max(fscan(bb,aat,btgc,atgct,i,room+1,st))
                if resGo>0:
                    res[i] = resGo
            else:
                resGo = sorted(fscan(bb,aat,btgc,atgct,i,room+1,st)) #min, todo optimization
                for j in resGo:
                    if j>0:
                        res[i] = j
                        break
    else:
        print('room #',room, file=sys.stderr, end=' ')                    

    return res


def scanGo(aa,bb,atgc,btgc,gc,room,st):
    res = {}
    bgc = [[0] for _ in range(9)]
    aabgc = [[0] for _ in range(9)]
    #bbT = bb[gc]+(1<<(8-gc))
    agc = mmres(aa[gc],bb[gc])

    for i,n in enumerate(agc):
        if n>0:
            if n==5:
                if atgc[gc]==5:
                    res[i] = 99
                    return [res.get(round(i,3),0) for i in range(9)]
            if i==gc:  
                aaNow = aa[i]+(1<<(8-i))                       
                bgc[i] = mmres(bb[i],aaNow)
                aabgc[i] = mmres(aaNow,bb[i])
            else:
                bgc[i] = mmres(bb[i],aa[i])
                aabgc[i] = mmres(aa[i],bb[i])                    

    for i,n in enumerate(agc):
        if n>0:
            if i==gc:
                gm = 0 if n==5 else btgc[i]
                ga = 0 if n==5 else btgc[i]
            else:          
                gm = atgc[i]
                ga = btgc[i]


            if ga==0: 
                ga = max(btgc)
                if ga==5:
                    la = max(bgc[btgc.index(5)])
                    if max(j)==5: la = 9
                else:
                    la = max(max(j) for j in bgc)                    
            elif ga==5:
                la = max(bgc[i])                
                if la==5: la = 9
            else:
                la = max(bgc[i])                

            #if ga==4:
            #    ga = 7                        

           
            res[i] = [n+atgc[gc],la+ga]            
            #res[i] = (n+atgc[gc]) / (la+ga) 

    resList = [0,0,0,0,0,0,0,0,0]
    for i in range(9):
        rt = res.get(i,[0,0])
        if sum(rt)>0:
            resList[i] = round(rt[0]/rt[1],3)
            #resList[i] = rt[0] - rt[1] + 0.1

    return resList    
    #return [round(res.get(i,0),3) for i in range(9)]              



def scan(aa,bb,atgc,btgc,gc,debug=True,st=0):
    res = {}
    bgc = [[0] for _ in range(9)]
    aabgc = [[0] for _ in range(9)]
    agc = mmres(aa[gc],bb[gc])

    #maxAtgc = max(atgc)

    atmp = []

    #if debug:
        #print(aa[gc],bb[gc],agc, file=sys.stderr) 
        #print(atgc,btgc, file=sys.stderr)         

    for i,n in enumerate(agc):
        if n>0:
            if n==5:
                if atgc[gc]==5:
                    res[i] = 99
                    return [res.get(round(i,3),0) for i in range(9)]

            if i==gc:  
                aaNow = aa[i]+(1<<(8-i))                       
                bgc[i] = mmres(bb[i],aaNow)
                aabgc[i] = mmres(aaNow,bb[i])
            else:
                bgc[i] = mmres(bb[i],aa[i])
                aabgc[i] = mmres(aa[i],bb[i])                    



    for i,n in enumerate(agc):
        if n>0:
            if i==gc:
                # если я захватил эту точку и сюдаже ссылаюсь, то в ноль
                gm = 0 if n==5 else btgc[i]
                ga = 0 if n==5 else btgc[i]
            else:          
                gm = atgc[i]
                ga = btgc[i]


            la = max(bgc[i])


            if ga==0: 
                ga = max(btgc)
                if ga==5:
                    la = max(bgc[btgc.index(5)])
                    if la==5: la = 9
                else:
                    la = max(max(j) for j in bgc)                    
            elif ga==5:
                la = max(bgc[i])                
                if la==5: la = 9
            else:
                la = max(bgc[i])  
            #if ga==4:
            #    ga = 7


            #res[i] = (n+atgc[gc]) / (la+ga+max(resGo)*3)
            #res[i] = (n+atgc[gc]) / (la+ga)            
            res[i] = [n+atgc[gc],la+ga]


            #print(i,'go:',resGo, file=sys.stderr)

            atmp.append('{}\{}. ({}+{}) / ({}+{}) = {} - {}'.format(
                i, gc, n, atgc[gc], la, ga, round(res[i][0],1), bgc[i]
            ))                

    #print('Oтклик:',int(time.time()*1000-st), file=sys.stderr)
    #if debug:
    #    print(*atmp, file=sys.stderr, sep='\n')                        
        #print('Счет[',gc,']:',res, file=sys.stderr)

    resBreak = res.copy()

    resList = [0,0,0,0,0,0,0,0,0]
    for i in range(9):
        rt = res.get(i,[0,0])
        if sum(rt)>0:
            resList[i] = round(rt[0]/rt[1],3)

    return resList

    print('\n-Результат:',resList, file=sys.stderr)    
    print('-Результат:',res, file=sys.stderr)        

    main = [[0,0] for i in range(9)]
    for i in range(9):
        main[i] = [aa[i],bb[i]]



    for i in sorted(res, key=res.get):
        if int(time.time()*1000-st)>90:
            resList = [0,0,0,0,0,0,0,0,0]
            for i in range(9):
                rt = resBreak.get(i,[0,0])
                if sum(rt)>0:
                    resList[i] = round(rt[0]/rt[1],3)
            return resList
            #return [round(resBreak.get(i,0),3) for i in range(9)]            
            print(i,'timeout',sorted(res, key=res.get), file=sys.stderr, end=' ')            
            break
        if sum(res[i])>0 and  atgc[i]>0 and btgc[i]>0 and debug:

            p = 0
            cntAll = [0]
            fb = ~(main[gc][0]|main[gc][1])
            cntAll = [0]
            if fb & (1<<i):
           
                aat = aa.copy()
                aat[gc] = aat[gc]+(1<<(8-i))
                atgct = atgc
                if awin[aat[gc]]:
                    atgct = atgc.copy()
                    atgct[gc] = 1

                resGo = max(scanGo(bb,aat,btgc,atgct,i,0,st))
                resGo = max(scanGo(bb,aat,btgc,atgct,i,0,st))
                if resGo>0:
                    res[i][1] += resGo
                    res[i][1] = resGo+0.01
                    print(round(res[i][0],3),'/',round(resGo,3), file=sys.stderr)
    resList = [0,0,0,0,0,0,0,0,0]
    for i in range(9):
        rt = res.get(i,[0,0])
        if sum(rt)>0:
            resList[i] = round(rt[0]/rt[1],3)            
            #resList[i] = rt[0] - rt[1] + 0.1

    return resList
    #return [round(res.get(i,0),3) for i in range(9)]   
    #return [round(res.get(i,0),3) for i in range(9)]


# ----------------------------------------------------------

cntMove = 0

isgY = [0,0,0,1,1,1,2,2,2]
isgX = [0,1,2,0,1,2,0,1,2]

aa  = [0,0,0,0,0,0,0,0,0]
bb  = [0,0,0,0,0,0,0,0,0]
mmBoard  = [0,0,0,0,0,0,0,0,0]
amBoard  = [0,0,0,0,0,0,0,0,0]
mBoard = [[0]*9 for _ in range(9)]
aBoard = [[0]*9 for _ in range(9)]

while True:
    isAll = False
    cntMove += 1
    oy, ox = [int(i) for i in input().split()]
    vac = int(input())
    st = time.time() * 1000    

    if oy<0:
        isAll = one_move(aa, mBoard, vac)
        continue
    elif vac>9:
        isAll = True

    gy = oy//3
    gx = ox//3   
    gc = gy*3 + gx  
    ogc = (oy%3)*3+ox%3    
   
    aBoard[gc][ogc] = 1
    #bb[gc] = bdex(aBoard[gc][::-1])
    bb[gc] = bdex(aBoard[gc])    
    if win(aBoard[gc]):
        amBoard[gc] = 1 #не трогать, все прально тут
        bb[gc] = 7

    if amBoard[ogc] == 1 or mmBoard[ogc] == 1:
        isAll = True

    
    for i in range(vac):
        row, col = [int(j) for j in input().split()]


    gy = row//3
    gx = col//3    
    gc = gy*3 + gx


    aac = bdex(mmBoard)
    bbc = bdex(amBoard)


    #print(mmres(128,0), file=sys.stderr)

 
    atgc = mmres(aac,bbc)
    btgc = mmres(bbc,aac)        


    if isAll:
        score = [[0] for i in range(9)]
        for i in range(9):
            if mmBoard[i]==0 and amBoard[i]==0:
                if cntMove>20:
                    score[i] = scan(aa,bb,atgc,btgc,i,True,st)
                else:
                    score[i] = scan(aa,bb,atgc,btgc,i,False,st)
        
        gcScore = [max(j) for j in score]
        gc = gcScore.index(max(gcScore))
        inx = score[gc].index(max(score[gc]))
        #inx = maxNonNullInx(score[gc])

        gy = isgY[gc]
        gx = isgX[gc]

        print('Результат:',score, file=sys.stderr)
        #print('score end',gc,inx,gcScore,'\n',score[gc], file=sys.stderr)
    else:
        score = scan(aa,bb,atgc,btgc,gc,True,st)
        inx = score.index(max(score))
        #inx = maxNonNullInx(score)

        print('Результат:',score, file=sys.stderr)

    
    # testing fmimax
    if int(time.time()*1000-st)<90 and cntMove>1000:
        mainTest = [[0,0] for i in range(9)]
        for i in range(9):
            mainTest[i] = [aa[i],bb[i]]
        
        resTest = [0]*9
        for i in range(9):
            if mBoard[gc][i//3+i%3]==0 and aBoard[gc][i//3+i%3]==0:
                resTest[i] = fOldmimax(mainTest, gc, 1, 0,st)

        print('-------','\n',resTest,mBoard[gc],mainTest, file=sys.stderr)
    

    my = inx//3
    mx = inx%3


    mBoard[gc][my*3+mx] = 1
    aa[gc] = bdex(mBoard[gc])   

    if win(mBoard[gc]):
        mmBoard[gc] = 1
        aa[gc] = 7

    # -----  Testing time code:
    #stt = time.time() * 1000
    #print('Test time code:',int(time.time()*1000-stt), file=sys.stderr)

    #print(vac, file=sys.stderr)

    my = my+gy*3
    mx = mx+gx*3
    print(my,mx,'Время отклика',int(time.time()*1000-st), file=sys.stderr)
    print(my,mx) 

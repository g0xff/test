#намудренная ТОП10 в серебре

import sys
import math
import time
import numpy as np
import random

st = int(round(time.time() * 1000))

def dsqr(ay,ax,by,bx):
    return math.sqrt((ax - bx)**2 + (ay - by)**2) 

def viewMap(mm):
    res = ''
    for i in mm:
        for j in i:
            if j<-90: res += ' x '
            elif j==0: res += '   '
            elif type(j)==list and len(j)>0: res += ' '+str(len(j)-1)+' '
            elif j>0 and j<10:  res += ' '+str(int(j))+' '
            elif j>1999:  res += '*'+str(int(j//2000))+' '              
            elif j>199:  res += '-'+str(int(j//20))                       
            elif j>90:  res += '-'+str(int(j//20))+' '
            elif j>9:  res += str(int(j))+' '
            elif j<-10:  res += ' . '
            else: res += ' , '            
        res += '\n'
    print(res, file=sys.stderr)

def sumVert(g):
    aa = np.zeros(g.shape)
    for i,n in enumerate(g):
        for j,m in enumerate(n):
            if type(m)==list and len(m)>0:
                if len(m)==4: aa[i,j] = 2
                elif len(m)==5: aa[i,j] = 2
                elif len(m)==1: aa[i,j] = 1
                else: aa[i,j] = 2
            else:
                aa[i,j] = 0                
    return aa


def bfsByMax(ny,nx,aa,g):
    eith = {}
    p = 0    
    for y,x in g[ny,nx][1:]:
        p = aa[y,x]
        eith[p] = [y,x]
    return (eith[max(eith)],p)
def bfsByMin(ny,nx,aa,g):
    eith = {}
    p = 0
    for y,x in g[ny,nx][1:]:
        if aa[y,x]>0:
            p = int(aa[y,x]*100)
            eith[p] = [y,x]
    if len(eith)==0: 
        eith[1] = [y,x]
    return (eith[min(eith)],p)

def bfcGraph(h,w,aa,transit=True):
    """ 
        transit = True - с конца в начало и обратно., False - есть границы
        aa - матрица h на w, где -99 - это стенка, остальное list переходами
    """ 
    g = np.zeros((h,w),dtype='object')
    for y,n in enumerate(aa):
        for x,m in enumerate(n):
            if aa[y,x]<-90: continue        
            g[y,x] = [[0,0]]
            for i,j in (-1,0),(1,0),(0,-1),(0,1):
                yn = y+i
                xn = x+j
                if yn>height-1 and transit: yn=0
                if xn>width-1 and transit:  xn=0
                if yn<0 and transit: yn = height-1
                if xn<0 and transit: xn = width-1            
                if aa[yn,xn]==0:
                    g[y,x].append([yn,xn])
    return g 

def bfcВepth(stak,aa,g,direct=0,maxFloor=50,floor=0,ixStak=0,res=0):
    isv = {}
    while stak[ixStak:] and floor<maxFloor:
        y,x,floor = stak[ixStak]
        _cxy = y*1000+x        
        ixStak += 1

        isv[_cxy] = isv.get(_cxy,0) + 1
        if isv[_cxy]<2 and aa[y,x]>=0: 
            res += aa[y,x]
            floor += 1
            aa[y,x] = 0
            r = bfsByMax(y,x,aa,g)
            stak.append([r[0],r[1],floor])
            #for sy,sx in g[y,x][1:]:
            #stak.append([sy,sx,floor])
    return res    

def bfc(stak,aa,g,direct=0,maxFloor=50,floor=0,ixStak=0,coefPoint=0):
    # direct - с чего начинать считать ход
    # maxFloor - сколько макс этажей можно пройти
    # stak = [[my,mx,0]]
    isv = {}
    while stak[ixStak:] and floor<maxFloor:
        y,x,floor,point = stak[ixStak]        
        _cxy = y*1000+x        
        ixStak += 1

        isv[_cxy] = isv.get(_cxy,0) + 1
        if isv[_cxy]<2:
            aa[y,x] = abs(direct+floor)
            floor += 1
            for sy,sx in g[y,x][1:]:
                stak.append([sy,sx,floor,aa[y,x]]) 
    return (aa,floor)  

def bfcSum(stak,aa,g,direct=0,maxFloor=50,floor=0,ixStak=0):
    isv = {}
    bb = np.array(aa)
    while stak[ixStak:] and floor<maxFloor:
        y,x,floor,sy,sx = stak[ixStak]        
        _cxy = y*1000+x        

        isv[_cxy] = isv.get(_cxy,0) + 1
        if isv[_cxy]<2:
            floor += 1
            for sy,sx in g[y,x][1:]:
                stak.append([sy,sx,floor,y,x])
        else:
            stak[ixStak] = [0,0,0,0,0]
        ixStak += 1
    
    ixStak -= 1
    aa = np.zeros(aa.shape)
    while ixStak>0:
        y,x,floor,sy,sx = stak[ixStak]
        if bb[y,x]>0:
            t = (floor+aa[y,x])/(bb[y,x]*2)
            aa[y,x] = t
            aa[sy,sx] += t
        else:
            aa[sy,sx] = aa[y,x]
        ixStak -= 1   
        #if floor>20: print(y,x,':',sy,sx,'room:',floor,'sum:',aa[sy,sx])
    return aa

def bfcSum1(stak,aa,g,direct=0,maxFloor=50,floor=0,ixStak=0):
    isv = {}
    bb = np.array(aa)
    while stak[ixStak:] and floor<maxFloor:
        y,x,floor,sy,sx = stak[ixStak]        
        _cxy = y*1000+x        

        isv[_cxy] = isv.get(_cxy,0) + 1
        if isv[_cxy]<2:
            floor += 1
            for sy,sx in g[y,x][1:]:
                stak.append([sy,sx,floor,y,x])
        else:
            stak[ixStak] = [0,0,0,0,0]
        ixStak += 1
    
    mF = floor*2
    ixStak -= 1
    aa = np.zeros(aa.shape)
    while ixStak>0:
        y,x,floor,sy,sx = stak[ixStak]
        chek = bb[y,x]
        bb[y,x] = -99 # чтоб небыло хвостов.
        if chek==-99:
            ixStak -= 1               
            continue
        elif chek>0:
            aa[y,x] = (floor+aa[y,x])/(2*chek)
            for sy,sx in g[y,x][1:]:
                if bb[y,x]!=-99:
                    if aa[sy,sx]>0:
                        aa[sy,sx] = (aa[sy,sx]+aa[y,x])/2
                    else:
                        aa[sy,sx] = aa[y,x]
        elif chek<0:
            aa[y,x] = mF - floor
            for sy,sx in g[y,x][1:]:
                if bb[y,x]!=-99:                
                    if aa[sy,sx]>0:
                        aa[sy,sx] = (aa[sy,sx]+aa[y,x])/2
                    else:
                        aa[sy,sx] = aa[y,x]            
        else:
            if floor>0 and aa[y,x]>0:
                for sy,sx in g[y,x][1:]:
                    aa[sy,sx] = aa[y,x]
            
        ixStak -= 1 
    ixStak = 0
    while stak[ixStak:]:
        y,x,floor,sy,sx = stak[ixStak]
        if aa[y,x] == 0:
            aa[y,x] = aa[sy,sx]
        ixStak += 1          
    return aa

def bfcMain(stak,aa,g,direct=0,maxFloor=50,floor=0,ixStak=0,coef=2):
    isv = {}
    while stak[ixStak:] and floor<maxFloor:
        y,x,floor,sy,sx = stak[ixStak]        
        _cxy = y*1000+x        
        isv[_cxy] = isv.get(_cxy,0) + 1
        if isv[_cxy]<2:
            aa[y,x] = abs(direct+floor+coef)
            floor += 2 # 2 - чтобы меньше границы между друг другом были
            for sy,sx in g[y,x][1:]:
                stak.append([sy,sx,floor,y,x])
        else:
            stak[ixStak] = [0,0,0,0,0]
        ixStak += 1
    return aa

def bfcSumPointA(stak,aa,g,maxFloor=50,floor=0,ixStak=0):
    isv = {}
    point = stak[0][3]
    while stak[ixStak:] and floor<maxFloor:
        y,x,floor,point = stak[ixStak]        
        _cxy = y*1000+x        
        isv[_cxy] = isv.get(_cxy,0) + 1
        if isv[_cxy]<2:
            if aa[y,x]==0: point = point*0.7 #test, возможно убрать надо.            
            point = aa[y,x]+point
            if aa[y,x]>0: aa[y,x] = point
            floor += 1
            for sy,sx in g[y,x][1:]:
                stak.append([sy,sx,floor,point])
        else:
            stak[ixStak] = [0,0,0,0,0]
        ixStak += 1
    return aa
def bfcSumPointB(stak,iy,ix,aa,g,maxFloor=50,floor=0,ixStak=0):
    isv = {}
    point = stak[0][3]
    while stak[ixStak:] and floor<maxFloor:
        y,x,floor,point = stak[ixStak]
        if y==iy and x==ix: break        
        _cxy = y*1000+x        
        isv[_cxy] = isv.get(_cxy,0) + 1
        if isv[_cxy]<2:
            #if y==1 and x==29:
            #    print(aa[y,x],floor,point,file=sys.stderr)
            #if aa[y,x]==0: point *= 0.5
            point = aa[y,x]+point
            aa[y,x] = point
            floor += 1
            for sy,sx in g[y,x][1:]:
                stak.append([sy,sx,floor,point])

        else:
            stak[ixStak] = [0,0,0,0,0]
        ixStak += 1
    return aa    

def bfcDist(stak,g,maxFloor=10,ixStak=0,floor=0):
    isv = {}
    dy = stak[0][3]
    dx = stak[0][4]    
    while stak[ixStak:] and floor<maxFloor:
        y,x,floor,py,px = stak[ixStak]; ixStak += 1        
        isv[y*1000+x] = isv.get(y*1000+x,0) + 1
        if isv[y*1000+x]>1: continue

        for sy,sx in g[y,x][1:]:
            stak.append([sy,sx,floor+1,y,x])
            if sy==dy and sx==dx:
                return (floor+1,y,x,py,px)
    return (0,0,0,0,0) 
def bfcMoveMax(stak,aa,g,maxFloor=3):
    isv = {}    
    ixStak = 0
    floor = 0
    maxStak = 0
    maxPoint = 0
    #print(stak,file=sys.stderr)    
    #bb = np.zeros(aa.shape)
    for i in range(len(stak)-1):    
        y = stak[i][0]
        x = stak[i][1]
        isv[y*1000+x] = isv.get(y*1000+x,0) + 1
        aa[y,x] = stak[i][3]
        maxPoint = stak[i][3]
        maxStak = i        
        ixStak = i                        
    while stak[ixStak:]:
        y,x,floor,point = stak[ixStak]
        isv[y*1000+x] = isv.get(y*1000+x,0) + 1
        if isv[y*1000+x]<2 and floor<maxFloor:
            #if aa[y,x]<0: aa[y,x] = 0
            point = point+aa[y,x]
            #print(point,aa[y,x],y,x,floor,maxPoint,maxStak,ixStak,file=sys.stderr)                
            aa[y,x] = point
            #bb[y,x] = point
            if point>maxPoint:
                maxStak = ixStak
                maxPoint = point
            for sy,sx in g[y,x][1:]:
                stak.append([sy,sx,floor+1,point+1])
        ixStak += 1  
    #viewMap(bb)      
    return stak[maxStak]




# Формируем граф и начальную матрицу лабиринта.
pacLoc = {}
predFoe = []
akmn = {'ROCK':'PAPER','PAPER':'SCISSORS','SCISSORS':'ROCK'}                            
width, height = [int(i) for i in input().split()]
aMain = np.zeros((height,width), dtype=int)
for i in range(height):
    aMain[i] = [-99 if i=='#' else 0 for i in input()]
G = bfcGraph(height,width,np.array(aMain))
aMain[aMain==0] = 1
aMain[aMain==-99] = 0
asVert = sumVert(G)
#allPoint = aMain.sum()
#minVPoint = allPoint*0.7 # 2 чтоб отключить
#viewMap(asVert)

while True:
    if st==0: st = int(round(time.time() * 1000))

    ap = {}
    aa = {}
    am = {}
    result = ''    
    players = []
    aRaund = np.array(aMain)

    my_score, opponent_score = [int(i) for i in input().split()]
    visible_pac_count = int(input()) 
    for i in range(visible_pac_count):
        pac_id, mine, x, y, type_id, speed_turns_left, ability_cooldown = input().split()
        mine = int(mine)
        y = int(y)
        x = int(x)
        if type_id!='DEAD':
            players.append([int(pac_id),y,x,mine,int(speed_turns_left),int(ability_cooldown),type_id,[]])
        aMain[y,x] = 0
        aRaund[y,x] = 0
    #print('Player:',players, file=sys.stderr)        

    visible_pellet_count = int(input())
    for i in range(visible_pellet_count):
        x, y, value = [int(j) for j in input().split()]
        aRaund[y,x] = value
        ap[y*1000+x] = value*3

    #allPoint -= visible_pac_count
    #if minVPoint>allPoint:
    #    asVert = np.ones(aMain.shape)

        
    #print('Поинты:',ap, file=sys.stderr)

    # for pl in players: #Нулим рядом стоящии координаты
    #     if pl[3]!=0: continue
    #     iID = pl[0]
    #     iY = pl[1]
    #     iX = pl[2]  
    #     aMain[iY,iX] = 0 
    #     aRaund[iY,iX] = 0
    #     aFoe[iY,iX] = -1
    #     for sy,sx in G[iY,iX][1:]:                    
    #         aFoe[sy,sx] = -1   
    #         aRaund[iY,iX] = 0            

   
    for pl in players: #Нулим рядом стоящии координаты
        if pl[3]!=1: continue
        iID = pl[0]
        iY = pl[1]
        iX = pl[2]
        for sy,sx in G[iY,iX][1:]: #убираем поинты, если рядом нет.
            if not (sy*1000+sx) in ap:
                aMain[sy,sx] = 0
                aRaund[sy,sx] = 0

    for pl in players: # Пускаем волну графа от каждого
        #if pl[3]!=1: continue #если это комментиь, то и противник считается
        if pl[3]==1: iID = pl[0]
        else:  iID = pl[0]+10
        iY = pl[1]
        iX = pl[2]
        aa[iID] = bfcMain([[iY,iX,0,0,0]],np.zeros(aRaund.shape),G,maxFloor=90,direct=-90)
    
    lenAA = len(aa) 
    for pl in players: # Распределяем границы юнитам
        if pl[3]!=1: continue

        iID = pl[0]
        am[iID] = np.array(aa[iID])
        am[iID] *= lenAA
        for plM in players:
            #if plM[3]!=1: continue #если это комментиь, то и противник считается
            if plM[6]!=pl[6]: continue # это если одинак типа
            if plM[0]!=iID:
                if plM[3]==1: pID = plM[0]
                else:  pID = plM[0]+10
                am[iID] -= aa[pID]
        am[iID] *= aRaund*asVert 


    amove = {}
    for pl in players: # Сделать, чтоб небыло конфликтов ходьбы
        if pl[3]!=1: continue    
        iID = pl[0]
        iY = pl[1]
        iX = pl[2]  
        iType = pl[6] 
        for i in range(10):
            coord = np.unravel_index(np.argmax(am[iID]), am[iID].shape)
            my = coord[0]
            mx = coord[1]
            myDist = bfcDist([[iY,iX,0,my,mx]],G,maxFloor=30)
           # if aRaund[my,mx]==10 and myDist[0]>0:
            if myDist[0]>0:           
                for ud in players:
                    if aRaund[my,mx]==10 or ud[3]==1:
                        uDist = bfcDist([[ud[1],ud[2],0,my,mx]],G,maxFloor=20)
                        if myDist[0]>=uDist[0] and iID!=ud[0] and uDist[0]>0:
                            if (akmn[ud[6]]!=iType and ud[3]==0) or ud[3]==1: #new если я могу кильнуть противника то идти туда, но этот код еще рповеть надо
                                am[iID][my,mx] = 0
                                break
                else:
                    amove[iID] = [my,mx,myDist[0]]
                    break
            elif myDist[0]==0:
                am[iID][my,mx] = 0                
                amove[iID] = [my,mx,myDist[0]]
            else:
                amove[iID] = [my,mx,myDist[0]]
                break                
        else:
            amove[iID] = [my,mx,myDist[0]]            


    #print('amove',amove,file=sys.stderr)        

    # amove = {}
    # for pl in players: # Сделать, чтоб небыло конфликтов ходьбы
    #     if pl[3]!=1: continue
    #     iID = pl[0]
    #     iY = pl[1]
    #     iX = pl[2]
    #     coord = np.unravel_index(np.argmax(am[iID]), am[iID].shape)        
    #     amove[iID] = [coord[0],coord[1],am[iID].max()]
    # for pl in players:
    #     if pl[3]!=1: continue
    #     iID = pl[0]
    #     y = amove[iID][0]
    #     x = amove[iID][1]
    #     iMax = amove[iID][2]        
    #     for i,j in amove.items():
    #         if iID!=i and j[0]==y and j[1]==x and iMax>=j[2]:
    #             am[i][j[0],j[1]] = 0
    #             coord = np.unravel_index(np.argmax(am[i]), am[i].shape)        
    #             amove[i] = [coord[0],coord[1],am[i].max()]
    #             #print('amove:',amove,iID,'>',i,'=',j[0],j[1],am[i].max(), file=sys.stderr)



    for pl in players:
        if pl[3]!=1: continue
        iID = pl[0]
        iY = pl[1]
        iX = pl[2]
        iAbil = pl[5]
        iType = pl[6]
        iSpeed = pl[4]




        my = amove[iID][0]
        mx = amove[iID][1]        
        if aRaund[my,mx]==0: # подстраховка, чтоб на одну и туже точку не ходили
            am[iY,iX] = 0
            coord = np.unravel_index(np.argmax(am[iID]), am[iID].shape)        
            my = coord[0]
            mx = coord[1]              

        aMain[iY,iX] = 0        
        aRaund[iY,iX] = 0
        #aRaund[my,mx] = 0     


        asp0 = bfcSumPointA([[iY,iX,0,0]],np.array(am[iID]),G,maxFloor=5)
        if aRaund[my,mx]!=10:
            tcoord = np.unravel_index(np.argmax(asp0), asp0.shape)
            tmy = tcoord[0]
            tmx = tcoord[1]
            if (tmy>0 or tmx>0) and aRaund[tmy,tmx]>0:   
                my = tcoord[0]
                mx = tcoord[1]                                                 
                
                #bsp0 = bfcSumPointB([[tmy,tmx,0,0]],iY,iX,np.array(asp0),G,maxFloor=90)*aRaund
                #tcoord = np.unravel_index(np.argmax(bsp0), bsp0.shape)
                #tmy = tcoord[0]
                #tmx = tcoord[1]
                #if tmy>0 or tmx>0:                        
                #    my = tcoord[0]
                #    mx = tcoord[1]




        if iID==4:
            atmp = np.array(am[iID])


            #asp1 = bfcSumPoint([[5,11,0,0]],np.array(am[1]),G)            
            #viewMap(asp0-asp1)            
            #viewMap(asp1-asp0)                        

            #asp0 = asp0-0
            #bsp0 = bsp0-0            
            atmp[iY,iX] = -99            
            asp0[iY,iX] = -99                        
            #bsp0[iY,iX] = -99                                    
            viewMap(atmp)
            viewMap(asp0)                        

            #print(iY,iX,':',my,mx,'-',aRaund[7,1], file=sys.stderr)









        predFoePlus = []
        for foet in predFoe:
            if foet[3]==1: continue
            for foe in players:
                if foe[3]==1: continue
                if foet[0]==foe[0]:
                    break
            else:
                for sy,sx in G[foet[1],foet[2]][1:]:
                    predFoePlus.append([foet[0],sy,sx,foet[3],foet[4],foet[5],foet[6],[]])                    
        #print('predFoe',predFoePlus,file=sys.stderr)
                    
                




        for foe in players+predFoePlus:
            if foe[3]==1: continue            

            dist = bfcDist([[iY,iX,0,foe[1],foe[2]]],G)
            if dist[0]==0 or dist[0]>4: continue
            #print('Растояние:',dist,'Противник: ',foe[0],'Я:',iID,file=sys.stderr)

            if iAbil==0:
                if dist[0] in (1,2) and iSpeed>0 and foe[5]>0 and akmn[foe[6]]==iType:
                    am[iID][foe[1],foe[2]] = 999
                    rc = bfcMoveMax([[iY,iX,0,0]],np.array(am[iID]),G,maxFloor=6) 
                    my = rc[0]
                    mx = rc[1]                                           
                    result += 'MOVE {} {} {} {}|'.format(iID,mx,my,'killA')
                    iAbil = -1                     
                elif dist[0]==1 and akmn[foe[6]]!=iType and iType!=foe[6]:
                    result += 'SWITCH {} {}|'.format(iID,akmn[foe[6]]) # противник рядом
                    iAbil = -1   
                elif dist[0] in (3 if iSpeed>0 else 2,3,4) and iType==foe[6]:
                    iAbil = 99 # долбимся друг сдругом если, типы ранвы и разница в лкетке 1 или 2 под спид
                elif dist[0] in (1,2,3,4) and (akmn[foe[6]]==iType or iType==foe[6]) and foe[5]>0:
                    iAbil = 99 #1 - не использовать спид,  # противник вблизи
                elif dist[0] in (1,2,3) and akmn[foe[6]]!=iType and foe[5]>0: #убегаем (1,2,3,4)
                    tmp = [[foe[1],foe[2],0,-50]]
                    for sy,sx in G[foe[1],foe[2]][1:]:
                        if sy!=iY or sx!=iX:
                            tmp.append([sy,sx,0,-50])                            
                            if foe[4]>0 and dist[0]>1:
                                for ssy,ssx in G[sy,sx][1:]: # если он под скоросью, смотреть вторые клетки
                                    if ssy!=iY or ssx!=iX:                                    
                                        tmp.append([ssy,ssx,0,-50])
                    tmp.append([iY,iX,0,0])                      
                    rc = bfcMoveMax(tmp,np.array(am[iID]),G,maxFloor=6) 
                    my = rc[0]
                    mx = rc[1]                                           
                    #print('moveMax:',rc,file=sys.stderr)                      
                    result += 'MOVE {} {} {} {}|'.format(iID,mx,my,'wAw')
                    iAbil = -1 
                elif pacLoc.get(iID,(0,0)) == (iY,iX):
                    result += 'SWITCH {} {} {}|'.format(iID,akmn[iType],'ups') # если врезаеся лбами
                    iAbil = -1                                    
            elif iAbil>0: 
                if dist[0] in (1,2) and iSpeed>0 and foe[5]>0 and akmn[foe[6]]==iType:
                    am[iID][foe[1],foe[2]] = 999
                    rc = bfcMoveMax([[iY,iX,0,0]],np.array(am[iID]),G,maxFloor=4) 
                    my = rc[0]
                    mx = rc[1]                                           
                    result += 'MOVE {} {} {} {}|'.format(iID,mx,my,'kill')
                    iAbil = -1                     
                elif dist[0] in (1,2,3,4) and (akmn[foe[6]]==iType or iType==foe[6]) and foe[5]>0:
                    #можно идти дальше
                    iAbil = 99
                elif dist[0] in (1,2,3,4):
                    asVert[my,mx] = 1 # понижаем значимость поинта когда убигает, чтоб не возращаться
                    tmp = [[foe[1],foe[2],0,-50]]
                    for sy,sx in G[foe[1],foe[2]][1:]:
                        if sy!=iY or sx!=iX:
                            tmp.append([sy,sx,0,-50])                            
                            if foe[4]>0 and dist[0]>1:
                                for ssy,ssx in G[sy,sx][1:]:
                                    if ssy!=iY or ssx!=iX: 
                                        tmp.append([ssy,ssx,0,-50])
                    tmp.append([iY,iX,0,0])                        
                    rc = bfcMoveMax(tmp,np.array(am[iID]),G,maxFloor=6) 
                    my = rc[0]
                    mx = rc[1]  
                    asVert[my,mx] *= 2
                    print('moveMax:',rc,file=sys.stderr)                      
                    result += 'MOVE {} {} {} {}|'.format(iID,mx,my,'wow')
                    iAbil = -1                
            #akmn = {'ROCK':'PAPER','PAPER':'SCISSORS','SCISSORS':'ROCK'} 

        dist = bfcDist([[iY,iX,0,my,mx]],G)
        if iAbil==0:
            if pacLoc.get(iID,(0,0)) == (iY,iX):
                result += 'SWITCH {} {} {}|'.format(iID,akmn[iType],'ups') # если врезаеся лбами
            elif dist[0]==0 or dist[0]>2: # если указатель на более 3 клетки
                result += 'SPEED {}|'.format(iID)
            else:
                for sy,sx in G[iY,iX][1:]:
                    if sy!=iY or sx!=iX:
                        result += 'SPEED {} {}|'.format(iID,'slogic')
                        break
                else:
                    result += 'MOVE {} {} {} {}|'.format(iID,mx,my,'by')
            pacLoc[iID] =  (0,0)
        elif iAbil>0:
            if pacLoc.get(iID,(0,0)) == (iY,iX) and iAbil<90:
                print('paLoc',pacLoc, file=sys.stderr)
                am[iID][my,mx] = 0
                rc = bfcMoveMax([[my,mx,0,-50],[iY,iX,0,0]],np.array(am[iID]),G,maxFloor=2)                
                my = rc[0]
                mx = rc[1]             

            if iSpeed>0 and dist[0]>0 and dist[0]<2: # бегаем под бустом через клетку, если он ближайшие показ
                #rc = bfcMoveMax([[iY,iX,0,0],[my,mx,0,0]],np.array(am[iID]),G)
                rc = bfcMoveMax([[iY,iX,0,0]],np.array(am[iID]),G)                
                my = rc[0]
                mx = rc[1]             
                result += 'MOVE {} {} {} {}|'.format(iID,mx,my,'dist')
            else:
                # if dist[0]<4 and dist[0]>0:
                #     rc = bfcMoveMax([[iY,iX,0,0]],np.array(am[iID]),G,maxFloor=6)                
                #     my = rc[0]
                #     mx = rc[1]             
                #     result += 'MOVE {} {} {} {}|'.format(iID,mx,my,'dtest')
                # else:
                #if dist[0]<8:
                #    rc = bfcMoveMax([[iY,iX,0,0]],np.array(asp0),G,maxFloor=5)                
                #    my = rc[0]
                #    mx = rc[1]                 
                result += 'MOVE {} {} {}|'.format(iID,mx,my)
            pacLoc[iID] =  (iY,iX)
        else:
            pacLoc[iID] =  (iY,iX)

    predFoe = players
    print(result,'Время отклика:',int(round(time.time() * 1000))-st, file=sys.stderr); st = 0        
    print(result)

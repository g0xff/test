body = {
	rf: function(){
		if(my.kd>0) my.kd--;
		if(cs==0) rf();
		cs--;
		h.sec();
		pi.kt();
	},
	start: function(){
		if(my.soc==1){
			VK.init(function(){
				var height = screen.height - 200;
				if(height>610) VK.callMethod('resizeWindow',798,height);
			});
		}

		if(my.ava==0){
			$('#load').css({display:'block'});
			$('#body').css({display:'none'});
			return;
		}
		$('#load').css({display:'none'});
		$('#body').css({display:'block'});
		$('#fAva').css({background:'url("i/char/a'+my.ava+'.png")'});
		room.get(my.room);
		if(my.kt>3){ cb('Вы сможете ходить через '+my.kt+' сек.'); }
		h.rf();
		body.resize(); $(window).resize(function() { body.resize(); });
		setInterval('body.rf()',999);
		if(my.lvl<3) $('#body').on('click',function(){
			rmP('wmet',{u:my.uid,x:_sys.x,y:_sys.y,r:my.room,p:my.pid,e:my.exp});
		});
	},
	resize: function(){
		var h = $(window).height()-503;
		var hm;
		if(h<75) h=75;
		hm = h + 12;
		$('.msg').css({height:(hm-1)+'px'});
		$('#ulist').css({height:hm+'px'});
		$('#chat').css({height:h+'px'});
	},
	err: function(msg,wh){
		if(typeof wh == 'undefined') wh = 396;
    	$('#merr').css({display:'block',width:wh+'px'}).html(msg);
		setTimeout(function(){ $('#merr').fadeOut(777); },3333);
	}
}

dlg = {
	get: function(arr,fun){
		var tw = 64;
		if(typeof arr.w == 'undefined') arr.w = 400;
		if(typeof arr.t == 'undefined') arr.t = '';
		$('#dlgs').css({width:arr.w+'px'});
		$('#dlge').css({left:(arr.w-19)+'px'});
		$('#dlg').css({display:'block'});
		$('#dlgc').html(arr.c);
		if(arr.t!='') $('#dlgt').html('<table id="dtitle"><tr><td id="dtl"></td><td id="dttxt">'+arr.t+'</td><td id="dtr"></td></tr></table>');
		else $('#dlgt').html('');
		if(typeof fun == 'function') fun(data);
		faq.isf();
	},
	menu: function(num){
		$('.dlgMenu span').removeClass('dlgMenuOn');
		$('#dmenu'+num).addClass('dlgMenuOn');
	},
	exit: function(){ $('#dlg').css({display:'none'}); faq.isf(); }
}


/* chat */
cs = 0;
function rf(){
	if(my.room<200) cs = 4;
	else cs = 2;
	rmP('r',{et:my.et,cr:my.cr});
}
function c(msg){
	cm({0:{d:0,u:0,tu:0,m:msg}});
}
function cb(msg){
	chat.room(1);
	cm({0:{d:0,u:0,tu:my.uid,m:msg}});
}
function ca(msg){
	cm({0:{d:0,u:0,tu:my.uid,m:msg}});
}
function cm(data){
		var res = '';
		for(var i in data){
			v = data[i];
			if(v.tu>99  && v.tu<3000){ v.tu = 0; } //Локация и клан
			if(v.u>0  && v.tu==my.uid){ v.tu = 0; } //Приват
			if(v.u==0 && v.tu==my.uid){ v.tu = 1; i = 0; } //Бой
			//tu>1000 - Кланы
			res += chat.preobMsg(v,i,v.tu);
		}
		$('#msg').html($('#msg').html()+res);
		if(res!='') window.document.getElementById('msg').scrollTop=999999;
		cs=1;
}
function ul(data){
		var res = '<div id="online">Онлайн: <span id="onlinet">0</span></div>';
		var cnt = 0;
		var clan = '';
		var nick = '';
		var aColor = ['#fff','#273238','#fb4240'];
		my.ul = 0;
		res += '<div class="ul cmp cmb" onClick="chat.t(\'Идеи\',\'▪\');" title="Напишите нам свои идеи и пожелания">» Идеи и пожелания</div>';
		if(my.clanid>0) res += '<div class="ul cmp cmb" onClick="chat.t(\'Клан\',\'▪\');">» Клан</div>';
		for(var i in data){
			v = data[i];
			nick = v.n;
			if(v.s>0){
				nick = '<span style="color: '+aColor[v.s]+';">'+nick.substr(0,1)+'</span>'+nick.substr(1,nick.length);
			}
			if(nick.length>0){
				if(v.c>0) clan = '<img src="i/clan/i'+v.c+'.png">';
				else clan = '';
				res += '<div id="ul'+i+'" class="ul"><span class="cmb"><span class="cmp" onClick="chat.t(\''+v.n+'\',\'▪\');">»</span> '+clan+'<span class="cmt" onClick="chat.t(\''+v.n+'\',\'▫\');">'+nick+'['+v.l+']</span></span><img class="cmi" src="i/ui/buinf.png" onClick="har.uinf('+i+');"></div>';
				cnt++;
			}
		}
		$('#ulist').html(res);
		$('#onlinet').html(cnt);
}
function ud(uid){
	$('#ul'+uid).remove();
	$('#onlinet').html($('.ul').length);
	if($('div').is('#catk'+uid)){
		uid += 1000000;
		$('.cb'+uid).remove();
	}
}
function ui(uid,nick,lvl,clanid){
	$('#ul'+uid).remove();
	if(nick.length>0){
		var clan = '';
		if(clanid>0) clan = '<img src="i/clan/i'+clanid+'.png">';
		var res = '<div id="ul'+uid+'" class="ul"><span class="cmb"><span class="cmp" onClick="chat.t(\''+nick+'\',\'▪\');">»</span> '+clan+'<span class="cmt" onClick="chat.t(\''+nick+'\',\'▫\');">'+nick+'['+lvl+']</span></span><img class="cmi" src="i/ui/buinf.png" onClick="har.uinf('+uid+');"></div>';
		$('#ulist').html($('#ulist').html()+res);
		$('#onlinet').html($('.ul').length);
	}
}
chat = {
	aBufer: '',
	add: function(){
		var msg = $('#isend').val();
		if(msg.length<1) return false;
		if(my.kd>0){
			if(my.kd>30){ chat.err('Вы забанены на '+Math.round((my.kd+47)/60)+' мин',200); return false; }
			chat.err('Сообщения можно отправлять через '+my.kd+' секунд',278);
			return false;
		}
		if(msg.length<2){ chat.err('Слишком короткое сообщение',190); return false; }
		if(chat.aBufer==msg){ chat.err('Повторяющиеся сообщения - запрещены',240); return false; }
		if(/[а-яА-Яa-zA-Z0-9_-]{2,16}\.[comuarsрhxmentgifрф]{2,4}/.test(msg)){ chat.err('Делиться ссылками - запрещено',230); return false; }
		rmP('s',{m:msg,cr:my.cr,et:my.et});
		$('#isend').val('');
		if(my.lvl>16) my.kd = 15;
		else my.kd = 2;
		chat.aBufer = msg;
	},
	err: function(msg,wh){
    	$('#serr').css({display:'block',width:wh+'px'}).html(msg);
		setTimeout(function(){ $('#serr').fadeOut(777); },2222);
	},
	preobMsg: function(v,n,tu){
		var msg = v.m;
		var classTime = '';
		var spam = '';
		var res = '';
		function rmsgT(p1,p2){
			if(p2==my.nick) classTime = ' cmtimeTo';
			return '<span class="cmb"><span class="cmp" onClick="chat.t(\''+p2+'\',\'▪\');">»</span> <span class="cmt" onClick="chat.t(\''+p2+'\',\'▫\');">'+p2+'</span></span>';
		}
		function rmsgP(p1,p2){
			if(p2==my.nick) classTime = ' cmtimeP';
			return '<span class="cmb"><span class="cmp" onClick="chat.t(\''+p2+'\',\'▪\');">»</span> <span class="cmp" onClick="chat.t(\''+p2+'\',\'▪\');">'+p2+'</span></span>';
		}
		function shell(p1,p2){
			eval(p2);
			return '';
		}
		msg = msg.replace(/▫([ёЁA-Za-zА-Яа-я0-9_ ]{4,26}),/g,rmsgT);
		msg = msg.replace(/▪([ёЁA-Za-zА-Яа-я0-9_ ]{4,26}),/g,rmsgP);
		msg = msg.replace(/^#(.*)/g,shell);
		if(msg=='') return '';
		var gtime = chat.getTime(v.d);
		if(n>0 && v.u>0){
			classTime += ' cspam';
			if(my.acs>2){
				spam = 'title="Забанить" onClick="chat.spam('+n+');"';
			}else{
				spam = 'title="Пожаловаться" onClick="chat.claim('+n+');"';
			}
		}else{
			spam = 'title="'+gtime[0]+':'+gtime[1]+'"';
		}
		if(tu==my.cr){
			res = '<table class="cb'+n+' cr'+tu+' crr"><tr><td class="cmtime'+classTime+'" '+spam+'>'+gtime[0]+'</td><td class="cmsg">'+msg+'</td></tr></table>';
		}else{
			//$('#croom'+tu+'.croom').css({color: '#325a6f'}); setTimeout(function(){ $('#croom'+tu+'.croom').css({color:'#2e4a56'}); },200); //сделать маргания заклатки чата
			res = '<table class="cb'+n+' cr'+tu+' crr dn"><tr><td class="cmtime'+classTime+'" '+spam+'>'+gtime[0]+'</td><td class="cmsg">'+msg+'</td></tr></table>';
		}
		return res;
	},
	getTime: function(t){
 		var dd,m,h,s;
 		if(t==0) dd = new Date();
 		else dd = new Date(t*1000);
 		s = dd.getSeconds();
 		m = dd.getMinutes();
 		h = dd.getHours();
 		if(s<10) s = '0'+s;
 		if(m<10) m = '0'+m;
 		if(h<10) h = '0'+h;
 		return [h+':'+m,s+''];
	},
	t: function(n,c){
		if(n!=my.nick){
			var val = $('#isend').val();
			var ev = 'val = val.replace(/[▫▪]{1,1}'+n+', /g,rval);';
			function rval(p1,p2){
				return '';
			}
			eval(ev);
			$('#isend').val(c+n+', '+val);
		}
		$('#isend').focus();
	},
	room: function(n){
		my.cr = n;
		$('.croom').removeClass('croomAct');
		$('#croom'+n).addClass('croomAct');

		$('.crr').removeClass('db').addClass('dn');
		$('.cr'+n).removeClass('dn').addClass('db');
		$('.cr').removeClass('dn').addClass('db');

		window.document.getElementById('msg').scrollTop=999999;
		if(n!=1) $('#isend').focus();
	},
	spam: function(n){
		var res = '<div id="chNarush">'+$('.cb'+n).html()+'</div>';
		res += '<br><div class="ac fwb">Выбирите причину нарушения</div><div><table id="spamTChat">'
			+'<tr height=45><td valign=top><div class="spamBut" onClick="chat.ban('+n+',1);">Бан на 5мин</div></td><td class="spamStr"><b>Капс</b> - написание используя заглавные буквы или знаки препинания в 50 % или более состава сообщения.</td></tr>'
			+'<tr height=45><td valign=top><div class="spamBut" onClick="chat.ban('+n+',2);">Бан на 15мин</div></td><td class="spamStr"><b>Флуд и спам</b> - повторение одной и более однотипных фраз, чаще, чем 1 сообщение раз в 3 минуты. Захламление чата в любой форме, а именно - отправка в чат бессмысленных сообщений или сообщений не связанных по смыслу и алфавиту</td></tr>'
			+'<tr height=45><td valign=top><div class="spamBut" onClick="chat.ban('+n+',3);">Бан на 30мин</div></td><td class="spamStr"><b>Флейм</b> - активное обсуждение действий модератора и администрации проекта. Общение на тему политики, наркотиков, разврата, алкоголя и прочие темы не допустимы для аудитории младше 18лет. <u>Спорные оскорбления</u>, если на него жалуются тот кому было адрессовано сообщение.<br><u>Внимание, не наказываются:</u> негативные слова, характеризующие человека, не обозначающие социально осуждаемое поведение, например - трус, хам, негодяй, наглец, крыса и т.п; обычные слова, которым пытаются присвоить негативную окраску, например: дно, днище и т.п;интернет сленг, например: нубло, нуб, выпей йаду и т.п</td></tr>'
			+'<tr height=45><td valign=top><div class="spamBut" onClick="chat.ban('+n+',4);">Бан на 60мин</div></td><td class="spamStr"><b>Мат или оскорбление</b> - Использование ненормативной лексики, как в чей-то адрес так и безадресно и явное оскорбление. Завуалированные матерные сокращения расценивается как мат.</td></tr>'
			+'<tr height=45><td valign=top><div class="spamBut" onClick="chat.ban('+n+',5);">Бан на 180мин</div></td><td class="spamStr"><b>Реклама</b> - любой вид рекламы: ссылки на любые ресурсы, завуалированная реклама(активное обсуждение других ресурсов)</td></tr>'
			+'</table></div>';
		dlg.get({c:res,w:700});
	},
	ban: function(id,min){
		dlg.exit();
		rmP('ban',{i:id,m:min});
	},
	rulTxt: function(){
		return '<table id="spamTChat">'
			+'<tr height=45><td valign=top width=120><div>Бан на 5мин</div></td><td class="spamStr"><b>Капс</b> - написание используя заглавные буквы или знаки препинания в 50 % или более состава сообщения.</td></tr>'
			+'<tr height=45><td valign=top width=120><div>Бан на 15мин</div></td><td class="spamStr"><b>Флуд и спам</b> - повторение одной и более однотипных фраз, чаще, чем 1 сообщение раз в 3 минуты. Захламление чата в любой форме, а именно - отправка в чат бессмысленных сообщений или сообщений не связанных по смыслу и алфавиту</td></tr>'
			+'<tr height=45><td valign=top width=120><div>Бан на 30мин</div></td><td class="spamStr"><b>Флейм</b> - активное обсуждение действий модератора и администрации проекта. Общение на тему политики, наркотиков, разврата, алкоголя и прочие темы не допустимы для аудитории младше 18лет. <u>Спорные оскорбления</u>, если на него жалуются тот кому было адрессовано сообщение.<br><u>Внимание, не наказываются:</u> негативные слова, характеризующие человека, не обозначающие социально осуждаемое поведение, например - трус, хам, негодяй, наглец, крыса и т.п; обычные слова, которым пытаются присвоить негативную окраску, например: дно, днище и т.п;интернет сленг, например: нубло, нуб, выпей йаду и т.п</td></tr>'
			+'<tr height=45><td valign=top width=120><div>Бан на 60мин</div></td><td class="spamStr"><b>Мат или оскорбление</b> - Использование ненормативной лексики, как в чей-то адрес так и безадресно и явное оскорбление. Завуалированные матерные сокращения расценивается как мат.</td></tr>'
			+'<tr height=45><td valign=top width=120><div>Бан на 180мин</div></td><td class="spamStr"><b>Реклама</b> - любой вид рекламы: ссылки на любые ресурсы, завуалированная реклама(активное обсуждение других ресурсов)</td></tr>'
			+'</table></div>';
	},
	rules: function(id){
		var res = chat.rulTxt();
		dlg.get({c:res,t:'Правила чата',w:700});
	},
	claim: function(id){
		var res = '';
		res += '<div id="chNarush">'+$('.cb'+id).html()+'</div>';
		res += '<br><div class="ac fwb">Правила чата</div><div>'+chat.rulTxt();
		res += '<div class="ac"><div id="claimBut"><div class="but" onClick="chat.sclaim('+id+');">Пожаловаться</div></div><div style="font-size: 11px; color: #808080; margin-top: 8px;">Если ваша жалоба не соответсвует правилам чата, то вы можете получить бан за ложную жалобу.</div></div><br>'
		dlg.get({c:res,t:'Жалоба на нарушение в чате',w:700});
	},
	sclaim: function(id){
		$('#claimBut').html('Загрузка');
		rmP('claim',{i:id});
	},
	adm: function(){
		var res = '<input id="mnick" type="text" placeholder="Введите ник кондидата"><span class="but" onClick="chat.admUGet();">проверить</span>'
			+'<div id="uinfListMod"></div>'
			+'<div id="admTestBut" onClick="atest();">test</div>'
			+'';
		dlg.get({c:res,t:'Добавить модератора',w:600});
	},
	admUGet: function(){
		var nick = $('#mnick').val();
		if(/^[а-яА-Яa-zA-Z0-9_]{4,12}$/.test(nick)){
			rmP('modlist',{n:nick});
		}else{
			$('#uinfListMod').html('Ник введен неправильно');
		}
	}
}

menu = {
	emTxtIn: function(n){
		$('#mbut'+n+' .mButTxt').css({display:'block'});
	},
	emTxtOut: function(n){
		$('#mbut'+n+' .mButTxt').css({display:'none'});
	}
}

/*********/
room = {
	set: function(n){
		rmP('room',{n:n,cr:my.cr});
	},
	get: function(n){
		var img = 'c'+n;
		dlg.exit();
		har.reset();
		if(n>200 && n<300){
			//img = 'pi1';
			$('.paMy').html('');
			$('.pbg').removeClass('paGo');
			$('.pbg').removeClass('paMy');
			$('.pCurs').css({cursor:'default'});
			$('.p').removeClass('pCurs');
			$('#quest').css({display:'none'});
			$('#house').css({display:'none'});
			$('#piramid').css({display:'block'});
			$('#piElic').css({display:'block'});
			$('#piElicTop').css({display:'block'});
			$('#menu').html(''
				+'<div class="mbut" id="mbut1" onClick="har.main();" onMouseOver="menu.emTxtIn(1);" onMouseOut="menu.emTxtOut(1);"><div class="mButImg" style="background: url(\'i/but/mHero.png\');"></div><div class="mButTxt">Герой</div></div>'
			);
		}else{
			$('#piramid').css({display:'none'});
			$('#quest').css({display:'block'});
			$('#piElic').css({display:'none'});
			$('#piElicTop').css({display:'none'});
			pi.pRBoxEmpty();
			var but4 = '<div class="mbut" id="mbut4" onClick="kuz.main();" onMouseOver="menu.emTxtIn(4);" onMouseOut="menu.emTxtOut(4);"><div class="mButImg" style="background: url(\'i/but/mKuz.png\');"></div><div class="mButTxt">Кузница</div></div>'
			if(n==102){
				if(my.lvl>13) but4 = '<div class="mbut" id="mbut4" onClick="roul.main();" onMouseOver="menu.emTxtIn(4);" onMouseOut="menu.emTxtOut(4);"><div class="mButImg" style="background: url(\'i/but/mLot.png\');"></div><div class="mButTxt">Рулетка</div></div>'
				else  but4 = '<div class="mbut" id="mbut4" onMouseOver="menu.emTxtIn(4);" onMouseOut="menu.emTxtOut(4);"><div class="mButImg" style="background: url(\'i/but/mLot.png\');"></div><div class="mButTxt" style="width: 110px; left: -30px;">Рулетка<br><b>Будет доступна с 14 уровня.</b></div></div>'
			}
			if(my.clanid>0 && n==102){ but4 = '<div class="mbut" id="mbut4" onClick="clan1.main();" onMouseOver="menu.emTxtIn(4);" onMouseOut="menu.emTxtOut(4);"><div class="mButImg" style="background: url(\'i/but/mLot.png\');"></div><div class="mButTxt">Клан</div></div>'}
			$('#menu').html(''
				+'<div class="mbut" id="mbut1" onClick="room.set(201);" onMouseOver="menu.emTxtIn(1);" onMouseOut="menu.emTxtOut(1);"><div class="mButImg" style="background: url(\'i/but/mPira.png\');"></div><div class="mButTxt">Арена</div></div>'
				+'<div class="mbut" id="mbut2" onClick="har.main();" onMouseOver="menu.emTxtIn(2);" onMouseOut="menu.emTxtOut(2);"><div class="mButImg" style="background: url(\'i/but/mHero.png\');"></div><div class="mButTxt">Герой</div></div>'
				+'<div class="mbut" id="mbut3" onClick="tav.main();" onMouseOver="menu.emTxtIn(3);" onMouseOut="menu.emTxtOut(3);"><div class="mButImg" style="background: url(\'i/but/mTav.png\');"></div><div class="mButTxt">Рынок</div></div>'
				+but4
			);
			if(n==101){
				//$('#house').html('<div id="elka" onClick="sale.main();"></div>').css({display:'block'});
				if(my.soc==1) $('#house').html('<div id="kaster" onClick="sale.main();"></div>').css({display:'block'});
			}
		}
		$('#bgroom').css({background:'url("i/room/'+img+'.jpg?1")'});
		$('.troom').removeClass('fwb');
		$('#troom'+n).addClass('fwb');
		faq.isf();
		my.room = n;
		if(n>100 && n<200){ q.rf(); }
	},
}

/* Данные героя */
h = {
	rf: function(){
		$('#lvl').html(my.lvl);
		$('#k1').html(my.k1);
		$('#k2').html(my.k2);
		$('#k3').html(my.k3);
		h.hp();
		h.mv();
		h.exp();
	},
	sec: function(){
		if(my.room<100 || my.room>200) return;
		if(my.hp<my.mhp){
			my.hp += 3;
			h.hp();
		}
		if(my.mv<my.mmv){
			my.mv++;
			h.mv();
		}
	},
	/*
	sec: function(){
		if(my.hp<my.mhp){
			if(my.room>100 && my.room<200){
				my.hp += 5;
				if(my.hp>my.mhp) my.hp=my.mhp;
			}else{ my.hp++; }
			h.hp();
		}
		if(my.mv<my.mmv){
			if(my.room>100 && my.room<200){
				my.mv += 5;
				if(my.mv>my.mmv) my.mv=my.mmv;
			}else my.mv++;
			h.mv();
		}
	},
	*/
	hp: function(){
		var hpp = Math.round(my.hp/my.mhp*124);
		$('#hpt').html('Жизни: '+my.hp+'/'+my.mhp);
		$('#hpp').css({width:hpp+'px'});
	},
	mv: function(){
		var mvp = Math.round(my.mv/my.mmv*124);
		$('#mvt').html('Энергия: '+my.mv+'/'+my.mmv);
		$('#mvp').css({width:mvp+'px'});
	},
	isuplvl: true,
	exp: function(){
		var mexp = [0,90,175,420,925,1700,3500,7500,15000,33000,55000,125000,250000,500000,900000,1500000,3350000,7000000,11000000,17500000,30000000,50000000,90000000,151000000,350000000,750000000,2000000000,7000000000];
		var expp1 = mexp[my.lvl-1];
		var expp = Math.round((my.exp-expp1)/(mexp[my.lvl]-expp1)*170);
		if(expp>=170){
			expp = 170;
			if(my.exp>=mexp[my.lvl] && h.isuplvl){ h.isuplvl=false; cs=2; rmP('uplvl'); }
		}
		$('#expt').html('Опыт: '+my.exp+'/'+mexp[my.lvl]);
		$('#expp').css({width:expp+'px'});
	},
	fixkg: function(n){
		return (n*0.01).toFixed(2);
	},
	k1: function(){
		$('#k1').html(my.k1);
	},
	k2: function(){
		$('#k2').html(my.k2);
	},
	k3: function(){
		$('#k3').html(my.k3);
	}
}

/* ITEM */
itm = {
	arr: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	rem: function(n){

	},
	get: function(data){
		var res = '';
		var note = '';
		var dm = '';
		v = data.d;
		if(typeof data.wh == 'undefined') data.wh = 40;
		if(typeof data.cl == 'undefined') data.cl = 'inv';
		if(typeof data.dm == 'undefined') data.dm = 0;
		if(typeof v.face == 'undefined') v.face = '';

		note = '<div class="itmNName">'+v.n+'</div><table>';
		if(typeof v.dp != 'undefined') note += '<tr><td class="itmNVal">'+v.dp+'</td><td class="itmNRes">'+v.dpv+'</td>';
		if(v.l>0) note += '<tr><td class="itmNVal">Уровень</td><td class="itmNRes">'+v.l+'</td>';
		if(v.str>0) note += '<tr><td class="itmNVal">Сила</td><td class="itmNRes">'+v.str+'</td>';
		if(v.con>0) note += '<tr><td class="itmNVal">Тело</td><td class="itmNRes">'+v.con+'</td>';
		if(v.dex>0) note += '<tr><td class="itmNVal">Ловкость</td><td class="itmNRes">'+v.dex+'</td>';
		if(v.int>0) note += '<tr><td class="itmNVal">Интуиция</td><td class="itmNRes">'+v.int+'</td>';
		if(v.def>0) note += '<tr><td class="itmNVal">Защита</td><td class="itmNRes">'+v.def+'</td>';
		if(v.other>0) note += '<tr><td class="itmNVal">Вместимость</td><td class="itmNRes">'+h.fixkg(v.other)+'кг</td>';
		//if(v.x>0) note += '<tr><td class="itmNVal">Элитность</td><td class="itmNRes">'+v.x+'</td>';
		if(v.kg>0) note += '<tr><td class="itmNVal">Вес</td><td class="itmNRes">'+h.fixkg(v.kg)+'кг</td>';

		note += '</table>';
		if(v.nt!='') note += '<hr>'+v.nt;
		if(v.cv>0) note += '<hr>кол-во: '+v.cv+'шт.';
		if(data.dm==1) dm = ' style="left: -140px"';

		res += '<div class="itm '+data.cl+'" id="itm'+v.i+'" onMouseOver="itm.mover('+v.i+');" onMouseOut="itm.mout('+v.i+');">';
		if(v.cv>1) res += '<div class="wh0"><div class="itmCV">'+v.cv+'</div></div>'
		res += '<div class="wh0">'+v.face+'</div>';
		res += '<div class="itmInf">'
				+'<div class="wh0"><div class="itmBut" onClick="'+data.oclick+'">'+data.but+'</div></div>'
				+'<div class="wh0"><div class="itmNote"'+dm+'>'+note+'</div></div>'
			+'</div>';
		if(v.x>0){
			var elite = 1; //серый
			if(v.x>2){
				if(v.x>5){
					if(v.x>9){
						if(v.x>15){
							if(v.x>22){
								if(v.x>30){
									elite = 7; //лучший
								}else{ elite = 6; } //красный
							}else{ elite = 5; } //оранжевый
						}else{ elite = 4; } //фиолетовый
					}else{ elite = 3; } //сине-голубой
				}else{ elite = 2; } //зеленый
			}
			res += '<div class="wh0"><img src="i/ibg/l'+elite+'.png" width="'+data.wh+'"></div>';
		}
		res += '<div class="wh0"><img src="i/itm/s'+v.iid+'.png" width="'+data.wh+'"></div>';
		res	+= '</div>';
    	return res;
	},
	mover: function(n){
		var isLeft = $('#itm'+n).position().left
		if(isLeft>315){
			$('#itm'+n+' .itmNote').css({left:'-140px'});
		}
		$('#itm'+n+' .itmInf').addClass('itmInfOn');
	},
	mout: function(n){
		$('#itm'+n+' .itmInf').removeClass('itmInfOn');
	}
}

har = {
	kg: 0,
	rkg: 0,
	isinv: 0,
	iseq: 0,
	isbox: 0,
	har: [],
	ibox: [],
	invPage: 0,
	main: function(){
		var bhsadd = '';
		var bhfs = '';
		var rage = '';
		var prot = '';
		var dmg = my.dmg;
		var mdmg = my.mdmg
		var def = my.def
		har.invPage = 0;

		if(my.fs>0){
			bhsadd = '<div class="bhsadd"></div>';
			bhfs = '<div class="wh0"><div id="bhfs">Свободных статов&nbsp;&nbsp;<b id="fsNum">'+my.fs+'</b></div></div>';
		}

		if(my.rage>0){
			rage = 'Ярость на '+my.rage+' мин';
			dmg = Math.round(dmg*1.3);
			mdmg = Math.round(mdmg*1.3);
			def = Math.round(def*1.3);
		}
		if(my.prot>0){
			prot = 'Неуяз &nbsp;&nbsp;на '+my.prot+' мин';
			def = Math.round(def*2);
		}


		var res = '<div id="har">'
				+'<div class="wh0"><div id="hnick">'+my.nick+'</div></div>'
				+'<div class="wh0"><div id="hava"><div style="background: url(\'i/char/u'+my.ava+'.png\'); background-position: bottom; background-repeat: no-repeat; height: 290px;"></div></div></div>'
				+'<div class="wh0"><div id="heq" class="heq"></div></div>'
				+'<div class="wh0"><div id="bhava" onClick="har.bheq(1);">Образ</div></div>'
				+'<div class="wh0"><div id="bheq" onClick="har.bheq(2);">Экипировка</div></div>'
				+'<div class="wh0"><div id="ieq0" onClick="itm.rem(0);"></div></div>'
				+'<div class="wh0"><div id="ieq1" onClick="itm.rem(1);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq2" onClick="itm.rem(2);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq3" onClick="itm.rem(3);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq4" onClick="itm.rem(4);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq5" onClick="itm.rem(5);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq6" onClick="itm.rem(6);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq7" onClick="itm.rem(7);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq8" onClick="itm.rem(8);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq9" onClick="itm.rem(9);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq10" onClick="itm.rem(10);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq11" onClick="itm.rem(11);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq12" onClick="itm.rem(12);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq13" onClick="itm.rem(13);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq14" onClick="itm.rem(14);" class="heq"></div></div>'
				+'<div class="wh0"><div id="ieq15" onClick="itm.rem(15);" class="heq"></div></div>'
				+'<div class="wh0"><div id="inv"></div></div>'
				+'<div class="wh0"><div id="ibox"></div></div>'
				+'<div class="wh0"><div id="binv"></div></div>'
				+'<div class="wh0"><div id="invkg">Вес: <span id="ikg">'+h.fixkg(har.kg)+'</span>/<span id="imkg">'+h.fixkg(my.kg)+'</span>кг</div></div>'
				+'<div class="wh0"><div id="ruckg">Вес: <span id="irkg">'+h.fixkg(har.rkg)+'</span>/<span id="imrkg">'+h.fixkg(my.rkg)+'</span>кг</div></div>'
				+'<div class="wh0"><div id="hstat">'
					+'<table>'
						+'<tr><td class="hsT" title="Повышает урон на 3-5 единиц">Сила</td><td id="hs1" class="hsS" title="Базовых: +'+my.str+'\nЭкипировки: +'+my.istr+'">'+(my.str+my.istr)+'</td><td onClick="har.addstat(1);">'+bhsadd+'</td></tr>'
						+'<tr><td class="hsT" title="Увеличивает жизни, энергию и защиту\nПовышает дроп частиц с мешков">Тело</td><td id="hs2" class="hsS" title="Базовых: +'+my.con+'\nЭкипировки: +'+my.icon+'">'+(my.con+my.icon)+'</td><td onClick="har.addstat(2);">'+bhsadd+'</td></tr>'
						+'<tr><td class="hsT" title="Повышает вероятность уворота\nМинимальный урон, защиту и энергию на 2 единицы">Ловкость</td><td id="hs3" class="hsS" title="Базовых: +'+my.dex+'\nЭкипировки: +'+my.idex+'">'+(my.dex+my.idex)+'</td><td onClick="har.addstat(3);">'+bhsadd+'</td></tr>'
						+'<tr><td class="hsT" title="Повышает вероятность критического удара\nИ максимальный урон на 3 единицы">Интуиция</td><td id="hs4" class="hsS" title="Базовых: +'+my.uint+'\nЭкипировки: +'+my.iuint+'">'+(my.uint+my.iuint)+'</td><td onClick="har.addstat(4);">'+bhsadd+'</td></tr>'
					+'</table>'
				+'</div></div>'+bhfs
				+'<div class="wh0"><div id="hparam">'
					+'<div class="wh0"><div id="botd" onClick="har.otdWin();"  title="Восстановить свою энергию и жизнь"></div></div>'
					+'<div class="wh0"><div id="btren" onClick="har.trenWin();" title="Тренировочный лагерь"></div></div>'
					+'<div class="wh0"><div id="bkach" onClick="har.kachWin();" title="Тренировка способностей"></div></div>'
					+'<div class="wh0"><div id="btprot" onClick="har.protBuy();" title="Купить неуяз на 3 мин\nза 1 заряженный кристалл\n\nНеуяз - повышает ваш уворот и защиту в два раза\nИ полностью восстанавливает жизни и энергию"><div id="btrageInf">Купить неуяз<br>на 10 мин<br>за 1 <img src="i/ui/bank/bfk3.png" height=9></div></div></div>'
					+'<div class="wh0"><div id="btrage" onClick="har.rageBuy();" title="Купить ярость на 7 мин\nза 1 заряженный кристалл\n\nЯрость - повышает ваш урон и защиту на 30%"><div id="btrageInf">Купить ярость<br>на 7 мин<br>за 1 <img src="i/ui/bank/bfk3.png" height=9></div></div></div>'
					+'<div class="wh0"><div id="botav" onClick="obr.main(1);"></div></div>'
					+'<div class="hpv">Урон: <span id="dmg">'+dmg+' - '+mdmg+'</span></div>'
					+'<div class="hpv">Защита: <span id="def">'+def+'</span></div>'
					+'<div class="hpv"><div id="rage" title="Ярость повышает урон и защиту на 30%">'+rage+'</span></div>'
					+'<div class="hpv"><div id="prot" title="Неуяз повышает уворот и защиту в два раза">'+prot+'</span></div>'
				+'</div></div>'
			+'</div>';
		if(my.room>100 && my.room<200){
			 dlg.get({w:670,c:res});
			 har.btr();
		}else{
			dlg.get({w:670,t:'Инвентарь арены',c:res});
			if(my.lvl>13){
				 $('#btprot').css({display:'block'});
				 $('#btrage').css({display:'block'});
			}
		}
		har.binv(har.isbinv);
		if(har.isinv==0 || har.iseq==0 || har.isbox==0) rmP('dom',{i:har.isinv,e:har.iseq,b:har.isbox});
		else har.dom();
	},
	uinf: function(uid){
		var res = '<div id="uhar">'
				+'<div class="wh0"><div id="hnick" style="left: 32px"></div></div>'
				+'<div class="wh0"><div id="hava" style="left: 32px"></div></div>'
				+'<div class="wh0"><div id="heq" class="heq" style="left: 32px"></div></div>'
				+'<div class="wh0"><div id="bhava" onClick="har.bheq(1);" style="left: 51px">Образ</div></div>'
				+'<div class="wh0"><div id="bheq" onClick="har.bheq(2);" style="left: 110px">Экипировка</div></div>'
				+'<div class="wh0"><div id="ieq1" class="heq" style="left: 38px"></div></div>'
				+'<div class="wh0"><div id="ieq2" class="heq" style="left: 88px"></div></div>'
				+'<div class="wh0"><div id="ieq3" class="heq" style="left: 138px"></div></div>'
				+'<div class="wh0"><div id="ieq4" class="heq" style="left: 38px"></div></div>'
				+'<div class="wh0"><div id="ieq5" class="heq" style="left: 88px"></div></div>'
				+'<div class="wh0"><div id="ieq6" class="heq" style="left: 138px"></div></div>'
				+'<div class="wh0"><div id="ieq7" class="heq" style="left: 38px"></div></div>'
				+'<div class="wh0"><div id="ieq8" class="heq" style="left: 88px"></div></div>'
				+'<div class="wh0"><div id="ieq9" class="heq" style="left: 138px"></div></div>'
				+'<div class="wh0"><div id="ieq10" class="heq" style="left: 38px"></div></div>'
				+'<div class="wh0"><div id="ieq11" class="heq" style="left: 88px"></div></div>'
				+'<div class="wh0"><div id="ieq12" class="heq" style="left: 138px"></div></div>'
				+'<div class="wh0"><div id="ieq13" class="heq" style="left: 38px"></div></div>'
				+'<div class="wh0"><div id="ieq14" class="heq" style="left: 88px"></div></div>'
				+'<div class="wh0"><div id="ieq15" class="heq" style="left: 138px"></div></div>'
				+'<div class="wh0"><div id="hstat" style="left: 202px">'
					+'<table>'
						+'<tr><td class="hsT" title="Повышает урон на 3-5 единиц">Сила</td><td id="hs1" class="hsS"></td></tr>'
						+'<tr><td class="hsT" title="Увеличивает жизни, энергию и защиту">Тело</td><td id="hs2" class="hsS"></td></tr>'
						+'<tr><td class="hsT" title="Повышает вероятность уворота\nМинимальный урон, защиту и энергию на 2 единицу">Ловкость</td><td id="hs3" class="hsS"></td></tr>'
						+'<tr><td class="hsT" title="Повышает вероятность критического удара\nИ максимальный урон на 3 единицу">Интуиция</td><td id="hs4" class="hsS"></td></tr>'
					+'</table>'
				+'</div></div>'
				+'<div class="wh0"><div id="hparam" style="left: 215px">'
					+'<div class="hpv">Урон: <span id="dmg"></span></div>'
					+'<div class="hpv">Защита: <span id="def"></span></div>'
					+'<div class="hpv"><div id="rage" title="Ярость повышает урон и защиту на 30%"></span></div>'
					+'<div class="hpv"><div id="prot" title="Неуяз повышает уворот и защиту в два раза"></span></div>'
					+'<div id="nextHpv"><div id="nhpv1"></div><div id="nhpv2"></div><div id="nhpv3"></div></div>'
				+'</div></div>'
			+'</div>';
		dlg.get({w:354,c:res});
		rmP('i',{u:uid});
	},
	iok: function(data){
		//var str = data.str+data.istr;
		if(data.rg>0){
			$('#rage').html('Ярость на '+data.rg+' мин');
			data.dmg = Math.round(data.dmg*1.3);
			data.mdmg = Math.round(data.mdmg*1.3);
			data.def = Math.round(data.def*1.3);
		}else{ $('#rage').html(''); }
		if(data.pt>0){
			$('#prot').html('Неуяз &nbsp;&nbsp;на '+data.pt+' мин');
			data.def = Math.round(data.def*2);
		}else{ $('#prot').html(''); }
		$('#hnick').html(data.n);
		$('#hava').html('<div style="background: url(\'i/char/u'+data.a+'.png\'); background-position: bottom; background-repeat: no-repeat; height: 290px;"></div>');
		$('#hs1').html(data.str+data.istr).attr('title','Базовых: +'+data.str+'\nЭкипировки: +'+data.istr+'');
		$('#hs2').html(data.con+data.icon).attr('title','Базовых: +'+data.con+'\nЭкипировки: +'+data.icon+'');
		$('#hs3').html(data.dex+data.idex+'<span class="infSMF" title="Вероятность уклониться от вашего удара">`'+data.mfl+'%</span>').attr('title','Базовых: +'+data.dex+'\nЭкипировки: +'+data.idex+'');
		$('#hs4').html(data.uint+data.iuint+'<span class="infSMF" title="Вероятность нанести вам критичекий урон">`'+data.mfk+'%</span>').attr('title','Базовых: +'+data.uint+'\nЭкипировки: +'+data.iuint+'');
		$('#dmg').html(data.dmg+' - '+data.mdmg);
		$('#def').html(data.def);
		har.iseq=0;
		har.elist('');
	},
	reset: function(){
		har.isinv = 0;
		har.iseq = 0;
		har.isbox = 0;
	},
	addstat: function(n){
		if(my.room<100 || my.room>200){ body.err('Распределять статы можно только в городе'); }
		rmP('addstat',{n:n});
	},
	rfStat: function(n){
		$('#dmg').html(my.dmg+' - '+my.mdmg);
		$('#def').html(my.def);
		h.hp();
		h.mv();
		if(typeof n=='number'){
			var sarr = ['','str','con','dex','uint'];
			var stat = sarr[n];
			if(my.fs<1){ $('.bhsadd').remove(); $('#bhfs').remove(); har.btr(); }
			else{ $('#fsNum').html(my.fs); }
			$('#hs'+n).html(my[stat]+my['i'+stat]).attr('title','Базовых: +'+my[stat]+'\nЭкипировки: +'+my['i'+stat]);
			return;
		}
		$('#hs1').html(my.str+my.istr).attr('title','Базовых: +'+my.str+'\nЭкипировки: +'+my.istr);
		$('#hs2').html(my.con+my.icon).attr('title','Базовых: +'+my.con+'\nЭкипировки: +'+my.icon);
		$('#hs3').html(my.dex+my.idex).attr('title','Базовых: +'+my.dex+'\nЭкипировки: +'+my.idex);
		$('#hs4').html(my.uint+my.iuint).attr('title','Базовых: +'+my.uint+'\nЭкипировки: +'+my.iuint);
		$('#imrkg').html(h.fixkg(my.rkg));
	},
	bheq: function(n){
		if(n==1){
        	$('.heq').css({display:'none'});
        	$('#hava').css({display:'block'});
        	$('#bheq').css({color:'#244c63'});
        	$('#bhava').css({color:'#22648a'});
		}else{
        	$('#hava').css({display:'none'});
        	$('.heq').css({display:'block'});
        	$('#bheq').css({color:'#22648a'});
        	$('#bhava').css({color:'#244c63'});
		}
		if(my.room>100 && my.room<200) $('#botav').css({display:'block'});
	},
	isbinv: 0,
	binv: function(n){
		var res = '<div class="binv binvon" id="binv0" onClick="har.binvGet(0);"></div>';
		for(var i=1;i<=n;i++){
			res += '<div class="binv" id="binv'+i+'" onClick="har.binvGet('+i+');"></div>';
		}
		$('#binv').html(res);
	},
	binvGet: function(n){
		$('.binv').removeClass('binvon');
		$('#binv'+n).addClass('binvon');
		har.invPage = n;
		har.ilist();
	},
	dom: function(){
		$('#ikg').html(h.fixkg(har.kg));
		$('#irkg').html(h.fixkg(har.rkg));
		har.ilist();
		har.blist();
		har.elist('снять');

		if( ((har.kg+0.1)/my.kg)>0.5 ) $('#invkg').css({color:'#B0B0B0'});
		else $('#invkg').css({color:'#2a2c2b'});
	},
	ilist: function(){
		var res = '';
		var but = '';
		var cbinv = parseInt(count(har.inv)/25);
		var p = har.invPage*24;
		for(var i in har.inv){
			if(i>p && i<(p+25)){
				but = '';
				if(har.inv[i].tt>9)  but = 'надеть';
				if(my.room>100 && my.room<200){
					if(har.inv[i].tt==1) but = 'в рюкзак';
					if(har.inv[i].tt==2) but = 'крафт';
				}else{ if(har.inv[i].tt==1) but = 'исп.'; }
				res += itm.get({d:har.inv[i],oclick:'har.dress(\'inv\','+i+');',but:but});
			}
		}
		$('#inv').html(res);
		if(har.isbinv!=cbinv){ har.isbinv=cbinv; har.binv(cbinv); };
	},
	blist: function(){
		var res = '';
		var but = '';
		for(var i in har.ibox){
			if(my.room>100 && my.room<200) but = 'снять';
			else but = 'исп.';
			res += itm.get({d:har.ibox[i],cl:'ibox',wh:35,oclick:'har.rem('+har.ibox[i].i+');',but:but});
		}
		$('#ibox').html(res);
	},
	elist: function(but){
		var res = '';
		//var but = '';
		var num = 0;
		for(var i=10;i<=25;i++){
			num = i - 10;
			if(typeof har.ieq[i] == 'undefined'){
                $('#ieq'+num).css({background: 'url("i/itm/i'+num+'.png")'}).html('');
				continue;
			}
			res = itm.get({d:har.ieq[i],cl:'eq'+num,oclick:'har.rem('+har.ieq[i].i+');',but:but});
			$('#ieq'+num).css({background: 'url("i/clear.png")'});
			$('#ieq'+num).html(res);
		}
	},
	dress: function(sel,i){
		var v = har[sel];
		if(v[i].s==3 && v[i].tt==1){
	    	if(v[i].l>my.lvl){ body.err('<b>Невозможно использовать! Уровень предмета больше вашего.</b><br>Чтобы использовать этот предмет, достигните '+v[i].l+' уровня.'); return; }
		}else{
	    	if(v[i].l>my.lvl){ body.err('<b>Невозможно надеть! Уровень предмета больше вашего.</b><br>Чтобы надеть этот предмет, достигните '+v[i].l+' уровня.'); return; }
	    	if(v[i].mp==0){ body.err('<b>Невозможно надеть! Предмет поломан.</b><br>Починить вещь можно у кузнеца.'); return; }
	    	if(v[i].tt==1 && har.rkg>my.rkg){ body.err('<b>Невозможно надеть!</b><br>Рюкзак переполнен'); return; }
	  	}
    	rmP('dom',{i:har.isinv,e:har.iseq,b:har.isbox,a:1,id:v[i].i});
	},
	rem: function(id){
    	rmP('dom',{i:har.isinv,e:har.iseq,b:har.isbox,a:2,id:id});
	},
	btr: function(){
    	if(my.fs==0 && my.lvl>my.fsk) $('#btren').css({display:'block'});
    	if(my.lvl>7) $('#botav').css({display:'block'});
	   	$('#bkach').css({display:'block'});
	   	$('#botd').css({display:'block'});
	},
	trenWin: function(){
		var res = ''
			+'<div class="wh0"><div id="bgtren"></div></div>'
			+'<div id="tren"></div>'
			+'<div class="wh0"><div id="trenNote">Это школа древних боевых искусств.<br>За заряженные кристаллы вас обучат новым навыкам ведения боя.<br><br><b>Что даст вам дополнительный свободный стат.</b></div></div>'
			+'<div class="wh0"><div id="trenCena"></div></div>'
			+'<div class="wh0"><div id="trenBut"><br>Загрузка...</div></div>'
			+'';
		dlg.get({w:451,t:'Тренировочный лагерь',c:res});
		rmP('tren');
	},
	otdWin: function(){
		var res = ''
			+'<div id="otdih"></div>'
			+'<div class="wh0"><div id="txtLekar">Целитель Джо, вылечит быстро и эффективно за небольшую плату.</div></div>'
			+'<div class="wh0"><div id="txtGostin">Отдых в гостинице Мэри, дешево и быстро восстановит ваши силы.</div></div>'
			+'<div class="wh0"><div id="otdButL"></div></div>'
			+'<div class="wh0"><div id="otdButG"></div></div>'
			+'';
		dlg.get({w:454,t:'Лекарьня и Гостиница',c:res});
		if(my.k2>0){
			$('#otdButL').html('<div id="otdButAddL" onClick="har.otdOkL();"></div><div class="otdCena">стоит 1 кристалл</div>');
			$('#otdButG').html('<div id="otdButAddG" onClick="har.otdOkG();"></div><div class="otdCena">стоит 1 кристалл</div>');
		}else{
			$('#otdButL').html('Недостаточно кристаллов для исцеления у Джо.');
			$('#otdButG').html('Недостаточно кристаллов для отдыха в гостинице.');
		}
		if(my.hp>(my.mhp-30)){ $('#otdButL').html('Вы выглядите здоровым, вам не нужен лекарь.'); }
		if(my.mv>(my.mmv-30)){ $('#otdButG').html('Вы выглядите отдохнувшим и бодрым.'); }
	},
	otdOkL: function(){
    	$('#otdButL').html(''
    		+'<div class="wh0" style="position: relative; top:8px; left: 20px;"><div id="piDLoadLine"></div></div>'
    		+'<div class="wh0"><div id="piDLoad"  style="top:8px; left: 20px;"></div></div>'
    		+'');
		$('#piDLoadLine').animate({width: '61px'},3000,function(){
			rmP('otd',{a:1});
		});
	},
	otdOkG: function(){
    	$('#otdButG').html(''
    		+'<div class="wh0" style="position: relative; top:8px; left: 20px;"><div id="piDLoadLine"></div></div>'
    		+'<div class="wh0"><div id="piDLoad"  style="top:8px; left: 20px;"></div></div>'
    		+'');
		$('#piDLoadLine').animate({width: '61px'},3000,function(){
			rmP('otd',{a:2});
		});
	},
	trenClose: function(){
		$('#trenBut').html('<div id="errTrenBut" onClick="har.main();" title="Тренироваться в данный момент не возможно.\nПокинуть школу."><br>Закрыто<br>&nbsp;</div>');
	},
	trenAddStat: function(k){
		$('#trenBut').html('<div id="trenButAdd" onClick="har.trenAS();" title="Стоимость тренировки '+k+' заряженных кристаллов.\nПо окончанию тренировки вы получите +1 свободный стат."></div>');
	},
	trenAS: function(){
		$('#trenBut').html('<br>Загрузка...');
		rmP("tren",{a:1});
	},
	trenOk: function(){
    	$('#trenBut').html(''
    		+'<div class="wh0" style="position: relative; top:8px; left: 10px;"><div id="piDLoadLine"></div></div>'
    		+'<div class="wh0"><div id="piDLoad"  style="top:8px; left: 10px;"></div></div>'
    		+'');
		$('#piDLoadLine').animate({width: '61px'},3000,function(){
			$('#trenBut').html('<div id="trenButEnd" onClick="har.main();" title="Вернуться в раздел героя\nдля распледеления статов"></div>');
		});
	},
	idops: function(data){
		var dsu = '';
		if(data.dsu==1){
			var titm = {i:1,cv:1,dp:'Цена',dpv:'<span style=" color: #3C3C3C; font-weight: bold;">150 кристаллов</span>',tt:1,l:15,n:'Дирдоновский сундук',nt:'Можно открыть на вершине арены г.Айтарии. Хранит в себе вещь 16-17 уровня.',iid:"1079",kg:7,def:0,other:0,str:0,con:0,dex:0,int:0};
			dsu = '<div style="font-weight:normal">'+itm.get({d:titm,oclick:'har.idopsBuy();',but:'купить'})+'</div>';
		}
		$('#nhpv2').html('<div clas="hpv" title="Дается за:\nУбийство мобов 16 уровня и выше\nЗа покупку любой игровой валюту">Добытчик: '+data.ds+'</div>'+dsu);
	},
	ilimit: function(lim){
		$('#nhpv1').html('<div clas="hpv" title="Сколько осталось добыть частиц за сутки.\n Лимит повышается за уровень и донат.">Лимит: '+lim+'k</div>');
	},
	idopsBuy: function(){
		if(my.k2<150){
			body.err("У вас не хватает кристаллов для покупки сундука.");
			return;
		}
		rmP('i',{u:my.uid,sun:1});
	},
	rageBuy: function(){
		if(my.k3<1) body.err("У вас недостаточно заряженных кристаллов");
		rmP('rage');
	},
	protBuy: function(){
		if(my.k3<1) body.err("У вас недостаточно заряженных кристаллов");
		rmP('prot');
	},
	kachWin: function(){
		var res = ''
			+'<div class="wh0" style="height:258px;"><div id="bgkach"></div></div>'
			+'<div class="wh0"><div id="imgKach"></div></div>'
			+'<div class="wh0"><div id="nameKach"></div></div>'
			+'<div class="wh0"><div id="cenaKach"></div></div>'
			+'<div class="wh0"><div id="buyKach"></div></div>'
			+'<div class="wh0"><div id="slKach" onClick="har.slKach();"></div></div>'
			+'<div class="wh0"><div id="srKach" onClick="har.srKach();"></div></div>'
			+'';
		dlg.get({w:257,t:'Тренировка способностей',c:res});
		rmP('kach');
	},
	actKach:1,
	dataKach: {},
	slKach: function(){
		har.actKach--;
		if(har.actKach<1) har.actKach = 7;
        if(count(har.dataKach)<1) return;
		har.getKach(har.actKach,har.dataKach)
	},
	srKach: function(){
		har.actKach++;
		if(har.actKach>7) har.actKach = 1;
        if(count(har.dataKach)<1) return;
		har.getKach(har.actKach,har.dataKach)
	},
	getKach: function(p,data){
		har.actKach = p;
		har.dataKach = data;
		var arrVal = ['','str','con','dex','uint','dmg','mdmg','def','mhp','mmv'];
		var arrStr = ['','силы','тело','ловкости','интуиции','минимального урона','максимального урона','защиты','жизни','энергии'];
		var arrStrN = ['','Ваша <b>сила</b>','Ваше <b>тело</b>','Ваша <b>ловкость</b>','Ваша <b>интуиция</b>','Ваш <b>мин. урон</b>','Ваш <b>мак. урона</b>','Ваша <b>защита</b>','Ваши <b>жизни</b>','Ваша <b>эергия</b>'];

		$('#nameKach').html(arrStrN[p]+' '+data[arrVal[p]]+'%');
		$('#imgKach').html('<img src="i/ui/kach/a'+p+'.png">');

		if(data.s>0){
			$('#cenaKach').html('Вы уже приобрели задание на повышения умений.');
		}else{
			var cenaStr = '';
			var cena = Math.round(data[arrVal[p]]*data[arrVal[p]]*data[arrVal[p]]*0.51+1);
			if(cena==1) cenaStr = cena+' кристалл';
			if(cena>1 && cena<5) cenaStr = cena+' кристалла';
			if(cena>4) cenaStr = cena+' кристаллов';
			$('#cenaKach').html('Цена за +1% '+arrStr[p]+'<br>стоит '+cenaStr);
		}
	},
	buyKach: function(){
		$('#buyKach').html('');
		rmP('kach',{p:har.actKach,a:har.actKach});
	},
	vote: function(i){
		$('#nhpv3').html('<div class="but" onClick="har.setVote('+i+');">Голосовать</div><br>На должность советника игры.');
	},
	setVote: function(i){
		$('#nhpv3').html('загрузка');
		rmP('vote',{u:i});
	}
}

function pl(data){
	var cnick,chp,cimg;
	for(var i in data){
		v = data[i];
		pi.aul[i] = v;
        if(v.u==i){
			if(v.v==0) $('#p'+i+' .pui').html('');
			else $('#p'+i+' .pui').html('<div class="pVal"><img src="i/itm/s'+v.v+'.png"></div>');
        }else{
        	if(v.c>0) clan='<img src="i/clan/i'+v.c+'.png" height=8> ';
        	else clan = '';
        	cnick = '<div class="wh0"><div class="cuNick">'+clan+v.n+'</div></div>';
			chp = '<div class="cuTop" id="cut'+i+'"><div class="cuHpM"></div><div class="cuHp" style="width: '+v.h+'%"></div><div class="cuLvl">'+v.l+'</div></div>';
			cimg = '<div class="charMini" style="background: url(i/char/u'+v.a+'.png) 50% 100% no-repeat; background-size: contain;"></div>';
	        if(v.u==my.uid)	$('#p'+i+' .pui').html('<div class="wh0" id="myPiHero">'+cnick+chp+cimg+'</div>');
	        else $('#p'+i+' .pui').html(cnick+chp+cimg);
        	if(v.u==my.uid){
        		my.pid = i;
				if(v.v>0){
					if($('#piLBox').is('#piDrop')==false){
						if(v.v>59 && v.v<80) pi.rfdl();
						else pi.drop();
					}
				}
        	}
        }
	}

	pi.cursRem();
	$('#p'+my.pid+' .pbg').addClass('paMy');
	for(var vp in pi.aib[my.pid]){
		if($('#p'+vp+' .cuNick').html()!=null){ $('.p.p'+vp).addClass('pCursA'); }
		else{ $('.p.p'+vp).addClass('pCurs'); }
		$('#p'+vp+' .pbg').addClass('paGo');
	}
	if(my.kt>0) pi.cursWait();
	else pi.cursOk();
	h.rf();
}
function p(id){
	var act = 0;
	if(typeof pi.aib[my.pid][id]=='undefined'){ tt.pcerr(id); return; }
	if(my.kt>0){
		//tt.pclick(id);
		return;
	}else{
		if(pi.aul[id].u<100){
			if(my.mv<1){ pi.notmv(); return; }
		}else{
			if(my.mv<2){ pi.notmv(); return; }
			act = 1;
		}
		my.kt = 2;
		rmP('ib',{i:id,cr:my.cr,et:my.et,a:act});

		if(my.lvl<14){
			a = $('#myPiHero').offset();
			$('#myPiHero').animate({top:-6},100);
		}
		faq.isf();
	}
}
pi = {
	aul: [],
	aib: [
		{62:0,63:0,64:0,52:0,53:0,54:0,55:0,56:0,57:0,58:0,59:0,65:0,66:0,67:0},
		{2:0,3:0,4:0},
		{1:0,3:0,5:0,6:0},
		{1:0,2:0,4:0,5:0,6:0,7:0,8:0,9:0},
		{1:0,3:0,8:0,9:0},
		{2:0,3:0,6:0,10:0,11:0},
		{2:0,3:0,5:0,7:0,10:0,11:0,12:0},
		{3:0,6:0,8:0,11:0,12:0,13:0,14:0,15:0},
		{3:0,4:0,7:0,9:0,14:0,15:0,16:0},
		{3:0,4:0,8:0,15:0,16:0},
		{5:0,6:0,11:0,17:0,18:0},
		{5:0,6:0,7:0,10:0,12:0,17:0,18:0,19:0},
		{6:0,7:0,11:0,13:0,18:0,19:0,20:0},
		{7:0,12:0,14:0,19:0,20:0,21:0,22:0,23:0},
		{7:0,8:0,13:0,15:0,22:0,23:0,24:0},
		{7:0,8:0,9:0,14:0,16:0,23:0,24:0,25:0},
		{8:0,9:0,15:0,24:0,25:0},
		{10:0,11:0,18:0,26:0,27:0},
		{10:0,11:0,12:0,17:0,19:0,26:0,27:0,28:0},
		{11:0,12:0,13:0,18:0,20:0,27:0,28:0,29:0},
		{12:0,13:0,19:0,21:0,28:0,29:0,30:0},
		{13:0,20:0,22:0,29:0,30:0,31:0,32:0,33:0},
		{13:0,14:0,21:0,23:0,32:0,33:0,34:0},
		{13:0,14:0,15:0,22:0,24:0,33:0,34:0,35:0},
		{14:0,15:0,16:0,23:0,25:0,34:0,35:0,36:0},
		{15:0,16:0,24:0,35:0,36:0},
		{17:0,18:0,27:0,37:0,38:0},
		{17:0,18:0,19:0,26:0,28:0,37:0,38:0,39:0},
		{18:0,19:0,20:0,27:0,29:0,38:0,39:0,40:0},
		{19:0,20:0,21:0,28:0,30:0,39:0,40:0,41:0},
		{20:0,21:0,29:0,31:0,40:0,41:0,42:0},
		{21:0,30:0,32:0,41:0,42:0,43:0,44:0,45:0},
		{21:0,22:0,31:0,33:0,44:0,45:0,46:0},
		{21:0,22:0,23:0,32:0,34:0,45:0,46:0,47:0},
		{22:0,23:0,24:0,33:0,35:0,46:0,47:0,48:0},
		{23:0,24:0,25:0,34:0,36:0,47:0,48:0,49:0},
		{24:0,25:0,35:0,48:0,49:0},
		{26:0,27:0,38:0,50:0,51:0},
		{26:0,27:0,28:0,37:0,39:0,50:0,51:0,52:0},
		{27:0,28:0,29:0,38:0,40:0,51:0,52:0,53:0},
		{28:0,29:0,30:0,39:0,41:0,52:0,53:0,54:0},
		{29:0,30:0,31:0,40:0,42:0,53:0,54:0,55:0},
		{30:0,31:0,41:0,43:0,54:0,55:0},
		{31:0,42:0,44:0,55:0,56:0},
		{31:0,32:0,43:0,45:0,56:0,57:0},
		{31:0,32:0,33:0,44:0,46:0,56:0,57:0,58:0},
		{32:0,33:0,34:0,45:0,47:0,57:0,58:0,59:0},
		{33:0,34:0,35:0,46:0,48:0,58:0,59:0,60:0},
		{34:0,35:0,36:0,47:0,49:0,59:0,60:0,61:0},
		{35:0,36:0,48:0,60:0,61:0},
		{37:0,38:0,51:0,62:0,63:0},
		{37:0,38:0,39:0,50:0,52:0,62:0,63:0,64:0},
		{38:0,39:0,40:0,51:0,53:0,63:0,64:0},
		{39:0,40:0,41:0,52:0,54:0,64:0},
		{40:0,41:0,42:0,53:0,55:0},
		{41:0,42:0,43:0,54:0},
		{43:0,44:0,45:0,57:0},
		{44:0,45:0,46:0,56:0,58:0},
		{45:0,46:0,47:0,57:0,59:0,65:0},
		{46:0,47:0,48:0,58:0,60:0,65:0,66:0},
		{47:0,48:0,49:0,59:0,61:0,65:0,66:0,67:0},
		{48:0,49:0,60:0,66:0,67:0},
		{50:0,51:0,63:0},
		{50:0,51:0,52:0,62:0,64:0},
		{51:0,52:0,53:0,63:0},
		{58:0,59:0,60:0,66:0},
		{59:0,60:0,61:0,65:0,67:0},
		{60:0,61:0,66:0},
	],
	kt: function(){
		if(my.kt>0){
			my.kt--;
			if(my.kt>0){
				pi.cursWait();
			}else{
				$('#p'+my.pid+' .pbg').html('');
				pi.cursOk();
			}
		}
	},
	cursOk: function(){
		$('.pCurs').css({cursor:'pointer'});
		$('.pCursA').css({cursor:'url("i/curs/a1.png"), pointer'});
	},
	cursWait: function(){
		$('.pCurs').css({cursor:'progress'});
		$('.pCursA').css({cursor:'progress'});
	},
	cursRem: function(){
		$('.pCurs').css({cursor:'default'});
		$('.pCursA').css({cursor:'default'});
		$('.p').removeClass('pCurs');
		$('.p').removeClass('pCursA');
	},
	ib: function(pid){
		cs = 4;
		my.pid = pid;
/*
		if(my.lvl>13) my.kt = 2;
		else my.kt = 1;
*/
		my.kt = 2;
		$('.paMy').html('');
		$('.pbg').removeClass('paGo');
		$('.pbg').removeClass('paMy');
		//$('#p'+my.pid+' .pbg').html('<img src="i/ui/lhs2.gif?'+rand(0,999)+'" class="lhs2">');
		pi.cursRem();
		h.rf();
		if(pi.aul[pid].v>59 && pi.aul[pid].v<80){ pi.rfdl(); return; }
		if(pi.aul[pid].v>0){ pi.vDropOpen = true; pi.drop(); }
		else{ pi.pRBoxEmpty(); }

		//Плавное передвижение по клеткам
		if(my.lvl<14){
			setTimeout(function(){
					$('#myPiHero').animate({top:1,left:0},200).animate({top:1,left:1},200)
						.animate({top:0,left:1},200).animate({top:-1,left:1},200)
						.animate({top:-1,left:0},200).animate({top:-1,left:-1},200)
						.animate({top:0,left:-1},200).animate({top:0,left:0},200);
				/*
				if(rand(0,1)==0){
					$('#myPiHero').animate({top:2,left:1},200).animate({top:1,left:3},200)
						.animate({top:0,left:4},200).animate({top:-1,left:2},200)
						.animate({top:-2,left:0},200).animate({top:-1,left:-2},200)
						.animate({top:0,left:-1},200).animate({top:0,left:0},200);
				}else{
					$('#myPiHero').animate({top:2,left:2},200).animate({top:0,left:4},200)
						.animate({top:2,left:2},200).animate({top:0,left:0},200)
						.animate({top:2,left:-2},200).animate({top:0,left:-4},200)
						.animate({top:2,left:-2},200).animate({top:0,left:0},200);
				}
				*/
			},100);
		}
	},
	cnb: function(n){
		$('#p'+n+' .cuNick').css({display:'block'});
	},
	cnn: function(n){
		$('#p'+n+' .cuNick').fadeOut(500);
	},
	exit: function(){
		room.set(101);
	},
	catk: function(data){
		var arrDmg = ['уворот',data.d+' урона',data.d+' крита',data.d+' урона'];
		var arrDmgС = ['вы увернулись','нанес '+data.d+' урона','нанес '+data.d+' крита','нанес '+data.d+' урона'];
		var arrDmgV = ['<span style="color: #86a746">уворот</span>','<span style="color: #968372">-'+data.d+'</span>','-'+data.d+' крит','<span style="color: #b8aa9e">-'+data.d+'</span>'];
		var arrRip = ['',', вас убили'];
		var id = data.i+1000000;
		ca('▫'+data.n+', -▫'+my.nick+',['+my.lvl+']: '+arrDmg[data.a]+arrRip[data.r]);
		if($('div').is('#catk'+data.i)){
			 $('#catk'+data.i+' .catkDmg').html(arrDmgС[data.a]+arrRip[data.r]);
		}else{
			if(data.i>10000){
				if(data.i!=my.uid){
					var msg = '<div id=catk'+data.i+' class=catk>На вас напал ▫'+data.n+', и <span class=catkDmg>'+arrDmgС[data.a]+arrRip[data.r]+'</span></div>';
					eval('cm({'+id+':{d:0,u:0,tu:0,m:"'+msg+'"}});');
				}
			}
		}
		if(data.r>0){
			if(data.i>10000){
				$('.cb'+id).remove();
				cm({0:{d:0,u:0,tu:0,m:'Вас убил ▫'+data.n+','}});
			}
			pi.rip();
		}else{
			$('#p'+data.p+' .pbg').html('<div class="pr0"><div class="cuAtk">'+arrDmgV[data.a]+'</div></div>');
			$('#p'+data.p+' .cuAtk').animate({opacity: 0,left: '+=8px',top: '-=20px'},1000);
		}
	},
	catk: function(data){
		var arrDmg = ['уворот',data.d+' урона',data.d+' крита',data.d+' урона'];
		var arrDmgС = ['вы увернулись','нанес '+data.d+' урона','нанес '+data.d+' крита','нанес '+data.d+' урона'];
		var arrDmgV = ['<span style="color: #86a746">уворот</span>','<span style="color: #968372">-'+data.d+'</span>','-'+data.d+' крит','<span style="color: #b8aa9e">-'+data.d+'</span>'];
		var arrRip = ['',', вас убили'];
		var id = data.i+1000000;
		ca('▫'+data.n+', -▫'+my.nick+',['+my.lvl+']: '+arrDmg[data.a]+arrRip[data.r]);
		if($('div').is('#catk'+data.i)){
			 $('#catk'+data.i+' .catkDmg').html(arrDmgС[data.a]+arrRip[data.r]);
		}else{
			if(data.i>10000){
				if(data.i!=my.uid){
					var msg = '<div id=catk'+data.i+' class=catk>На вас напал ▫'+data.n+', и <span class=catkDmg>'+arrDmgС[data.a]+arrRip[data.r]+'</span></div>';
					eval('cm({'+id+':{d:0,u:0,tu:0,m:"'+msg+'"}});');
				}
			}
		}
		if(data.r>0){
			if(data.i>10000){
				$('.cb'+id).remove();
				cm({0:{d:0,u:0,tu:0,m:'Вас убил ▫'+data.n+','}});
			}
			pi.rip();
		}else{
			$('#p'+data.p+' .pbg').html('<div class="pr0"><div class="cuAtk">'+arrDmgV[data.a]+'</div></div>');
			$('#p'+data.p+' .cuAtk').animate({opacity: 0,left: '+=8px',top: '-=20px'},1000);
		}
	},
	tatk: function(data){
		var arrDmg = ['уворот',data.d+' урона',data.d+' крита',data.d+' урона'];
		var arrDmgС = ['вы увернулись','нанес '+data.d+' урона','нанес '+data.d+' крита','нанес '+data.d+' урона'];
		var arrDmgV = ['<span style="color: #86a746">уворот</span>','<span style="color: #968372">-'+data.d+'</span>','-'+data.d+' крит','<span style="color: #b8aa9e">-'+data.d+'</span>'];
		var arrRip = ['',', вас убили'];
		var id = data.i+1000000;
		ca('▫'+data.n+', -▫'+data.t+',['+data.l+']: '+arrDmg[data.a]+arrRip[data.r]);
		if(data.r>0){
			if(data.i>10000){
				$('.cb'+id).remove();
				cm({0:{d:0,u:0,tu:0,m:'Вас убил ▫'+data.t+','}});
			}
			pi.rip();
		}else{
			$('#p'+data.p+' .pbg').html('<div class="pr0"><div class="cuAtk">'+arrDmgV[data.a]+'</div></div>');
			$('#p'+data.p+' .cuAtk').animate({opacity: 0,left: '+=8px',top: '-=20px'},1000);
		}
	},
	atk: function(data){
		var arrDmg = ['уворот',data.d+' урона',data.d+' крита',data.d+' урона'];
		var arrDmgV = ['<span style="color: #86a746">уворот</span>','<span style="color: #968372">-'+data.d+'</span>','-'+data.d+' крит','<span style="color: #b8aa9e">-'+data.d+'</span>','<span style="color: #A65300">убит</span>'];
		my.mv = data.m;
		/*
		if(my.lvl>5) my.kt = 2;
		else my.kt = 1;
		*/
		my.kt = 2;
		cs = 2;
		h.rf();
		if(data.r>0) data.a = 4;
		$('#p'+data.p+' .pbg').html('<div class="pr0"><div class="cuAtk">'+arrDmgV[data.a]+'</div></div>');
		$('#p'+data.p+' .cuAtk').animate({opacity: 0,left: '+=8px',top: '-=20px'},1000);
	},
	rip: function(){
		cs = 3;
		my.hp = 0;
		rmP('r',{et:my.et,cr:my.cr,ul:1});
		h.hp();
		room.get(101);
	},
	dot: function(data){
		if(typeof data.mv=='number') my.mv = data.mv;
		if(typeof data.hp=='number') my.hp = data.hp;
		ca(data.m);
		h.mv(); h.hp();
	},
	dot1: function(data){
		my.kt = data.kt;
		ca(data.m);
	},
	pRBoxEmpty: function(){
		if(pi.dk1>0){ my.k1 += pi.dk1; h.k1(); }
		pi.dk1 = 0;
		pi.vDropOpen = true;
		pi.ditm = {};
		$('#piRBox').html('');
		$('#piRBoxTop').html('');
	},
	vDropOpen: true,
	ditm: {},
	dk1: 0,
	isrfdl: true,
	rfdl: function(){
		if(pi.isrfdl){
			pi.pRBoxEmpty();
			pi.isrfdl = false;
			rmP('rfdl');
			setTimeout(function(){ pi.isrfdl = true; },2000);
		}
	},
	dropLoad: function(data){
		pi.drop();
		if(data.c>99) return;
		if(data.c<1) data.c = 1;
		var px = Math.round(61*data.c/100);
		$('#piDBut').html('<div class="wh0"><div id="piDLoadLine" style="width: '+px+'px;"></div></div><div class="wh0"><div id="piDLoad"></div><div class="piDLNote">'+data.m+'</div></div>');
		/*
		$('#piDLoadLine').animate({width: px+'px'},1000,function(){
		});
		*/
		//piDBut
	},
	drop: function(){
		var res,resTop;
		var val = pi.aul[my.pid].v;
		var strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsend();">';
		if(pi.vDropOpen){
			pi.vDropOpen = false;
	       	res = '<div id="piDrop">'
	       			+'<div class="wh0"><div id="piDBG" style="background: url(\'i/itm/d'+val+'.png\')"></div></div>'
	       			+'<div class="wh0"><div id="piDFrame"></div></div>'
	       		+'</div>';
			$('#piRBox').html(res);
			if(val==7){
		       	strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsend();" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">Восстановить энергию<br>стоит 1 кристалл</div></div>';
			}
			if(val==8){
		       	strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsend();" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">Восстановить жизнь<br>стоит 1 кристалл</div></div>';
			}
			if(val==10){
		       	strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsend();" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">Активировать<br>стоит 95 частиц</div></div>';
			}
			if(val==11){
				var mv = 0;
				mv = Math.round(my.mmv*0.15);
				if(((my.mv-mv)<4) || (mv<4)) mv = 3;
		       	strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsend();" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">Восстанавливает<br>+'+(mv*9)+' жизни<br>за '+mv+' энергии</div></div>';
			}
	       	if(val>49 && val<54){
		       	if(val==53) strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsendk2('+val+');">';
		       	else strButImg = '<img src="i/ui/pDBZar.png" onClick="pi.dsendk2('+val+');" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">зарядить на +33%<br>стоит 90 частиц</div></div>';
	       	}
	       	if(val>54 && val<59){
		       	if(val==58) strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsendk3('+val+');">';
		       	else strButImg = '<img src="i/ui/pDBZar.png" onClick="pi.dsendk3('+val+');" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">зарядить на +33%<br>стоит 1 кристалл</div></div>';
	       	}
			if(val==80){
		       	strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsend();" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">Активировать<br>стоит 1 кристалл</div></div>';
			}
	       	if(val==90){
				var toStrCity = 'Телепорт в Айтарию';
	       		if(my.room==209) toStrCity = 'В арену Вторжение';
		       	strButImg = '<img src="i/ui/pDBOpen.png" onClick="pi.dsend();" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">'+toStrCity+'<br>стоит 1 кристалл</div></div>';
	       	}
	      	resTop = '<div class="wh0"><div id="piDBut">'+strButImg+'</div></div>'
       			+'<div class="wh0"><div id="piDItm"></div></div>';
			$('#piRBoxTop').html(resTop);
		}
	},
	dinfOver: function(){
		$('.piDNote').css({display:'block'});
	},
	dinfOut: function(){
		$('.piDNote').css({display:'none'});
	},
	dsend:function(){
		if(my.mv<3){ pi.notmv(); return; }
		$('#piDBut').html('<div class="wh0"><div id="piDLoadLine"></div></div><div class="wh0"><div id="piDLoad"></div></div>');
		my.kt = 4;
		rmP('drop');
		pi.dload();
	},
	dsendk2:function(val){
		if(my.mv<4){ pi.notmv(); return; }
		if(my.kt>0 && val>50){ body.err("Действие недоступно.<br>Попробуйте еще раз через "+my.kt+" сек."); return; }
		$('#piDBut').html('<div class="wh0"><div id="piDLoadLine"></div></div><div class="wh0"><div id="piDLoad"></div></div>');
		if(val==53){
			my.kt = 3;
			pi.dload();
		}else{
			if(my.k1<90){ $('#piDBut').html('<div class="piDErr">Не хватает<br>частиц</div>'); body.err("<b>У вас не хватает частиц кристалла.</b><br>Источник заряжается за 90 частиц на +33%"); return; }
			my.kt = 4;
			pi.dloadk2(val);
		}
		rmP('zar');
	},
	dloadk2: function(val){
		$('#piDLoadLine').animate({width: '61px'},4000,function(){
			val++
			$('#piDBG').css({background:'url("i/itm/d'+val+'.png")'});
			if(val==53) $('#piDBut').html('<img src="i/ui/pDBOpen.png" onClick="pi.dsendk2('+val+');">');
			else $('#piDBut').html('<img src="i/ui/pDBZar.png" onClick="pi.dsendk2('+val+');" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">зарядить на +33%<br>стоит 90 частиц</div></div>');
		});
	},
	dsendk3:function(val){
		if(my.mv<5){ pi.notmv(); return; }
		if(my.kt>0 && val>55){ body.err("Действие недоступно.<br>Попробуйте еще раз через "+my.kt+" сек."); return; }
		$('#piDBut').html('<div class="wh0"><div id="piDLoadLine"></div></div><div class="wh0"><div id="piDLoad"></div></div>');
		if(val==58){
			my.kt = 3;
			pi.dload();
		}else{
			if(my.k2<1){ $('#piDBut').html('<div class="piDErr">Не хватает<br>кристаллов</div>'); body.err("<b>У вас не хватает кристаллов.</b><br>Источник заряжается за кристалл на +33%"); return; }
			my.kt = 5;
			pi.dloadk3(val);
		}
		rmP('zar1');
	},
	dloadk3: function(val){
		$('#piDLoadLine').animate({width: '61px'},5000,function(){
			val++
			$('#piDBG').css({background:'url("i/itm/d'+val+'.png")'});
			if(val==58) $('#piDBut').html('<img src="i/ui/pDBOpen.png" onClick="pi.dsendk3('+val+');">');
			else $('#piDBut').html('<img src="i/ui/pDBZar.png" onClick="pi.dsendk3('+val+');" onMouseOver="pi.dinfOver();" onMouseOut="pi.dinfOut();"><div class="wh0"><div class="piDNote">зарядить на +33%<br>стоит 1 кристалл</div></div>');
		});
	},
	dload: function(){
		$('#piDLoadLine').animate({width: '61px'},3000,function(){
			if(count(pi.ditm)>0){
				$('#piDBG').css({background:'url("i/ui/pDBGItm.png")'});
				$('#piDItm').html(''
						+'<div class="wh0"><div id="piDSlot1"></div></div>'
						+'<div class="wh0"><div id="piDSlot2"></div></div>'
						+'<div class="wh0"><div id="piDSlot3"></div></div>'
						+'<div class="wh0"><div id="piDSlot4"></div></div>'
					+'');
				$('#piDBut').html('<img src="i/ui/pDBClose.png" onClick="pi.pRBoxEmpty();">');
				har.isinv = 0;
				for(var i in pi.ditm){
					$('#piDSlot'+i).html(itm.get({d:pi.ditm[i],oclick:'har.dress(\'inv\','+i+');',but:'',dm:1}));
				}
			}else{ pi.pRBoxEmpty(); }
		});
	},
	dropMob: function(){
		var res,resTop;
		if(count(pi.ditm)==0){
			return;
		}
       	res = '<div id="piDrop">'
       			+'<div class="wh0"><div id="piDBG" style="background: url(\'i/itm/d'+pi.aul[my.pid].v+'.png\')"></div></div>'
       			+'<div class="wh0"><div id="piDFrame"></div></div>'
       		+'</div>';
      	resTop = '<div class="wh0"><div id="piDBut"><img src="i/ui/pDBOpen.png" onClick="pi.dsend();"></div></div>'
       			+'<div class="wh0"><div id="piDItm"></div></div>';
		$('#piRBox').html(res);
		$('#piRBoxTop').html(resTop);
		$('#piDBG').css({background:'url("i/ui/pDBGItm.png")'});
		$('#piDItm').html(''
				+'<div class="wh0"><div id="piDSlot1"></div></div>'
				+'<div class="wh0"><div id="piDSlot2"></div></div>'
				+'<div class="wh0"><div id="piDSlot3"></div></div>'
				+'<div class="wh0"><div id="piDSlot4"></div></div>'
			+'');
		$('#piDBut').html('<img src="i/ui/pDBClose.png" onClick="pi.pRBoxEmpty();">');
		har.isinv = 0;
		for(var i in pi.ditm){
			$('#piDSlot'+i).html(itm.get({d:pi.ditm[i],oclick:'har.dress(\'inv\','+i+');',but:'',dm:1}));
		}
	},
	ielList: {},
	ielb: function(data){
		var res = '';
		var but = '';
		var id = 0;
		for(var i in data){
			but = 'исп.';
			id = data[i].i;
			data[i].i += 10000;
			res += itm.get({d:data[i],cl:'ibox pelID'+data[i].iid,wh:35,oclick:'pi.aelic('+id+');',but:but});
		}
		$('#piElicTop').html(res);
		pi.isClkEl = true;
	},
	isClkEl: true,
	aelic: function(id){
		if(pi.isClkEl){
			pi.isClkEl = false;
			rmP('ael',{i:id});
		}
	},
	notmv: function(){
		if(my.lvl<4){
			if($('.pelID1002').length){
				var a = $('.pelID1002').offset();
				faq.tar({t:(a.top),l:(a.left+45),n:4,m:'<div style="padding-top: 6px;"><b>Закончилась энергия</b><br>Выпейте эликсир!</div>'});
				$('.ibox').click(function(){ faq.isf(); });
			}else{
				var a = $('#bpexit').offset();
				faq.tar({t:(a.top-35),l:(a.left+20),n:3,m:'<div style="padding-top: 0px;"><b>Закончилась энергия</b><br>Восстановить энергию можно в городе.</div>'});
			}
			return;
		}
		body.err("<b>У вас закончилась энергия.</b><br>Выпейте эликсир или выйдите в город, там она восстановится.");
	}
}

kuz = {
	main: function(){
		var res = ''
			+'<div class="wh0"><div id="bgkuz"></div></div>'
			+'<div class="wh0"><div id="kuzIList"></div></div>'
			+'<div class="wh0"><div id="kuzUItm"></div></div>'
			+'<div class="wh0"><div id="kuzStat"><br><br><br><br>Это мастерская где можно за заряженные кристаллы улучшить ваши вещи.</div></div>'
			+'<div class="wh0"><div id="kuzStatE"></div></div>'
			+'<div style="height: 272px;"></div>'
			+'';
		kuz.isbuy = true;
		dlg.get({w:489,t:'Кузница - улучшение вещей',c:res});
		rmP('kuz');
	},
	litm: {},
	list: function(){
		var res = '';
		var p = 0;
		for(var i in kuz.litm){
			if(i>p && i<(p+36)){
				res += itm.get({d:kuz.litm[i],oclick:'kuz.set('+kuz.litm[i].i+');',but:'прокач'});
			}
		}
		$('#kuzIList').html(res);
	},
	set: function(id){
		kuz.isbuy = true;
		rmP('kuz',{i:id});
	},
	get: function(data){
		var parr = [2,2,2,2,3,3,4,5,5,7,7,9,11,11,13,13,15,17,30,35,60,70,70,70,70,70,25,25,25,25,25,33,33,33,33,33,50,50,50,50,50];
		var res = '';
		var resStat = '';
		var resStatE = '';
		var v = data[1];

		var potec = v.istr+v.icon+v.idex+v.iint;

		if(parr[v.l]>potec){
			var cstr = Math.round(v.str*0.8+(v.istr*v.istr)*1.7+1);
			if(v.str==0) cstr += Math.round(v.l*0.6);
			cstr = '<td class="ksbut" title="Улучшить на +1 силу\nза '+cstr+' заряженных кристаллов" onClick="kuz.buy(1,'+v.i+','+cstr+');"><div class="kcena">'+cstr+'</div></td>';
			var ccon = Math.round(v.con*0.8+(v.icon*v.icon)*1.7+1);
			if(v.con==0) ccon += Math.round(v.l*0.6);
			ccon = '<td class="ksbut" title="Улучшить на +1 тело\nза '+ccon+' заряженных кристаллов" onClick="kuz.buy(2,'+v.i+','+ccon+');"><div class="kcena">'+ccon+'</div></td>';
			var cdex = Math.round(v.dex*0.8+(v.idex*v.idex)*1.7+1);
			if(v.dex==0) cdex += Math.round(v.l*0.6);
			cdex = '<td class="ksbut" title="Улучшить на +1 ловкость\nза '+cdex+' заряженных кристаллов" onClick="kuz.buy(3,'+v.i+','+cdex+');"><div class="kcena">'+cdex+'</div></td>';
			var cint = Math.round(v.int*0.8+(v.iint*v.iint)*1.7+1);
			if(v.int==0) cint += Math.round(v.l*0.6);
			cint = '<td class="ksbut" title="Улучшить на +1 интуиция\nза '+cint+' заряженных кристаллов" onClick="kuz.buy(4,'+v.i+','+cint+');"><div class="kcena">'+cint+'</div></td>';
		}else{
			var cstr = '';
			var ccon = '';
			var cdex = '';
			var cint = '';
		}

		var cdef = Math.round(v.def*0.2+(v.idef*v.idef)*1.5+1);
		cdef = '<td class="ksbut" title="Улучшить на +1 защиту\nза '+cdef+' заряженных кристаллов" onClick="kuz.buy(5,'+v.i+','+cdef+');"><div class="kcena">'+cdef+'</div></td>';
		var cother = Math.round(v.other*0.2+(v.iother*v.iother)*1.5+1);
		cother = '<td class="ksbut" title="Улучшить на +0.01кг вместимости\nза '+cother+' заряженных кристаллов" onClick="kuz.buy(6,'+v.i+','+cother+');"><div class="kcena">'+cother+'</div></td>';



		v.str = v.str+v.istr;
		v.con = v.con+v.icon;
		v.dex = v.dex+v.idex;
		v.int = v.int+v.iint;
		v.def = v.def+v.idef;
		v.other = v.other+v.iother;

		potec = parr[v.l]-potec;

		resStat = '<table>'
		    +'<tr><td class="ksstr">Сила</td><td class="ksval">'+v.str+'</td>'+cstr+'</tr>'
		    +'<tr><td class="ksstr">Тело</td><td class="ksval">'+v.con+'</td>'+ccon+'</tr>'
		    +'<tr><td class="ksstr">Ловкость</td><td class="ksval">'+v.dex+'</td>'+cdex+'</tr>'
		    +'<tr><td class="ksstr">Интуиция</td><td class="ksval">'+v.int+'</td>'+cint+'</tr>'
			+'</table>Потенциал: '+potec+' стата';

		if(v.def>0 || v.other>0){
			resStatE = '<div id="kuzLine"></div><table>';
			if(v.def>0) resStatE += '<tr><td class="ksstr">Зашита</td><td class="ksval">'+v.def+'</td>'+cdef+'</tr>';
			if(v.other>0) resStatE = resStatE + '<tr><td class="ksstr">Вместим.</td><td class="ksval">'+v.other+'</td>'+cother+'</tr>';
			resStatE += '</table>';
		}

		res = itm.get({d:v,wh:50,oclick:'kuz.main();',but:''});
		$('#kuzUItm').html(res);
		$('#kuzStat').html(resStat);
		$('#kuzStatE').html(resStatE);
	},
	isbuy: true,
	buy: function(act,id,cena){
		var sarr = ['','силы','тело','ловкости','интуиции','зищиты','вместимость'];
    	if(cena>my.k3){
    		body.err('Недостаточно <b>заряженных кристаллов</b><br><b>для улучшения '+sarr[act]+'</b> этого предмета');
    		return;
    	}
    	if(kuz.isbuy) rmP('kuz',{i:id,a:act});
    	kuz.isbuy = false;
		har.isinv = 0;
		har.iseq = 0;
	}
}

tav = {
	main: function(){
		var menu = '<div class="tavLB" style="background: url(\'i/ui/tav/lb1.png\');" onClick="tav.get(0,1);"></div>'
				+'<div class="tavLB" style="background: url(\'i/ui/tav/lb2.png\');" onClick="tav.get(0,0);"></div>'
				+'<div id="tavLBlock"></div>';
		var rbody = '<div class="wh0"><div id="tavMITop">'
			+'<div style="background: url(\'i/ui/tav/mt1.png\')" class="tavMIT" onClick="tav.get(0,1);"></div>'
			+'<div style="background: url(\'i/ui/tav/mt2.png\')" class="tavMIT" onClick="tav.get(0,2);"></div>'
			+'<div style="background: url(\'i/ui/tav/mt3.png\')" class="tavMIT" onClick="tav.get(0,3);"></div>'
			+'<div style="background: url(\'i/ui/tav/mt4.png\')" class="tavMIT" onClick="tav.get(0,4);"></div>'
			+'<div style="background: url(\'i/ui/tav/mt5.png\')" class="tavMIT" onClick="tav.get(0,5);"></div>'
			+'<div class="wh0"><div id="tavMITact"></div></div>'
			+'</div></div><div id="tavItmList"></div>';
		var list = '';
		dlg.get({w:670,c:'<div id="tavMain"><div id="tavMenu">'+menu+'</div><div id="tavBody">'+rbody+'</div></div>'});
		tav.get(0,1);
	},
	act: 1,
	get: function(i,a,id){
		if(a!=tav.act) $('#tavItmList').html('');
		tav.act = a;
		if(i>0) har.isinv=0;

		if(a==0){ $('#tavMITop').css({display:'none'}); }
		else{ $('#tavMITop').css({display:'block'}); $('#tavMITact').css({left: (52*(a-1)+26)+'px'}); }

		faq.isf();
		if((typeof tav.litm[id] == 'object') && (a==0)){
			if(tav.litm[id].x>0){
				var xy = $('#itm'+i).offset();
				faq.tar({t:(xy.top),l:(xy.left-60),n:0,m:'Вы хотите продать предмета с доп. статами?<br><div class="tfBut" onClick="faq.isf();">Отмена</div>&nbsp;&nbsp;<div class="tfBut" title="Продать '+tav.litm[id].n+' за '+tav.litm[id].k1+' частиц" onClick="faq.isf(); tav.get2('+i+','+a+');">Продать</div>'});
				return;
			}
			if(tav.litm[id].l==my.lvl){
				var xy = $('#itm'+i).offset();
				faq.tar({t:(xy.top),l:(xy.left-60),n:0,m:'Вы уверены в продаже предмета вашего уровня?<br><div class="tfBut" onClick="faq.isf();">Отмена</div>&nbsp;&nbsp;<div class="tfBut" title="Продать '+tav.litm[id].n+' за '+tav.litm[id].k1+' частиц" onClick="faq.isf(); tav.get2('+i+','+a+');">Продать</div>'});
				return;
			}
			if((tav.litm[id].l>my.lvl) || (tav.litm[id].l>16)){
				var xy = $('#itm'+i).offset();
				faq.tar({t:(xy.top),l:(xy.left-60),n:0,m:'Хотите продать пердмет высокого уровня?<br><div class="tfBut" onClick="faq.isf();">Отмена</div>&nbsp;&nbsp;<div class="tfBut" title="Продать '+tav.litm[id].n+' за '+tav.litm[id].k1+' частиц" onClick="faq.isf(); tav.get2('+i+','+a+');">Продать</div>'});
				return;
			}
		}
		rmP('tav',{i:i,act:a});
	},
	get2: function(i,a){ rmP('tav',{i:i,act:a}); },
	litm: {},
	list: function(){
		var res = '';
		var but = '';
		var p = 0;
		for(var i in tav.litm){
			if(i>p && i<(p+58)){
				if(tav.act==0){
					but = 'продать';
					tav.litm[i].k1 = Math.round(tav.litm[i].k1*0.3);
				}else{
					but = 'купить';
					//if(tav.litm[i].cv>30) tav.litm[i].cv = 0;
				}
				if(tav.litm[i].k1<1) continue;
				tav.litm[i].dp = 'Цена';
				tav.litm[i].dpv = '<span class="k1color">'+tav.litm[i].k1+' частиц</span>';
				res += itm.get({d:tav.litm[i],oclick:'tav.get('+tav.litm[i].i+','+tav.act+','+i+');',but:but});
			}
		}
		$('#tavItmList').html(res);
	}
}

q = {
	l: [],
	rf: function(){
		rmP('ql');
	},
	list: function(data){
  		var res = '';
  		var win;
  		q.l = data;
  		for(var i in data){
  			v = data[i];
			if(v.w==1) win = '<div class="wh0"><div class="qWin"></div></div>';
			else win = '<div class="wh0"><div class="qnNotif" id="qnn'+i+'">&#8678; Новое задание</div></div>'
	  		res += '<div class="qblock qb'+i+'" onClick="q.get('+i+');" onMouseOver="q.over('+i+');" onMouseOut="q.out('+i+');">'
	  				+win
	  				+'<div class="wh0"><div class="qnote"><div class="qnTitle">'+v.n+'</div><div class="qnBody">'+v.o+'</div></div></div>'
	  				+'<div class="qava"><img src="i/qst/i'+v.a+'.png"></div>'
	  			+'</div>';
	 	}
	 	$('#quest').html(res);
	},
	over: function(id){
		$('.qb'+id+' .qnote').css({display:'block'});
	},
	out: function(id){
		$('.qb'+id+' .qnote').css({display:'none'});
	},
	get: function(i){
		var v = q.l[i];
		var tb = '';
		var arrW = ['<img src="i/qst/w0.png">','<img src="i/qst/w1.png">']
		if(v.tb>0) tb = '<div class="wh0"><div id="gstLImg"><img src="i/qst/l'+v.tb+'.png"></div></div>';
        var res = ''
        	+'<div class="wh0"><div id="gstMImg"><img src="i/qst/a'+v.ta+'.jpg"></div></div>'
        	+'<div class="wh0"><div id="gstBut" onClick="q.ok('+i+');">'+arrW[v.w]+'</div></div>'
			+tb
        	+'<div class="wh0"><div id="qstDop"></div></div>'
        	+'<div id="gstBgTop"></div>'
        	+'<div id="gstText">'+v.o+'</div>'
        	+'<div id="gstLine"></div>'
        	+'<div id="gstPriz"><div id="gstTxtPrize">Награда</div><div id="gstOkPrize">'+v.p+'</div></div>'
		dlg.get({w:486,t:v.n,c:'<div id="qstWin">'+res+'</div>'});
		if(typeof v.e == 'string') eval(v.e);
	},
	ok: function(i){
		if(q.l[i].w==1){ rmP('ql',{i:i}); }
		else{ q.rf(); }
		dlg.exit();
	},
	nNotif: function(qid){
		setTimeout(function(){
			$('#qnn'+qid).css({display:'block'});
			setTimeout(function(){ $('#qnn'+qid).fadeOut(777); },1111);
		},999);
	},
	vkAuth: function(){
		window.vkAsyncInit = function() {
			VK.init({
				apiId: 4015864
		    });
			VK.Auth.getLoginStatus(q.vkAuthGet);
			VK.UI.button('login_button');
		};

		setTimeout(function() {
			var el = document.createElement("script");
		    el.type = "text/javascript";
		    el.src = "//vk.com/js/api/openapi.js";
		    el.async = true;
		    document.getElementById("vk_api_transport").appendChild(el);
		}, 0);
	},
	vkAuthGet: function(response){
		if(typeof response.session.sig!='undefined'){
        	rmP('vkauth',{sg:response.session.sig,u:response.session.mid,e:response.session.expire,sd:response.session.sid,sec:response.session.secret});
		}else{
			$("#vkAuth").html("Ошибка авторизации");
		}
	},
	vkAddGroup: function(){
		//toto не запущена
		window.vkAsyncInit = function() {
			VK.Widgets.Group("vk_groups", {mode: 1, width: "260", height: "200", color1: '212323', color2: '57a3d0', color3: '5B7FA6'}, 59338149);
		};
		setTimeout(function() {
			var el = document.createElement("script");
		    el.type = "text/javascript";
		    el.src = "//vk.com/js/api/openapi.js";
		    el.async = true;
		    document.getElementById("vk_api_transport").appendChild(el);
		}, 0);
	},
	vkArrB: [0,0,0,0,0],
	vkBonus: function(n){
		q.vkArrB[4] = n;
		if(q.vkArrB[0]==0){
			q.vkbGroup();
		}else{ $('#sb1').html('Вы вступили в группу'); }
		if(q.vkArrB[1]==0){
			q.vkbWall();
		}else{ $('#sb2').html('Запись размещена'); }
		if(q.vkArrB[2]==0){
			q.vkbMenu();
		}else{ $('#sb3').html('Добавлено в меню'); }
		if(q.vkArrB[3]==0){
			q.vkbFrend();
		}else{ $('#sb4').html('Вы пригласили друзей'); }
		if(q.l[n].w==0) q.vkBonusOk();
	},
	vkBonusOk: function(){
		if(q.vkArrB[0]==1 && q.vkArrB[1]==1 && q.vkArrB[2]==1 && q.vkArrB[3]==1){
			q.l[q.vkArrB[4]].w = 1;
			q.get(q.vkArrB[4]);
			$('.qb'+q.vkArrB[4]).html('<div class="wh0"><div class="qWin"></div></div>'+$('.qb'+q.vkArrB[4]).html());
		}
	},
	vkbGroup: function(){
		VK.api('groups.isMember',{v:5.34,group_id:87864215,user_id:my.vid,extended:0},function(data){
			if(typeof data.response=='number'){
				if(data.response==1){
					q.vkArrB[0] = 1;
					if(q.l[q.vkArrB[4]].w==0) q.vkBonusOk();
					$('#sb1').html('Вы вступили в группу');
					return;
				}
			}
			$('#sb1').html('<a href="https://vk.com/piage_ru" target="_blank" class="but" onClick="q.vkbGroup(); setTimeout(function(){ q.vkbGroup(); },5000); return true;">Вступить в группу</a>');
		});
	},
	vkbMenu: function(){
		VK.api('getUserSettings',{v:5.34},function(data) {
			if((data.response&256)==256){
				$('#sb3').html('Добавлено в меню');
				q.vkArrB[2] = 1;
			}else $('#sb3').html('<span class="but" onClick="q.vkbMenuAdd();">Добавить в меню</span>');
		});
	},
	vkbMenuAdd: function(){
		VK.callMethod('showSettingsBox',256);
		VK.addCallback('onSettingsChanged',function(data){q.vkbMenu(); q.vkArrB[2] = 1; q.vkBonusOk();});
	},
	vkbFrend: function(){
		$('#sb4').html('<span class="but" onClick="q.vkbFrendAdd();">Пригласить 5 друзей</span>');
	},
	vkbFrendAdd: function(){
		q.vkArrB[3] = 1;
		VK.callMethod("showInviteBox");
		setTimeout(function(){$('#sb4').html('Вы пригласили друзей');},2000);
		q.vkBonusOk();
	},
	vkbWall: function(){
    	$('#sb2').html('<span class="but" onClick="q.vkbWallAdd();">Разместить запись</span>');
	},
	vkbWallAdd: function(){
		VK.api('wall.post',{v:5.34,message:'Я покоряю MMORPG вселенную в стили фэнтези с массовыми PvP сражения!     Ты со мной? Тогжа жми ссылку ► vk.com/piage2 ◄',attachments:'photo6593694_436942111'},function(data){
			if(typeof data.response['post_id']=='number'){
				if(data.response['post_id']>0){
					q.vkArrB[1] = 1;
					$('#sb2').html('Запись размещена');
					q.vkBonusOk();
				}
			}
		});
	}
}

function bok(msg,k1,k2,k3){
	my.k1 = k1;
	my.k2 = k2;
	my.k3 = k3;
	h.k1();
	h.k2();
	h.k3();
	c(msg);
	bank.err(msg);
}
function bsok(msg,act,point,k1,k2,k3){
	har.isinv = 0;
	my.k1 = k1;
	my.k2 = k2;
	my.k3 = k3;
	h.k1();
	h.k2();
	h.k3();
	msg += '<br>Хотие повторить? - Откройте доступ за '+point+' огненных звезд.';
	c(msg);
	sale.lock(1,act,point);
	//sale.err(msg,act);

}

sale = {
	main: function(){
		if(my.soc==0){
			var but4 = '<div class="wh0"><div class="slBuy"><a href="xbuy.php?sid='+sid+'&a=16" target="_blank" id="slBuyA" onClick="return true;"><div class="slBuyA"> </div></a></div></div>';
			var but5 = '<div class="wh0"><div class="slBuy"><a href="xbuy.php?sid='+sid+'&a=17" target="_blank" id="slBuyA" onClick="return true;"><div class="slBuyA"> </div></a></div></div>';
		}
		if(my.soc==1 || my.soc==3){
			var but4 = '<div class="wh0"><div class="slBuy" onClick="sale.buy(4);"></div></div>';
			var but5 = '<div class="wh0"><div class="slBuy" onClick="sale.buy(5);"></div></div>';
		}
        var res = ''
        	+'<div class="slBlock" id="slb3">'
        		+'<div class="wh0"><div class="slbImg" style="background:url(\'i/ui/sale/p3f.jpg\')"></div></div>'
        		+'<div class="wh0"><div class="slbBG"></div></div>'
				+'<div class="wh0"><div id="slMInf3" class="slMInf">'
					+'<b>Праздник у костра</b><br><br>К нам приехали маги и барды с эльфийских земель и дарят вам подарки.<br><br>3000 частиц<br>5 кристаллов<br>2 заряженных кристалла<br>Белый огонёк<br>+0.01кг вес в доме'
				+'</div></div>'
        		+'<div class="wh0"><div class="slBuy" onClick="sale.buy(3);"></div></div>'
				+'<div class="wh0"><div class="slMInfBut" onMouseOver="sale.mover(3);" onMouseOut="sale.mout(3);"></div></div>'
        		+'<div class="wh0"><div class="slMCena"><span class="slLoad">зарузка</span></div></div>'
        		+'<div class="wh0"><div class="slItm" id="slItm3"></div></div>'
        	+'</div>'
        	+'<div class="slBlock" id="slb4">'
        		+'<div class="wh0"><div class="slbImg" style="background:url(\'i/ui/sale/p4f.jpg\')"></div></div>'
        		+'<div class="wh0"><div class="slbBG"></div></div>'
				+'<div class="wh0"><div id="slMInf4" class="slMInf">'
					+'<b>Скидка на 65%</b><br><br>Подарите себе хороший подарок за небольшую цену.<br><br>13тыс частиц<br>40 кристаллов<br>15 заряженных кристалла<br>126 лотерейных билетов<br>Огненный свиток<br>+0.1кг вес в доме'
				+'</div></div>'
        		+but4
				+'<div class="wh0"><div class="slMInfBut" onMouseOver="sale.mover(4);" onMouseOut="sale.mout(4);"></div></div>'
        		+'<div class="wh0"><div class="slMCena"><span class="slLoad">зарузка</span></div></div>'
        		+'<div class="wh0"><div class="slProc"><img src="i/ui/sale/s4.png"></div></div>'
        		+'<div class="wh0"><div class="slItm" id="slItm4"></div></div>'
        	+'</div>'
        	+'<div class="slBlock" id="slb5">'
        		+'<div class="wh0"><div class="slbImg" style="background:url(\'i/ui/sale/p5f.jpg\')"></div></div>'
        		+'<div class="wh0"><div class="slbBG"></div></div>'
				+'<div class="wh0"><div id="slMInf5" class="slMInf">'
					+'<b>Скидка на 80%</b><br><br>Это хит сезона! С такими бонусами вы будете уверенно себя чувствовать на аренах в этот период.<br><br>190тыс частиц<br>800 кристаллов<br>250 заряженных кристалла<br>1704 лотерейных билетов<br>Элюминатный тримид<br>Снежная книга<br>+1кг вес в доме'
				+'</div></div>'
        		+but5
				+'<div class="wh0"><div class="slMInfBut" onMouseOver="sale.mover(5);" onMouseOut="sale.mout(5);"></div></div>'
        		+'<div class="wh0"><div class="slMCena"><span class="slLoad">зарузка</span></div></div>'
        		+'<div class="wh0"><div class="slProc"><img src="i/ui/sale/s5.png"></div></div>'
        		+'<div class="wh0"><div class="slItm" id="slItm5"></div></div>'
        		+'<div class="wh0"><div class="slItm" id="slItm6"></div></div>'
        	+'</div>'
        	+'';
		dlg.get({w:525,t:'Маги и барды с эльфийских земель.',c:'<div id="saleWin">'+res+'</div>'});
		rmP('slget');

		var itm3 = {i:2021,cv:0,tt:2,s:0,l:8,n:"Белый огонек",nt:"Служит для создания символов",iid:"2021",kg:1,def:1,other:0,x:0,str:0,con:0,dex:0,int:0};
		var itm4 = {i:2085,cv:0,tt:1,s:0,l:17,n:"Огненный свиток",nt:"Призывает на топовой арене айтария моба огненного метателя. Также обнуляет костер или зимой ёлку",iid:"2085",kg:1,def:0,other:0,x:0,str:0,con:0,dex:0,int:0};
		var itm5 = {i:2236,cv:0,tt:25,s:0,l:22,n:"Элюминатный тримид",nt:"",iid:"2236",kg:6,def:105,other:0,x:0,str:50,con:45,dex:45,int:50};
		var itm6 = {i:2232,cv:0,tt:23,s:0,l:19,n:"Снежная книга",nt:"",iid:"2232",kg:4,def:150,other:0,x:0,str:30,con:50,dex:50,int:50};
		$('#slItm3').html(itm.get({d:itm3,cl:'slItm3',but:'',wh:25}));
		$('#slItm4').html(itm.get({d:itm4,cl:'slItm4',but:'',wh:36}));
		$('#slItm5').html(itm.get({d:itm5,cl:'slItm5',but:'',wh:25,dm:1}));
		$('#slItm6').html(itm.get({d:itm6,cl:'slItm6',but:'',wh:25,dm:1}));
	},
	mover: function(id){
		$('#slMInf'+id).css({display:'block'});
	},
	mout: function(id){
		$('#slMInf'+id).css({display:'none'});
	},
	err: function(msg,act){
		body.err(msg);
	},
	lock: function(stat,act,point){
		if(stat==0){
			var arrBuy = ['','','','url("i/ui/sale/bfree.png")','url("i/ui/sale/bbuy.png")','url("i/ui/sale/bbuy.png")'];
			var arrCena = ['','','','Бесплатно','За 100 руб.','За 1000 руб.'];
			if(my.soc==1) var arrCena = ['','','','Бесплатно','За 14 голосов','За 142 голоса'];
			if(my.soc==3) var arrCena = ['','','','Бесплатно','За 100 OK','За 1000 OK'];

			if(my.soc==0) $('#slb'+act+' .slBuyA').attr('onClick','return true;');
			$('#slb'+act+' .slbImg').css({background:'url("i/ui/sale/p'+act+'.jpg")'});
			$('#slb'+act+' .slBuy').css({background:arrBuy[act]}).attr('onClick','sale.buy('+act+');');
			$('#slb'+act+' .slMCena').html(arrCena[act]);
			$('#slb'+act+' .slItm').css({display:'block'});
			/*
			if(act==5){
				if(point>10) var itm6 = {i:1079,cv:0,tt:20,s:0,l:15,n:"Дирдоновский сундук",nt:"Можно открыть на вершине арены г.Айтарии. Хранит в себе вещь 16 уровня.",iid:"1079",kg:7,def:0,other:0,x:0,str:0,con:0,dex:0,int:0};
				else var itm6 = {i:109,cv:0,tt:20,s:0,l:0,n:"Образ ледяного отшельника",nt:"Новогодний образ, повышает все статы на 2%",iid:"109",kg:0,def:0,other:0,x:0,str:0,con:0,dex:0,int:0};
				$('#slItm6').html(itm.get({d:itm6,cl:'slItm6',but:'',wh:25,dm:1}));
			}
			*/
		}else{
			if(my.soc==0) $('#slb'+act+' .slBuyA').attr('onClick','return false;');
			$('#slb'+act+' .slbImg').css({background:'url("i/ui/sale/p'+act+'f.jpg")'});
			$('#slb'+act+' .slBuy').css({background:'url("i/ui/sale/bset.png")'}).attr('onClick','sale.sneg('+act+');');
			$('#slb'+act+' .slMCena').html('За '+point+' звезд');
			$('#slb'+act+' .slItm').css({display:'none'});
		}
	},
	buy: function(act){
		if(act==3){
			$('#slb3 .slBuy').css({background:'url("i/clear.png")'}).attr('onClick','');
			$('#slb3 .slMCena').html('<span class="slLoad">зарузка</span>');
			rmP('slfree');
			return;
		}
		num = 0;
		if(act==4) num = 16;
		if(act==5) num = 17;

		if(my.soc==1) if(num>0) sale.buyVk(num);
		if(my.soc==3) if(num>0) okm.buyBank(num);
	},
	buyVk: function(num){
		VK.callMethod('showOrderBox', {type:'item',item:num});
		VK.addCallback("onOrderSuccess",function(data){
			cs = 1;
		});
		VK.addCallback("onOrderFail",function(data){
			c("<b>Произошла ошибка!</b> Если с вас списались голоса, то кристаллы начисляться в течении часа, либо через час будет возврат голосов.");
		});
	},
	sneg: function(act){
		$('#slb'+act+' .slBuy').css({background:'url("i/clear.png")'}).attr('onClick','');
		$('#slb'+act+' .slMCena').html('<span class="slLoad">зарузка</span>');
		rmP('slsneg',{a:act});
	},


}

bank = {
	main: function(n){
        var res = ''
        	+'<div class="wh0"><div id="bankErr" style="display:none"></div></div>'
        	+'<div class="wh0"><div id="bBM3" class="bBMOn bBM" title="Заряженные кристаллы" onClick="bank.bm(3);"><img src="i/ui/bank/bk3.png"></div></div>'
        	+'<div class="wh0"><div id="bBM2" class="bBMOff bBM" title="Кристаллы" onClick="bank.bm(2);"><img src="i/ui/bank/bk2.png"></div></div>'
			+'<div class="wh0"><div id="bBM1" class="bBMOff bBM" title="Частицы" onClick="bank.bm(1);"><img src="i/ui/bank/bk1.png"></div></div>'
        	+'<div class="wh0"><div id="bankMain"></div></div>'
        	+'<div id="bankWBG"></div>'
        	+'';
		dlg.get({w:582,c:'<div id="bankWin">'+res+'</div>'});
        bank.bm(n);
	},
	err: function(msg){
		$('#bankErr').css({display:'block'}).html(msg);
	},
	buy: function(num){
		$('#bankErr').html('').css({display:'none'});
		if(my.soc==1){
        	bank.buyVk(num);
		}
		if(my.soc==3){
        	okm.buyBank(num);
		}
	},
	buyVk: function(num){
		VK.callMethod('showOrderBox', {type:'item',item:num});
		VK.addCallback("onOrderSuccess",function(data){
			cs = 1;
		});
		VK.addCallback("onOrderFail",function(data){
			$("#nmErr").html("<b>Произошла ошибка!</b> Если с вас списались голоса, то кристаллы начисляться в течении часа, либо через час будет возврат голосов.");
		});
	},
	bm: function(n){
		var res = '';
		var bonus = '';
		$('.bBM').removeClass('bBMOn');
		$('.bBM').addClass('bBMOff');
		$('#bBM'+n).addClass('bBMOn');
		if(my.soc==0){
			switch(n){
				case 3:
					var arrBuy = ['',
						'<div class="blmRub" title="Купить 5 заряженных кристаллов за 35 рублей." onClick="bank.buy(1);"><a href="xbuy.php?sid='+sid+'&a=1" target="_blank">&nbsp;&nbsp;&nbsp;35 <span>руб.</span>&nbsp;&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 23 заряженных кристалла за 140 рублей.\nЭкономите 21 рублей (13% скидки)" onClick="bank.buy(2);"><a href="xbuy.php?sid='+sid+'&a=2" target="_blank">&nbsp;&nbsp;140 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 59 заряженных кристаллов за 350 рублей.\nЭкономите 63 рубля (15% скидки)" onClick="bank.buy(3);"><a href="xbuy.php?sid='+sid+'&a=3" target="_blank">&nbsp;&nbsp;350 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 125 заряженных кристаллов за 700 рублей.\nЭкономите 175 рублей (20% скидки)" onClick="bank.buy(4);"><a href="xbuy.php?sid='+sid+'&a=4" target="_blank">&nbsp;&nbsp;700 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub"  title="Купить 399 заряженных кристаллов за 2100 рублей.\nЭкономите 693 рублей (24% скидки)" onClick="bank.buy(5);"><a href="xbuy.php?sid='+sid+'&a=5" target="_blank">&nbsp;2100 <span>руб.</span>&nbsp;</a></div>'
					];
					var arrK = [0,5,20,50,100,300];
					var arrB = [0,0,3,9,25,99];
					break;
				case 2:
					var arrBuy = ['',
						'<div class="blmRub" title="Купить 15 кристаллов за 35 рублей." onClick="bank.buy(6);"><a href="xbuy.php?sid='+sid+'&a=6" target="_blank">&nbsp;&nbsp;&nbsp;35 <span>руб.</span>&nbsp;&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 69 кристалла за 140 рублей.\nЭкономите 21 рублей (13% скидки)" onClick="bank.buy(7);"><a href="xbuy.php?sid='+sid+'&a=7" target="_blank">&nbsp;&nbsp;140 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 177 кристаллов за 350 рублей.\nЭкономите 63 рубля (15% скидки)" onClick="bank.buy(8);"><a href="xbuy.php?sid='+sid+'&a=8" target="_blank">&nbsp;&nbsp;350 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 375 кристаллов за 700 рублей.\nЭкономите 175 рублей (20% скидки)" onClick="bank.buy(9);"><a href="xbuy.php?sid='+sid+'&a=9" target="_blank">&nbsp;&nbsp;700 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub"  title="Купить 1197 кристаллов за 2100 рублей.\nЭкономите 693 рублей (25% скидки)" onClick="bank.buy(10);"><a href="xbuy.php?sid='+sid+'&a=10" target="_blank">&nbsp;2100 <span>руб.</span>&nbsp;</a></div>'
					];
					var arrK = [0,15,60,150,300,900];
					var arrB = [0,0,9,27,75,297];
					break;
				case 1:
					var arrBuy = ['',
						'<div class="blmRub" title="Купить 405 частиц за 35 рублей." onClick="bank.buy(11);"><a href="xbuy.php?sid='+sid+'&a=11" target="_blank">&nbsp;&nbsp;&nbsp;35 <span>руб.</span>&nbsp;&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 18630 частиц за 140 рублей.\nЭкономите 21 рублей (13% скидки)" onClick="bank.buy(12);"><a href="xbuy.php?sid='+sid+'&a=12" target="_blank">&nbsp;&nbsp;140 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 47790 частиц за 350 рублей.\nЭкономите 63 рубля (15% скидки)" onClick="bank.buy(13);"><a href="xbuy.php?sid='+sid+'&a=13" target="_blank">&nbsp;&nbsp;350 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub" title="Купить 101250 частиц за 700 рублей.\nЭкономите 175 рублей (20% скидки)" onClick="bank.buy(14);"><a href="xbuy.php?sid='+sid+'&a=14" target="_blank">&nbsp;&nbsp;700 <span>руб.</span>&nbsp;&nbsp;</a></div>',
						'<div class="blmRub"  title="Купить 323190 частиц за 2100 рублей.\nЭкономите 693 рублей (25% скидки)" onClick="bank.buy(15);"><a href="xbuy.php?sid='+sid+'&a=15" target="_blank">&nbsp;2100 <span>руб.</span>&nbsp;</a></div>'
					];
					var arrK = [0,4050,16200,40500,81000,243000];
					var arrB = [0,0,2430,7290,20250,80190];
					break;

			}
		}else if(my.soc==1){
			switch(n){
				case 3:
					var arrBuy = ['',
						'<div class="blmGRub" title="Купить 5 заряженных кристаллов за 35 рублей." onClick="bank.buy(1);"><div class="blmGolos">5 голосов</div><div class="blmGRub">35 рублей</div></div>',
						'<div class="blmGRub" title="Купить 23 заряженных кристалла за 140 рублей.\nЭкономите 21 рублей (13% скидки)" onClick="bank.buy(2);"><div class="blmGolos">20 голосов</div><div class="blmGRub">140 рублей</div></div>',
						'<div class="blmGRub" title="Купить 59 заряженных кристаллов за 350 рублей.\nЭкономите 63 рубля (15% скидки)" onClick="bank.buy(3);"><div class="blmGolos">50 голосов</div><div class="blmGRub">350 рублей</div></div>',
						'<div class="blmGRub" title="Купить 125 заряженных кристаллов за 700 рублей.\nЭкономите 175 рублей (20% скидки)" onClick="bank.buy(4);"><div class="blmGolos">100 голосов</div><div class="blmGRub">700 рублей</div></div>',
						'<div class="blmGRub"  title="Купить 399 заряженных кристаллов за 2100 рублей.\nЭкономите 693 рублей (24% скидки)" onClick="bank.buy(5);"><div class="blmGolos">300 голосов</div><div class="blmGRub">2100 рублей</div></div>'
					];
					var arrK = [0,5,20,50,100,300];
					var arrB = [0,0,3,9,25,99];
					break;
				case 2:
					var arrBuy = ['',
						'<div class="blmGRub" title="Купить 15 кристаллов за 35 рублей." onClick="bank.buy(6);"><div class="blmGolos">5 голосов</div><div class="blmGRub">35 рублей</div></div>',
						'<div class="blmGRub" title="Купить 69 кристалла за 140 рублей.\nЭкономите 21 рублей (13% скидки)" onClick="bank.buy(7);"><div class="blmGolos">20 голосов</div><div class="blmGRub">140 рублей</div></div>',
						'<div class="blmGRub" title="Купить 177 кристаллов за 350 рублей.\nЭкономите 63 рубля (15% скидки)" onClick="bank.buy(8);"><div class="blmGolos">50 голосов</div><div class="blmGRub">350 рублей</div></div>',
						'<div class="blmGRub" title="Купить 375 кристаллов за 700 рублей.\nЭкономите 175 рублей (20% скидки)" onClick="bank.buy(9);"><div class="blmGolos">100 голосов</div><div class="blmGRub">700 рублей</div></div>',
						'<div class="blmGRub"  title="Купить 1197 кристаллов за 2100 рублей.\nЭкономите 693 рублей (25% скидки)" onClick="bank.buy(10);"><div class="blmGolos">300 голосов</div><div class="blmGRub">2100 рублей</div></div>'
					];
					var arrK = [0,15,60,150,300,900];
					var arrB = [0,0,9,27,75,297];
					break;
				case 1:
					var arrBuy = ['',
						'<div class="blmGRub" title="Купить 4050 частиц за 35 рублей." onClick="bank.buy(11);"><div class="blmGolos">5 голосов</div><div class="blmGRub">35 рублей</div></div>',
						'<div class="blmGRub" title="Купить 18630 частиц за 140 рублей.\nЭкономите 21 рублей (13% скидки)" onClick="bank.buy(12);"><div class="blmGolos">20 голосов</div><div class="blmGRub">140 рублей</div></div>',
						'<div class="blmGRub" title="Купить 47790 частиц за 350 рублей.\nЭкономите 63 рубля (15% скидки)" onClick="bank.buy(13);"><div class="blmGolos">50 голосов</div><div class="blmGRub">350 рублей</div></div>',
						'<div class="blmGRub" title="Купить 101250 частиц за 700 рублей.\nЭкономите 175 рублей (20% скидки)" onClick="bank.buy(14);"><div class="blmGolos">100 голосов</div><div class="blmGRub">700 рублей</div></div>',
						'<div class="blmGRub"  title="Купить 323190 частиц за 2100 рублей.\nЭкономите 693 рублей (25% скидки)" onClick="bank.buy(15);"><div class="blmGolos">300 голосов</div><div class="blmGRub">2100 рублей</div></div>'
					];
					var arrK = [0,4050,16200,40500,81000,243000];
					var arrB = [0,0,2430,7290,20250,80190];
					break;
			}

		}else if(my.soc==3){
			switch(n){
				case 3:
					var arrBuy = ['',
						'<div class="blmRub" title="Купить 5 заряженных кристаллов за 35 ОК" onClick="bank.buy(1);">35 <span>ОК</span></div>',
						'<div class="blmRub" title="Купить 23 заряженных кристалла за 140 ОК\nЭкономите 21 ОК (13% скидки)" onClick="bank.buy(2);">40 <span>ОК</span></div>',
						'<div class="blmRub" title="Купить 59 заряженных кристаллов за 350 ОК\nЭкономите 63 ОК (15% скидки)" onClick="bank.buy(3);">350 <span>ОК</span></div>',
						'<div class="blmRub" title="Купить 125 заряженных кристаллов за 700 ОК\nЭкономите 175 ОК (20% скидки)" onClick="bank.buy(4);">700 <span>ОК</span></div>',
						'<div class="blmRub"  title="Купить 399 заряженных кристаллов за 2100 ОК\nЭкономите 693 ОК (24% скидки)" onClick="bank.buy(5);">2100 <span>ОК</span></div>'
					];
					var arrK = [0,5,20,50,100,300];
					var arrB = [0,0,3,9,25,99];
					break;
				case 2:
					var arrBuy = ['',
						'<div class="blmRub" title="Купить 15 кристаллов за 35 ОК" onClick="bank.buy(6);">35 <span>ОК</span></div>',
						'<div class="blmRub" title="Купить 69 кристалла за 140 ОК\nЭкономите 21 ОК (13% скидки)" onClick="bank.buy(7);">140 <span>ОК</span></div>',
						'<div class="blmRub" title="Купить 177 кристаллов за 350 ОК\nЭкономите 63 ОК (15% скидки)" onClick="bank.buy(8);">350 <span>ОК</span></div>',
						'<div class="blmRub" title="Купить 375 кристаллов за 700 ОК\nЭкономите 175 ОК (20% скидки)" onClick="bank.buy(9);">700 <span>ОК</span></div>',
						'<div class="blmRub"  title="Купить 1197 кристаллов за 2100 ОК\nЭкономите 693 ОК (25% скидки)" onClick="bank.buy(10);">2100 <span>ОК</span></div>'
					];
					var arrK = [0,15,60,150,300,900];
					var arrB = [0,0,9,27,75,297];
					break;
				case 1:
					var arrBuy = ['',
						'<div class="blmRub" title="Купить 4050 частиц за 35 ОК" onClick="bank.buy(11);">35 <span>OK</span></div>',
						'<div class="blmRub" title="Купить 18630 частиц за 140 ОК\nЭкономите 21 ОК (13% скидки)" onClick="bank.buy(12);">140 <span>ОК</span></div>',
						'<div class="blmRub" title="Купить 47790 частиц за 350 ОК\nЭкономите 63 ОК (15% скидки)" onClick="bank.buy(13);">350 <span>ОК</span></div>',
						'<div class="blmRub" title="Купить 101250 частиц за 700 ОК\nЭкономите 175 ОК (20% скидки)" onClick="bank.buy(14);">700 <span>ОК</span></div>',
						'<div class="blmRub"  title="Купить 323190 частиц за 2100 ОК\nЭкономите 693 ОК (25% скидки)" onClick="bank.buy(15);">2100 <span>ОК</span></div>'
					];
					var arrK = [0,4050,16200,40500,81000,243000];
					var arrB = [0,0,2430,7290,20250,80190];
					break;
			}
		}

		for(var i=1;i<=5;i++){
			bonus = '';
			if(arrB[i]>0) bonus = '<div class="wh0"><div class="blmBonus"><div class="blmBonusNun blmKColor'+n+'">+'+arrB[i]+'<img src="i/ui/bank/bfk'+n+'.png" height=18></div><div class="blmBonusTxt">БЕСПЛАТНО</div></div></div>';
			res += '<div class="blMon">'
					+'<div class="wh0"><div class="blmKris blmKColor'+n+'">'+arrK[i]+'</div></div>'
					+'<div class="wh0"><div class="blmKrisImg"><img src="i/ui/bank/bfk'+n+'.png" height=28></div></div>'
					+'<div class="wh0"><div class="blmBuy">'+arrBuy[i]+'</div></div>'
					+bonus
				+'</div>';
		}
		$('#bankMain').html(res);
	}
}

faq = {
	is: false,
	isf: function(){
		if(faq.is) faq.tarOff();
	},
	tar: function(data){
		var arrTop = ['0px','40px','-13px','-60px','-13px'];
		var arrLeft = ['0px','-60px','-160px','-60px','40px'];
		faq.is = true;
		if(typeof data.m=='undefined') $('#tfNote').css({top:arrTop[data.n],left:arrLeft[data.n],display:'none'});
		else $('#tfNote').html(data.m).css({top:arrTop[data.n],left:arrLeft[data.n],display:'block'});
		if(data.n>0) $('#tfStrel').css({background:'url("i/ui/faq/tar'+data.n+'.gif")'});
		else $('#tfStrel').css({background:'url("i/clear.png")'});
		$('#tfaq').css({display:'block'}).offset({top:data.t,left:data.l});
	},
	tarOff: function(){
		$('#tfaq').css({display:'none'});
		faq.is = false;
	},
	s:function(n){
		switch(n){
			case 1:
				var a = $('#mbut1').offset();
				$('#mbut1 .mButTxt').css({display:'block'});
				faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'<b>Жмите на Арену</b><br>Чтобы войти на поле битвы и добычи клада.'});
				faq.cc(1);
				faq.qgExp = my.exp;
				setTimeout('faq.qgvest();',15000);
				break;
			case 2:
				var tmp = 0;
				var arr = [];
				var rnd = [];
				arr[0] = [53,52,54,55,56,58,59,64,63,62,66,65,67,57];
				arr[1] = [58,59,56,54,55,53,52,63,64,62,65,66,67,57];
				arr[2] = [54,55,53,52,58,56,65,59,67,66,57,63,64,62];
				arr[3] = [59,58,56,52,53,54,55,65,66,67,57,64,63,62];
				rnd = arr[rand(0,3)];
				for(var i=0;i<=13;i++){
					tmp = rnd[i];
					if($('#p'+tmp+' .cuNick').length==0) break;
				}
				var a = $('#p'+tmp).offset();
				$('.p'+tmp).click(function(){
					$('.p'+tmp).unbind('click').click(function(){ p(tmp); });
					p(tmp);
					setTimeout(function(){
						var a = $('.pCurs').offset();
						faq.tar({t:(a.top-37),l:(a.left+15),n:3,m:'Ходить по Арене можно через ближайшие клетки<br><b>Жмите на эту клетку</b>'});
						c('▪Помощник, ▪'+my.nick+', каждое действие на арене имеет 3 секундную задержку. На самом вверху арене находиться босс. Поднимитесь чуть выше.');
						$('.pCurs').click(function(){
							if(typeof faq.isS2=='undefined'){
								setTimeout(function(){
									faq.isS2 = true;
									var asel = $('.pCurs');
									var numPid = /[0-9]+/.exec(asel.attr('class'));
									var a = asel.offset();
									rmP('nub1',{i:numPid});
									$('.p'+numPid).unbind('click').click(function(){
										$('.p'+numPid).unbind('click').click(function(){ p(numPid); });
                                    	p(numPid);
                                    	setTimeout(function(){
	                                    	b = $('#piDBut').offset();
	                                    	$('#piDBut').html('<img src="i/ui/pDBOpen.png" onclick="pi.dsend(); faq.exp3();">');
	                                    	faq.tar({t:(b.top+18),l:(b.left+20),n:1});
										},900);
									});
									//var a = $('.pVal').offset();
									setTimeout(function(){
										//var a = $('.pVal').offset();
										//faq.tar({t:(a.top-37),l:(a.left+15),n:3,m:'Дойдите до блежайшего мешочка,  в нем вы найдете клад.'});
										faq.tar({t:(a.top-37),l:(a.left+15),n:3,m:'Дойдите до блежайшего мешочка и <b>откройте его</b>. В нем вы найдете клад.'});
								    },2000);
									//faq.tar({t:(a.top-8),l:(a.left+11),n:3,m:'Дойдите до мешочка и откройте его. В нем вы найдете клад.'});
							    },900);
							}
						});
					},2500);
				});
				faq.tar({t:(a.top-40),l:(a.left-5),n:3,m:'Взобраться на Арену, можно только снизу.<br><b>Жмите на эту клетку</b>'});
				//c('▪Помощник, ▪'+my.nick+', это арена, здесь вы будете добывать деньги за которые сможете много чего купить. По арене можно ходить через ближайшие клетки, но для начала надо взобраться на арену, жмите на любую свободную клетку нижнего ряда.<br>');
				break;
			case 3:
				$('#gstBut').click(function(){
					if(my.fs>0){
						var a = $('#mbut2').offset();
						$('#mbut2 .mButTxt').css({display:'block'});
						$('#mbut2').click(function(){
                            faq.s(4);
                            $('#hstat').click(function(){
                            	setTimeout('faq.s(4);',555);
                            });
						});
						faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'Раздел управления статами и экипировкой вашего героя.'});
                        faq.cc(2);
					}
				});
				faq.s(10);
				break;
			case 4:
				if(my.fs>0){
					var a = $('#mbut2').offset();
					faq.tar({t:(a.top+94),l:(a.left-20),n:2,m:'У вас '+my.fs+' свободных стата. Нажимайте на плюсик для повышения их.'});
					faq.cc(3);
				}else{ faq.isf(); q.rf(); }
				break
			case 5:
				$('#gstBut').click(function(){
					var a = $('#mbut3').offset();
					$('#mbut3 .mButTxt').css({display:'block'});
					faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'На рынке вы можете себе прикупить любую экипировку и эликсир.'});
				});
				break;
			case 6:
				if(my.fs>0){
					var a = $('#mbut2').offset();
					$('#mbut2 .mButTxt').css({display:'block'});
					$('#mbut2').click(function(){
     					faq.s(4);
                        $('#hstat').click(function(){
                        	setTimeout('faq.s(4);',555);
                        });
					});
					faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'У вас появились новые статы, распределите их.'});
				}
				break;
			case 7:
				if($('#dlg').css('display')=='none'){
					var a = $('#mbut3').offset();
					$('#mbut3 .mButTxt').css({display:'block'});
					faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'Зайдите на рынок, купите себе экипировку, чтобы стать сильнее.'});
				}
				break;
			case 8:
				if($('#dlg').css('display')=='none'){
					var a = $('#mbut2').offset();
					$('#mbut2 .mButTxt').css({display:'block'});
					faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'Здесь вы можете надеть купленные или добытые вещи на героя.'});
				}
				break;
			case 9:
				var a = $('#mbut2').offset();
				$('#mbut2 .mButTxt').css({display:'block'});
				faq.tar({t:(a.top+140),l:(a.left-534),n:1});
				break;
			case 10:
				var a = $('#mbut2').offset();
				$('#mbut2 .mButTxt').css({display:'block'});
				faq.tar({t:(a.top+406),l:(a.left-204),n:1});
				break;
			case 11:
				$('#gstBut').click(function(){
					var a = $('#mbut2').offset();
					$('#mbut2 .mButTxt').css({display:'block'});
					faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'Здесь вы можете надеть купленные или добытые вещи на героя.'});
				});
				break;
			case 12:
				//rmP('abtest',{tt:1});
				$('#gstBut').click(function(){
					var a = $('#mbut1').offset();
					$('#mbut1 .mButTxt').css({display:'block'});
					faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'<b>Жмите на Арену</b><br>Где вы можете собрать мешочки с кладом.'});
					//rmP('abtest',{tt:2});
				});
				faq.s(10);
				break;
			case 13:
				if($('#dlg').css('display')=='block') break;
				if($('#tfaq').css('display')=='block') break;
				var tmp = 0;
				var arr = [];
				var rnd = [];
				arr = [59,58,57,56,65,66,67];
				for(var i=0;i<=6;i++){
					tmp = arr[i];
					if($('#p'+tmp+' .cuNick').length==0) break;
				}
				var a = $('#p'+tmp).offset();
				faq.tar({t:(a.top-40),l:(a.left-5),n:3,m:'Взойдите на арену для начала пути.<br><b>Жмите на эту клетку</b>'});
				break;
			case 14:
				if($('#dlg').css('display')=='block') break;
				if($('#tfaq').css('display')=='block') break;
				if(my.room!=201) break;

									var asel = $('.pCurs');
									var numPid = /[0-9]+/.exec(asel.attr('class'));
									var a = asel.offset();
									rmP('nub1',{i:numPid});
									faq.tar({t:(a.top-37),l:(a.left+15),n:3,m:'Дойдите до ближайшего мешочка, в нем вы найдете клад.'});
									/*
									$('.p'+numPid).unbind('click').click(function(){
										$('.p'+numPid).unbind('click').click(function(){ p(numPid); });
                                    	p(numPid);
                                    	setTimeout(function(){
	                                    	b = $('#piDBut').offset();
	                                    	$('#piDBut').html('<img src="i/ui/pDBOpen.png" onclick="pi.dsend(); faq.exp3();">');
	                                    	faq.tar({t:(b.top+18),l:(b.left+20),n:1});
										},900);
									});
									*/


				/*
				for(var i=0;i<=44;i++){
					tmp = 49-i;
					if($('#p'+tmp+' .pVal').length>0) break;
				}
				var a = $('#p'+tmp).offset();
				faq.tar({t:(a.top-40),l:(a.left-3),n:3,m:'Дойдите до ближайшего мешочка, в нем вы найдете клад.'});
				*/
				break;
			case 15:
				a = $('#piDBut').offset();
				$('#piDBut').html('<img src="i/ui/pDBOpen.png" onclick="pi.dsend(); faq.tarOff();">');
				faq.tar({t:(a.top+18),l:(a.left+20),n:1});
				break;
			case 16:
				$('#gstBut').click(function(){
					var a = $('#mbut1').offset();
					$('#mbut1 .mButTxt').css({display:'block'});
					faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'<b>Жмите на Арену</b><br>Где вы сможете сразить с горпулами и убить их.'});
				});
				faq.s(10);
				break;
		}
	},
	mob1: function(pid){
		if($('#dlg').css('display')=='block') return;
		if($('#tfaq').css('display')=='block') return;
		var a = $('#p'+pid).offset();
		faq.tar({t:(a.top-50),l:(a.left-5),n:3,m:'Дойдите до горпула и потом жмите на него, чтобы нанести урон.'});
	},
	exp3: function(){
		setTimeout(function(){
			//c('▪Помощник, ▪'+my.nick+', поздравляю, <b>вы нашли первый клад!</b><br>В мешочках вы можете найти игровую валюту или эликсиры, также ресурсы можно добывать уничтожая монстров, для этого надо к ним подойти и атаковать до тех пор пока он не умрет.<br><br>После того как у вас закончиться энергия, нажмите на кнопку &laquo;в город&raquo; и вы попадете в город где сможете взять задание, купить вещи, прокачать своего героя и восстановить энергию.');
		},3000);
		faq.tarOff();
	},
	kach: function(){
		$('#gstBut').click(function(){
			var a = $('#mbut2').offset();
			$('#mbut2 .mButTxt').css({display:'block'});
			$('#mbut2').click(function(){
				faq.tar({t:(a.top+230),l:(a.left+78),n:3,m:'Здесь вы можете купить задания для тренировки способностей.'});
			});
			faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'Здесь вы найдете тренировку способностей.<br><b>Кликайте на &laquo;Герой&raquo;</b>'});
		});
	},
	arrCC: [],
	cc: function(n){
		return; //todo откл подсказки
		if(typeof faq.arrCC[n]=='number') return;
		faq.arrCC[n] = 1;
		switch(n){
			case 1:
				c('▪Помощник, ▪'+my.nick+', Приветствую! Вы попали в сказочный мир который полон приключений. Начнем наш путь с изучения Арены, где происходят самые главные сражения. Для этого нажмите куда показывает красная стрелочка.<br><br>');
				break;
			case 2:
				c('▪Помощник, ▪'+my.nick+', статы - это параметры которые влияют на вашу боевую способность, они делают вас сильнее. Прокачайте статы в разделе &laquo;герой&raquo;:<br><b>Сила</b> - позволяет вам бить сильнее, наносить больше урона.<br><b>Тело</b> - дает вам больше жизней, энергии и защиты.<br><b>Ловкость</b> - позволяет вам чаще уворачиваться, а противнику реже.<br><b>Интуиция</b> - чаще наносить критические удары по противнику.');
				break;
			case 3:
				c('▪Помощник, ▪'+my.nick+', каждый уровень вы будете выбирать каким путем развития идти дальше. Сейчас у вас есть возможность прокачать '+my.fs+' стата. Жмите на плюсик возле цифры силы,тела... Сделайте себя сильней.');
				break;
		}
	},
	qgExp: 0,
	qgvest: function(){
		if(faq.qgExp==my.exp){
			//c('▪Гвест, я создатель этой игры, хочу поинтересоваться КАК ТЕБЕ ИГРА? Можешь поделиться своим мнением?');
		}else{
			if(my.lvl<5){
				faq.qgExp = my.exp;
				setTimeout('faq.qgvest();',10000);
			}
		}
	},
	getVote: function(){
		var res = '<div id="listVote">загрузка</div>';
		dlg.get({w:740,t:'Список активных игроков. Выбири за кого хочешь проголосовать.',c:res});
		rmP('lvote');
	},
	listVote: function(list){
		var res = '';
		var ures = '';
		for(var i in list){
			v = list[i];
			if(v.c>0) clan = '<img src="i/clan/i'+v.c+'.png">';
			else clan = '';
			ures += '<div class="lvNick"><span class="cmb">'+clan+'<span class="cmt" onClick="chat.t(\''+v.n+'\',\'▫\');">'+v.n+'['+v.l+']</span></span><img class="cmi" src="i/ui/buinf.png" onClick="har.uinf('+v.u+');"></div>';
		}
		res += ures;
		$('#listVote').html(res);
	},
	rroul: function(){
		if(my.lvl<14) return;
		var a = $('#mbut4').offset();
		$('#mbut4 .mButTxt').css({display:'block'});
		faq.tar({t:(a.top+60),l:(a.left+5),n:1,m:'Сколько вы заберете сегодня хороших вещей?<br><b>Жмите на Рулетку</b>'});
	},
	butReg: function(){
		var a = $('#ladd').offset();
		//$('#ladd .mButTxt').css({display:'block'});
		faq.tar({t:(a.top+50),l:(a.left+85),n:1});
	}
}

obr = {
	ma:[],
	r:[],
	c:0,
	main: function(z){
		var res = '<div id="mobr">';
		var tmpM = '';
		if(my.lvl>17) tmpM = '<div style="background: url(\'i/ui/obr/mt6.png\')" class="obrMIT" onClick="obr.get(6);"></div><div style="background: url(\'i/ui/obr/mt7.png\')" class="obrMIT" onClick="obr.get(7);"></div>';
		if(my.lvl>19) tmpM += '<div style="background: url(\'i/ui/obr/mt7.png\')" class="obrMIT" onClick="obr.get(8);"></div>';
		if(my.lvl>21) tmpM += '<div style="background: url(\'i/ui/obr/mt7.png\')" class="obrMIT" onClick="obr.get(9);"></div>';
		if(my.lvl>22) tmpM += '<div style="background: url(\'i/ui/obr/mt7.png\')" class="obrMIT" onClick="obr.get(10);"></div>';

			res += '<div class="wh0"><div id="obrMITop">'
				+'<div style="background: url(\'i/ui/obr/mt1.png\')" class="obrMIT" onClick="obr.get(1);"></div>'
				+'<div style="background: url(\'i/ui/obr/mt2.png\')" class="obrMIT" onClick="obr.get(2);"></div>'
				+'<div style="background: url(\'i/ui/obr/mt3.png\')" class="obrMIT" onClick="obr.get(3);"></div>'
				+'<div style="background: url(\'i/ui/obr/mt4.png\')" class="obrMIT" onClick="obr.get(4);"></div>'
				+'<div style="background: url(\'i/ui/obr/mt5.png\')" class="obrMIT" onClick="obr.get(5);"></div>'
				+ tmpM
				+'<div style="background: url(\'i/ui/obr/mt0.png\')" class="obrMITmy" onClick="obr.get(0);"></div>'
				+'<div class="wh0"><div id="obrMITact"></div></div>'
				+'</div></div>';
//				+'<div style="background: url(\'i/ui/obr/mt3.png\')" class="obrMIT" onClick="obr.get(3);"></div>'


			res += ''
			    + '<div class="wh0 fl"><div id="obrmsL"></div></div>'
			    + '<div class="wh0 fr"><div id="obrmsR"></div></div>'
				+ '<div id="tdmo1" class="tdmObr"></div>'
				+ '<div id="tdmo2" class="tdmObr"></div>'
				+ '<div id="tdmo3" class="tdmObr"></div>'
				+ '<div id="tdmo4" class="tdmObr"></div>'
				+ '<div id="obrBot">загрузка</div>';
		res += '</div>'
		dlg.get({w:672,c:res});
		obr.get(z);
	},
	get: function(z){
		$('#obrBot').html('загрузка');
		rmP('mobr',{z:z});
		if(z==0){ $('#obrMITop').css({display:'block'}); $('#obrMITact').css({left: (51*5+37)+'px'}); }
		else{ $('#obrMITop').css({display:'block'}); $('#obrMITact').css({left: (51*(z-1)+21)+'px'}); }
	},
	list: function(p){
		var cnt = count(obr.r);
		var strPage = '';
		obr.ab = 1;
		if(cnt>4){
			var page = parseInt(count(obr.r)/4+0.9);
			for(var i=1;i<=page;i++){
				if(i==p) strPage += '<div class="obrCirclOk"></div>';
				else strPage += '<div class="obrCircl" onClick="obr.list('+i+')"></div>';
			}
			if(p==1){
				$('#obrmsR').css({display:'block'}).attr('onClick','obr.list('+(p+1)+')');
				$('#obrmsL').css({display:'block'}).attr('onClick','obr.list('+(page)+')');
			}else{
				if(p==page){
					$('#obrmsR').css({display:'block'}).attr('onClick','obr.list(1)');
					$('#obrmsL').css({display:'block'}).attr('onClick','obr.list('+(p-1)+')');
				}else{
					$('#obrmsR').css({display:'block'}).attr('onClick','obr.list('+(p+1)+')');
					$('#obrmsL').css({display:'block'}).attr('onClick','obr.list('+(p-1)+')');
				}
			}
		}else{
				$('#obrmsR').css({display:'none'});
				$('#obrmsL').css({display:'none'});
		}
		$('#obrBot').html(strPage);

		var cnt = 0;
		var inf = '';
		var arrClass = ['Универсал','Воин','Берсерк','Ловкач','Паладин','Нейтрал','Элитный','Клановый','Личный','Дух'];
		for(var i=(p-1)*4;i<=(p*4-1);i++){
			cnt++;
			if(typeof obr.r[i] != 'object'){
				$('#tdmo'+cnt).html('');
				continue;
			}else{
				v = obr.r[i];
				res = ''
					+ '<div class="wh0"><div class="obrMAva" style="background: url(\'i/char/u'+v.ava+'.png\'); background-position: bottom; background-repeat: no-repeat; height: 225px;"></div></div>'
					+ '<div class="wh0"><div class="obrMInfBut" onMouseOver="obr.mover('+i+');" onMouseOut="obr.mout('+i+');"></div></div>'
					+ '';

				if(v.ava==my.ava){
					//todo
				}else{
					if(typeof obr.ma[v.ava]=='number'){
						 res += '<div class="wh0"><div class="obrMSet" onClick="obr.set('+i+','+p+');"></div></div>';
					}else{
						res += '<div class="wh0"><div class="obrMBuy" onClick="obr.buy('+i+','+p+');"></div></div>';
						if(typeof v.k2!='undefined') res += '<div class="wh0"><div class="obrMCena blmKColor2">за '+v.k2+' <img src="i/ui/bank/bfk2.png" height="18" style="position:relative;top:3px;" title="Кристалл"></div></div>';
						else  res += '<div class="wh0"><div class="obrMCena blmKColor3">за '+v.k3+' <img src="i/ui/bank/bfk3.png" height="18"  style="position:relative;top:3px;"  title="Заряженный кристалл"></div></div>';
					}
				}

				inf = '<div class="qnTitle">'+v.name+'</div>';
				if(v.rang>0) inf += '<div>Ранг: '+v.rang+'</div>';
				inf += '<div>Класс: '+arrClass[v.tt]+'</div>';
				inf += '<div class="oiHR">Повышает:</div>';
				if(typeof v.str != 'undefined') inf += '<div>▪ Силу на +'+(v.str*100)+'%</div>';
				if(typeof v.con != 'undefined') inf += '<div>▪ Тело на +'+(v.con*100)+'%</div>';
				if(typeof v.dex != 'undefined') inf += '<div>▪ Ловкость на +'+(v.dex*100)+'%</div>';
				if(typeof v.uint != 'undefined') inf += '<div>▪ Интуицию на +'+(v.uint*100)+'%</div>';
				if(typeof v.dmg != 'undefined') inf += '<div>▪ Мин. урон на +'+(v.dmg*100)+'%</div>';
				if(typeof v.mdmg != 'undefined') inf+= '<div>▪ Макс. урон на +'+(v.mdmg*100)+'%</div>';
				if(typeof v.def != 'undefined') inf += '<div>▪ Защиту на +'+(v.def*100)+'%</div>';
				if(typeof v.mhp != 'undefined') inf += '<div>▪ Жизни на +'+(v.mhp*100)+'%</div>';
				if(typeof v.mmv != 'undefined') inf += '<div>▪ Энергию на +'+(v.mmv*100)+'%</div>';
				if(typeof v.drop != 'undefined') inf += '<div>▪ Дроп клада на +'+(v.drop*100)+'%</div>';

				if(v.tt==9){
					var strRang = ['','','Чтобы купить требуется:','Чтобы купить требуется:','Чтобы купить требуется:','Чтобы купить требуется:','Чтобы купить требуется:','Чтобы купить требуется:','Чтобы купить требуется:','Чтобы купить требуется:','Чтобы купить требуется:']
					inf += '<div class="oiHR">'+strRang[v.rang]+'</div>';
				}else inf += '<div class="oiHR">Чтобы купить требуется:</div>';

				if(v.rang>1){
					 inf += '<div>▪ Класс '+arrClass[v.tt]+' '+(v.rang-1)+' ранга</div>';
				}
				if(typeof v.tstr != 'undefined') inf += '<div>▪ Силы: '+v.tstr+'</div>';
				if(typeof v.tcon != 'undefined') inf += '<div>▪ Тело: '+v.tcon+'</div>';
				if(typeof v.tdex != 'undefined') inf += '<div>▪ Ловкости: '+v.tdex+'</div>';
				if(typeof v.tuint != 'undefined') inf += '<div>▪ Интуиции: '+v.tuint+'</div>';

				res += '<div class="wh0"><div id="obrMInf'+i+'" class="obrMInf">'+inf+'</div></div>';
				$('#tdmo'+cnt).html(res);
			}
		}
	},
	mover: function(id){
		$('#obrMInf'+id).css({display:'block'});
	},
	mout: function(id){
		$('#obrMInf'+id).css({display:'none'});
	},
	ab: 1,
	buy: function(id,p){
		v = obr.r[id];
		if(v.tstr>(my.str+my.istr)){
			body.err('У вас <b>недостаточно силы</b> для покупки этого образа<br>Надо '+v.tstr+' или больше силы');
			return;
		}
		if(v.tcon>(my.con+my.icon)){
			body.err('У вас <b>недостаточно тела</b> для покупки этого образа<br>Надо '+v.tcon+' или больше тела');
			return;
		}
		if(v.tdex>(my.dex+my.idex)){
			body.err('У вас <b>недостаточно ловкости</b> для покупки этого образа<br>Надо '+v.tdex+' или больше ловкости');
			return;
		}
		if(v.tuint>(my.uint+my.iuint)){
			body.err('У вас <b>недостаточно интуиции</b> для покупки этого образа<br>Надо '+v.tuint+' или больше интуиции');
			return;
		}
		if(typeof v.k2!='undefined'){
			if(v.k2>my.k2){
				body.err('У вас <b>недостаточно кристаллов</b> для покупки этого образа<br>Надо '+v.k2+' кристаллов');
				return;
			}
		}else{
			if(v.k3>my.k3){
				body.err('У вас <b>недостаточно синих кристаллов</b> для покупки этого образа<br>Надо '+v.k3+' синих кристаллов');
				return;
			}
		}
		if(obr.ab==0) return;
		obr.ab = 0;
		rmP('mobuy',{a:1,p:p,i:v.ava});
	},
	set: function(id,p){
		v = obr.r[id];
		obr.ab = 0;
		rmP('mobuy',{p:p,i:v.ava});
	},
	myset: function(ava,p){
		my.ava = ava;
		obr.ma[ava] = 1;
		$('#fAva').css({background:'url("i/char/a'+ava+'.png")'});
		obr.list(p);
	}
}

vkapi = {
	uidsOk: [],
	qlFrend: function(list,qid){
		var res = '';
		var msg = 'Выручай! Очень нужны магические огоньки. Зайди в игру, это поможет мне.';
		var ttl = 'белые огоньки';
		var cnt = 0;

		switch(qid){
			case 999:
				msg = 'Выручай, друг! Очень нужны магические огоньки. Зайди в игру, это поможет мне.';
				ttl = 'белые огоньки'
				break;
			case 1000:
				msg = 'Выручай! Очень нужны гвозди. Зайди в игру, это поможет мне.';
				ttl = 'гвоздь'
				break;
			case 1001:
				msg = 'Выручай! Очень нужны семена. Зайди в игру, это поможет мне.';
				ttl = 'семя элея'
				break;
			case 1002:
				msg = 'Выручай! Очень нужны папирусы. Зайди в игру, это поможет мне.';
				ttl = 'чистый папирус'
				break;
			case 1003:
				msg = 'Выручай! Очень нужны колбы. Зайди в игру, это поможет мне.';
				ttl = 'пустая колба'
				break;
		}

		for(var i in list) vkapi.uidsOk[list[i]] = true;

		VK.api('execute',{v:5.34,code:'var l = API.friends.getOnline({order:"random"}); l = API.users.get({user_ids:l,fields:"photo_50",name_case:"gen"}); if(l[10]){ return l; } else{ return API.friends.get({order:"random",fields:"photo_50",name_case:"gen",count:"100"}).items; }'},function(data){
			if(typeof data.response!='object') return;
			for(var i in data.response){
				v = data.response[i];
				if(typeof vkapi.uidsOk[v.id]!='undefined') continue;
				if(typeof v.deactivated!='undefined') continue;
                res += '<div class="qduAva" id="qlv'+v.id+'" onClick="vkapi.qrSend('+v.id+','+qid+',\''+msg+'\');" style="background: url(\''+v.photo_50+'\');" title="Попросить у '+v.first_name+' '+ttl+'"></div>';
                cnt++;
                if(cnt>13) break;
			}
			if(cnt>0) $('#qstDop').css({top:10,left:25,width:'450px'}).html('<div id="srbFrendTitle">Попроси друга прислать вам '+ttl+':</div>'+res);
		});
	},
	qrSend: function(vid,qid,msg){
		VK.callMethod("showRequestBox",vid,msg,qid);
		VK.addCallback("onRequestSuccess",function(data){
			rmP('vk_sr',{i:vid,q:qid});
			$('#qlv'+vid).html('<div style="padding: 5px; padding-top: 8px;"><img src="i/qst/gwin.png"></div>').removeAttr('onClick').attr('title','Уже отправлено');
		});
		vkapi.uidsOk[vid] = true;
	}
}

craft = {
	litm: {},
	licr: [],
	main: function(data,mid){
		var lCraft = '';
		har.isinv = 0;
		for(i in data){
			v = data[i];
			craft.licr[v.t] = v.i;
			lCraft += '<div id="lcr'+v.t+'" class="lcr" onClick="craft.lget('+mid+','+v.t+')"><img src="i/itm/s'+v.t+'.png" width=9> '+craft.litm[v.t].n+'</div>';
		}
		var res = '<div id="bgCraft">'
			+'<div class="wh0"><div id="lCraft">'+lCraft+'</div></div>'
			+'<div class="wh0"><div id="toCraft"></div></div>'
			+'<div class="wh0"><div id="iCraft"></div></div>'
			+'<div class="wh0"><div id="msgCraft"><br>test</div></div>'
			+'<div class="wh0"><div id="butCraft"></div></div>'
			+'</div>';
		dlg.get({w:232,c:res});
		craft.lget(mid,data[0].t);
	},
	lget: function(mid,iid){
		var toItm = craft.litm[iid];
		toItm.i = iid;
		var to = itm.get({d:toItm,wh:50,oclick:'kuz.main();',but:''});
		var istr = '';
		var but1 = '<div id="bcrGet" onClick="craft.create('+mid+','+iid+');"></div>';
		for(i in craft.licr[iid]){
			craft.litm[craft.licr[iid][i]].i = i;
			istr += itm.get({d:craft.litm[craft.licr[iid][i]],but:''});
			//istr += '<div class="notICr">'+itm.get({d:craft.litm[craft.licr[iid][i]],but:''})+'</div>'; // Показывать когда нет в наличии предмета
		}
		$('#toCraft').html(to);
		$('#iCraft').html(istr);
   		$('.lcr').removeClass('lcrAct');
		$('#lcr'+iid).addClass('lcrAct');
		$('#butCraft').html(but1);
	},
	cmsg: '',
	create: function(mid,iid){
		craft.cmsg = '';
		$('#butCraft').html('<div id="piDLoadLine" style="top: 11px; left: 16px;"></div>');
		$('#piDLoadLine').animate({width: '74px'},3000,function(){
        	$('#butCraft').html('<div id="bcrGet" onClick="craft.create('+mid+','+iid+');"></div>');
        	craft.msg(craft.cmsg);
		});
    	rmP('ccr',{m:mid,i:iid});
	},
	msgErr: function(name,iid){
		craft.cmsg = 'У вас нет <b>'+name+'</b> для создания <b>'+craft.litm[iid].n+'</b>.';
	},
	msg: function(msg){
    	$('#msgCraft').css({display:'block'}).html('<br>'+msg);
		setTimeout(function(){ $('#msgCraft').fadeOut(777); },2222);
	}
}

clan1 = {
	main: function(){
        var res = ''
       		+'<div class="wh0"><div id="clanImgAWar" class="clanImgArena"></div></div>'
       		+'<div class="wh0"><div id="clanImgADom" class="clanImgArena"></div></div>'
       		+'<div class="wh0"><div id="clanExp"><div class="wh0"><div id="clanExpP"></div></div><div class="wh0"><div id="clanExpT"></div></div></div></div>'
        	+'<div class="wh0"><div id="clanBG" style="background: url(\'i/ui/clan/bg.png\');"></div></div>'
       		+'<div class="wh0"><div id="clanLvl"></div></div>'
       		+'<div class="wh0"><div id="clanName"></div></div>'
       		+'<div class="wh0"><div id="clanList"></div></div>'
       		+'<div class="wh0"><div id="clanButAWar" class="clanButArena" onClick="clan1.awar();" title="Вход на арену стоит 1 кристалл">Войти</div></div>'
       		+'<div class="wh0"><div id="clanButIWar" class="clanButArena" onClick="clan1.iwar();" title="Арена испытаний!\nС вас снимаются все вещи и вы начинаете с начальной арены.\nВход на арену стоит 1 кристалл.">Войти</div></div>'
       		+'<div class="wh0"><div id="clanAddit">'
       			+'<div class="addbb" onClick="roul.main();" title="Рулетка"><div class="wh0"><img src="i/itm/s6.png" width=47 height=48></div><div class="boxb"></div></div>'
       			+'<div class="addbb"><div class="wh0"><img src="i/ui/clan/bb0.png"></div><div class="boxb"></div></div>'
       			+'<div class="addbb"><div class="wh0"><img src="i/ui/clan/bb0.png"></div><div class="boxb"></div></div>'
       			+'<div class="addbb"><div class="wh0"><img src="i/ui/clan/bb0.png"></div><div class="boxb"></div></div>'
       			+'<div class="addbb"><div class="wh0"><img src="i/ui/clan/bb0.png"></div><div class="boxb"></div></div>'
       			+'<div class="addbb"><div class="wh0"><img src="i/ui/clan/bb0.png"></div><div class="boxb"></div></div>'
       		+'</div></div>'
        	+'';
		dlg.get({w:490,c:'<div id="clanWin">'+res+'</div>'});
		rmP('uclan');
	},
	cn: 0,
	get: function(data,list){
		var ures = '';
		var mexp = [0,45,250,700,1800,3500,7000,11000,16000,35000,200000,300000,500000,900000,1400000,2000000,5000000,12000000];
		var expp1 = mexp[data.l-1];
		var expp = Math.round((data.e-expp1)/(mexp[data.l]-expp1)*170);
		if(expp>=166){ expp = 166; }
		$('#clanExpT').html('Клан опыт: '+data.e+'/'+mexp[data.l]);
		$('#clanExpP').css({width:expp+'px'});

		$('#clanLvl').html('<img src="i/ui/clan/l'+data.l+'.png">');
		$('#clanName').html('<img src="i/clan/i'+data.i+'.png"> '+data.n);
		clan1.cn = Math.round(data.l*1.6)-data.cn;

		for(var i in list){
			v = list[i];
			ures += '<div><span class="cmb"><span class="cmp" onClick="chat.t(\''+v.n+'\',\'▪\');">»</span> <span class="cmt" onClick="chat.t(\''+v.n+'\',\'▫\');">'+v.n+'['+v.l+']</span></span><img class="cmi" src="i/ui/buinf.png" onClick="har.uinf('+v.u+');"></div>';
		}
		if(data.u==my.uid){
			if(clan1.cn>0) ures += '<div id="clanAddUser">'+clan1.butValidUser()+'</div>';
			else ures += '<div class="clanAddInf">Добавить новых игроков будет доступно со следующего уровня клана.</div>';
		}else{
			ures += '<div id="clanAddUser"><span class="but" onClick="clan1.butValidExit();">Покинуть клан</span></div>';
		}
		$('#clanList').html(ures);
	},
	butValidExit: function(){
		$('#clanAddUser').html('<div>Вы уверены что хотите покинуть клан?</div><span class="but" onClick="clan1.butUExit();">ДА!<br>Я хочу уйти из клана.</span>');
	},
	butUExit: function(){
		$('#clanAddUser').html('Загрузка');
		rmP('cuexit');
	},
	urem: function(uid){
		$('#nhpv3').html('<div id="clanRemUser"><span class="but" onClick="clan1.butValidRem('+uid+');">Выгнать из клана</span></div>');
	},
	butValidRem: function(uid){
		$('#nhpv3').html('<div id="clanRemUser"><div>Вы уверены?</div><span class="but" onClick="clan1.butURem('+uid+');">ДА! Я выгоняю этого игрока из клана.</span></div>');
	},
	butURem: function(uid){
		$('#nhpv3').html('<div id="clanRemUser">загрузка</div>');
		rmP('curem',{u:uid});
	},
	butValidUser: function(n){
		return '<input id="clanAddNick" type="text" placeholder="Введите ник кандидата"><br><span class="but" onClick="clan1.validUser();">Добавить в клан</span><br><span class="c08">+'+clan1.cn+' места в клане</span>';
	},
	butAddUser: function(data){
		$('#clanAddUser').html('<div><span class="cmb"><span class="cmp" onClick="chat.t(\''+data.n+'\',\'▪\');">»</span> <span class="cmt" onClick="chat.t(\''+data.n+'\',\'▫\');">'+data.n+'['+data.l+']</span></span><img class="cmi" src="i/ui/buinf.png" onClick="har.uinf('+data.u+');"></div><span class="but" onClick="clan1.addUser('+data.u+');" title="За 1 заряженный кристалл">Добавить в клан</span><div class="blmKColor3">за 1 <img src="i/ui/bank/bfk3.png" height="11"></div>');
	},
	validUser: function(){
		var nick = $('#clanAddNick').val();
		if(/^[ёЁа-яА-Яa-zA-Z0-9_]{4,12}$/.test(nick)){
			$('#clanAddUser').html('загрузка');
			rmP('clvu',{n:nick});
		}else{
			body.err('Ник введен неправильно');
		}
	},
	addUser: function(uid){
		if(my.k3<1) body.err('У вас недостаточно кристаллов');
		$('#clanAddUser').html('загрузка');
		rmP('claddu',{i:uid});
	},
	awar: function(){
		if(my.k3<1) body.err('У вас недостаточно кристаллов');
		room.set(216);
	},
	iwar: function(){
		if(my.k3<1) body.err('У вас недостаточно кристаллов');
		room.set(221);
	}
}

roul = {
	litm: [],
	rcnt: 0,
	main: function(){
		var resStat = '<br>Купить ходы:<br><table>'
		    +'<tr><td class="rsstr">30тыс частиц</td><td class="ksbut" title="Купить 1 ход за 30тыс частиц" onClick="roul.buy(1);"><div class="kcena">1</div></td></tr>'
		    +'<tr><td class="rsstr">1 кристалл</td><td class="ksbut" title="Купить 2 хода за 1 кристалл" onClick="roul.buy(2);"><div class="kcena">2</div></td></tr>'
		    +'<tr><td class="rsstr">1 синий крис</td><td class="ksbut" title="Купить 9 ходов за 1 заряженный кристалл" onClick="roul.buy(3);"><div class="kcena">9</div></td></tr>'
			+'</table>';
		var res = ''
			+'<div class="wh0"><div id="bgkuz"></div></div>'
			+'<div class="wh0"><div id="kuzIList"></div></div>'
			+'<div class="wh0"><div id="kuzUItm"></div></div>'
			+'<div class="wh0"><div id="kuzStat">'+resStat+'</div></div>'
			+'<div class="wh0"><div id="roulStatE">'
				+'<div id="butRoul"><div class="but" onClick="roul.run();">Хочу приз! Поехали!</div></div>'
				+'<div id="rhit"></div>'
			+'</div></div>'
			+'<div style="height: 272px;"></div>'
			+'';
		dlg.get({w:489,t:'Рулетка',c:res});
		rmP('roul');
	},
	list: function(){
		var res = '';
		var p = 0;
		for(var i in roul.litm){
			if(i>p && i<(p+36)){
				res += itm.get({d:roul.litm[i],but:'',cl:'inv rl'+i});
			}
		}
		$('#kuzIList').html(res);
	},
	rhit: function(num){
		var res = '';
		roul.rcnt = num;
		if(num==0) res = 'У вас законились ходы.';
		if(num==1) res = 'У вас 1 ход.';
		if(num>1 && num<5) res = 'У вас '+num+' хода';
		if(num>4) res = 'У вас '+num+' ходов';
		$('#rhit').html(res);
	},
	buy: function(act){
		rmP('rbuy',{a:act})
	},
	run: function(){
		if(roul.rcnt<1) return;
		roul.rcnt--;
		roul.rhit(roul.rcnt);
		$('#butRoul').html('Ждем приз...');
		rmP('rrun');
	},
	rend: function(data){
		var itmCool = roul.litm[data.r];
		itmCool.i = 999;
		$('#kuzUItm').html(itm.get({d:itmCool,wh:50,but:''}));
		$('#butRoul').html('<div id="butRoul"><div class="but" onClick="roul.run();">Хочу приз! Поехали!</div></div>');
		cb(data.m);
		har.isinv = 0;
	}
}

function atest(){
	roul.main();
}
tt = {
	pcerr: function(id){
		//rmP('tt_pce',{i:id,kt:my.kt});
	}
}

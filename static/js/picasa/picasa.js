// JavaScript Document

var getDom = function(element) {
	return typeof(element) == 'object' ? element : document.getElementById(element);
};

// 窗口大小
var getWindowSize = function() {
	var windowWidth, windowHeight;
	if (self.innerHeight) { // all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
		//windowWidth = window.screen.width;
		//windowHeight= window.screen.height;
	}
	
	var visibleWidth, visibleHeight;
	visibleWidth = document.body.clientWidth;
	visibleHeight = document.body.clientHeight;
	return new Array(windowWidth, windowHeight, visibleWidth, visibleHeight);
};

// 获取鼠标位置
var getXY = function (e){
	var XY;
	if(navigator.userAgent.match(/msie/i)){
		var scrollPos;
		if (typeof window.pageYOffset != 'undefined'){
			scrollPos = [window.pageXOffset, window.pageYOffset];
		}else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat'){
			scrollPos = [document.documentElement.scrollLeft, document.documentElement.scrollTop];
		}else if(typeof document.body != 'undefined'){
			scrollPos =[document.body.scrollLeft, document.body.scrollTop];
		}
		XY =[
			window.event.clientX + scrollPos[0] - document.body.clientLeft,
			window.event.clientY + scrollPos[1] - document.body.clientTop
		];
	}else{
		XY = [e.pageX, e.pageY];
	}
	return XY;
};

// 透明度
opacity = {
	set : function() {
		var args = arguments;
		var o = getDom(args[0]);
		try{
			o.filters.alpha.opacity = args[1];
		}catch(e){
			o.style.opacity = args[1]/100;
			o.style.filter = 'alpha(opacity='+ (args[1]) +')';
		}
	},
	get : function() {
		var o = getDom(arguments[0]), p;
		try{
			p = parseInt(o.filters.alpha.opacity, 10);
			if(isNaN(p)) p=100;
		}catch(e){
			p = o.style.opacity;
			p *= 100;
		}
		return p;
	}
},

// 显示隐藏下拉框
displaySelect = function(status) {
	var selects = document.getElementsByTagName('select');
	var count = selects.length;
	for (var i=0;i<count;i++){
		selects[i].style.visibility = status ? 'visible' : 'hidden';
	}
},

// 事件操作
Event = {
	'add' : function(o, e, h) {
		o = getDom(o);
		if(o.addEventListener){
			o.addEventListener(e, h, false);
		}else if(o.attachEvent){
			o.attachEvent('on'+e, function(){
				return h.call(o, window.event);
			});
		}else{
			var oldHandler = o['on'+e] || function(){};
			o['on'+e] = function(){
				oldHandler();
				h();
			}
		}
	},
	'remove' : function(o, e, h) {
		o = getDom(o);
		if(o.removeEventListener){
			o.removeEventListener(e, h, false);
		}else if(o.detachEvent){
			o.detachEvent('on'+e, h);
		}else{
			o['on'+e] = null;
		}
	},
	'end' : function(e) {
		e = e || window.event;
		e.stopPropagation && (e.preventDefault(), e.stopPropagation()) || (e.cancelBubble = true, e.returnValue = false);
	}
};



/*============================================================
	- 主体函数 Picasa
	- Cody By Mudoo 09.02
============================================================*/
function Picasa(){}
Picasa.prototype = {
	author			: 'Mudoo',
	version			: '1.0 Alpha',
	name			: 'MyPicasa',	// 实例名
	inited			: false,		// 是否已完成初始化
	selector		: '',			// 选择器
	
	// 功能状态
	hotkey			: true,			// 快捷按键是否可用
	wheel			: true,			// 鼠标滚轮是否可用
	slide			: true,			// 幻灯片播放是否可用
	auto			: true,			// 自动播放是否可用
	zoomAnimation	: false,		// 图片缩放动画是否可用
	
	// 参数
	itemWidth		: 36,			// 列表项宽度(像素)
	maskOpacity		: 50,			// 遮罩层透明度
	fadeOutTime		: 200,			// 隐藏遮罩层动画时间
	itemsOpacity	: 30,			// 列表项透明度
	perHintOpacity	: 80,			// 百分比提示框透明度
	fadeInModulus	: 5,			// 渐显系数
	fadeOutModulus	: 8,			// 渐隐系数
	moveModulus		: 6,			// 移动系数
	zoomModulus		: 6,			// 缩放系数
	zoomSpeed		: .8,			// 缩放步长
	zoomMin			: 10,			// 缩放最小百分比
	zoomMax			: 5000,			// 缩放最大百分比
	defaulePerMax	: 85,			// 初始图片最大占屏幕百分比
	toQuickInterval	: 200,			// 切换到快速模式间歇(1秒=1000)
	quickDoInterval	: 50,			// 快速模式动作间歇(1秒=1000)
	autoInterval	: 3000,			// 自动播放间歇(1秒=1000)
	actionSpeed		: 10,			// 动作速度(越小越快，1秒=1000)
	
	// 计时器
	doFade			: null,			// 透明
	doZoom			: null,			// 图片缩放
	doShowItem		: null,			// 列表显示
	doMove			: null,			// 列表移动
	doToQuick		: null,			// 切换到快速模式
	doQuick			: null,			// 快速模式
	doLoad			: null,			// 加载图片
	doAuto			: null,			// 自动播放
	doHidePerHint	: null,			// 隐藏百分比提示栏
	doFadePerHint	: null,			// 显示百分比提示栏
	
	// 变量
	arrItems		: [],			// 列表数组
	arrCount		: -1,			// 列表数量
	currentNo		: 0,			// 当前图片No
	itemDefaultX	: 0,			// 列表默认位置
	initialCoord	: [0, 0],		// 图片初始坐标
	moveDistance	: [0, 0],		// 图片拖拽移动距离
	defaultSizePer	: 100,			// 默认图片大小百分比
	fullSizePer		: 100,			// 满屏图片大小百分比
	currentSizePer	: 100,			// 当前图片大小百分比
	currentZoomSize	: [0, 0],		// 当前图片大小
	currentZoomCoord: [0, 0],		// 当前图片坐标
	isLoaded		: false,		// 图片是否加载完
	isZooming		: false,		// 是否正在缩放图片
	isDraging		: false,		// 是否正在拖拽图片
	isAutoPlaying	: false,		// 是否正在自动播放
	
	activeImage		: null,			// 图片加载容器
	lng				: {				// 中文
		'zoomin'	: '放大图像',
		'zoomout'	: '缩小图像',
		'zoomactual': '以实际大小显示',
		'zoomauto'	: '自适应屏幕大小',
		'prev'		: '上一张图片',
		'slide'		: '播放幻灯片演示',
		'next'		: '下一张图片',
		'autoplay'	: '自动播放',
		'loading'	: '图片加载中...',
		'loaderror'	: '图片加载错误'
	},

	initData:function(){		
		var img, name;
		var self = this;
		self.arrItems = [];
		$(self.selector).each(function(index){
			$(this).attr('PicasaNo', index);
			var thumb = $(this).css('background-image');
			thumb = thumb.substring(4,thumb.length-1);
			img = [thumb,$(this).attr('picasa')];
			name = img[1].substr(img[1].lastIndexOf('\/')+1);
			self.arrItems.push(new Array(img,name,[0,0],''));
		});
		this.arrCount = this.arrItems.length;
		if (this.inited) {
			//若初始化，则填充缩略图列表
			this.createItems();
			$('#PV_Control li').click(function(){
				var number = $(this).attr('number');
				self.changeImage(number);
			});
		}
	},

	// 初始化
	init : function(selectorUser) {
		this.selector = selectorUser;
		var self = this;		
		var img, name;
		$(self.selector).unbind('dblclick').live('dblclick',function(){
			self.display($(this).get(0)); this.blur(); return false;
		});

		if(!this.inited) {
			this.createFrame();
			this.setElementEvent();
			if(this.wheel) this.setWheel();		
			this.inited = true;
		}
	},

	// 生成框架
	createFrame : function() {
		// 背景遮罩
		this.mask = document.createElement('div');
		this.mask.id = 'PicasaMask';
		document.body.appendChild(this.mask);
		// 主体框架
		this.frame = document.createElement('div');
		this.frame.id = 'PicasaView';
		this.frame.innerHTML =
			'<div id="PV_Loading"></div>'+
			'<div id="PV_Error" >error</div>'+
			'<img id="PV_Picture" src="" />'+
			'<div id="PV_PerHint"></div>'+
			'<div id="PV_Hint"></div>'+
			'<div id="PV_Control">'+
			'	<ul id="PV_Items"></ul>'+
			'	<div id="PV_Buttons">'+
			'		<div id="PV_Zoom"><a href="javascript: void(0);" id="PV_Btn_ZoomActual">1:1</a><a href="javascript: void(0);" id="PV_Btn_ZoomOut">-</a><a href="javascript: void(0);" id="PV_Btn_ZoomIn">+</a></div>'+
			'		<div id="PV_Select" class="PV_Btn_Normal"><a href="javascript: void(0);" id="PV_Btn_Prev"></a><a href="javascript: void(0);" id="PV_Btn_Slide"></a><a href="javascript: void(0);" id="PV_Btn_Next"></a></div>'+
			'		<div id="PV_AutoPlay"><a href="javascript: void(0);" id="PV_Btn_AutoPlay">自动播放</a></div>'+
			'	</div>'+
			'</div>';
		document.body.appendChild(this.frame);

		// 框架对象
		this.Picture	= getDom('PV_Picture');				// 大图
		this.Loading	= getDom('PV_Loading');				// 加载提示图
		this.Error		= getDom('PV_Error');					// 错误提示图
		this.fPerHint	= getDom('PV_PerHint');				// 缩放百分比提示框
		this.fHint		= getDom('PV_Hint');					// 底部提示框
		this.fControl	= getDom('PV_Control');				// 控制栏
		this.fItems		= getDom('PV_Items');					// 列表项
		this.fButtons	= getDom('PV_Buttons');				// 控制按钮

		// 按钮对象
		this.btnZoomIn		= getDom('PV_Btn_ZoomIn');			// 放大(+)
		this.btnZoomOut		= getDom('PV_Btn_ZoomOut');		// 缩小(-)
		this.btnZoomActual	= getDom('PV_Btn_ZoomActual');		// 原始尺寸(1:1)
		this.btnPrev		= getDom('PV_Btn_Prev');			// 上一张图片
		this.btnSlide		= getDom('PV_Btn_Slide');			// 幻灯片演示
		this.btnNext		= getDom('PV_Btn_Next');			// 下一张图片
		this.btnAutoPlay	= getDom('PV_Btn_AutoPlay');		// 自动播放
		
		this.mask.style.display = 'none';
		this.frame.style.display = 'none';
		
		var self = this;
		this.activeImage = new Image();
		this.activeImage.onload = function() {self.doLoad = setTimeout(function() {self.loadedAction();}, 0)}
		this.activeImage.onerror = function() {self.doLoad = setTimeout(function() {self.loadError();}, 0)}
		
		// 设置遮罩层透明度
		opacity.set(this.mask, this.maskOpacity);
	},
	
	// 生成列表项
	createItems : function() {
		var itemStr = '';
		for (var i=0; i<this.arrCount; i++){
			itemStr += '<li number="'+i+'"><img src="'+ this.arrItems[i][0][0] +'" /></li>';
		}		
		this.fItems.innerHTML = itemStr;
		this.fItems.style.width = (this.arrCount*36) +'px';
	},
	
	// 设置框架布局
	setFrameLayout : function() {
		//this.mask.style.display = '';
		this.frame.style.display = '';		
		var winSize = getWindowSize();

		this.mask.style.width = winSize[2] +'px';
		this.mask.style.height = winSize[1] +'px';
		
		this.frame.style.width = winSize[2] +'px';
		this.frame.style.height = winSize[1] +'px';
		
		this.fHint.style.width = winSize[2] +'px';
		this.fHint.style.top = (winSize[1]-this.fControl.offsetHeight-this.fHint.offsetHeight) +'px';
		this.fControl.style.width = winSize[2] +'px';
		this.fControl.style.top = (winSize[1]-this.fControl.offsetHeight) +'px';
		
		this.fButtons.style.left = ((winSize[2]-this.fButtons.offsetWidth)/2) +'px';
		
		this.itemDefaultX = Math.round((winSize[2]-this.itemWidth)/2);
		opacity.set(this.fItems, 0);
		this.fItems.style.left = this.itemDefaultX +'px';
		
		this.initialCoord = [
			Math.round(winSize[2]/2),
			Math.round((winSize[1]-this.fControl.offsetHeight)/2)
		];
		
		this.fPerHint.style.left = (this.initialCoord[0]-Math.round(this.fPerHint.offsetWidth/2)) +'px';
		this.fPerHint.style.top = (this.initialCoord[1]-Math.round(this.fPerHint.offsetHeight/2)) +'px';
		opacity.set(this.fPerHint, 0);
		$(this.mask).fadeIn(this.fadeOutTime);
	},
	
	// 设置事件
	setElementEvent : function() {
		var self = this;
		
		this.frame.oncontextmenu = function() {return false}
		this.frame.onclick = function() {self.close()}
		
		this.Picture.onclick = Event.end;
		this.Picture.ondblclick = function() {
			var zoomPer = self.currentSizePer==self.defaultSizePer ? self.fullSizePer : self.defaultSizePer;
			if(self.moveDistance.join(',')!='0,0') {
				zoomPer = self.defaultSizePer;
				self.moveDistance = [0, 0];
			}
			self.zoomAction(zoomPer, true);
		}
		this.dragPicture();
		
		this.Loading.onclick = Event.end;
		this.Error.onclick = Event.end;		
		this.fPerHint.onclick = Event.end;		
		this.fControl.onclick = Event.end;
		this.fControl.ondblclick = function() {
			var zoomPer = self.currentSizePer==self.defaultSizePer ? self.fullSizePer : self.defaultSizePer;
			if(self.moveDistance.join(',')!='0,0') {
				zoomPer = self.defaultSizePer;
				self.moveDistance = [0, 0];
			}
			self.zoomAction(zoomPer, true);
		}
		this.fControl.onmouseover = function() {clearInterval(self.doFade); self.doFade = self.fadeAction(1, self.fItems, 100)}
		this.fControl.onmouseout = function() {clearInterval(self.doFade); self.doFade = self.fadeAction(0, self.fItems, self.itemsOpacity)}
		
		this.btnZoomIn.onmouseover = function() {self.hint(self.lng.zoomin);}
		this.btnZoomIn.onmouseout = function() {self.hint();}
		this.btnZoomIn.onclick = function() {self.zoomAction(1); return false;}
		this.setQuickAction(this.btnZoomIn, 'self.zoomAction(1);');
		
		this.btnZoomOut.onmouseover = function() {self.hint(self.lng.zoomout);}
		this.btnZoomOut.onmouseout = function() {self.hint();}
		this.btnZoomOut.onclick = function() {self.zoomAction(-1); return false;}
		this.setQuickAction(this.btnZoomOut, 'self.zoomAction(-1);');
		
		this.btnZoomActual.onmouseover = function() {self.hint(self.currentSizePer==100 ? self.lng.zoomauto : self.lng.zoomactual);}
		this.btnZoomActual.onmouseout = function() {self.hint();}
		this.btnZoomActual.onclick = function() {self.zoomAction(self.currentSizePer==100 ? self.defaultSizePer : 0); return false;}

		this.btnPrev.onmouseover = function() {self.hint(self.lng.prev);getDom('PV_Select').className='PV_Btn_PrevOver';}
		this.btnPrev.onmouseout = function() {self.hint();getDom('PV_Select').className='PV_Btn_Normal';}
		this.btnPrev.onclick = function() {self.changeImage(self.currentNo-1); return false;}
		this.setQuickAction(this.btnPrev, 'self.changeImage(self.currentNo-1);');
		
		this.btnSlide.onmouseover = function() {self.hint(self.lng.slide);getDom('PV_Select').className='PV_Btn_SildeOver';}
		this.btnSlide.onmouseout = function() {self.hint();getDom('PV_Select').className='PV_Btn_Normal';}
		this.btnSlide.onclick = function() {return false;}
	
		this.btnNext.onmouseover = function() {self.hint(self.lng.next);getDom('PV_Select').className='PV_Btn_NextOver';}
		this.btnNext.onmouseout = function() {self.hint();getDom('PV_Select').className='PV_Btn_Normal';}
		this.btnNext.onclick = function() {self.changeImage(self.currentNo+1); return false;}
		this.setQuickAction(this.btnNext, 'self.changeImage(self.currentNo+1);');
		
		this.btnAutoPlay.onmouseover = function() {self.hint(self.lng.autoplay);}
		this.btnAutoPlay.onmouseout = function() {self.hint();}
		this.btnAutoPlay.onclick = function() {self.autoPlayAction(); return false;}
	},
	
	// 开始显示
	display : function() {
		var self = this;
		var o = getDom(arguments[0]);
		if(!this.inited) this.initialize();
		
		if(this.hotkey) this.setKeyboard(true);
		displaySelect(false);
		
		this.setFrameLayout();
		this.currentNo = parseInt(o.getAttribute('PicasaNo'), 10);
		this.loadImage();
		this.moveAction();
		this.doShowItem = setTimeout(function(){
			self.fadeAction(1, self.fItems, self.itemsOpacity, 0);
		}, 0);
	},
	
	// 切换图片
	changeImage : function() {
		if(this.isDraging) return;
		var No = arguments[0];
		if(No<0) No = 0;
		if(No>=this.arrCount) No = this.arrCount-1;
		if(No == this.currentNo) return;

		clearInterval(this.doZoom);
		clearTimeout(this.doAuto);

		this.currentNo = No;
		this.moveAction(true);
		this.loadImage();
	},
	
	// 加载图片
	loadImage : function() {
		clearTimeout(this.doLoad);
		var self = this;
		this.isLoaded = false;
		//this.Picture.style.display = 'none';
		this.Loading.style.display = '';
		this.Error.style.display = 'none';
		if(this.Loading.offsetLeft==0) {
			this.Loading.style.left = (this.initialCoord[0]-30) +'px';
			this.Loading.style.top = (this.initialCoord[1]-30) +'px';
		}
		this.hintTxt = this.lng.loading;
		this.hint();		
		this.activeImage.src = this.arrItems[this.currentNo][0][1];
	},
	loadedAction : function() {
		this.isLoaded = true;		
		var winSize = getWindowSize();
		var widthPer = Math.round(this.activeImage.width/winSize[2]*100);
		var heightPer = Math.round(this.activeImage.height/winSize[1]*100);
		var sizePer = 100;
		if(widthPer>heightPer && widthPer>=this.defaulePerMax) {
			sizePer = Math.round((winSize[2]*this.defaulePerMax)/this.activeImage.width);
		}else if(widthPer<heightPer && heightPer>=this.defaulePerMax){
			sizePer = Math.round((winSize[1]*this.defaulePerMax)/this.activeImage.height);
		}
		this.defaultSizePer = sizePer;
		this.fullSizePer = Math.round(winSize[2]/this.activeImage.width*100);
		this.moveDistance = [0, 0];
		
		this.arrItems[this.currentNo][2] = [this.activeImage.width, this.activeImage.height];
		this.Picture.src = this.activeImage.src;

		this.zoomAction(sizePer, true, false);
		var cItem = this.arrItems[this.currentNo];
		var hintTxt = '';
		if(cItem[3]!='') hintTxt = cItem[3]+' — ';
		hintTxt += cItem[1] +' ('+ (cItem[2][0] +' x '+ cItem[2][1]) +')';
		this.hintTxt = '<strong>'+ hintTxt +'</strong>';
		this.hint();
		
		this.Picture.style.display = '';
		this.Loading.style.display = 'none';
		this.Error.style.display = 'none';		
		if(this.isAutoPlaying) this.autoPlay();
	},
	loadError : function() {
		this.Picture.style.display = 'none';
		this.Loading.style.display = 'none';
		this.Error.style.display = '';
		this.Error.style.left = (this.initialCoord[0]-30) +'px';
		this.Error.style.top = (this.initialCoord[1]-30) +'px';
		
		this.hintTxt = this.lng.loaderror;
		this.hint();
		if(this.isAutoPlaying) this.autoPlay();
	},
	
	// 自动播放
	autoPlayAction : function() {
		if(!this.auto) return;
		if(this.isAutoPlaying) {
			clearTimeout(this.doAuto);
			this.isAutoPlaying = false;
		}else{
			this.autoPlay();
			this.isAutoPlaying = true;
		}
		
		this.setButton(this.btnAutoPlay, this.isAutoPlaying);
	},
	autoPlay : function() {
		var self = this;
		var No = this.currentNo>=this.arrCount-1 ? 0 : this.currentNo+1;
		this.doAuto = setTimeout(function() {
			self.changeImage(No);
		}, this.autoInterval);
	},
	
	// 拖拽图片
	dragPicture : function() {
		var self = this;
		var currentCoord = [];
		var currentXY = [];
		
		function dragMove(e) {
			if(self.isZooming) return false;
			if(!self.isDraging) {
				self.fControl.style.display = 'none';
				self.fHint.style.display = 'none';
				self.isDraging = true;
			}
			var mouseXY = getXY(e);
			self.Picture.style.left = (currentCoord[0]+mouseXY[0]-currentXY[0]) +'px';
			self.Picture.style.top = (currentCoord[1]+mouseXY[1]-currentXY[1]) +'px';
			return false;
		}
		function initDrag(e) {
			currentCoord = [self.Picture.offsetLeft, self.Picture.offsetTop];
			currentXY = getXY(e);
			
			document.onmousemove = dragMove;
			document.onmouseup = stopDrag;  
			return false; 
		}
		function stopDrag() {
			document.onmousemove = null;
			document.onmouseup = null;
			
			self.moveDistance = [Math.round((self.currentZoomCoord[0]-self.Picture.offsetLeft)/self.currentSizePer*100), Math.round((self.currentZoomCoord[1]-self.Picture.offsetTop)/self.currentSizePer*100)];
			self.fControl.style.display = '';
			self.fHint.style.display = '';
			self.isDraging = false;
		}
		this.Picture.onmousedown = initDrag;   
	},
	
	// 图片缩放
	zoomAction : function() {
		if(!this.isLoaded || this.isDraging) return;
		clearInterval(this.doZoom);
		switch(arguments[0]) {
			case -1 :
				this.currentSizePer *= this.zoomSpeed;
				break;
				break;				
			case 0 :
				this.currentSizePer = 100;
				break;
			case 1 :
				this.currentSizePer /= this.zoomSpeed;
				break;
			default :
				this.currentSizePer = arguments[0];
				break;
		}
		if(!arguments[1]) {
			if(this.currentSizePer<this.zoomMin) this.currentSizePer=this.zoomMin;
			if(this.currentSizePer>this.zoomMax) this.currentSizePer=this.zoomMax;
			this.currentSizePer = Math.round(this.currentSizePer);
		}
		
		this.setButton(this.btnZoomActual, (this.currentSizePer==100));
		
		var size = this.arrItems[this.currentNo][2];
		this.currentZoomSize = [Math.round(size[0]*this.currentSizePer/100), Math.round(size[1]*this.currentSizePer/100)];
		this.currentZoomCoord = [Math.round(this.initialCoord[0]-this.currentZoomSize[0]/2), Math.round(this.initialCoord[1]-this.currentZoomSize[1]/2)];
		
		var moveDistance = [Math.round(this.moveDistance[0]*this.currentSizePer/100), Math.round(this.moveDistance[1]*this.currentSizePer/100)];
		var zoomSize = this.currentZoomSize;
		var zoomCoord = [this.currentZoomCoord[0]-moveDistance[0], this.currentZoomCoord[1]-moveDistance[1]]
		var animation = arguments[2]==undefined ? this.zoomAnimation : arguments[2];
		
		if(animation) {
			var self = this;
			this.doZoom = setInterval(function() {
				self.zoomLoop(zoomSize, zoomCoord);
			}, this.actionSpeed);
			this.isZooming = true;
		}else{
			this.Picture.width = zoomSize[0];
			this.Picture.height = zoomSize[1];
			this.Picture.style.left = zoomCoord[0] +'px';
			this.Picture.style.top = zoomCoord[1] +'px';
			
			this.perHint(this.currentSizePer);
		}
	},
	zoomLoop : function() {
		var zoomSize = arguments[0];
		var zoomCoord = arguments[1];
		var sizeSpeed = [Math.round((zoomSize[0]-this.Picture.width)/this.zoomModulus*10)/10, Math.round((zoomSize[1]-this.Picture.height)/this.zoomModulus*10)/10]
		var coordSpeed = [Math.round((zoomCoord[0]-this.Picture.offsetLeft)/this.zoomModulus*10)/10, Math.round((zoomCoord[1]-this.Picture.offsetTop)/this.zoomModulus*10)/10]
		
		if((sizeSpeed.join(',')!='0,0') || coordSpeed.join(',')!='0,0') {
			this.Picture.width += (sizeSpeed[0]>0 ? Math.ceil(sizeSpeed[0]) : Math.floor(sizeSpeed[0]));
			this.Picture.height += (sizeSpeed[1]>0 ? Math.ceil(sizeSpeed[1]) : Math.floor(sizeSpeed[1]));
			this.Picture.style.left = (this.Picture.offsetLeft+(coordSpeed[0]>0 ? Math.ceil(coordSpeed[0]) : Math.floor(coordSpeed[0]))) +'px';
			this.Picture.style.top = (this.Picture.offsetTop+(coordSpeed[1]>0 ? Math.ceil(coordSpeed[1]) : Math.floor(coordSpeed[1]))) +'px';

			this.perHint(Math.round(this.Picture.width/this.arrItems[this.currentNo][2][0]*100));
		}else{
			clearInterval(this.doZoom);
			this.isZooming = false;
		}
	},
	
	// 列表移动
	moveAction : function() {
		clearInterval(this.doMove);
		var self = this;
		var moveX = this.itemDefaultX-this.currentNo*this.itemWidth;
		if(arguments[0]) {
			this.doMove = setInterval(function(){
				self.moveLoop(moveX);
			}, this.actionSpeed);
		}else{
			this.fItems.style.left = moveX +'px';
		}
	},
	moveLoop : function() {
		var moveX = arguments[0];
		var currX = this.fItems.offsetLeft;
		var speed = Math.round((moveX-currX)/this.moveModulus*10)/10;
		if(speed!=0) {
			speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);
			this.fItems.style.left = (currX+speed) +'px';
		}else{
			this.fItems.style.left = moveX +'px';
			clearInterval(this.doMove);
		}
	},
	
	// 渐变
	fadeAction : function() {
		var args = arguments;
		if(args[3]) opacity.set(args[1], args[3]);
		
		var self = this;
		var modulus = args[0]==1 ? this.fadeInModulus : this.fadeOutModulus;
		var intervalID = setInterval(function(){
			self.fadeLoop(args[1], args[2], modulus, intervalID)
		}, this.actionSpeed);
		return intervalID;
	},
	fadeLoop : function() {
		var args = arguments;
		var o = getDom(args[0]);
		var currOpacity = opacity.get(o);
		var modulus = parseInt(args[2], 10) || 5;
		var speed = Math.round((args[1]-currOpacity)/modulus*10)/10;
		
		if(speed!=0) {
			speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);
			currOpacity += speed;
			opacity.set(o, currOpacity);
		}else{
			clearInterval(args[3]);
		}
	},
	
	// 信息提示
	hint : function() {
		var msg='';		
		if(arguments[0]) {
			msg = arguments[0];
		}else{
			msg = this.hintTxt;
		}
		this.fHint.innerHTML = msg;
	},
	
	// 缩放百分比提示
	perHint : function() {
		this.fPerHint.innerHTML = arguments[0] +'%';
		var self = this;
		clearInterval(this.doFadePerHint);
		this.doFadePerHint = this.fadeAction(1, self.fPerHint, this.perHintOpacity);
		clearTimeout(this.doHidePerHint);
		this.doHidePerHint = setTimeout(function(){
			self.doFadePerHint = self.fadeAction(0, self.fPerHint, 0);
		}, 1000);
	},
	
	// 快速模式
	setQuickAction : function() {
		var args = arguments;
		var self = this;
		args[0].onmousedown = function() {
			self.doToQuick = setTimeout(function(){
				self.doQuick = setInterval(function() {
					eval(args[1]);
				}, self.quickDoInterval);
			}, self.toQuickInterval);
		}
		args[0].onmouseup = function() {
			clearTimeout(self.doToQuick);
			clearInterval(self.doQuick);
		}
		Event.add(args[0], 'mouseout', function() {
			clearTimeout(self.doToQuick);
			clearInterval(self.doQuick);
		});
	},
	
	// 快捷键操作
	setKeyboard : function(b) {
		var self = this;
		if(b) {
			document.onkeydown = function(e) {self.keyboardAction(e);}
		}else{
			document.onkeydown = null;
		}
	},
	keyboardAction : function(e) {
		e = e || window.event;
		var key = e.keyCode;
		var isHotKey = false;
		
		if(key==27) {
			this.close();
			isHotKey = true;
		}else if(key==37) {
			this.changeImage(this.currentNo-1);
			isHotKey = true;
		}else if(key==39) {
			this.changeImage(this.currentNo+1);
			isHotKey = true;
		}else if(key==38 || key==187 || key==107) {
			this.zoomAction(1);
			isHotKey = true;
		}else if(key==40 || key==189 || key==109) {
			this.zoomAction(-1);
			isHotKey = true;
		}else if(key==111 || key==191 || key==220) {
			this.zoomAction(100);
			isHotKey = true;
		}else if(key==106) {
			this.zoomAction(this.defaultSizePer);
			isHotKey = true;
		}		
		if(isHotKey) Event.end(e);
	},
	
	// 滚轮操作
	setWheel : function(b) {
		var self = this;
		if (window.addEventListener) {
			this.frame.addEventListener('DOMMouseScroll', function(e) {self.frameWheelAction(e);}, false);
			this.fControl.addEventListener('DOMMouseScroll', function(e) {self.itemWheelAction(e);}, false);
		}
		this.frame.onmousewheel = function() {self.frameWheelAction();};
		this.fControl.onmousewheel = function() {self.itemWheelAction();};
	},
	getWheel : function(e) {
		e = e || window.event;
		
		var delta = 0;
		if (e.wheelDelta) {
			delta = e.wheelDelta/120;
			//if (window.opera) delta = -delta;
		} else if (e.detail) {
			delta = -e.detail/3;
		}
		
		delta = delta>0 ? 1 : -1;
		return delta;	
	},
	frameWheelAction : function(e) {
		this.zoomAction(this.getWheel(e));
		Event.end(e);
	},
	itemWheelAction : function(e) {
		this.changeImage((this.currentNo-this.getWheel(e)));
		Event.end(e);
	},
	
	// 设置按钮
	setButton : function() {
		var args = arguments;
		args[0].className = args[1] ? 'seled' : '';
	},
	
	// 停止所有动作
	stopAll : function() {
		clearTimeout(this.doShowItem);
		clearTimeout(this.doAuto);
		clearTimeout(this.doToQuick);
		clearInterval(this.doQuick);
		clearTimeout(this.doLoad);
		clearInterval(this.doZoom);
		clearInterval(this.doMove);
		clearInterval(this.doFade);
		clearTimeout(this.doHidePerHint);
		clearInterval(this.doFadePerHint);

	},
	
	// 结束关闭
	close : function() {
		this.stopAll();
		if(this.isAutoPlaying) this.autoPlayAction();
		this.setKeyboard(false);
		displaySelect(true);

		$(this.mask).fadeOut(this.fadeOutTime);
		$(this.frame).fadeOut(this.fadeOutTime);
		$(this.Loading).fadeOut(this.fadeOutTime);
		$(this.Picture).fadeOut(this.fadeOutTime);
	},
	
	// 销毁
	destruction : function() {
		this.stopAll();		
		this.mask		= null;// 框架对象
		this.frame		= null;
		this.Picture	= null;
		this.Loading	= null;
		this.Error		= null;
		this.fPerHint	= null;
		this.fHint		= null;
		this.fControl	= null;
		this.fItems		= null;
		this.fButtons	= null;

		// 按钮对象
		this.btnZoomIn		= null;
		this.btnZoomOut		= null;
		this.btnZoomActual	= null;
		this.btnPrev		= null;
		this.btnSlide		= null;
		this.btnNext		= null;
		this.btnAutoPlay	= null;
		
		this.activeImage = null;
		window[this.name] = null;
		//try{window.CollectGarbage();}catch(e){};
	}
}
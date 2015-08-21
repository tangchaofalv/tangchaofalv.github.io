document.write("<script language='javascript' src='./lib/myDatas.js' ></script>");
document.write("<script language='javascript' src='./lib/flipclock.js' ></script>");
var dynamicLoading = {
	'css':function(path,callback){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required.');
		}
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.href = path;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		head.appendChild(link);
		link.onload=link.onreadystatechange=function(){
			if(!this.readyState || this.readyState=='loaded' || this.readyState=='complete'){
				if(!!callback)callback();
			}
		}
	},
	'js':function(path,callback){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required.');
		}
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = path;
		script.type = 'text/javascript';
		head.appendChild(script);
		script.onload=script.onreadystatechange=function(){
			if(!this.readyState || this.readyState=='loaded' || this.readyState=='complete'){
				if(!!callback)callback();
			}
		}
	}
};
//-----------------------------------------------------------------------------------------------------------------
/*获取数据*/
function getDataById(dataId){
	for(var i in data_myPhotos){
		if(data_myPhotos[i]['id']==dataId){
			return data_myPhotos[i];
		}
	} 
}
/*时钟*/
function clockInit(){
	setInterval(function(){
			var clock = new Date();
			var strClock = clock.getHours()+":"+clock.getMinutes()+":"+clock.getSeconds();
			$('#timespan').text(strClock);
	},1000);
}
/*设置首页背景图片*/
function loadBGImgs(bgImgArray,url,imgs,callback){
	for(var i in imgs){
		var tmpImg = new Image();
		tmpImg.src = url + imgs[i]['imgName'];
		tmpImg.onload = function(){
			bgImgArray.push(this);
			if(bgImgArray.length==2){
				callback(rollBg(bgImgArray));
			}
		}
	}
}
/*轮播首页背景图片*/
function rollBg(bgImgArray){
	var indexNum = 0;
	$('#elem').fadeTo('fast', 0, function(){
		 	$(this).css('background-image', 'url('+bgImgArray[indexNum].src+')');
			indexNum++;
	}).fadeTo('slow', 1);
	
	var rollTrigger = setInterval(function(){
		if(indexNum!=(bgImgArray.length)){
			bgName = bgImgArray[indexNum].src;
		}else{
			indexNum = 0;
			bgName = bgImgArray[indexNum].src;
		}
		indexNum++;
		//console.log(bgName);
		$('#elem').fadeTo('slow', 0, function(){
		 	$(this).css('background-image', 'url('+bgName+')');
		}).fadeTo('slow', 1);
	},4000);

	return rollTrigger;
}

var myTrigger;
var clock;
dynamicLoading.js("./lib/jquery-2.1.4.min.js",function(){
	$(function(){
		
		clock = $('.clock').FlipClock({
			clockFace: 'TwelveHourClock'
		});
			

		var bgImgArray = new Array();
		var indexRollImgs = getDataById('indexRollImg');
		loadBGImgs(bgImgArray,indexRollImgs['url'],indexRollImgs['photos'],function(myParam){
			myTrigger = myParam;
		});

		$("#gallery").click(function(){
			clearInterval(myTrigger);
			$("#elem").fadeTo('fast',0,function(){
				$(this).css("background-image","linear-gradient(to top left,white,black)");
			}).fadeTo('slow',1,function(){
				if($("#gridDiv").length>0){
					$("#gridDiv").css("display","block");
				}else{
					getGridList();
				}
			});
		});

		$("#myLogo").click(function(){
			clearInterval(myTrigger);
			$("#gridDiv").fadeOut('fast',function(){
				myTrigger = rollBg(bgImgArray);
			});
		});

		$("#clossImgShow").click(function(){
			$("#showImgAllSizeDiv").fadeOut(200);
		});

	});
});

/*显示图列*/
function getGridList(){
	var gridDiv = document.createElement("div");
	gridDiv.className = "gridDiv clearfix";
	gridDiv.id = "gridDiv";
	document.getElementById("elem").appendChild(gridDiv);

	var gridUl = document.createElement("ul");
	gridUl.className = 'gridUl';
	gridUl.id = 'gridUl';

	var myGallery = getDataById('gallery');
	var imgArray = new Array();
	// loadGalleryImgs(imgArray,myGallery['url'],myGallery['photos']);
	// loadGalleryImgs2(imgArray,myGallery['url'],myGallery['photos']);
	loadGalleryImgs3(imgArray,myGallery['url'],myGallery['photos']);
	imgSize = imgArray.length;

	gridDiv.appendChild(gridUl);

	var chooseSlideDiv ="<div class='navSlide'>"+
							"<div class='pre' id='pre'>"+
								"<span class='test'></span><span class='test'></span><span class='test'></span><span class='test'></span>"+
							"</div>"+
							"<div class='next' id='next'>"+
								"<span class='test'></span><span class='test'></span><span class='test'></span><span class='test'></span>"+
							"</div>"+
						"</div>";
	$("#gridDiv").append(chooseSlideDiv);

	$('#pre').click(function(){
		 var liSize = $("li.gridLi")
		 if(liSize.length>1 && pageIndex!=0){
		 	var curLi = $("li.gridLi:eq("+pageIndex+")");
			curLi.fadeOut('slow');
			curLi.prev().fadeIn('slow');
		 	pageIndex--;
		 }else{
		 	alert('已经是第一页了');
		 }
	});
	$('#next').click(function(){
		if(currentIndex==imgSize && (pageIndex==$("li.gridLi").length-1)){
			console.log('img end:'+currentIndex+"   "+imgSize);
			alert('没有更多内容了');
			return;
		};
		var curLi = $("li.gridLi:eq("+pageIndex+")");
		if(curLi.next().length>0){//已生成过的节点
			pageIndex++;
			curLi.fadeOut('slow');
			curLi.next().fadeIn('slow');
		}else{//需 生成节点
			pageIndex++;
			getNewImgShow(imgArray);//生成
			curLi.fadeOut('slow');
			curLi.next().fadeIn('slow');
		}
	});

	getNewImgShow(imgArray);
	curLi = $("li.gridLi:eq("+pageIndex+")");
	curLi.fadeIn();

}
var imgSize = 0;
var currentIndex = 0;
var pageIndex = 0;

function getNewImgShow(imgArray){
	var showType = Math.floor(Math.random()*4);
	if(imgSize%currentIndex==2){
		$('#gridUl').append("<li class='gridLi'>"+imgShow2(imgArray)+"</li>");
	}else if(imgSize%currentIndex==1){
		$('#gridUl').append("<li class='gridLi'>"+imgShow3(imgArray)+"</li>");
	}else{
		$('#gridUl').append("<li class='gridLi'>"+getShowImg[showType](imgArray,0)+"</li>");
	}
	/*$("li.gridLi:last img").each(function(){
		$(this).next().text($(this).data('tip'));
		$(this).click(function(){
			var imgSrc = $(this).attr('src');
			console.log(imgSrc);
			$("#showImgAllSizeDiv>div>img").attr('src',imgSrc);
			$("#showImgAllSizeDiv").fadeIn(200);
		})
	});*/
	$("li.gridLi:last div.imgShowDivItem").each(function(){
		$(this).next().text($(this).data('tip'));
		$(this).click(function(){
			var imgSrc = $(this).css('backgroundImage');
			imgSrc = imgSrc.slice(4,imgSrc.length-1);
			// var imgSrc = $(this).attr('src');
			$("#showImgAllSizeDiv>div>img").attr('src',imgSrc);
			$("#showImgAllSizeDiv").fadeIn(200);
		})
	});
}

function loadGalleryImgs(imgArray,url,imgs,callback){
	for(var i in imgs){
		var tmpImg = new Image();
		tmpImg.src = url + imgs[i]['imgName'];
		imgArray.push(tmpImg);
	}
}
function loadGalleryImgs2(imgArray,url,imgs,callback){
	for(var i in imgs){
		var strImg = "<img src='"+url + imgs[i]['imgName']+"' data-tip='"+imgs[i]['description']+"' />";
		imgArray.push(strImg);
	}
}
function loadGalleryImgs3(imgArray,url,imgs,callback){
	for(var i in imgs){
		var strImg = "<div class='imgShowDivItem' style='background-image:url("+url + imgs[i]['imgName']+")' data-tip='"+imgs[i]['description']+"' ></div>";
		imgArray.push(strImg);
	}
}

function createImgItem(eParentNode,imgObj){
	var div = document.createElement("div");
	div.style.backgroundImage = "url("+imgObj.src+")";
	// var a = document.createElement("a");
	// a.appendChild(imgObj);
	// div.appendChild(a);

	var p = document.createElement("p");
	p.innerHTML = "此处展示描述文字";

	eParentNode.appendChild(div);
	eParentNode.appendChild(p);

}

var getShowImg = [imgShow1,imgShow2,imgShow3,imgShow4];

function imgShow1(imgArray){
	var divFrame = "<div>"+
						"<div class='floatLeft allHeight halfWidth imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div>"+
						"<div class='floatLeft halfWidth halfHeight imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div>"+
						"<div class='floatLeft halfWidth halfHeight imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div>"+
					"</div>";
	return divFrame;
}
function imgShow2(imgArray){
	var divFrame = "<div>"+
						"<div class='floatLeft allHeight halfWidth imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div>"+
						"<div class='floatRight allHeight halfWidth imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div>"+
					"</div>";
	return divFrame;
}
function imgShow3(imgArray){
	var divFrame = "<div><div class='allHeight allWidth imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div></div>";
	return divFrame;
}
function imgShow4(imgArray){
	var divFrame = "<div>"+
						"<div class='allWidth halfHeight imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div>"+
						"<div class='floatLeft halfWidth halfHeight imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div>"+
						"<div class='floatRight halfWidth halfHeight imgShowDiv'>"+imgArray[currentIndex++]+"<span>123</span></div>"+
					"</div>";
	return divFrame;
}

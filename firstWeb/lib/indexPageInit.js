document.write("<script language='javascript' src='./lib/myDatas.js' ></script>");

function pageInit(){
	setInterval(function(){
			var clock = new Date();
			var strClock = clock.getHours()+":"+clock.getMinutes()+":"+clock.getSeconds();
			$('#timespan').text(strClock);
	},1000);

	
}

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

function rollBg(bgImgArray){
	var indexNum = 0;
	$('#elem').fadeTo('slow', 0, function(){
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

function getDataById(dataId){
	for(var i in data_myPhotos){
		if(data_myPhotos[i]['id']==dataId){
			return data_myPhotos[i];
		}
	} 
}

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

var myTrigger;
dynamicLoading.js("./lib/jquery-2.1.4.min.js",function(){
	$(function(){
		pageInit();
		
		// $({property:0}).animate({property:100},{
		// 	duration:3000,
		// 	step:function(){
		// 		var percentage = Math.round(this.property);
		// 		$('#loadingProcess').css('width',percentage+'%');
		// 		if(percentage == 100){
		// 			$('#loadingProcess').addClass("done");
		// 		}
		// 	}
		// });

		var bgImgArray = new Array();
		var indexRollImgs = getDataById('indexRollImg');
		loadBGImgs(bgImgArray,indexRollImgs['url'],indexRollImgs['photos'],test);

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

	});
});

function test(myParam){
	console.log('callback:'+myParam);
	myTrigger = myParam;
}

function getGridList(){
	var gridDiv = document.createElement("div");
	gridDiv.className = "gridDiv clearfix";
	gridDiv.id = "gridDiv";
	document.getElementById("elem").appendChild(gridDiv);

	var gridUl = document.createElement("ul");
	gridUl.className = 'gridUl';

	var myGallery = getDataById('gallery');
	var imgArray = new Array();
	loadGalleryImgs(imgArray,myGallery['url'],myGallery['photos']);
	console.log(imgArray);

	for(var i in imgArray){
		var tmpLi = document.createElement("li");
		tmpLi.className = "gridLi";
		createImgItem(tmpLi,imgArray[i]);
		gridUl.appendChild(tmpLi);
	}
	gridDiv.appendChild(gridUl);

	var chooseSlideDiv = "<div class='navSlide'><div class='pre' id='pre'></div><div class='next' id='next'></div></div>";
	$("#gridDiv").append(chooseSlideDiv);

	$('#pre').click(function(){
		console.log('test');
		var index = Math.floor(Math.random()*4);
		console.log(index);
		console.log(getShowImg[index]());
	});

}

function loadGalleryImgs(imgArray,url,imgs,callback){
	for(var i in imgs){
		var tmpImg = new Image();
		tmpImg.src = url + imgs[i]['imgName'];
		imgArray.push(tmpImg);
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

function imgShow1(){
	var divFrame = "<div><div class='floatLeft'></div><div></div><div></div></div>";
	return divFrame;
}
function imgShow2(){
	var divFrame = "<div><div class='floatLeft'></div><div class='floatRight'></div></div>";
	return divFrame;
}
function imgShow3(){
	var divFrame = "<div><div></div></div>";
	return divFrame;
}
function imgShow4(){
	var divFrame = "<div><div></div><div class='floatLeft'></div><div class='floatRight'></div></div>";
	return divFrame;
}
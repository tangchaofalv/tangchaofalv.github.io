document.write("<script language='javascript' src='./lib/myDatas.js' ></script>");

function pageInit(){
	setInterval(function(){
			var clock = new Date();
			var strClock = clock.getHours()+":"+clock.getMinutes()+":"+clock.getSeconds();
			$('#timespan').text(strClock);
	},1000);

	var bgImgArray = new Array();
	var indexRollImgs = getDataById('indexRollImg');
	loadBGImgs(indexRollImgs['url'],indexRollImgs['photos']);

	function loadBGImgs(url,imgs){
		for(var i in imgs){
			var tmpImg = new Image();
			tmpImg.src = url + imgs[i]['imgName'];
			tmpImg.onload = function(){
				bgImgArray.push(this);
				if(bgImgArray.length==2){
					rollBg();
				}
			}
		}

	}

	function rollBg(){
		var indexNum = 0;
		$('#elem').fadeTo('slow', 0, function(){
			 	$(this).css('background-image', 'url('+bgImgArray[indexNum].src+')');
				indexNum++;
		}).fadeTo('slow', 1);
		

		setInterval(function(){
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
	}

	function getDataById(dataId){
		for(var i in data_myPhotos){
			if(data_myPhotos[i]['id']==dataId){
				return data_myPhotos[i];
			}
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

dynamicLoading.js("./lib/jquery-2.1.4.min.js",function(){
	$(function(){
		//pageInit();
		console.log("i am here");
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
	});
});
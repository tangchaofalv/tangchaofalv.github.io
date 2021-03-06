var indexBGImgTrigger,currentTap,indexBGImgArray = new Array(),dataMap = {},sortGalleryArray,galleryLoadIndex=0,galleryLoadSize=15;

$(function(){
	indexBGImg_Init(function(param){
		indexBGImgTrigger = param;
	});

	$("#gallery,#video,#about").click(function(){
		clearInterval(indexBGImgTrigger);
		$(".main").css("height","100%");
		var tmpid = "#"+$(this).attr("id")+"_panel";

		if(currentTap!=tmpid){
			$(currentTap).css("display","none");
			currentTap = tmpid;
		}

		if($(tmpid).length>0){//显示
			$(tmpid).css("display","block");
		}else{//创建
			createChildPanel($(this).attr("id")+"_panel");
		}
	});

	$(".logo").click(function(){
		clearInterval(indexBGImgTrigger);
		$(".main").css("height","100vh");
		$(currentTap).css("display","none");
		indexBGImgTrigger = indexBGImg_Roll(indexBGImgArray);
	});

	$("#closeFullImg").click(function(){
		$("#fullImgOutPanel").css("display","none");
		$("#fullImg").attr("src","");
		$(document.body).css("overflow","auto");
	});
	$(".fullImgDivDetail i").each(function(){
		$(this).hover(function(){
			$(this).addClass($(this).attr("id"));
		},function(){
			$(this).removeClass($(this).attr("id"));
		});
		$(this).click(function(){
			if($(this).attr("id")=="iconHeart"){
				$(this).toggleClass("fa-heart redFont fa-heart-o");
			}
			if($(this).attr("id")=="iconClose"){
				$("#fullImgOutPanel").css("display","none");
				$("#fullImg").attr("src","");
				$(document.body).css("overflow","auto");
			}
		});
	});
});
/*创建分类下的子面板*/
function createChildPanel(panelid){
	var gallery_obj = getPhotos('gallery');
	var gallery_url = gallery_obj['url'];

	sortGalleryArray = layoutGalleryList(gallery_obj['photos'],gallery_url);/*设置图片长宽及其比率*/

	var childHtml = "<div class='outPanel'></div>";
	var html = "<div id='"+panelid+"' class='childPanel'>"+childHtml+"</div>";
	$(".mainChildPanel").append(html);

	checkAndLoad();
	freshImg();
	$(window).scroll(function(){
		loadImg();
	});
}

function checkAndLoad(){
	var imgHtml = "",tmpIndex;
	for(var i=galleryLoadIndex;i<sortGalleryArray.length&&i<(galleryLoadIndex+galleryLoadSize);i++){
		dataMap[sortGalleryArray[i]['id']]=sortGalleryArray[i];
		var whValue = "height:"+sortGalleryArray[i]['height']+"px;width:";
		whValue+=sortGalleryArray[i]['width']+"px;";

		imgHtml+="<div class='galleryImgDiv' style='background:white;"+whValue+"' data-id='"+sortGalleryArray[i]['id']+"' "+ 
				   "data-original='"+sortGalleryArray[i]['imgName']+"' data-load='false'>";

		if(!!sortGalleryArray[i]['title']){
			imgHtml+="<span>"+sortGalleryArray[i]['title']+"</span>";
		}
		imgHtml+="</div> ";
		tmpIndex = i;
	}
	galleryLoadIndex = tmpIndex+1;
	if(!!imgHtml){/*有加载数据*/
		$(".outPanel").append(imgHtml);
		return true;
	}else{/*无加载数据*/
		return false;
	}
}

/*加载图片*/
function loadImg(){
	/*滚动条达到 文档底部时 判断是否还有图片流加载*/
	if(($(window).height()+$(window).scrollTop())==$(document).height()){
		if(checkAndLoad()){

		}else{
			$(window).unbind("scroll");
		}
	}else{
		/*图片文档高度 在文档显示高度内 则图片加载*/
		freshImg();
	}
}
/*显示缩略图*/
function showThumbnail(divobj,imgobj){
	divobj.css("opacity","0");
	divobj.css("background-image","url("+imgobj.src+")");
	divobj.fadeTo("normal","1");
}
/*刷新 缩略图*/
function freshImg(){
	var tmpHeight = $(window).height()+$(window).scrollTop();
	$(".galleryImgDiv[data-load=false]").each(function(){
		if($(this).offset().top<=tmpHeight){
			//$(this).css("background-image","url("+$(this).attr("data-original")+")");
			var tmpImg = new Image();
			tmpImg.src = $(this).attr("data-original");
			var ttt = $(this);
			tmpImg.onload = function(){
				showThumbnail(ttt,this);
			}
			$(this).attr("data-load","true");
		}
		$(this).click(function(){
			$("#fullImgOutPanel").css("top",document.body.scrollTop+"px");/*ie9 有问题*/
			$(document.body).css("overflow","hidden");
			$("#fullImgOutPanel").css("display","block");

			var imgSrc = dataMap[$(this).attr("data-id")]['imgDetail'];
			$("#fullImg").css("opacity","0");
			$("#fullImg").bind("load",function(){
				$(this).fadeTo("normal","1");
			});
			$("#fullImg").attr("src",imgSrc);
			if(!!dataMap[$(this).attr("data-id")]['title']){
				$(".imgtitle").text(dataMap[$(this).attr("data-id")]['title']);
				$(".imgtitle").css("display","block");
			}else{
				$(".imgtitle").css("display","none");
			}
			if(!!dataMap[$(this).attr("data-id")]['description']){
				$(".imgtitle + h3").text(dataMap[$(this).attr("data-id")]['description']);
				$(".imgtitle + h3").css("display","block");
			}else{
				$(".imgtitle + h3").css("display","none");
			}
			
		});
	});
}

/*图册排版*/
function layoutGalleryList(gallery_photos,gallery_url){
	var returnArray = new Array();
	var positionCur = 0,currentCur = 0,picWidth = 0,count = 0;
	for(var i=0;i<gallery_photos.length;i++){
		var rate = (gallery_photos[i]['width']/gallery_photos[i]['height']).toFixed(1);
		gallery_photos[i]['rate'] = rate;

		var tmpWidth = 200*rate; 
		picWidth+=tmpWidth;
		if(picWidth>990){
			resetGalleryImg(returnArray,positionCur,i-1,count);
			positionCur = i;
			currentCur = i;
			picWidth = 0;
			count = 0;
			i--;
			continue;
		}else if(picWidth==990){
			returnArray.push(gallery_photos[i]);
			positionCur = i+1;
			count = 0;
			picWidth = 0;
			continue;
		}else{
			returnArray.push(gallery_photos[i]);
			count++;
		}
		if(i==gallery_photos.length-1){
			resetGalleryImg(returnArray,positionCur,i,count);
		}
		picWidth+=4;
	}
	return returnArray;
}

function resetGalleryImg(returnArray,start,end,count){
	var total = 0;
	var totalWidth = 990-4*count;
	for(var i=start;i<=end;i++){
		total+=parseFloat(returnArray[i]['rate']);
	}
	var lineHeight;
	for(var i=start;i<=end;i++){
		var imgObj = returnArray[i];
		var tmpWidth = (totalWidth/total*imgObj['rate']).toFixed(0);
		returnArray[i]['width'] = tmpWidth;
		if(!lineHeight){
			lineHeight = returnArray[i]['width']/imgObj['rate'];
		}
		returnArray[i]['height'] = lineHeight;
	}

}

/*滚动 初始*/
function indexBGImg_Init(callback){
	var indexBGImg_Obj = getPhotos("indexBGImg");
	var indexBGImg_Url = indexBGImg_Obj['url'];
	var indexBGImg_Photos = indexBGImg_Obj['photos'];

	for(var i in indexBGImg_Photos){
		var tempImg = new Image();
		tempImg.src = indexBGImg_Url+indexBGImg_Photos[i]['imgName'];
		tempImg.onload = function(){
			indexBGImgArray.push(this);
			if(indexBGImgArray.length==2){
				callback(indexBGImg_Roll(indexBGImgArray));
			}
		}
	}
}

/*滚动 执行*/
function indexBGImg_Roll(indexBGImgArray){
	var indexBGImg_Photos_index = 0;

	$(".main").fadeTo("slow",0,function(){
			$(this).css("background-image","url("+indexBGImgArray[indexBGImg_Photos_index].src+")");
			indexBGImg_Photos_index++;
			if(indexBGImg_Photos_index==indexBGImgArray.length){
				indexBGImg_Photos_index = 0;
			}
	}).fadeTo("slow",1);

	var indexBGImg_Time = setInterval(function(){
		
		$(".main").fadeTo("slow",0,function(){
			$(this).css("background-image","url("+indexBGImgArray[indexBGImg_Photos_index].src+")");
			indexBGImg_Photos_index++;
			if(indexBGImg_Photos_index==indexBGImgArray.length){
				indexBGImg_Photos_index = 0;
			}
		}).fadeTo("slow",1);
		
	},4000);

	return indexBGImg_Time;
}

function getPhotos(photoid){
	for(var i in data_photos){
		if(data_photos[i]['id']==photoid){
			return data_photos[i];
		}
	}
}
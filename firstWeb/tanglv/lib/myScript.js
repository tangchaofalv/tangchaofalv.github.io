var indexBGImgTrigger,currentTap,indexBGImgArray = new Array();

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
		$(document.body).css("overflow","auto");
	});
});
/*创建分类下的子面板*/
function createChildPanel(panelid){
	var gallery_obj = getPhotos('gallery');
	var gallery_url = gallery_obj['url'];
	var gallery_photos = gallery_obj['photos'];

	var sortGalleryArray = layoutGalleryList(gallery_photos,gallery_url);

	var imgHtml = "";
	for(var i in sortGalleryArray){
		var whValue = "height:"+sortGalleryArray[i]['height']+"px;width:";
		whValue+=sortGalleryArray[i]['width']+"px;";

		imgHtml+="<div class='galleryImgDiv' style='background:white;"+whValue+"' "+ 
				   "data-original='"+gallery_url+sortGalleryArray[i]['imgName']+"' data-load='false'>";

		if(!!sortGalleryArray[i]['title']){
			imgHtml+="<span>"+sortGalleryArray[i]['title']+"</span>";
		}
		imgHtml+="</div> ";
	}

	var childHtml = "<div class='outPanel'>"+imgHtml+"</div>";
	var html = "<div id='"+panelid+"' class='childPanel'>"+childHtml+"</div>";
	$(".mainChildPanel").append(html);

	$(".galleryImgDiv").each(function(){
		$(this).click(function(){
			$("#fullImgOutPanel").css("top",document.body.scrollTop+"px");/*ie9 有问题*/
			$(document.body).css("overflow","hidden");
			$("#fullImgOutPanel").css("display","block");
			var imgSrc = $(this).css('backgroundImage');
			imgSrc = imgSrc.slice(4,imgSrc.length-1);
			console.log(imgSrc);
			console.log(imgSrc.lastIndexOf("/"));
			var tmpSrc = imgSrc.substring(0,imgSrc.lastIndexOf("/")+1);
			var tmpName = imgSrc.substring(imgSrc.lastIndexOf("/")+1,imgSrc.length);
			console.log(tmpName);
			var tmpDetailName = tmpName.substring(0,tmpName.indexOf("."))+"_detail.jpg";
			console.log(tmpDetailName);
			$("#fullImg").attr("src",tmpSrc+tmpDetailName);
		});
	});

	loadImg();
	$(window).scroll(function(){
		loadImg();
	});
	/*$("img.lazy").lazyload({effect: "fadeIn"});*/
}

function loadImg(){
	var tmpHeight = $(window).height()+$(window).scrollTop();
	$(".galleryImgDiv[data-load=false]").each(function(){
		if($(this).offset().top<=tmpHeight){
			$(this).css("background-image","url("+$(this).attr("data-original")+")");
			$(this).attr("data-load","true");
		}
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
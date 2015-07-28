/*动态加载 js or css*/
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
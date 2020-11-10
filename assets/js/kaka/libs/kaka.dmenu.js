kaka.dmenu = function(DOM, opts){
	var self = this;

	self.defaults = {
		htmlTpl: '<select></select>', //控件模板
		selected: 0, //选中项ID
		disableId: 0, //禁止ID加载
		defaultText: false, //默认文本
		firstText: false, //首个加载控件文本
		script: '', //请求脚本地址
		mapping: new Array(), //控件映射 [['province', '请选择省份...'], ['city', '请选择城市...']]
		callback: function(el, data) {}, //回调方法
		rootId: 0, //载入的根ID
		limit: 0
	};

	var opts = $.extend(true, self.defaults, opts);
	var data = new Object();
	var path = new Array();

	self.init = function(){
		//载入数据
		$.getJSON(opts.script, function(result) { 
			data = result; 
			el = self.loadNote(opts.rootId, $(this));
			if (opts.selected) {
				//name转换成ID
				if (!parseInt(opts.selected)) {
					var sId = 0;
					$.each(data, function(key, val) {
						if (opts.selected.indexOf(val.name) >= 0) {
							path = new Array();
							self.parsePath(val.id);
							path = path.reverse();
							
							var str = '';
							for(idx in path) {
								str += path[idx].name;
							}
							if (opts.selected == str) {
								sId = val.id;
							}
						}
					});
					opts.selected = sId;
				}

				path = new Array();
				self.parsePath(opts.selected);
				path = path.reverse();

				for(idx in path) {
					var id = path[idx].id;
					if (id != opts.rootId) {
						$('[value='+id+']', el).attr('selected', true);
						if (opts.limit != 0 && idx > opts.limit) return false;

						el = self.loadNote(id, el);
					}
				}
			}
		});
	}

	self.parsePath = function(id) {
		if (opts.rootId != id) {
			$.each(data, function(key, val) {
				if (id == val.id) {
					path.push(val);
					self.parsePath(val.parent_id);
				}
			});
		}
	}
	
	self.loadNote = function(id, obj) {
		var extend = data[id];
		var level = parseInt(extend ? extend.level : 1);

		$(obj).nextAll().remove();

		opts.callback(obj, extend ? extend : false);
		if (opts.limit != 0 && level >= opts.limit+1) return false;
		var mp = opts.mapping[level-1];
		var el = $(opts.htmlTpl)
			.data('level', level)
			.change(function() {
				if (!$(this).val()) return false;
				self.loadNote($(this).val(), $(this));
			});

		el.appendTo(DOM);

		if (opts.firstText && id == opts.rootId) {
			el.empty();
			$(el).append('<option value="-1">'+opts.firstText+'</option>');
		} else if (opts.defaultText) {
			el.empty();
			var defText = opts.defaultText;
			if (typeof(defText) == 'object') {
				var defText = defText[level-1];
			}

			$(el).append('<option value="-1">'+defText+'</option>');					
		}

		if (mp) {
			if (typeof(mp) == 'object') {
				el.attr('name', mp[0]);
				if (mp[1]) {
					el.empty();
					el.append('<option value="-1">'+mp[1]+'</option>');
				}
			} else {
				el.attr('name', mp);
			}
		}

		var find = false;
		$.each(data, function(key, val) {
			if (opts.disableId != val.id) {
				if (val.parent_id == id) {
					$(el).append('<option value="'+val.id+'">'+val.name+'</option>');
					find = true;
				}
			}
		});

		if (!find) $(el).remove();
		
		return el;
	}

	self.init();


	return self;
}
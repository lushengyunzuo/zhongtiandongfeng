
kaka = function(){
	var self = this;

	self.init = function(){
		self.bindPlugin();
	}

	self.bindPlugin = function(){
		$('[data-plugin]').each(function(idx){
			var el = $(this);
			var data = $(this).data();

			var fa = data.plugin.match(/\-(\w)/g);
			if (fa) {
				for(x in fa) {
					var funcName = data.plugin.replace(fa[x], fa[x].toUpperCase()).replace('-','');
					var func = eval('self.'+funcName);
				}
			} else {
				func = eval('self.'+data.plugin);
			}

			func(el, data);
		});

		$('[data-selected]').each(function(idx){
			var v = $(this).data('selected');
			$('option', this).each(function(){
				if ($(this).val()==v) {
					$(this).prop('selected', 1);
				}
			})
		});
	}

	self.validator = function(el, opts) {
		seajs.use(['/assets/js/kaka/libs/kaka.validator.js'], function(){
			new kaka.validator(el, opts);
		});
	}

	self.datetimePicker = function(el, opts) {
		$(el).data('type', 'datetime');
		self.datePicker(el, opts);
	}

	self.datePicker = function(el, opts){
		seajs.use(['/assets/js/datetime/bootstrap-datetimepicker.min.css',
			'/assets/js/datetime/bootstrap-datetimepicker.min.js'], function(){
			seajs.use(['/assets/js/datetime/locales/bootstrap-datetimepicker.zh-CN.js'], function(){
				var defaults = {
					format: 'yyyy/mm/dd',
					language:  'zh-CN',
					weekStart: 1,
					todayBtn:  1,
					autoclose: 1,
					minView: 2,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0,
					showMeridian: 0
				};

				opts = $.extend(true, defaults, opts);
				switch (opts.type) {
					case 'datetime':
						opts.format = 'yyyy/mm/dd hh:ii';
						opts.minView = 0;
						opts.minuteStep = 5;
						break;
					case 'datehour':
						opts.format = 'yyyy/mm/dd hh:00';
						opts.minView = 1;
						break;
				}
				$(el).datetimepicker(opts);	
			});
		});
	}

	self.chkGroup = function(el, opts){
		$('[role=chk-all]', el).unbind('click');
		$('[role=chk-all]', el).bind('click', function(){ 
			var chk = $(this).is(":checked") ? true : false;
			$('[role=chk-item]', el).prop('checked', chk);
		});
		$('[role=chk-item]', el).unbind('click');
		$('[role=chk-item]', el).bind('click', function(){ 
			var chk = true;
			$('[role=chk-item]', el).each(function(){
				if (!$(this).is(":checked")) chk = false;
			});
			$('[role=chk-all]', el).prop('checked', chk);
		});
	}

	self.editor = function(el, opts){
		seajs.use(['/assets/js/kindeditor/kindeditor.sea.js'], function(editor){
			var defaults = {
				uploadJson : '/misc.php?act=upload&token='+opts.token,
				filterMode : false,
				themeType : 'bootstrap',
				cssPath : '/assets/css/richtext.css',
				bodyClass: 'richtext',
				width: '100%',
				minWidth : 450,
				minHeight: 360,
				fontSizeTable : ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px', '38px', '42px'],
				items : [
					'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
					'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
					'flash', 'media', 'insertfile', 'table', /*'hr', 'emoticons',*/ 'baidumap', 'pagebreak',
					'anchor', 'link', 'unlink', '/', 
					'cut', 'copy', 'paste',
					'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
					'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
					'superscript', '|', 'clearhtml', 'quickformat', /*'selectall', */'preview', 'print', 'template', 'code', 'source', 'fullscreen',
				],
				afterBlur: function () { 
					this.sync(); 
				}
			}
			opts = $.extend(true, defaults, opts);
			editor.create(el, opts);
		});
	}

	self.codeEditor = function(el, opts){
		var mode = $(el).data('mode');
		el.hide();
		seajs.use(['/assets/js/ace/ace.sea.js'], function(ace){
			var domId = 'ace-'+$(el).index();
			var editorDom = '<div class="form-control" style="height:350px; font-size:13px" id="'+domId+'"></div>';
			$(editorDom).insertAfter(el);

			var editor = ace.edit(domId);
			editor.getSession().setValue($(el).val());
			//editor.setTheme("ace/theme/twilight");
			editor.getSession().setMode('ace/mode/'+mode);
			editor.getSession().on('change', function(e) {
				var val = editor.getSession().getValue();
				$(el).val(val);
			});
		});
	}

	self.imgSelector = function(el, opts) {
		var id = 'img-selector';
		var limit = $(el).data('limit');
		var idx = $(el).index();
		var ipt = $(el).data('ipt');
		var ref = $(el).data('ref')?$(el).data('ref'):0;
		var dom = $('[data-ipt="'+ipt+'"]>.sui-img-selector-box');
		var url = '/?module=admincp&controller=image&action=selector&ipt='+ipt+'&ref='+ref+'&limit='+limit+'&idx='+idx;
		var val = $('.sui-img-value', el).html();
		var files = new Array();

		$.applyImage = function(file, ipt, DOM) {
			var tpl = '<input type="hidden" name="'+ipt+'" value="'+file+'" />'
				+ '<a class="img-preview"><img src="'+file+'" role="btn" /></a>'
				+ '<a class="JS_DelImg img-remove" href="javascript:;"><i class="fa fa-remove"></i> <span>移除</span></a>';
			$(DOM).html(tpl);

			$('.JS_DelImg', DOM).on('click', function(){
				$(DOM).empty().html('<input type="hidden" name="'+ipt+'" value="" />');
				event.stopPropagation();
			});
		}

		$.applyImages = function(files, ipt, DOM) {
			$(DOM).empty();
			for(x in files) {
				var file = files[x];
				var tpl = '<div class="JS_ImgItem img-item">'
					+ '<div class="alt">'
					+ '<input type="hidden" name="'+ipt+'['+x+'][id]" value="'+file.id+'">'
					+ '<input type="hidden" name="'+ipt+'['+x+'][src]" value="'+file.src+'">'
					+ '<textarea name="'+ipt+'['+x+'][alt]" class="form-control" placeholder="请输入图片说明">'+(file.alt?file.alt:'')+'</textarea>'
					+ '<a href="javascript:;$(\'.alt\',\'.JS_ImgItem\').hide();" class="btn btn-primary btn-xs">确定</a>'
					+ '</div>'
					+ '<a class="thumb" title="'+(file.alt?file.alt:'')+'"><img src="'+file.src+'" data-id="'+file.id+'"></a>'
					+ '<div class="operate">'
					+ '<a href="javascript:;" class="JS_DelImg">'
					+ '<i class="fa fa-remove"></i> 移除</a>'
					+ '</div></div>';
				$(DOM).append(tpl);
			}

			$('.JS_ImgItem', DOM).on('click', function(){
				var el = $(this);
				$('.alt', DOM).hide();
				$('.alt', el).show();
				$(document).mouseup(function(e){
					var _con = el;   // 设置目标区域
					if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
						$('.alt', DOM).hide();
					}
				});
				event.stopPropagation();
			});

			$('.JS_DelImg', DOM).on('click', function(){
				$(this).parents('.JS_ImgItem').remove();
			});

			$('.JS_Forward', DOM).on('click', function(){
				var e = $(this).parents('.JS_ImgItem');
				e.prev('.JS_ImgItem').before(e);
			});
			$('.JS_Backward', DOM).on('click', function(){
				var e = $(this).parents('.JS_ImgItem');
				e.next('.JS_ImgItem').after(e);
			});
			seajs.use(['/assets/js/dragsort/jquery.dragsort-0.5.2.min.js'], function(dragsort){
				$(DOM).dragsort("destroy");
				$(DOM).dragsort({placeHolderTemplate: "<div class='img-item'></div>"});
			});
		}

		if (val) {
			if (limit>1) {
				$.applyImages(eval('(' + val + ')'), ipt, dom);
			} else {
				$.applyImage(val, ipt, dom);
			}
		}
		
		$('[role="btn"]', el).unbind('click');
		$('[role="btn"]', el).bind('click', function(){
			$('#'+id).remove();
			$('body').append('<div class="modal fade" id="'+id+'" tabindex="-1" role="dialog" aria-hidden="false"></div>');

			$('#'+id).load(url,function(){  
				$('#'+id).modal("show");
				$('.btn-ok').click(function(){
					if (limit>1) {
						$.applyImages(images, ipt, dom);
					} else {
						$.applyImage(images[0].src, ipt, dom);
					}
				});
			})
		});
	}

	self.userSelector = function(el, opts) {
		var id = 'user-selector';
		var role = $(el).data('role');
		var url = '/?module=admincp&controller=user&action=selector&role='+role;

		$('[role="btn"]', el).unbind('click');
		$('[role="btn"]', el).bind('click', function(){
			$('#'+id).remove();
			$('body').append('<div class="modal fade" id="'+id+'" tabindex="-1" role="dialog" aria-hidden="false"></div>');

			$('#'+id).load(url,function(){  
				$('#'+id).modal("show");
			});
		});
	}

	self.tagsinput = function(el, opts) {
		seajs.use(['/assets/js/tagsinput/bootstrap-tagsinput.js',
			'/assets/js/tagsinput/bootstrap-tagsinput.css'], function(){
			var remoteUrl = $(el).data('typeahead');
			if (remoteUrl) {
				$(el).tagsinput({
					typeaheadjs: {
						valueKey: 'value',
						source: function(query, process) {
							$.getJSON(remoteUrl, {q:query}, function (data) {
								process(data);
							});
						}
					}
				});
			} else {
				$(el).tagsinput();
			}
		});
	}

	self.dragsort = function(el, opts) {
		seajs.use(['/assets/js/dragsort/jquery.dragsort-0.5.2.js'], function(dragsort){
			$(el).dragsort({
				dragSelectorExclude: "input, textarea, select, a, button",
				dragSelector:'tr', 
			});
		});
	}

	self.chart = function(el, opts) {
		seajs.use(['/assets/js/highcharts/highcharts.js'], function(){
			var defaults = {
				credits: {
					enabled: false
				},
				yAxis: {
					title: {
						text: ''
					},
				}
			};
			if ($(el).attr('id')) {
				var obj = $(el).attr('id');
			} else {
				var obj = 'charts-'+$(el).index();
				$(el).attr('id', obj);
			}

			console.log(obj);
			opts = $.extend(true, defaults, opts);
			Highcharts.chart(obj, opts);
		});
	}

	self.dmenu = function(el, opts) {
		seajs.use(['/assets/js/kaka/libs/kaka.dmenu.js'], function() {
			var className = 'js-kaka-dmenu-'+$(el).index();
			$(el).hide().after('<div class="'+className+' form-inline"></div>');
			if (opts.size) {
				var tpl = '<select size="'+(opts.size)+'" class="form-control" style="margin-right:8px"></select>';
			} else {
				var tpl = '<select class="form-control form-control-select" style="margin-right:8px"></select>';
			}
			
			new kaka.dmenu('.'+className, {
				htmlTpl: tpl,
				script: opts.source,
				selected: $(el).val(),
				firstText: opts.deftext?opts.deftext:'主分类',
				callback: function(el, data) { 
					$(el).val(data.id > 0 ? data.id : 0); 
				}
			});
		});
	}

	self.init();

	return self;
}

var kaka = new kaka();
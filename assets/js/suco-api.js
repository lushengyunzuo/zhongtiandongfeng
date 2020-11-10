
$.fn.ready(function(){
	$.initSucoJS();
});

$.initSucoJS = function() {
	//处理select选中
	$('[data-selected]').each(function(idx){
		var v = $(this).data('selected');
		$('option', this).each(function(){
			if ($(this).val()==v) {
				$(this).prop('selected', 1);
			}
		})
	});
	$('[data-plugin]').each(function(idx){
		var el = $(this);
		var plugin = $(this).data('plugin');
		switch(plugin) {
			case 'chk-group':
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
				break;
			case 'accordion':
				$('[role=toggle]', el).unbind('click');
				$('[role=toggle]', el).bind('click', function(){
					var parent = $(this).parents('li');
					var target = $(this).attr("href");

					var flag = $(parent).hasClass('active');
					$('.active>[role=collapse]', el).slideUp('fast');
					$('.active', el).removeClass('active');

					if (flag) {
						$('[role=collapse]', parent).slideUp('fast');
						$(parent).removeClass('active');
					} else {
						$('[role=collapse]', parent).slideDown('fast');
						$(parent).addClass('active');
					}
					return false;
				});
				break;
			case 'date-picker':
				seajs.use('/assets/js/datetime/datetime.sea.js', function(){
					$(el).datetimepicker({
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
					});
				})
				break;
			case 'datetime-picker':
				seajs.use('/assets/js/datetime/datetime.sea.js', function(){
					$(el).datetimepicker({
						format: 'yyyy/mm/dd hh:ii',
						language:  'zh-CN',
						weekStart: 1,
						todayBtn:  0,
						autoclose: 1,
						minView: 0,
						todayHighlight: 1,
						startView: 2,
						forceParse: 0,
						showMeridian: 0,
						minuteStep: 5
					});
				})
				break;
			case 'editor':
				var token = $(el).data('token');
				seajs.use('/assets/js/kindeditor/kindeditor.sea.js', function(editor){
					editor.create(el, {
						uploadJson : '/misc.php?act=upload&token='+token,
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
					});
				});
				break;
			case 'code-editor':
				var mode = $(el).data('mode');
				el.hide();
				seajs.use('/assets/js/ace/ace.sea.js', function(ace){
					var domId = 'ace-'+idx;
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
			case 'tab':
				var e = $(el).data('event') ? $(el).data('event') : 'click';
				$('[role=nav] a', el).unbind();
				$('[role=nav] a', el).bind(e, function(){ 
					//$('[role=content]', el).hide();
					$(this).parents('ul').siblings('[role=content]').hide();
					$(this).parent('li').siblings().removeClass('active');
					$(this).parent('li').addClass('active');

					var target = $(this, el).attr('href');
					$(target).show();
					return false;
				});
				break;
			case 'scrollspy':
				$('[role=nav] a', el).unbind();
				$('[role=nav] a', el).bind('click', function(){ 
					$('[role=nav] li', el).removeClass('active');
					$(this).parent('li').addClass('active');
				});
				var s = new Object();
				$('[role=anchor]', el).each(function(){
					var n = $(this).attr('name');
					var p = $(this).offset();
					$(this).data('top', p.top);
					//s.push({name:n, top:p.top})
				});

				break;
			case 'img-selector':
				var id = 'img-selector';
				var limit = $(el).data('limit');
				var ipt = $(el).data('ipt');
				var ref = $(el).data('ref')?$(el).data('ref'):0;
				var dom = $('[data-ipt="'+ipt+'"]>.sui-img-selector-box');
				var url = '/?module=admincp&controller=image&action=selector&ipt='+ipt+'&ref='+ref+'&limit='+limit+'&idx='+idx;

				var val = $('.sui-img-value', el).html();

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

					
					$('#'+id).modal("show");
					$('#'+id).load(url,function(){  
						$('.btn-ok').click(function(){
							if (limit>1) {
								$.applyImages(images, ipt, dom);
							} else {
								$.applyImage(images[0].src, ipt, dom);
							}
						});
					})
				});
				break;
			case 'user-selector':
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
				break;
			case 'tagsinput':
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
				break;
			case 'dragsort':
				seajs.use('/assets/js/dragsort/jquery.dragsort-0.5.2.js', function(dragsort){
					$(el).dragsort({
						dragSelectorExclude: "input, textarea, select, a, button",
						dragSelector:'tr', 
					});
				});
				break;
			case 'star':
				var tpl = '<li></li><li></li><li></li><li></li><li></li>';
				if (!el.html()) { el.html(tpl); }

				$('li', el).hover(function(){
					$(this).addClass('hover');
					$(this).prevAll().addClass('hover')
					$(this).nextAll().removeClass('hover');
				}, function(){
					$('li', el).removeClass('hover');
				});

				$('li', el).click(function(){
					$('li', el).removeClass('hover');
					$(this).addClass('on');
					$(this).prevAll().addClass('on')
					$(this).nextAll().removeClass('on');

					var n = $(el).data('name');
					var v = $('.on', el).length;
					var t = $(this).text();
					$('.star-val,.star-text', el).remove();
					$(el).append('<input class="star-val" type="hidden" name="'+n+'" value="'+v+'" />');
					$(el).append('<span class="star-text">'+t+'</span>');
				});

				//初始化
				var dv = Math.round($(el).data('val'));
				if (dv) {
					$('li:eq('+(dv-1)+')', el).trigger('click');
				}

				if (!$(el).data('name')) {
					$('li', el).unbind();
				}
				break;
		}
	});

	seajs.use('/assets/js/validator/validator.sea.js', function(validator){
	    $('form').each(function(){
	        validator(this);
	    })
	});

	$('.sui-form').off('keypress');
	$('.sui-form').on('keypress', function(event){
		if (!(event.which == 115 && (event.ctrlKey||event.metaKey)) && !(event.which == 19)) return true;
		$('.sui-form').trigger('submit');
		return false;
	});
}
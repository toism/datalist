(function ($) {
	$.createDataList = function (settings) {
		
		var defaults = {
			page : "1",
			page_size : "10",
			
			list_url : "get_list.php",
			delete_url : "delete_proc.php",
			view_url : "update.html",
			reg_url : "regist.html",

			list_name : null,
			list_field : null,
			search_field : null,
			field_type : null,

			header_selector : "#header_list",
			datalist_selector : "#data_list",
			paging_selector : "#paging_list" ,

			date_from_selector : "#date_from",
			date_to_selector : "#date_to",
			search_word_selector : "#search_word",

		

			search_button_selector : "#search_button",
			regist_button_selector : "#regist_button",
			reset_button_selector : "#reset_button",

			top_zone_selector : "#top_zone",

			select_title : null,
			category : null,
			no_data : "데이터가 없습니다.",
			control : "both",
			search_zone : true,
			regist_zone : true
		}
		
		var opts = $.extend(defaults, settings);

		$.fn.extend(this, getDataList);	
		this.opts = opts;
		this.init();
	};

	var getDataList = {
		
		init : function () {
				
			var _this = this;

			this.page_total = 0;

			this.paging_html = "";
			this.page_start = 0;
			this.page_end =0;

			this.list_html = "";
			this.header_html = "";

			this.top_html = "";

			this.seq ="";

			this.list_url = this.opts.list_url;
			this.delete_url = this.opts.delete_url;
			this.view_url = this.opts.view_url;
			this.reg_url = this.opts.reg_url;

			

			this.list_name = this.opts.list_name;
			this.list_field = this.opts.list_field;
			this.search_field = this.opts.search_field;
			this.field_type = this.opts.field_type;

		
			this.header_selector = this.opts.header_selector;
			this.datalist_selector = this.opts.datalist_selector;
			this.paging_selector = this.opts.paging_selector;
			
			this.search_word_selector = this.opts.search_word_selector;
			this.date_from_selector = this.opts.date_from_selector;
			this.date_to_selector = this.opts.date_to_selector;

			this.search_word = null;
			this.date_from = null;
			this.date_to = null;

			this.search_button_selector = this.opts.search_button_selector;
			this.regist_button_selector = this.opts.regist_button_selector;
			this.reset_button_selector = this.opts.reset_button_selector;

			this.top_zone_selector = this.opts.top_zone_selector;
			this.select_title = this.opts.select_title;
			
			this.control = this.opts.control;
			this.no_data = this.opts.no_data;
			
			this.page = this.opts.page;
			this.page_size = this.opts.page_size;
			this.category = this.opts.category;

			this.search_zone = this.opts.search_zone;
			this.regist_zone = this.opts.regist_zone

			if(this.page == "" && this.page == null) {
				this.page = 1;
			}

			this.makeUtilityZone();
			this.getData();
			this.bindButton();

		},
		makeUtilityZone : function () {

			var _this = this;

			var top_html = "";
		
			if(this.search_zone) {
				top_html += "<div class='col-lg-2'>";
				top_html += "		<div id='datefromPicker' class='input-group date datepick' data-date-format='yyyy-mm-dd'>";
				top_html += "			<input size='16'  name='date_from'  id='date_from' class='form-control ' type='text' value='' >";
				top_html += "			<span class='input-group-addon'><i class='icon16 i-calendar-4'></i></span>";
				top_html += "		</div>";
				top_html += "</div>";
				top_html += "<div class='col-lg-2'>";
				top_html += "		<div id='datetoPicker' class='input-group date datepick' data-date-format='yyyy-mm-dd'>";
				top_html += "			<input size='16'  name='date_to'  id='date_to' class='form-control ' type='text' value='' >";
				top_html += "			<span class='input-group-addon'><i class='icon16 i-calendar-4'></i></span>";

				top_html += "		</div>";
				top_html += "</div>";
				top_html += "<div class='col-lg-4'> ";
				top_html += "		<div class='input-group'>";
				top_html += "			<input type='text' name='search_word' id='search_word' placeholder='검색어를 입력하세요' class='search-query form-control' value='' >";
				top_html += "			<span class='input-group-btn'>";
				top_html += "				<button type='submit' class='btn btn-info'  id='search_button'><i class='icon16 i-search-2 gap-right0'></i> 검색</button>";
				top_html += "				<button type='submit' class='btn btn-danger'  id='reset_button' style='display:none'><i class='icon16 i-undo-2 gap-right0'></i> 리셋</button>";
				top_html += "			</span>";
				top_html += "		</div>";
				top_html += "</div>";
			}

			if(this.regist_zone){
				top_html += this.search_zone ? "<div class='col-lg-4'>" : "<div class='col-lg-12'>"; 
				top_html += "<button class='btn btn-warning pull-right' type='button' id='regist_button' ><i class='icon10 i-user-plus'></i>등록</button>";
				top_html += "</div>";

			}

			this.top_html = top_html;

			
	
			
		
		},
		bindButton : function () {
			var _this = this;

			$(_this.reset_button_selector).hide();

			if(this.search_zone) {
				
				$("#datefromPicker, #datetoPicker").datepicker({
					format: 'yyyy-mm-dd',
					autoclose : true,
					language : "kr",
					showOn: "off"
			    });

				$(document).on("blur",".datepick", function() {
					$("#datefromPicker, #datetoPicker").datepicker({
						format: 'yyyy-mm-dd',
						autoclose : true,
						language : "kr",
						showOn: "off"
					});
					$(".datepick").removeClass('hasDatepicker').datepicker();     
				});
			}
			

			$(_this.datalist_selector).on("click",".btn-xs", function(e) {
				var btn_id=$(this).attr('id');
				var btn_type = btn_id.split('-')[0];
				var btn_seq = btn_id.split('-')[1];

				_this.seq = btn_seq;

				
				if(btn_type =='d'){
					if(confirm("삭제 하시겠습니까?")){
						_this.deleteData();
					}
				}
				else {

					_this.goView("u");
				}
				return false;

			});
			
			$(document).on("click", _this.search_button_selector, function(e) {

				_this.page = '1';

				if(_this.search_zone) {
					_this.date_from = $(_this.date_from_selector).val();
					_this.date_to = $(_this.date_to_selector).val();
					_this.search_word = $(_this.search_word_selector).val();
				}

				else{
					_this.date_from = null;
					_this.date_to = null;
					_this.search_word ="";
				}
				
				_this.getData();
				$(_this.reset_button_selector).show();
				return false;
			});

			$(document).on("click", _this.regist_button_selector, function() {
				_this.goView("r");
			});
			

			$(document).on("click", _this.reset_button_selector, function(e) {

				if(_this.search_zone) {
					_this.search_word = "";
					_this.date_from = null;
					_this.date_to = null;
				}
				
				_this.page = '1';
				_this.getData();
				$(_this.reset_button_selector).hide();

				return false;
			});



			$(document).on("keydown", _this.search_word_selector, function (e) {
				var keycode = (e.keyCode ? e.keyCode : e.which);
				
				if (e.keyCode == '13') {

					if(_this.search_zone) {
						_this.date_from = $(_this.date_from_selector).val();
						_this.date_to = $(_this.date_to_selector).val();
						_this.search_word = $(_this.search_word_selector).val();
					}

					else{
						_this.date_from = null;
						_this.date_to = null;
						_this.search_word ="";
					}
				
					_this.getData();
					$(_this.reset_button_selector).show();
					return false;
				}
				else {
					return true;
				}

			});
		},
		getData : function () {
			
			var _this = this;

			var page_total;
			
			var list_html;
			var header_html;
			
			var list_field = this.list_field;
			var list_name = this.list_name;
			var field_type = this.field_type;
			
			
			var control = this.control;

			var no_data = this.no_data;
			var page = this.page;
			var page_size = this.page_size;
			var list_url = this.list_url;

			var search_word = this.search_word;
			var search_field = this.search_field;
			var category = this.category;

			var date_from = this.date_from;
			var date_to = this.date_to;

			var list_field_len = this.list_field.length;

			var column_len = control ? parseInt(list_field_len+1) : parseInt(list_field_len) ;



			header_html = "<tr>";
			for(i=0; i<list_name.length; i++){
				header_html  += "<th class='center'>"+list_name[i]+"</th>";
			}
			header_html += "</tr>";

			$.ajax({   

				dataType : "xml",
				type: "post",  
				async: false,
				url: list_url, 
				data : { page:page, page_size:page_size, search_field:search_field, search_word:search_word, list_field:list_field, date_from:date_from, date_to:date_to, category:category },

				success : function(data) {

					page_total = $(data).find("info").attr("page-total");
					if (page_total == "-1"){
						alert("error");
					}
					else if (page_total == "0"){
						list_html += "<tr><td class='center' colspan='"+column_len+"'>" +no_data+"</td></tr>";
					}
					else {
						var paramsNode = $(data).find("params");
						paramsNode.each(function() {
							var seq = $(this).find('seq').text();
							list_html  += "<tr>";
							list_html  += "<td class='center'>"+$(this).find("no").text()+"</td>";
							for(i=1; i<list_field_len; i++){

								if(field_type[i] =="link") {
									list_html  += "<td class='center'><a href='"+$(this).find(list_field[i]).text()+"' target='_new'>"+$(this).find(list_field[i]).text()+"</a></td>";
								}
								else if (field_type[i] =="image") {
									if($(this).find(list_field[i]).text().length > 0) {
										list_html  += "<td class='center'><img src='/upload/data/thumb/"+$(this).find(list_field[i]).text()+"' ></td>";
									}
									else {
										list_html  += "<td class='center'></td>";
									}
								}
								else if(field_type[i] =="boolean") {
									var _select_title = eval("_this.select_title." + list_field[i])[parseInt($(this).find(list_field[i]).text())];
									list_html  += "<td class='center'>"+_select_title+"</td>";
								}
								else if(field_type[i] =="clamp") {
									list_html  += "<td class='center'>"+$(this).find(list_field[i]).text().substring(0, 16)+"...</td>";
								}
								else if(field_type[i] =="script") {
									list_html  += "<td class='center'><a href='javascript:;' id='"+list_field[i]+"'>"+$(this).find(list_field[i]).text()+"</a></td>";
								}
								else {
									list_html  += "<td class='center'>"+$(this).find(list_field[i]).text()+"</td>";
								}
							}

							if (control =="edit"){
								list_html  += "<td class='center'>";
								list_html  +="<button class='btn btn-primary btn-xs' type='button' id='u-"+seq+"' ><i class='icon12 i-tools'></i>수정</button>" ;
								list_html  += "</td>";
							}
							else if (control =="delete")	{
								list_html  += "<td class='center'>";
								list_html  +="<button class='btn btn-danger btn-xs'  type='button' id='d-"+seq+"' ><i class='icon12 i-remove'></i> 삭제</button>";									
								list_html  += "</td>";
							}
							else if(control == "both" ) {
								list_html  += "<td class='center'>";
								list_html  +="<button class='btn btn-primary btn-xs' type='button' id='u-"+seq+"' ><i class='icon12 i-tools'></i>수정</button>" ;
								list_html  +="<button class='btn btn-danger btn-xs'  type='button' id='d-"+seq+"' ><i class='icon12 i-remove'></i>삭제</button>";									
								list_html  += "</td>";
							}
							list_html  += "</tr>";
						});
					}

				},

				error: function (request, status, error) {
					alert(request.responseText);
				}
	
			});

			this.list_html = list_html;
			this.header_html = header_html;
			this.page_total = page_total;
			this.viewData();
			this.getPaging();
			this.viewPaging();
		
			
		},
		
		deleteData : function() {
			var _this = this;
			var delete_url = this.delete_url;
			var seq = this.seq;

			$.ajax({   
				type: "post",  
				url: delete_url,   
				data : { seq : seq },
				success : function(data) {
					var result = data.replace(/(^\s*)|(\s*$)/gi, "");
			
					if(result=="SUCCESS"){
						alert("삭제하였습니다.");
					}
					else if(result=="ERROR"){
						alert("알수 없는 에러 입니다.");
					}
					else {
						alert("삭제하지 못했습니다.");
					}
					_this.getData();
				}
		    });
		},
		getPaging : function () {

			var _this = this;

			var page = this.page; 
			var page_size = this.page_size;  
			var page_total = this.page_total; 

			var pageHtml = " ";
			var block = Math.ceil(page /  page_size);
			var pageStart =	parseInt((block-1) * page_size)+1;

			var pageEnd = parseInt(pageStart) + parseInt(page_size) -1;

			//console.log("end:"+pageEnd);
			pageEnd = pageEnd > page_total ? page_total : pageEnd;

			this.pageStart = pageStart;
			this.pageEnd = pageEnd;

			//console.log("start:"+ pageStart+"/end:"+pageEnd+"/page:"+page);
			if(parseInt(page) > parseInt(page_size)) {

				pageHtml += "<li><a href='#' class='page-first'> <i class='icon10 i-arrow-first'></i>처음 </a></li>";
				pageHtml += "<li><a href='#' class='page-prev'><i class='icon10 i-arrow-left'></i>이전 </a></li>";
			}

			for(i=parseInt(pageStart); i<=parseInt(pageEnd); i++) {
				if (i == page) {
					//alert(page);
					pageHtml += " <li class='active'><a href='#'>"+ i +"</a></li>" ;
				}
				else {
					pageHtml += "<li><a href='#' class='page-no'>" + i + "</a></li>" ;
				}
			}

			if( parseInt(pageEnd) < parseInt(page_total) ) {
				pageHtml += "<li><a href='#' class='page-next'>다음 <i class='icon10 i-arrow-right-2'></i> </a></li>";
				pageHtml += "<li><a href='#'  class='page-last'>마지막 <i class='icon10 i-arrow-right'></i></a></li>";
			}
			
			this.pagingHtml = pageHtml;

		},

		viewData : function () {
			_this = this;

			$(this.top_zone_selector).empty();
			$(this.top_zone_selector).append(this.top_html);		

			$(this.header_selector).empty();
			$(this.datalist_selector).empty();
			$(this.header_selector).append(this.header_html);
			$(this.datalist_selector).append(this.list_html);
			
			var searchedWord = this.search_word;
			if (searchedWord === '' || searchedWord === null || searchedWord > 0){

			}
			else {
					$("td").removeHighlight().highlight(searchedWord, false);
			}
		},

		viewPaging : function () {
			_this = this;
			$(this.paging_selector).empty();
			$(this.paging_selector).append(this.pagingHtml);

			$(".page-no").bind("click", function(e) {
				_this.page = $(this).text();
				_this.getData();
				return false;
			});
			$(".page-first").bind("click", function(e) {
				_this.page = 1;
				_this.getData();
				return false;
			});
			$(".page-last").bind("click", function(e) {
				_this.page = _this.page_total;
				_this.getData();
				return false;
			});
			$(".page-prev").bind("click", function(e) {
				_this.page = parseInt(_this.pageStart-1);
				_this.getData();
				return false;
			});
			$(".page-next").bind("click", function(e) {
				_this.page = parseInt(_this.pageEnd)+1;
				_this.getData();
				return false;
			});
		},

		goPage : function () {
			this.getData();
			this.getPaging();
			this.viewData();
			this.viewPaging();
		},

		goView : function (g) {

			var _gourl = g == "u" ? this.view_url : this.reg_url;

			$form = $("<form name='list_form' id='list_form' method='get' action='"+_gourl+"'></form>");
			if(this.category != null && this.category != "") {
				$form.append("<input type='hidden' name='category' id='category' value='"+this.category+"'>");
			}
			if(g=="u") {
				$form.append("<input type='hidden' name='page' id='page' value='"+this.page+"'>");
				$form.append("<input type='hidden' name='seq' id='seq' value='"+this.seq+"'>");
			}

			$('body').append($form);
			$form.submit();

		}

		
	}
	

})(jQuery);

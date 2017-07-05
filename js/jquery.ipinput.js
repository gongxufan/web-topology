/**
 * 本插件为IP地址输入框插件，由于作者水平较低，如发现有bug，望高手指教！
 * 
 * 注意： ① 此插件必须依赖于 jquery 使用；
 *      ② 附带样式文件 jquery.ipinput.css
 *      ③ 作用对象最好有id属性
 *
 * @author yuan_ge
 * 	
 * 201501版本:	① 通过 getSelectedText方法获得选中的值，修复 无法做鼠标选中删除bug；
 *			    ② 用name属性代替id 使插件可以在同一页面多次使用
 *				③ 增加 空格键 跳转功能，和修改 小数点、数字的跳转功能
 *         		④ 解决 谷歌 IE 部分不兼容的问题
 * 
 */

		;(function($){  
        $.fn.ipinput = function(options){  
            // 默认属性  
            var defaults =  {
            	width:220,
            	height:30,  
                currValue : '',  // 在键盘按下时用来存储未输入前的值 
                value : ''  //键盘按下后的值 
            }  
              
            // 传递的参数  
            var options = $.extend(defaults, options);  
              
            // 输入框对象及父级对象  
			var $this = this;  
            var $parent = this.parent(); 
			
            // 隐藏输入框（该输入框用于存储实际值）  
            $this.attr({style : 'display:none'});  
			
			var id=$this.attr('id')+"_ipinput";
              
            // 输入控件代码  
            var html = '';  
            html += '<div id="'+id+'"class="ipinput_div">';  
            html += '<input type="text" name="ipOne" class="ipinput_input"/>';  
            html += '<span class="ipinput_separator">.</span>';  
            html += '<input type="text" name="ipTwo" class="ipinput_input"/>';  
            html += '<span class="ipinput_separator">.</span>';  
            html += '<input type="text" name="ipThree" class="ipinput_input"/>';  
            html += '<span class="ipinput_separator">.</span>';  
            html += '<input type="text" name="ipFour" class="ipinput_input"/>';  
            html += '</div>';  
              
            // 添加输入控件代码  
            $parent.append(html);  
              
            // 把原有的值赋到输入框中  
            if(!isEmpty(options.value)){  
                var valArr = options.value.split(".");  
                if(4 == valArr.length){  
                    $('#'+id+' input[name=ipOne]').val(valArr[0]);  
					$('#'+id+' input[name=ipTwo]').val(valArr[1]); 
					$('#'+id+' input[name=ipThree]').val(valArr[2]);  
					$('#'+id+' input[name=ipFour]').val(valArr[3]);  
                }  
            }  
              
            // 设置宽度和高度  
            $('.ipinput_div').width(options.width);  
            $('.ipinput_div').height(options.height); 
			
            // 输入框绑定键盘按下事件  
            $('.ipinput_input').keydown(function(event){  
                keydown(event,this,options);  
            }); 
			
            // 输入框绑定键盘按下弹起事件  
            $('.ipinput_input').keyup(function(event){  
                keyup(event,this,options);  
            }); 
              
            // 输入框失去焦点事件  
            $('.ipinput_input').blur(function(){  
                setData($this);  
            }).blur();  
			
			return this;
        };  
          
        // 判断参数是否为空  
        var isEmpty = function(obj){  
            if(null == obj){  
                return true;  
            }else if(undefined == obj){  
                return true;  
            }else if("" == obj){  
                return true;  
            }else{  
                return false;  
            }  
        };  
        
        // 赋值给隐藏框  
        var setData = function(inputObj){  
			var id=inputObj.attr('id')+"_ipinput";
            // 四个框的值  
            var one = $('#'+id+' input[name=ipOne]').val();    
            var two = $('#'+id+' input[name=ipTwo]').val();
            var three = $('#'+id+' input[name=ipThree]').val();  
            var four = $('#'+id+' input[name=ipFour]').val();
              
            // 如果四个框都有值则赋值给隐藏框  
            if(!isEmpty(one) && !isEmpty(two) && !isEmpty(three) && !isEmpty(four)){  
                var ip = one + "." + two + "." + three + "." + four;  
                inputObj.val(ip);  
            }  
        }  
          
        //获得被选中的文本
        var getSelectedText=function(){
        	var selectedText="";
        	if(window.getSelection){
        	    selectedText=document.activeElement.value.substring(document.activeElement.selectionStart,
                        document.activeElement.selectionEnd);
        	}else if(document.selection){
        	    selectedText=document.selection.createRange().text;
        	}
        	return selectedText;
        }
        
		//获取光标位置
		var getCursortPosition=function(domObj) {
			var position = 0;   // IE Support
			if (document.selection) {
				domObj.focus ();
				var range = document.selection.createRange ();
				range.moveStart ('character', -domObj.value.length);
				position = range.text.length;
			}
			// Firefox support
			else if (domObj.selectionStart || domObj.selectionStart == '0')
				position = domObj.selectionStart;
			return position;
		}
		
		//设置光标位置
		var setCaretPosition=function (domObj, position){
			if(domObj.setSelectionRange)
			{
				domObj.focus();
				domObj.setSelectionRange(position,position);
			}
			else if (domObj.createTextRange) {
				var range = domObj.createTextRange();
				range.collapse(true);
				range.moveEnd('character', position);
				range.moveStart('character', position);
				range.select();
			}
		}
		          
        // 键盘按下事件  
        var keydown = function(event,obj,options) {  
            var code = event.keyCode;  // 当前输入的键盘值
            
            //除了数字键、删除键(8)、方向键(37,39)、空格键(32)、小数点(190/110)之外全部不允许输入 
            if((code < 48 && 8 != code &&32!=code&& 37 != code && 39 != code)||
            		(code > 57 && code < 96) ||
            		(code > 105 && 110 != code && 190 != code)){  
            	event.preventDefault();
				return false;  
            }
              
            // 先存储输入前的值，用于键盘弹起时判断值是否正确  
            options.currValue = $(obj).val();  
			
			var id=$(obj).parent().attr('id');
			
			var name=$(obj).attr("name");
			
			var value = $(obj).val();// 当前输入框的值  
			
			var position=getCursortPosition(obj);
			
			var selectedText=getSelectedText();
			
			//空格键
			if(code==32){
				if(position!=0&&isEmpty(selectedText)){
					if("ipOne" == name){
						var $obj=$('#'+id+' input[name=ipTwo]');
						$obj.focus();
						$obj.select();
						options.currValue=$obj.val();
					}else if("ipTwo" == name){
						var $obj=$('#'+id+' input[name=ipThree]');
						$obj.focus();
						$obj.select();
						options.currValue=$obj.val();
		        	}else if("ipThree"==name){
		        		var $obj=$('#'+id+' input[name=ipFour]');
		        		$obj.focus();
						$obj.select();
						options.currValue=$obj.val();
		        	}
				}
				event.preventDefault();
				return ; 
			}
			
			//删除键
			if(code==8){
				if(position==0&&isEmpty(selectedText)){
					if("ipFour" == name){
		        		var $obj=$('#'+id+' input[name=ipThree]');
						setCaretPosition($obj.get(0),$obj.val().length);
						options.currValue=$obj.val();
		        	}else if("ipThree" == name){
						var $obj=$('#'+id+' input[name=ipTwo]');
		        		setCaretPosition($obj.get(0),$obj.val().length);
		        		options.currValue=$obj.val();
		        	}else if("ipTwo" == name){
						var $obj=$('#'+id+' input[name=ipOne]');
		        		setCaretPosition($obj.get(0),$obj.val().length);
		        		options.currValue=$obj.val();
		        	}
				}
				return false; 
			}
			
			//向前键
            if(code==37){
            	if(!isEmpty(selectedText)){
            		setCaretPosition(obj,obj.value.length);
            		options.currValue=$(obj).val();
            		return false; 
            	}
            	if(position==0){
            		if("ipFour" == name){
    	        		var $obj=$('#'+id+' input[name=ipThree]');
    	        		setCaretPosition($obj.get(0),$obj.val().length);
    	        		options.currValue=$obj.val();
    	        	}else if("ipThree" == name){
    	        		var $obj=$('#'+id+' input[name=ipTwo]');
    	        		setCaretPosition($obj.get(0),$obj.val().length);
    	        		options.currValue=$obj.val();
    	        	}else if("ipTwo" == name){
    	        		var $obj=$('#'+id+' input[name=ipOne]');
    	        		setCaretPosition($obj.get(0),$obj.val().length);
    	        		options.currValue=$obj.val();
    	        	}
            		event.preventDefault();
            	}
            	return false; 
			}
            
            //向后键
            if(code==39){
				if(!isEmpty(selectedText)){
            		setCaretPosition(obj,obj.value.length-1);
            		options.currValue=$(obj).val();
            		return false; 
            	}
            	if(isEmpty(value)||(value.length==position)){
            		// 如果是第一个框则第二个框获的焦点  
                    if("ipOne" == name ){  
    					var $obj=$('#'+id+' input[name=ipTwo]');
						setCaretPosition($obj.get(0),0);
                        options.currValue=$obj.val();
                    }  
                    // 如果是第二个框则第三个框获的焦点  
                    else if("ipTwo" == name){  
    					var $obj=$('#'+id+' input[name=ipThree]');
						setCaretPosition($obj.get(0),0);
    					options.currValue=$obj.val();
                    }  
                    // 如果是第三个框则第四个框获的焦点  
                    else if("ipThree" == name ){  
    					var $obj=$('#'+id+' input[name=ipFour]');
						setCaretPosition($obj.get(0),0);
    					options.currValue=$obj.val();
                    }
                    event.preventDefault(); 
            	}
            	return false; 
            }
			
            //小数点
            if(110 == code || 190 == code){
            	if(value.length==position){
					// 如果是第一个框则第二个框获的焦点  
					if("ipOne" == name){  
						var $obj=$('#'+id+' input[name=ipTwo]');
						setCaretPosition($obj.get(0),0);
						options.currValue=$obj.val();
					}  
					// 如果是第二个框则第三个框获的焦点  
					else if("ipTwo" == name){  
						var $obj=$('#'+id+' input[name=ipThree]');
						setCaretPosition($obj.get(0),0);
						options.currValue=$obj.val();
					}  
					// 如果是第三个框则第四个框获的焦点  
					else if("ipThree" == name){  
						var $obj=$('#'+id+' input[name=ipFour]');
						setCaretPosition($obj.get(0),0);
						options.currValue=$obj.val();
					} 
				}
				event.preventDefault(); 
				return false; 
            }
            
            //数字键
            if((code>47&&code<58)||(code>95&&code<106)){
            	if(!isEmpty(selectedText)){
    				$(obj).val('');
    			} else if(value.length>=3){
    				if(value.length==position){
    					// 如果是第一个框则第二个框获的焦点  
    					if("ipOne" == name){  
    						var $obj=$('#'+id+' input[name=ipTwo]');
    						$obj.focus();  
    						$obj.select();
    						options.currValue=$obj.val();
    					}  
    					// 如果是第二个框则第三个框获的焦点  
    					else if("ipTwo" == name){  
    						var $obj=$('#'+id+' input[name=ipThree]');
    						$obj.focus(); 
    						$obj.select();
    						options.currValue=$obj.val();
    					}  
    					// 如果是第三个框则第四个框获的焦点  
    					else if("ipThree" == name){  
    						var $obj=$('#'+id+' input[name=ipFour]');
    						$obj.focus(); 
    						$obj.select();
    						options.currValue=$obj.val();
    					} 
    				}
    				event.preventDefault(); 
                }
            	return false;
            }
        } 
          
        // 键盘弹起事件  
        var keyup = function(event,obj,options) { 
			var code = event.keyCode; 
			if(code!=8&&code!=32&&code!=37&&code!=39&&(code<48||(code>57&&code<96)||code>105)){
				var position=getCursortPosition(obj);
				obj.value=obj.value.replace(/[^\d]/g,'');
				setCaretPosition(obj,position);
			}
			
            // 当前值  
            var value = $(obj).val(); 
            if(!isEmpty(value)){  
                value = parseInt(value);  
				if(value>=256 || value<0){
					alert(value+' 不是有效项。请指定一个介于 0 和 255 间的值。');
					//$.error(value+' 不是有效项。请指定一个介于 0 和 255 间的值。');
					$(obj).val(options.currValue);
					obj.focus();
					return false;
				}
            }
        }  
    })(jQuery);  
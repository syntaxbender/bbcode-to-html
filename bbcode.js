	if(!sbEditor){
		var sbEditor = {
			functions: {
				b: function(text,opentag,closetag,parameter){
					text[opentag] = "<b>";
					text[closetag] = "</b>";
					return text;
				},
				h1: function(text,opentag,closetag,parameter){
					text[opentag] = "<h1>";
					text[closetag] = "</h1>";
					return text;
				},
				h2: function(text,opentag,closetag,parameter){
					text[opentag] = "<h2>";
					text[closetag] = "</h2>";
					return text;
				},
				h3: function(text,opentag,closetag,parameter){
					text[opentag] = "<h3>";
					text[closetag] = "</h3>";
					return text;
				},
				highlight: function(text,opentag,closetag,parameter){
					if(parameter == "") parameter="yellow";
					text[opentag] = "<span style=\"background:"+parameter+";\">";
					text[closetag] = "</span>";
					return text;
				},
				color: function(text,opentag,closetag,parameter){
					text[opentag] = "<span style=\"color:"+parameter+";\">";
					text[closetag] = "</span>";
					return text;
				},
				u: function(text,opentag,closetag,parameter){
					text[opentag] = "<span style=\"text-decoration:underline;\">";
					text[closetag] = "</span>";
					return text;
				},
				code: function(text,opentag,closetag,parameter){
					if(parameter != "") var classn=" class=\""+parameter+"\""; else classn="";
					text[opentag] = "<pre><code"+classn+">";
					text[closetag] = "</code></pre>";
					return text;
				},
				quote: function(text,opentag,closetag,parameter){
					if(parameter != "") var author = "<p>"+parameter+"</p>";
					else var author = "";
					text[opentag] = "<blockquote>";
					text[closetag] = author+"</blockquote>";
					return text;
				},
				img: function(text,opentag,closetag,parameter){
					text[opentag] = "<img src=\"";
					text[closetag] = "\"/>";
					return text;
				},
				ul: function(text,opentag,closetag,parameter){
					text[opentag] = "<ul>";
					text[closetag] = "</ul>";
					return text;
				},
				li: function(text,opentag,closetag,parameter){
					text[opentag] = "<li>";
					text[closetag] = "</li>";
					return text;
				}
			},
			tagarray : {
				"b":{parameter:false},
				"color":{parameter:true},
				"u":{parameter:false},
				"h1":{parameter:false},
				"h2":{parameter:false},
				"h3":{parameter:false},
				"highlight":{parameter:false},
				"code":{parameter:false},
				"img":{parameter:false},
				"quote":{parameter:false},
				"ul":{parameter:false},
				"li":{parameter:false},
			},
			init(func=function(){}){
				window.addEventListener('load', (event) => {
					let sbeditors = document.querySelectorAll(".sbeditor-container");
					for(let id=0; id < sbeditors.length;id++){
						sbeditors[id].innerHTML =
						"<div class=\"sbeditor-textbox-container\">\
							<div class=\"sbeditor-preview\"></div>\
							<textarea class=\"sbeditor-textbox\"></textarea>\
						</div>\
						<input type=\"button\" class=\"sbeditor-preview-button\" value=\"Preview\" data-sbeditor-id=\""+id+"\">\
						";
						sbeditors[id].querySelector(".sbeditor-preview-button").addEventListener("click", function(){
							sbEditor.preview(this.getAttribute("data-sbeditor-id"));
						});
					}
					func();
				});
			},
			errorOutput(text){
				alert(text);
			},
			parser(text){
				let buffer = "";
				let buffer_active = false;
				let tag_checker = [];
				let text_array = [];
				let tag_placements = [];
				let tag_placements_basic = [];
				for(var start=0;start<text.length;start++){
					if(text[start] == "]"){
						if(buffer.includes("=")){
							buffer = buffer.split("=");
							var parameter = buffer[1];
							buffer = buffer[0];
						}else{
							var parameter = "";
						}
						if(this.tagarray[buffer] != null){
							if(parameter == "" && this.tagarray[buffer]["parameter"] === true){
								this.errorOutput(buffer+" tagı için gerekli parametre bulunamadı.");
								return false;
							}
							tag_checker.push([buffer,tag_placements.length]);
							tag_placements.push([buffer,parameter,text_array.length]);
							tag_placements_basic.push(text_array.length);
							text_array.push(buffer);
						}else if(this.tagarray[buffer.substr(1, buffer.length)] != null && buffer.substr(0, 1) == "/" && parameter == ""){
							if(tag_checker[(tag_checker.length-1)][0] == buffer.substr(1, buffer.length)){
								tag_placements[tag_checker[(tag_checker.length-1)][1]].push(text_array.length);
								tag_placements_basic.push(text_array.length);
								text_array.push(buffer);
								tag_checker.splice((tag_checker.length-1), 1);
							}else{
								this.errorOutput("Halihazırda açık kalan "+tag_checker[(tag_checker.length-1)][0]+" tagı kapatılmadan, "+buffer.substr(1, buffer.length)+" tagı kapatılmaya çalışılmakta.");
								return false;
							}
						}else{
							let buffer2="";
							buffer2 += (buffer_active === true) ? "[":"";
							buffer2 += buffer;
							buffer2 += (parameter != "") ? "="+parameter:"";
							buffer2 += "]";
							text_array.push(buffer2);
						}
						buffer_active = false;
						buffer = "";
					}else if(text[start] == "["){
						if(buffer_active === true){
							if(text_array.length == 0){
								buffer = "["+buffer;
							}else{
								let isappended=false;
								for (var place_index = text_array.length-1; place_index >= 0; place_index--) {
									if (tag_placements_basic.indexOf(place_index) == -1){
										isappended=true;
										text_array[place_index] = text_array[place_index]+"[";
										break;
									}
								}
								if(isappended===false) text_array.push("[");
							}
						}
						if(buffer != null && buffer != "" && buffer.length != 0) text_array.push(buffer);
						buffer_active = true;
						buffer = "";
					}else{
						buffer += (text[start] == "\n") ? "<br>":text[start];
					}
				}
				if(buffer_active === true) buffer += "[";
				if(buffer != null && buffer != "" && buffer.length != 0) text_array.push(buffer);
				if(tag_checker.length != 0){
					this.errorOutput(tag_checker[tag_checker.length-1][0]+" tagı kapatılmamış.");
					return false;
				}
				return [text_array, tag_placements];
			},
			getOutput(id){
				let plaintext = document.querySelectorAll(".sbeditor-container")[id].querySelector(".sbeditor-textbox").value;
				let call = this.parser(plaintext);
				let fixed_text = call[0];
				let tag_placements = call[1];
				for(let i in tag_placements){
					fixed_text = this.functions[tag_placements[i][0]](fixed_text,tag_placements[i][2],tag_placements[i][3],tag_placements[i][1]);
				}
				let htmlOutput = fixed_text.join('');
				return [plaintext, htmlOutput];
			},
			setText(id,text){
				const container = document.querySelectorAll(".sbeditor-container")[id];
				if(container != null){
					let plaintext = container.querySelector(".sbeditor-textbox").value = text;
				}
			},
			preview(id){
				const output = this.getOutput(id);
				document.querySelectorAll(".sbeditor-container")[id].querySelectorAll(".sbeditor-preview")[0].innerHTML = output[1];
			},
			register(title,parameterboolean,func){
				this.functions[title] = func;
				this.tagarray[title] = {paramater:parameterboolean};
			},
			get(){
				let arr = [];
				const sbeditors = document.querySelectorAll(".sbeditor-container");
				for(let id=0; id<sbeditors.length; id++){
					arr.push(this.getOutput(id));
				}
				return arr;
			}
		}
	}else{
		console.log("sbEditor is already imported.");
	} 

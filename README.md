# bbCode to HTML with parser

## What is this?
This is not a wysiwyg editor. This script provide to generate html content from bbcodes with <ins>**bbcode parser**</ins>. It is supports register new bbcodes or override an existing bbcodes.

## Why need this?
This script is so lightweight, easy to apply, new bbcodes can register easily and all the excellent features that I can't predict right now.

## What is difference? Why need this?
This script prevents parse errors and fully editable.

## Why isn't this a wysiwyg editor?
May the next releases is will be wysiwyg editor. There is not enough time for right now.

## Supports
### First version targets
| Tag | Means |
|--|--|
| [img]url[/img] | create an image element |
| [b]text[/b] | bold text |
| [u]text[/u] | underline text |
| [h1]text[/h1] | create h1 elements |
| [h2]text[/h2] | create h2 elements |
| [h3]text[/h3] | create h3 elements |
| [highlight=color]text[/highlight] | set background to text, parameter optional, default yellow color. |
| [color=color]text[/color] | color text, parameter required. |
| [code=language]text[/code] | create code elements, parameter optional. |
| [quote=origin]text[/quote] | create blockquote elements, parameter optional |
| [ul] li ggcode [/ul] | create ul element, need improvements. |
| [li]text1[/li] | create li element, need improvements. |

## Usage
First import javascript file.
``` html
<script type="text/javascript" src="assets/js/bbcode.js"></script>
```

Add textbox area inside body tags.
```html
<body>
...
.
.

<div class="sbeditor-container"></div>

.
.
...
</body>
```
If you want to add specitic bbcode tag or override an existing bbcode tag, register it like this.

``` javascript
    // dont touch this parameters "(text,opentag,closetag)".
    
		sbEditor.register('u',false,function(text,opentag,closetag){ // bbcode, parameter required boolean, function
			text[opentag] = "<span style=\"color:red;\">";
			text[closetag] = "</span>";
			return text;
		});
``` 
Call init method.
``` javascript
sbEditor.init();
``` 

for more check examples.html

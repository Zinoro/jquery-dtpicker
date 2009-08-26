/*
 * jquery-dtpicker jQuery extension
 * http://code.google.com/p/jquery-dtpicker/
 *
 * Copyright (c) 2009 Jack Douglas
 * Released under the MIT license
 * http://www.opensource.net/licenses/mit-license.html
 *
 * Version 1.0a2+
 */
(function(){
  "use strict";
  $.fn.extend({
    dtpicker:function(){
      return this.each(function() {
        var l_type, l_min, l_max, l_min_year, l_max_year, l_min_decade, l_max_decade, l_min_month, l_max_month, l_min_day, l_max_day, 
            l_min_hour, l_max_hour, l_min_minute, l_max_minute, l_time_start_position;
        if (this.tagName!=="INPUT") { throw "not an input element"; }
        l_type = this.getAttribute("type");
        if ((l_type!== "date")&&(l_type!=="datetime")&&(l_type!=="datetime-local")&&(l_type!=="time")) { return; }
        l_min = this.getAttribute("min");
        l_max = this.getAttribute("max");
        l_time_start_position = (l_type==="time")?0:11;
        l_this_year = (new Date()).getFullYear();
        l_min_year = (l_min===null)?1000:Number(l_min.slice(0,4));
        l_max_year = (l_max===null)?3000:Number(l_max.slice(0,4));
        l_min_decade = Math.floor(l_min_year/10);
        l_max_decade = Math.floor(l_max_year/10);
        l_min_month = (l_min===null)?1:Number(l_min.slice(5,7));
        l_max_month = (l_max===null)?12:Number(l_max.slice(5,7));
        l_min_day = (l_min===null)?1:Number(l_min.slice(8,10));
        l_max_day = (l_max===null)?31:Number(l_max.slice(8,10));
        l_min_hour = (l_min===null)?0:Number(l_min.slice(l_time_start_position,l_time_start_position+2));
        l_max_hour = (l_max===null)?23:Number(l_max.slice(l_time_start_position,l_time_start_position+2));
        l_min_minute = (l_min===null)?0:(Math.ceil(Number(l_min.slice(l_time_start_position+3,l_time_start_position+5))/5)*5);
        l_max_minute = (l_max===null)?55:(Math.floor(Number(l_max.slice(l_time_start_position+3,l_time_start_position+5))/5)*5);
        function display() {
          var l_input, l_maindiv, a, i;
          // helper classes
          function Yeargroup(p_min_year, p_max_year) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.min_year = p_min_year; 
            this.max_year = p_max_year; 
            this.output_part = this.min_year+'';
            if (l_type==="date") {
              this.output = this.output_part+'-01-01';
            } else if (l_type==="datetime") {
              this.output = this.output_part+'-01-01T00:00Z';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+'-01-01T00:00';
            }
          }
          Yeargroup.prototype.toString = function() { return this.min_year + 's'; };
          function Year(n) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.year = n; 
            this.output_part = this.year+'';
            if (l_type==="date") {
              this.output = this.output_part+'-01-01';
            } else if (l_type==="datetime") {
              this.output = this.output_part+'-01-01T00:00Z';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+'-01-01T00:00';
            }
          }
          Year.prototype.toString = function() { return this.output_part; };
          function Month(y, m) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.year = y; 
            this.month = m; 
            this.output_part = this.year.output_part+'-'+('0'+this.month).slice(-2);
            if (l_type==="date") {
              this.output = this.output_part+'-01';
            } else if (l_type==="datetime") {
              this.output = this.output_part+'-01T00:00Z';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+'-01T00:00';
            }
          }
          Month.prototype.toString = function() { return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.month - 1]; };
          function Daygroup(p_month, p_min_day, p_max_day) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.month = p_month; 
            this.min_day = p_min_day; 
            this.max_day = p_max_day; 
            this.output_part = this.month.output_part;
            this.output = this.month.output;
          }
          Daygroup.prototype.toString = function() { return this.min_day + '-' + this.max_day; };
          function Day(p_month, p_day) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.month = p_month; 
            this.day = p_day; 
            this.output_part = this.month.output_part+'-'+("0"+this.day).slice(-2);
            if (l_type==="date") {
              this.output = this.output_part;
            } else if (l_type==="datetime") {
              this.output = this.output_part+'T00:00Z';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+'T00:00';
            }
          }
          Day.prototype.toString = function() { return this.day; };
          function Hour(p_day, p_hour) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.day = p_day; 
            this.hour = p_hour; 
            if (l_type==="time") {
              this.output_part = ("0"+this.hour).slice(-2);
            } else {
              this.output_part = this.day.output_part+"T"+("0"+this.hour).slice(-2);
            }
            if (l_type==="datetime") {
              this.output = this.output_part+':00Z';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+':00';
            } else if (l_type==="time") {
              this.output = this.output_part+':00';
            }
          }
          Hour.prototype.toString = function() { return ("0"+this.hour).slice(-2)+":"; };
          function Minute(p_hour, p_minute) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.hour = p_hour; 
            this.minute = p_minute; 
            this.output_part = this.hour.output_part+":"+("0"+this.minute).slice(-2);
            if (l_type==="datetime") {
              this.output = this.output_part+'Z';
            } else {
              this.output = this.output_part;
            }
          }
          Minute.prototype.toString = function() { return ("0"+this.minute).slice(-2); };
          // element populator
          function do_elements(a, f, o){
            var d, i, s, m;
            s = this;
            if(o===undefined) { 
              o = Math.max(0, Math.floor(a.length/2)-6); 
              if(a[0] instanceof Yeargroup) {
                for (i=0; i<a.length; i++){ 
                  if((a[i].min_year<=l_this_year) && (a[i].max_year>=l_this_year)) {
                    o = Math.max(0, Math.min(i, a.length-11));
                    break;
                  }
                }
              } else if (a[0] instanceof Year) {
                for (i=0; i<a.length; i++){ 
                  if(a[i].year===l_this_year) {
                    o = Math.max(0, Math.min(i, a.length-11));
                    break;
                  }
                }
              } else if (a[0] instanceof Hour) {
                for (i=0; i<a.length; i++){ 
                  if(a[i].hour===8) {
                    o = Math.max(0, Math.min(i, a.length-11));
                    break;
                  }
                }
              }
            }
            m = 12;
            if(o>0) { m -= 1; }
            if(o+m<a.length) { m -= 1; }
            if(this===l_maindiv) {
              $(this).children().remove();
              d = $(this).append("<div></div>").children("div").css({'float':'left', 'background':'#F2F2F2', 'padding':'0px', 'margin':'1px'});
            } else {
              $(this).parent().children("div").css("border", "1px solid #E2E2E2");
              $(this).css("border", "1px solid black");
              $(this).parent().nextAll("div").remove();
              d = $(this).parent().after("<div></div>").next("div").css({'float':'left', 'background':'#F2F2F2', 'padding':'0px', 'margin':'1px'});
            }
            if (o>0) {
              d.append("<div><label>&uarr;</label></div>").children("div:last-child")
                  .css({'border':'1px solid #E2E2E2', 'background':'#E2E2E2', 'padding':'3px', 'margin':'2px', 'text-align':'center'})
                  .click(function(event){
                    event.stopPropagation();
                    l_input.focus();
                    do_elements.call(s, a, f, Math.max(0, o-10));
                  });
            }
            for (i=o; i<o+Math.min(a.length, m); i++){ 
              (function(e){
                d.append("<div><label>" + e + "</label></div>").children("div:last-child")
                    .css({'border':'1px solid #E2E2E2', 'background':'#E2E2E2', 'padding':'3px', 'margin':'2px'})
                    .click(function(event){ 
                      event.stopPropagation();
                      l_input.val(e.output);
                      l_input.one("focus", display);
                      $(l_maindiv).remove();
                    })
                    .mouseenter(function(event){ 
                      event.stopPropagation();
                      f(this, e); 
                    });
              }(a[i]));
            }
            if (a.length>o+m) {
              d.append("<div><label>&darr;</label></div>").children("div:last-child")
                  .css({'border':'1px solid #E2E2E2', 'background':'#E2E2E2', 'padding':'3px', 'margin':'2px', 'text-align':'center'})
                  .click(function(event){ 
                    event.stopPropagation();
                    l_input.focus();
                    do_elements.call(s, a, f, Math.min(a.length-11, o+10));
                  });
            }
            if (a.length===1) {
              d.children("div:last-child").mouseenter();
            }
          } 
          // initialise (create main div and handle destruction)
          l_input = $(this);
          function die() { 
            $(l_maindiv).remove();
            l_input.unbind("blur", die); 
            l_input.one("focus", display);
          }	
          l_maindiv = l_input.after("<div></div>").next("div")
              .css({'display':'inline', 'position':'absolute', 'float':'left', 'z-index':'1', 'background':'white', 'padding':'2px'})
              .blur(function(){ 
                die();
              })
              .mouseover(function(){ 
                l_input.unbind("blur", die); 
              })
              .mouseout(function(event){ 
                if((event.pageX<=$(this).offset().left)||(event.pageY<=$(this).offset().top)||
                   (event.pageX>=($(this).offset().left+$(this).outerWidth(true)))||
                   (event.pageY>=($(this).offset().top+$(this).outerHeight(true)))) {
                  l_input.bind("blur", die);
                }
              })
              .get(0);
          l_input.bind("blur", die);
          // main display functions
          function do_from_time(s, p) {
            var a, i, l_this_min, l_this_max;
            l_this_min = ((p===undefined)||((p.month.year.year===l_min_year)&&(p.month.month===l_min_month)&&(p.day===l_min_day)))?l_min_hour:0;
            l_this_max = ((p===undefined)||((p.month.year.year===l_max_year)&&(p.month.month===l_max_month)&&(p.day===l_max_day)))?l_max_hour:23;
            a = [];
            for (i=l_this_min; i<=l_this_max; i++) { a.push(new Hour(p, i)); }
            do_elements.call(s, a, function(s, p){
              var a, i, l_this_min, l_this_max;
              l_this_min = (((p.day===undefined)||((p.day.month.year.year===l_min_year)&&(p.day.month.month===l_min_month)&&(p.day.day===l_min_day)))&&(p.hour===l_min_hour))?l_min_minute:0;
              l_this_max = (((p.day===undefined)||((p.day.month.year.year===l_max_year)&&(p.day.month.month===l_max_month)&&(p.day.day===l_max_day)))&&(p.hour===l_max_hour))?l_max_minute:55;
              a = [];
              for (i=l_this_min; i<=l_this_max; i+=5) { a.push(new Minute(p, i)); }
              do_elements.call(s, a, function(s, p){
                do_elements.call(s, [], function(){});
              });
            });
          }
          function do_from_day(s, p) {
            var a, i;
            a = [];
            for (i=p.min_day; i<=p.max_day; i++) { a.push(new Day(p.month, i)); }
            if ((l_type==="datetime") || (l_type==="datetime-local")) {
              do_elements.call(s, a, do_from_time);
            } else {
              do_elements.call(s, a, function(s, p){ do_elements.call(s, [], function(){}); });
            }
          }
          function do_from_year(s, p) {
            var a, i;
            a = [];
            for (i=Math.max(l_min_year, p.min_year); i<=Math.min(l_max_year, p.max_year); i++) { a.push(new Year(i)); }
            do_elements.call(s, a, function(s, p){
              var a, i;
              a = [];
              for (i=((p.year===l_min_year)?l_min_month:1); i<=((p.year===l_max_year)?l_max_month:12); i++) { a.push(new Month(p, i)); }
              do_elements.call(s, a, function(s, p){
                var a, i, d, l_this_month_min, l_this_month_max;
                d = (new Date());
                d.setFullYear(p.year.year, p.month, 0);
                l_this_month_min = ((p.year.year===l_min_year)&&(p.month===l_min_month))?l_min_day:1;
                l_this_month_max = ((p.year.year===l_max_year)&&(p.month===l_max_month))?l_max_day:d.getDate();
                if((l_this_month_max-l_this_month_min)<=12){
                  do_from_day(s, new Daygroup(p, l_this_month_min, l_this_month_max));
                } else {
                  a = [];
                  a.push(new Daygroup(p, l_this_month_min, Math.floor(l_this_month_min/10)*10+9));
                  for (i=Math.floor(l_this_month_min/10)*10+10; i<=l_this_month_max; i+=10) { a.push(new Daygroup(p, i, Math.min(l_this_month_max, i+9))); }
                  do_elements.call(s, a, function(s, p){
                    do_from_day(s, p);
                  });
                }
              });
            });
          }
          function do_from_yeargroup() {
            a = [];
            for (i=l_min_decade; i<=l_max_decade; i++) { a.push(new Yeargroup(i*10, i*10+9)); }
            do_elements.call(l_maindiv, a, do_from_year);
          }
          // entry point
          if (l_type==="time") {
            do_from_time(l_maindiv);
          } else {
            if (l_min_year>=l_this_year-1) {
              do_from_year(l_maindiv, new Yeargroup(l_min_year, l_max_year));
            } else {
              do_from_yeargroup();
            }
          }
        }
        $(this).one("focus", display);
      });
    } 
  });
}());

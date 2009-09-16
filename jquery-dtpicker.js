/*
 * jquery-dtpicker jQuery extension
 * http://code.google.com/p/jquery-dtpicker/
 *
 * Copyright (c) 2009 Jack Douglas
 * Released under the MIT license
 * http://www.opensource.net/licenses/mit-license.html
 *
 * Version 1.0a4
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
          var l_input, l_maindiv;
          // helper classes
          function Timezonehour(p_hour) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.hour = p_hour; 
            this.output = "";
          }
          Timezonehour.prototype.toString = function() { return "&plusmn;"+("0"+this.hour).slice(-2); };
          function Timezoneminute(p_hour, p_minute, p_sign) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.hour = p_hour; 
            this.minute = p_minute; 
            this.sign = p_sign;
            this.part = ((p_hour.hour===0)&&(p_minute===0))?"Z":p_sign+("0"+p_hour.hour).slice(-2)+":"+("0"+p_minute).slice(-2);
            this.output = "";
          }
          Timezoneminute.prototype.toString = function() { return this.sign+("0"+this.hour.hour).slice(-2)+":"+("0"+this.minute).slice(-2); };
          function Yeargroup(p_timezone, p_min_year, p_max_year) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.timezone = p_timezone; 
            this.min_year = p_min_year; 
            this.max_year = p_max_year; 
          }
          Yeargroup.prototype.toString = function() { return this.min_year + "s"; };
          function Year(p_timezone, n) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.timezone = p_timezone; 
            this.year = n; 
            this.output = this.year+"-01-01"+((l_type.slice(0, 8)==="datetime")?"T00:00":"")+((l_type==="datetime")?p_timezone.part:"");
          }
          Year.prototype.toString = function() { return this.year+""; };
          function Month(y, m) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.year = y; 
            this.month = m; 
            this.part = y.year+"-"+("0"+this.month).slice(-2);
            this.output = this.part+"-01"+((l_type.slice(0, 8)==="datetime")?"T00:00":"")+((l_type==="datetime")?y.timezone.part:"");
          }
          Month.prototype.toString = function() { return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.month - 1]; };
          function Daygroup(p_month, p_min_day, p_max_day) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.month = p_month; 
            this.min_day = p_min_day; 
            this.max_day = p_max_day; 
            this.part = this.month.part;
          }
          Daygroup.prototype.toString = function() { return ("0"+this.min_day).slice(-2) + "-<br>" + ("0"+this.max_day).slice(-2); };
          function Day(p_month, p_day) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.month = p_month; 
            this.day = p_day; 
            this.part = this.month.part+"-"+("0"+this.day).slice(-2);
            this.output = this.part+((l_type.slice(0, 8)==="datetime")?"T00:00":"")+((l_type==="datetime")?p_month.year.timezone.part:"");
          }
          Day.prototype.toString = function() { return ("0"+this.day).slice(-2); };
          function Hour(p_day, p_hour) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.day = p_day; 
            this.hour = p_hour; 
            this.part = ((l_type==="time")?"":this.day.part+"T")+("0"+this.hour).slice(-2);
            this.output = this.part+":00"+((l_type==="datetime")?p_day.month.year.timezone.part:"");
          }
          Hour.prototype.toString = function() { return ("0"+this.hour).slice(-2)+":"; };
          function Minute(p_hour, p_minute) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.hour = p_hour; 
            this.minute = p_minute; 
            this.part = this.hour.part+":"+("0"+this.minute).slice(-2);
            this.output = this.part+((l_type==="datetime")?p_hour.day.month.year.timezone.part:"");
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
              } else if (a[0] instanceof Timezonehour) {
                o = 0;
              }
            }
            m = 12;
            if(o>0) { m -= 1; }
            if(o+m<a.length) { m -= 1; }
            if(this===l_maindiv) {
              $(this).children().remove();
              d = $(this).append("<div></div>").children("div").css({"float":"left", "background":"white", "padding":"1px"})
                         .append("<div></div>").children("div").css({"float":"left", "background":"#F2F2F2"});
            } else {
              $(this).parent().parent().nextAll("div").remove();
              d = $(this).parent().parent().after("<div></div>").next("div").css({"float":"left", "background":"white", "padding":"1px"})
                         .append("<div></div>").children("div").css({"float":"left", "background":"#F2F2F2"});
            }
            if (o>0) {
              d.append("<div><label>&uarr;</label></div>").children("div:last-child")
                  .css({"border":"1px solid #E2E2E2", "background":"#E2E2E2", "padding":"3px", "margin":"2px", "text-align":"center"})
                  .click(function(event){
                    event.stopPropagation();
                    l_input.focus();
                    do_elements.call(s, a, f, Math.max(0, o-10));
                  });
            }
            for (i=o; i<o+Math.min(a.length, m); i++){ 
              (function(e){
                d.append("<div><label>" + e + "</label></div>").children("div:last-child")
                    .css({"border":"1px solid #E2E2E2", "background":"#E2E2E2", "padding":"3px", "margin":"2px"})
                    .click(function(event){ 
                      event.stopPropagation();
                      if(e.output!==undefined) {
                        l_input.val(e.output);
                        $(l_maindiv).remove();
                        l_input.one("focus", display);
                        l_input.trigger("change");
                      } else {
                        l_input.focus();
                      }
                    })
                    .mouseenter(function(event){ 
                      event.stopPropagation();
                      if(e.output!==undefined) {
                        $(this).parent().children("div").css("border", "1px solid #E2E2E2");
                        $(this).css("border", "1px solid black");
                      }
                      f(this, e); 
                    });
              }(a[i]));
            }
            if (a.length>o+m) {
              d.append("<div><label>&darr;</label></div>").children("div:last-child")
                  .css({"border":"1px solid #E2E2E2", "background":"#E2E2E2", "padding":"3px", "margin":"2px", "text-align":"center"})
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
              .css({"display":"inline", "position":"absolute", "float":"left", "z-index":"1"})
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
              .click(function(){
                l_input.focus();
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
              do_elements.call(s, a, function(){});
            });
          }
          function do_from_day(s, p) {
            var a, i;
            a = [];
            for (i=p.min_day; i<=p.max_day; i++) { a.push(new Day(p.month, i)); }
            if ((l_type==="datetime") || (l_type==="datetime-local")) {
              do_elements.call(s, a, do_from_time);
            } else {
              do_elements.call(s, a, function(){});
            }
          }
          function do_from_year(s, p) {
            var a, i;
            a = [];
            for (i=Math.max(l_min_year, p.min_year); i<=Math.min(l_max_year, p.max_year); i++) { a.push(new Year(p.timezone, i)); }
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
                  if(l_this_month_min<10){ a.push(new Daygroup(p, l_this_month_min, 9)); }
                  a.push(new Daygroup(p, Math.max(10, l_this_month_min), Math.min(l_this_month_max, 19))); 
                  if(l_this_month_max>19){ a.push(new Daygroup(p, 20, l_this_month_max)); }
                  do_elements.call(s, a, function(s, p){
                    do_from_day(s, p);
                  });
                }
              });
            });
          }
          function do_from_yeargroup(s, p) {
            var a, i;
            a = [];
            for (i=l_min_decade; i<=l_max_decade; i++) { a.push(new Yeargroup(p, i*10, i*10+9)); }
            do_elements.call(s, a, do_from_year);
          }
          function do_from_timezone() {
            var a, i;
            a = [];
            for (i=0; i<=23; i++) { a.push(new Timezonehour(i)); }
            do_elements.call(l_maindiv, a, function(s, p){
              var a, i;
              a = [];
              if(p.hour===0) {
                a.push(new Timezoneminute(p, 0, ""));
                for (i=15; i<=45; i+=15) { a.push(new Timezoneminute(p, i, "-")); a.push(new Timezoneminute(p, i, "+")); } 
              } else {
                for (i=0; i<=45; i+=15) { a.push(new Timezoneminute(p, i, "-")); a.push(new Timezoneminute(p, i, "+")); } 
              }
              do_elements.call(s, a, do_from_yeargroup);
            });
          }
          // entry point
          if (l_type==="time") {
            do_from_time(l_maindiv);
          } else if(l_type==="datetime") {
            do_from_timezone();
          } else {
            if (l_min_year>=l_this_year-1) {
              do_from_year(l_maindiv, new Yeargroup(undefined, l_min_year, l_max_year));
            } else {
              do_from_yeargroup(l_maindiv);
            }
          }
        }
        $(this).one("focus", display);
      });
    } 
  });
}());

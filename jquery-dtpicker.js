/*
 * jquery-dtpicker jQuery extension
 * http://code.google.com/p/jquery-dtpicker/
 *
 * Copyright (c) 2009 Jack Douglas
 * Released under the MIT license
 * http://www.opensource.net/licenses/mit-license.html
 */
(function(){
  "use strict";
  $.fn.extend({
    dtpicker:function(){
      return this.each(function() {
        var l_type, l_min, l_max, l_min_year, l_max_year, l_min_decade, l_max_decade;
        if (this.tagName !== "INPUT") { throw "not an input element" }
        l_type = this.getAttribute("type");
        if ((l_type !== "date") && (l_type !== "datetime") && (l_type !== "datetime-local") && (l_type !== "time")) { return; }
        l_min = this.getAttribute("min");
        l_max = this.getAttribute("max");
        l_this_year = (new Date()).getFullYear();
        l_min_year = (l_min===null)?1000:Number(l_min.slice(0,4));
        l_max_year = (l_max===null)?3000:Number(l_max.slice(0,4));
        l_min_decade = Math.floor(l_min_year/10);
        l_max_decade = Math.floor(l_max_year/10);
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
              if(a[0] instanceof Year) {
                for (i=0; i<a.length; i++){ 
                  if(a[i].year = l_this_year) {
                    o = Math.max(0, Math.min(i, a.length-11));
                    break;
                  }
                }
              }
            }
            m = 12;
            if(o>0) { m -= 1 }
            if(o+m<a.length) { m -= 1 }
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
              d.append("<div>&uarr;</div>").children("div:last-child")
                  .css({'border':'1px solid #E2E2E2', 'background':'#E2E2E2', 'padding':'3px', 'margin':'2px', 'text-align':'center'})
                  .click(function(event){
                    event.stopPropagation();
                    l_input.focus();
                    do_elements.call(s, a, f, Math.max(0, o-9));
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
              d.append("<div>&darr;</div>").children("div:last-child")
                  .css({'border':'1px solid #E2E2E2', 'background':'#E2E2E2', 'padding':'3px', 'margin':'2px', 'text-align':'center'})
                  .click(function(event){ 
                    l_input.focus();
                    do_elements.call(s, a, f, Math.min(a.length-11, o+9));
                    event.stopPropagation();
                  });
            }
          } 
          // initialise (create main div and handle destruction conditions)
          l_input = $(this);
          function die() { 
            l_input.unbind("blur", die).next("div").remove(); 
            l_input.one("focus", display);
          }
          l_maindiv = $(this).after("<div></div>").next("div")
              .css({'display':'inline', 'position':'absolute', 'z-index':'1', 'background':'white', 'padding':'2px'})
              .blur(function(){ 
                die();
              })
              .hover(function(){ 
                  l_input.unbind('blur', die); 
                }, function(){ 
                  l_input.bind('blur', die);
                }
              )
              /*.mouseleave(function(){ 
                l_input.bind("blur", die);
              })
              .mouseenter(function(){ 
                l_input.unbind("blur", die); 
              })*/
              .get(0);
          l_input.bind("blur", die);
          // main display functions
          function do_from_time(s, p) {
            var a, i;
            a = [];
            for (i=9; i<=18; i++) { a.push(new Hour(p, i)); }
            do_elements.call(s, a, function(s, p){
              var a, i;
              a = [];
              for (i=0; i<60; i+=5) { a.push(new Minute(p, i)); }
              do_elements.call(s, a, function(s, p){
                do_elements.call(s, [], function(){});
              });
            });
          }
          function do_from_year(s, p) {
            var a, i;
            a = [];
            for (i=Math.max(l_min_year, p.min_year); i<=Math.min(l_max_year, p.max_year); i++) { a.push(new Year(i)); }
            do_elements.call(s, a, function(s, p){
              var a, i;
              a = [];
              for (i=1; i<=12; i++) { a.push(new Month(p, i)); }
              do_elements.call(s, a, function(s, p){
                var d;
                d = (new Date());
                d.setFullYear(p.year.year, p.month, 0);
                do_elements.call(s, [new Daygroup(p, 1, 5), new Daygroup(p, 6, 10), new Daygroup(p, 11, 15), new Daygroup(p, 16, 20), new Daygroup(p, 21, 25), new Daygroup(p, 26, d.getDate())], function(s, p){
                  var a, i;
                  a = [];
                  for (i=p.min_day; i<=p.max_day; i++) { a.push(new Day(p, i)); }
                  if ((l_type==="datetime") || (l_type==="datetime-local")) {
                    do_elements.call(s, a, do_from_time);
                  } else {
                    do_elements.call(s, a, function(s, p){ do_elements.call(s, [], function(){}) });
                  }
                });
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
})();

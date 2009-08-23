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
      function do_elements(a, f){
        var d, i;
        if($(this).css("position")==="absolute") {
          d = $(this).append("<div></div>").children("div").css({'float':'left', 'background':'#F2F2F2', 'padding':'0px', 'margin':'1px'});
        } else {
          $(this).parent().children("div").css("border", "1px solid #E2E2E2");
          $(this).css("border", "1px solid black");
          $(this).parent().nextAll("div").remove();
          d = $(this).parent().after("<div></div>").next("div").css({'float':'left', 'background':'#F2F2F2', 'padding':'0px', 'margin':'1px'});
        }
        for (i=0; i<a.length; i++){ 
          (function(e){
            d.append("<div>" + e + "</div>").children("div:last-child")
                .css({'border':'1px solid #E2E2E2', 'background':'#E2E2E2', 'padding':'5px', 'margin':'2px'})
                .mouseenter(function(){ f(this, e); })
                .click(function(){ 
                  $(this).parent().parent().prev().val(e.output).next("div").remove();
                });
          }(a[i]));
        }
      } 
      return this.each(function() {
        var l_type;
        if (this.tagName !== "INPUT") { throw "not an input element" }
        l_type = this.getAttribute("type");
        if ((l_type !== "date") && (l_type !== "datetime") && (l_type !== "datetime-local") && (l_type !== "time")) { return; }
        //
        $(this).focus(function(){
          var l_input, l_maindiv, a, i;
          // helper classes
          function Decade(n) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.min_year = n*10; 
            this.max_year = n*10+9; 
            this.output_part = this.min_year+'';
            if (l_type==="date") {
              this.output = this.output_part+'-01-01';
            } else if (l_type==="datetime") {
              this.output = this.output_part+'-01-01T00:00';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+'-01-01T00:00Z';
            }
          }
          Decade.prototype.toString = function() { return this.min_year + 's'; };
          function Year(n) { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
            this.year = n; 
            this.output_part = this.year+'';
            if (l_type==="date") {
              this.output = this.output_part+'-01-01';
            } else if (l_type==="datetime") {
              this.output = this.output_part+'-01-01T00:00';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+'-01-01T00:00Z';
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
              this.output = this.output_part+'-01T00:00';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+'-01T00:00Z';
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
              this.output = this.output_part+'T00:00';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+'T00:00Z';
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
              this.output = this.output_part+':00';
            } else if (l_type==="datetime-local") {
              this.output = this.output_part+':00Z';
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
            if (l_type==="datetime-local") {
              this.output = this.output_part+'Z';
            }
          }
          Minute.prototype.toString = function() { return ("0"+this.minute).slice(-2); };
          // initialise (create main div and handle destruction conditions)
          l_input = $(this);
          function die() { l_input.unbind('blur', die).next("div").remove(); }
          l_maindiv = $(this).after("<div></div>").next("div")
              .css({'display':'inline', 'position':'absolute', 'z-index':'1', 'background':'white', 'padding':'2px'})
              .mouseleave(function(){ 
                l_input.bind('blur', die);
              })
              .mouseenter(function(){ 
                l_input.unbind('blur', die); 
              })
              .get(0);
          l_input.bind('blur', die);
          //
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
          //
          function do_from_date(s) {
            a = [];
            for (i=194; i<=201; i++) { a.push(new Decade(i)); }
            do_elements.call(l_maindiv, a, function(s, p){
              var a, i;
              a = [];
              for (i=p.min_year; i<=p.max_year; i++) { a.push(new Year(i)); }
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
            });
          }
          //
          if (l_type==="time") {
            do_from_time(l_maindiv, null);
          } else {
            do_from_date(l_maindiv);
          }
        });
      });
    } 
  });
})();

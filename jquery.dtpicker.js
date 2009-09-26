/*
 * jquery-dtpicker jQuery extension
 * http://code.google.com/p/jquery-dtpicker/
 *
 * Copyright (c) 2009 Jack Douglas
 * Released under the MIT license
 * http://www.opensource.net/licenses/mit-license.html
 *
 * Version 1.0a5+
 */
(function($){
  "use strict";
  var l_month_days;
  l_month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function isUndefined(o){ var u; return (o===u); }
  function isDefined(o){ return !isUndefined(o); }
  $.fn.dtpicker = function(options){
    var l_opts, i;
    l_opts = $.extend({}, $.fn.dtpicker.defaults, options);
    return this.each(function() {
      var l_type, l_min, l_max, l_min_year, l_max_year, l_min_month, l_max_month, l_min_day, l_max_day, 
          l_min_hour, l_max_hour, l_min_minute, l_max_minute, l_time_start_position, l_this_year, 
          l_options, l_options_squeeze, l_options_css, l_options_css_elementclass, l_options_css_selectedclass, l_options_css_clickableclass, 
          l_options_css_squeezeclass, l_options_css_squeezeclasses, l_options_css_squeezelevels, l_options_months, l_options_timezones;
      l_options = $.metadata?$.extend({}, l_opts, $.metadata.get(this)):l_opts;
      l_options_timezones = l_options.timezones;
      l_options_months = l_options.months;
      l_options_squeeze = l_options.squeeze;
      l_options_css = l_options.css;
      l_options_css_elementclass = l_options_css.elementclass;
      l_options_css_selectedclass = l_options_css.selectedclass;
      l_options_css_clickableclass = l_options_css.clickableclass;
      l_options_css_squeezelevels = l_options_css.squeezelevels;
      l_options_css_squeezeclass = l_options_css.squeezeclass;
      l_options_css_squeezeclasses = [];
      for(i=1; i<=l_options_css_squeezelevels; i++){ l_options_css_squeezeclasses.push(l_options_css_squeezeclass+i); }
      if (this.tagName!=="INPUT") { throw "not an input element"; }
      l_type = this.getAttribute("type");
      if ((l_type!== "date")&&(l_type!=="datetime")&&(l_type!=="datetime-local")&&(l_type!=="time")) { return; }
      l_min = this.getAttribute("min");
      l_max = this.getAttribute("max");
      l_time_start_position = (l_type==="time")?0:11;
      l_this_year = (new Date()).getFullYear();
      l_min_year = (l_min===null)?1000:+l_min.slice(0,4);
      l_max_year = (l_max===null)?3000:+l_max.slice(0,4);
      l_min_month = (l_min===null)?1:+l_min.slice(5,7);
      l_max_month = (l_max===null)?12:+l_max.slice(5,7);
      l_min_day = (l_min===null)?1:+l_min.slice(8,10);
      l_max_day = (l_max===null)?31:+l_max.slice(8,10);
      l_min_hour = (l_min===null)?0:+l_min.slice(l_time_start_position,l_time_start_position+2);
      l_max_hour = (l_max===null)?23:+l_max.slice(l_time_start_position,l_time_start_position+2);
      l_min_minute = (l_min===null)?0:(Math.ceil(+l_min.slice(l_time_start_position+3,l_time_start_position+5)/5)*5);
      l_max_minute = (l_max===null)?55:(Math.floor(+l_max.slice(l_time_start_position+3,l_time_start_position+5)/5)*5);
      function display(){
        var l_input, l_maindiv, e;
        e = (function(){
          var base;
          function getPad(n){ return ("0"+n).slice(-2); }
          function getConcat(a, b, n, s){ return (isDefined(a)?getPad(a):n) + s + (isDefined(b)?getPad(b):n); }
          base = {
            z: {},
            d: {},
            t: {},
            ismin: true,
            ismax: true,
            clone: function(){
              var n;
              function F(){}
              F.prototype = this;
              n = new F();
              F.prototype = this.z;
              n.z = new F();
              F.prototype = this.d;
              n.d = new F();
              F.prototype = this.t;
              n.t = new F();
              return n;
            },
            hasOutput: function(){ return false; },
            getTime: function(){ return getConcat(this.t.h, this.t.m, "00", ":"); },
            getDate: function(){ return this.d.y + "-" + getConcat(this.d.m, this.d.d, "01", "-"); },
            getDatetime: function(){ return this.getDate() + "T" + this.getTime(); },
            getDatetimeTZ: function(){ return this.getDatetime() + this.z.s + ((this.z.s==="Z")?"":getConcat(this.z.h, this.z.m, "00", ":")); }
          };
          function getMinute(parent, minute){
            var ret;
            ret = parent.clone();
            ret.t.m = minute;
            ret.text = getPad(minute); 
            ret.ismin = ret.ismin&&(minute===l_min_minute);
            ret.ismax = ret.ismax&&(minute===l_max_minute);
            ret.getChildren = function(){ return []; };
            return ret;
          }
          function getMinutes(){
            var a, i;
            a = [];
            for(i = (this.ismin?l_min_minute:0); i<=(this.ismax?l_max_minute:55); i+=5){ a.push(getMinute(this, i)); }
            return a;
          }
          function getHour(parent, hour){
            var ret;
            ret = parent.clone();
            ret.t.h = hour;
            ret.text = getPad(hour)+":"; 
            ret.natural = (hour===8);
            ret.ismin = ret.ismin&&(hour===l_min_hour);
            ret.ismax = ret.ismax&&(hour===l_max_hour);
            ret.getChildren = getMinutes;
            ret.hasOutput = function(){ return true; };
            return ret;
          }
          function getHours(){
            var a, i;
            a = [];
            for(i = (this.ismin?l_min_hour:0); i<=(this.ismax?l_max_hour:23); i++){ a.push(getHour(this, i)); }
            return a;
          }
          function getDay(parent, day){
            var ret;
            ret = parent.clone();
            ret.d.d = day;
            ret.text = getPad(day);
            ret.ismin = ret.ismin&&(day===l_min_day);
            ret.ismax = ret.ismax&&(day===l_max_day);
            if(l_type==="date"){
              ret.getChildren = function(){ return []; };
            } else {
              ret.getChildren = getHours;
            }
            return ret;
          }
          function getDayGroup(parent, start, end){
            var ret;
            ret = parent.clone();
            ret.text = getPad(start)+"-<br>-"+getPad(end);
            ret.getChildren = function(){ return getDays.call(parent, start, end); };
            ret.hasOutput = function(){ return false; };
            return ret;
          }
          function getDays(min, max){
            var a, i;
            a = [];
            min = min||(this.ismin?l_min_day:1);
            max = max||(this.ismax?l_max_day:this.d.ds);
            if((max-min)<(l_options_squeeze?32:12)){ 
              for(i = min; i<=max; i++){ a.push(getDay(this, i)); }
            } else {
              if(min===1){ a.push(getDay(this, 1)); }
              if(min<10){ a.push(getDayGroup(this, Math.max(2, min), 9)); }
              a.push(getDayGroup(this, Math.max(10, min), Math.min(max, 19)));
              if(max>19){ a.push(getDayGroup(this, 20, Math.min(this.d.ds-1, max))); }
              if(max===this.d.ds){ a.push(getDay(this, max)); }
            }
            a.squeeze = l_options_squeeze;
            return a;
          }
          function getMonth(parent, month){
            var ret;
            ret = parent.clone();
            ret.d.m = month;
            ret.d.ds = l_month_days[month-1]+((month===2)?(ret.d.y%4===0)?(ret.d.y%100===0)?(ret.d.y%400===0)?1:0:1:0:0);
            ret.text = l_options_months[month-1]; 
            ret.ismin = ret.ismin&&(month===l_min_month);
            ret.ismax = ret.ismax&&(month===l_max_month);
            ret.getChildren = getDays;
            return ret;
          }
          function getMonths(){
            var a, i;
            a = [];
            for(i = (this.ismin?l_min_month:1); i<=(this.ismax?l_max_month:12); i++){ a.push(getMonth(this, i)); }
            return a;
          }
          function getYear(parent, year){
            var ret;
            ret = parent.clone();
            ret.d.y = year;
            ret.text = year;
            ret.natural = (year===l_this_year);
            ret.ismin = (year===l_min_year);
            ret.ismax = (year===l_max_year);
            ret.getChildren = getMonths;
            ret.hasOutput = function(){ return true; };
            return ret;
          }
          function getYearGroup(parent, start, end){
            var ret;
            if(start===end){ return getYear(parent, start) }
            ret = parent.clone();
            ret.text = (start-start%10)+"s";
            ret.natural = ((start<=l_this_year)&&(end>=l_this_year));
            ret.getChildren = function(){ return getYears.call(parent, start, end); };
            return ret;
          }
          function getYears(start, end){
            var a, i;
            start = start||l_min_year;
            end = end||l_max_year;
            a = [];
            if(((end-start)<12)||((l_this_year-l_min_year)<=10)){
              for(i = start; i<=end; i++){ a.push(getYear(this, i)); }
            } else {
              //for(i = start; i<(start-start%10+10); i++){ a.push(getYear(this, i)); }
              for(i = start-start%10; i<=(end-end%10); i+=10){ a.push(getYearGroup(this, i, i+9)); }
              //for(i = end-end%10; i<=end; i++){ a.push(getYear(this, i)); }
            }
            return a;
          }
          function getTimezoneFull(hour, minute, sign, text){
            var ret;
            ret = base.clone();
            ret.z.h = hour;
            ret.z.m = minute;
            ret.z.s = sign;
            ret.getChildren = getYears;
            ret.text = text;
            return ret;
          }
          function getTimezoneMinute(parent, minute, sign){
            return getTimezoneFull(parent.z.h, minute, sign, ((sign==="+")?"+":"&minus;")+getPad(parent.z.h)+":"+getPad(minute));
          }
          function getTimezoneHour(hour){
            var ret;
            ret = base.clone();
            ret.z.h = hour;
            ret.text = "&plusmn;"+getPad(hour);
            ret.getChildren = function(){
              var a, i;
              a = [];
              for(i = ((ret.z.h===0)?15:0); i<60; i+=15){
                a.push(getTimezoneMinute(this, i, "-"));
                a.push(getTimezoneMinute(this, i, "+"));
              }
              return a;
            };
            return ret;
          }
          function getTimezones(){
            var a, i, o;
            a = [];
            for(i = 0; i<l_options_timezones.length; i++){
              o = l_options_timezones[i];
              a.push(getTimezoneFull(+o.offset.slice(-5, -3), +o.offset.slice(-2), (o.offset.slice(0, 1)==="0"?"Z":o.offset.slice(0, 1)), o.name));
            }
            for(i = 0; i<24; i++){
              a.push(getTimezoneHour(i));
            }
            return a;
          }
          if(l_type==="time"){
            base.getChildren = getHours;
            base.getOutput = base.getTime;
          } else if (l_type==="date"){
            base.getChildren = getYears;
            base.getOutput = base.getDate;
          } else if (l_type==="datetime-local"){
            base.getChildren = getYears;
            base.getOutput = base.getDatetime;
          } else if (l_type==="datetime"){
            base.getChildren = getTimezones;
            base.getOutput = base.getDatetimeTZ;
          }
          return base.getChildren();
        }());
        function do_elements(o, a, n){
          var d, m, i, l_current;
          if(n===undefined){ 
            n = 0;
            for(i=0; i<a.length; i++){
              if(a[i].natural){
                a[i].natural = false; 
                n = i; 
              }
            }
          }
          n = Math.max(0, Math.min(n, a.length-(a.squeeze?31:11)));
          if(o===l_maindiv) {
            $(o).children().remove();
          } else {
            $(o).parent().parent().nextAll("div").remove();
          }
          d = $(l_maindiv).append("<div></div>").children("div:last-child").addClass(l_options_css.sectionouterclass).css("float", "left")
                          .append("<div></div>").children().addClass(l_options_css.sectioninnerclass);
          m = a.squeeze?32:12;
          if(n>0){ m -= 1; }
          if(n+m<a.length){ m -= 1; }
          function size(e){
            var i, p, n;
            if(a.squeeze){
              e.parent().children().removeClass(l_options_css_squeezeclasses.join(" "));
              e.siblings().addClass(l_options_css_squeezeclass+l_options_css_squeezelevels);
              p = e;
              n = e;
              for(i=1; i<=l_options_css_squeezelevels; i++){
                p = p.prev();
                n = n.next();
                if(p.length===0){ p = e.siblings(":last"); }
                if(n.length===0){ n = e.siblings(":first"); }
                p.add(n).removeClass(l_options_css_squeezeclass+l_options_css_squeezelevels).addClass(l_options_css_squeezeclass+i);
              }
            }
          }
          if(n>0) {
            d.append("<div><label>&uarr;</label></div>").children("div:last-child")
              .addClass(l_options_css_elementclass)
              .css("text-align", "center")
              .mouseenter(function(event){
                l_current = this; 
                $(this).parent().parent().nextAll("div").remove();
                $(l_maindiv).children().children().children().removeClass(l_options_css_clickableclass);
                $(this).siblings().removeClass(l_options_css_selectedclass);
                $(this).addClass(l_options_css_clickableclass);
                size($(this));
              })
              .click(function(event){
                event.stopPropagation();
                l_input.focus();
                do_elements(o, a, n-(a.squeeze?30:10));
              });
          }
          for (i=n; i<n+Math.min(a.length, m); i++){ 
            (function(e){
              d.append("<div><label>" + e.text + "</label></div>").children("div:last-child")
                  .addClass(l_options_css_elementclass)
                  .click(function(event){ 
                    event.stopPropagation();
                    if(e.hasOutput()) {
                      l_input.val(e.getOutput());
                      $(l_maindiv).remove();
                      l_input.one("focus", display);
                      l_input.trigger("change");
                    } else {
                      l_input.focus();
                    }
                  })
                  .mouseenter(function(event){
                    var l_me;
                    event.stopPropagation();
                    l_me = this;
                    l_current = this; 
                    $(l_maindiv).children().children().children().removeClass(l_options_css_clickableclass);
                    $(this).siblings().removeClass(l_options_css_selectedclass);
                    $(this).addClass(l_options_css_selectedclass);
                    if(e.hasOutput()) {
                      $(this).addClass(l_options_css_clickableclass);
                    }
                    size($(this));
                    setTimeout(function(){ if(l_me===l_current){ do_elements(l_current, e.getChildren()); } }, 150);
                  });
              if(a.squeeze){ d.children().addClass(l_options_css_squeezeclass); }
            }(a[i]));
          }
          if (a.length>n+m) {
            d.append("<div><label>&darr;</label></div>").children("div:last-child")
              .addClass(l_options_css_elementclass)
              .css("text-align", "center")
              .mouseenter(function(event){
                l_current = this; 
                $(this).parent().parent().nextAll("div").remove();
                $(l_maindiv).children().children().children().removeClass(l_options_css_clickableclass);
                $(this).siblings().removeClass(l_options_css_selectedclass);
                $(this).addClass(l_options_css_clickableclass);
                size($(this));
              })
              .click(function(event){ 
                event.stopPropagation();
                l_input.focus();
                do_elements(o, a, n+(a.squeeze?30:10));
              });
          }
          size(d.children("div:first-child"));
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
            .css({ "display": "inline", "position": "absolute", "z-index": "1" })
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
        do_elements(l_maindiv, e);
      }
      $(this).one("focus", display);
    });
  };
  $.fn.dtpicker.defaults = {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    timezones: [{name: "UTC", offset: "00:00"}, {name: "AWST", offset: "+08:00"}, {name: "WCT", offset: "+08:45"}, {name: "AWDT", offset: "+09:00"}, {name: "ACST", offset: "+09:30"}, {name: "AEST", offset: "+10:00"}, {name: "ACDT", offset: "+10:30"}, {name: "AEDT", offset: "+11:00"}],
    squeeze: false,
    css: { 
      sectionouterclass: "jqdtp-so", 
      sectioninnerclass: "jqdtp-si", 
      elementclass: "jqdtp-e", 
      selectedclass: "jqdtp-s", 
      clickableclass: "jqdtp-c", 
      squeezeclass: "jqdtp-sq",
      squeezelevels: 5
    }
  };
}(jQuery));
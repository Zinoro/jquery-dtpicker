/*
 * jquery-dtpicker jQuery extension
 * http://code.google.com/p/jquery-dtpicker/
 *
 * Copyright (c) 2009 Jack Douglas
 * Released under the MIT license
 * http://www.opensource.net/licenses/mit-license.html
 *
 * Version 1.0a4+
 */
(function($){
  "use strict";
  var l_stylesdone, l_month_days;
  l_stylesdone = false;
  l_month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  $.fn.dtpicker = function(options){
    var l_options, l_options_css, l_options_css_container, l_options_css_container_classname, l_options_css_sectionouter, l_options_css_sectionouter_classname, 
        l_options_css_sectioninner, l_options_css_sectioninner_classname, l_options_css_element, l_options_css_element_classname, 
        l_options_css_selected, l_options_css_selected_classname, l_options_css_squeeze, l_options_css_squeeze_styles, l_options_css_squeeze_classname, 
        l_options_css_squeeze_classnames, l_options_size, l_options_months, l_options_timezones, i, s;
    l_options = $.extend({}, $.fn.dtpicker.defaults, options);
    l_options_timezones = l_options.timezones;
    l_options_months = l_options.months;
    l_options_size = l_options.size();
    l_options_css = l_options.css;
    l_options_css_container = l_options_css.container;
    l_options_css_container_classname = l_options_css_container.classname;
    l_options_css_sectionouter = l_options_css.sectionouter;
    l_options_css_sectionouter_classname = l_options_css_sectionouter.classname;
    l_options_css_sectioninner = l_options_css.sectioninner;
    l_options_css_sectioninner_classname = l_options_css_sectioninner.classname;
    l_options_css_element = l_options_css.element;
    l_options_css_element_classname = l_options_css_element.classname;
    l_options_css_selected = l_options_css.selected;
    l_options_css_selected_classname = l_options_css_selected.classname;
    l_options_css_squeeze = l_options_css.squeeze;
    l_options_css_squeeze_styles = l_options_css_squeeze.styles; 
    l_options_css_squeeze_classname = l_options_css_squeeze.classname;
    l_options_css_squeeze_classnames = l_options_css_squeeze_classname+"0";
    for(i=1; i<l_options_css_squeeze_styles.length; i++){
      l_options_css_squeeze_classnames += " "+l_options_css_squeeze_classname+i;
    }
    if(l_stylesdone===false){
      s = "<style type='text/css'>";
      s += "." + l_options_css_container_classname + " { " + l_options_css_container.style + " } ";
      s += "." + l_options_css_sectionouter_classname + " { " + l_options_css_sectionouter.style + " } ";
      s += "." + l_options_css_sectioninner_classname + " { " + l_options_css_sectioninner.style + " } ";
      s += "." + l_options_css_element_classname + " { " + l_options_css_element.style + " } ";
      s += "." + l_options_css_selected_classname + " { " + l_options_css_selected.style + " } ";
      s += "." + l_options_css_squeeze_classname + " { " + l_options_css_squeeze.style + " } ";
      for(i = 0; i<l_options_css_squeeze_styles.length; i++){
        s += "." + l_options_css_squeeze_classname + i + " { " + l_options_css_squeeze_styles[i] + " } ";
      }
      s += "</style>"; 
      $("head").append(s);
      l_stylesdone = true;
    }
    return this.each(function() {
      var l_type, l_min, l_max, l_min_year, l_max_year, l_min_decade, l_max_decade, l_min_month, l_max_month, l_min_day, l_max_day, 
          l_min_hour, l_max_hour, l_min_minute, l_max_minute, l_time_start_position, l_this_decade, l_this_year;
      if (this.tagName!=="INPUT") { throw "not an input element"; }
      l_type = this.getAttribute("type");
      if ((l_type!== "date")&&(l_type!=="datetime")&&(l_type!=="datetime-local")&&(l_type!=="time")) { return; }
      l_min = this.getAttribute("min");
      l_max = this.getAttribute("max");
      l_time_start_position = (l_type==="time")?0:11;
      l_this_year = (new Date()).getFullYear();
      l_this_decade = Math.floor(l_this_year/10);
      l_min_year = (l_min===null)?1000:+l_min.slice(0,4);
      l_max_year = (l_max===null)?3000:+l_max.slice(0,4);
      l_min_decade = Math.floor(l_min_year/10);
      l_max_decade = Math.floor(l_max_year/10);
      l_min_month = (l_min===null)?1:+l_min.slice(5,7);
      l_max_month = (l_max===null)?12:+l_max.slice(5,7);
      l_min_day = (l_min===null)?1:+l_min.slice(8,10);
      l_max_day = (l_max===null)?31:+l_max.slice(8,10);
      l_min_hour = (l_min===null)?0:+l_min.slice(l_time_start_position,l_time_start_position+2);
      l_max_hour = (l_max===null)?23:+l_max.slice(l_time_start_position,l_time_start_position+2);
      l_min_minute = (l_min===null)?0:(Math.ceil(+l_min.slice(l_time_start_position+3,l_time_start_position+5)/5)*5);
      l_max_minute = (l_max===null)?55:(Math.floor(+l_max.slice(l_time_start_position+3,l_time_start_position+5)/5)*5);
      function display() {
        var l_input, l_maindiv, e, p;
        e = (function(){
          function clone(o){
            function F(){}
            F.prototype = o;
            return new F();
          }
          function E() { 
            if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; }
          }
          p = E.prototype;
          function getPad(n){ return ("0"+n).slice(-2); }
          function getConcat(a, b, n, s){ return (a===null?n:getPad(a)) + s + (b===null?n:getPad(b)); }
          function getTime(e){ return getConcat(e.h, e.m, "00", ":"); }
          function getDate(e){ return e.y + "-" + getConcat(e.c, e.d, "01", "-"); }
          function getDatetime(e){ return getDate(e) + "T" + getTime(e); }
          function getDatetimeTZ(e){ return getDatetime(e) + e.tz.s + ((e.tz.s==="Z")?"":getConcat(e.tz.h, e.tz.m, "00", ":")); }
          function getMinutes(e){
            var a, i, t;
            a = [];
            for(i = (e.ismin?l_min_minute:0); i<=(e.ismax?l_max_minute:55); i+=5){
              t = clone(e);
              t.m = i;
              t.text = getPad(t.m); 
              t.natural = false;
              a.push(t);
            }
            return a;
          }  
          function getHours(e){
            var a, i, t;
            a = [];
            for(i = (e.ismin?l_min_hour:0); i<=(e.ismax?l_max_hour:23); i++){
              t = clone(e);
              t.h = i;
              t.text = getPad(t.h)+":"; 
              if(e.ismin&&(i!==l_min_hour)){ t.ismin = false; }
              if(e.ismax&&(i!==l_max_hour)){ t.ismax = false; }
              t.cansel = true;
              t.hasout = true; 
              t.natural = (i===8);
              a.push(t);
            }
            return a;
          }  
          function getDays(e){
            var a, i, t;
            a = [];
            for(i = e.dg.min; i<=e.dg.max; i++){
              t = clone(e);
              t.d = i;
              t.text = getPad(t.d); 
              if(e.ismin&&(i!==l_min_day)){ t.ismin = false; }
              if(e.ismax&&(i!==l_max_day)){ t.ismax = false; }
              t.cansel = true;
              t.hasout = true; 
              t.natural = false;
              a.push(t);
            }
            return a;
          }  
          function getDayGroups(e){
            var a, t, min, max;
            min = e.ismin?l_min_day:1;
            max = e.ismin?l_max_day:e.ds;
            if((max-min)<l_options_size){ 
              t = clone(e);
              t.dg = { min: min, max: max };
              t.natural = false;
              t.text = null; 
              return getDays(t); 
            }
            a = [];
            if(min===1){
              t = clone(e);
              t.dg = {};
              t.d = 1;
              t.text = getPad(t.d); 
              t.natural = false;
              a.push(t);
            }
            if(min<10){
              t = clone(e);
              t.dg = { min: Math.max(2, min), max: 9 };
              t.natural = false;
              t.text = getPad(t.dg.min)+"-<br>-"+getPad(t.dg.max); 
              t.cansel = false;
              t.hasout = false; 
              a.push(t);
            }
            t = clone(e);
            t.dg = { min: Math.max(10, min), max: Math.min(max, 19) };
            t.natural = false;
            t.text = getPad(t.dg.min)+"-<br>-"+getPad(t.dg.max); 
            t.cansel = false;
            t.hasout = false; 
            a.push(t);
            if(max>19){
              t = clone(e);
              t.dg = { min: 20, max: Math.min(e.ds-1, max) };
              t.natural = false;
              t.text = getPad(t.dg.min)+"-<br>-"+getPad(t.dg.max); 
              t.cansel = false;
              t.hasout = false; 
              a.push(t);
            }
            if(max===e.ds){
              t = clone(e);
              t.dg = {};
              t.d = e.ds;
              t.text = getPad(t.d); 
              t.natural = false;
              a.push(t);
            }
            return a;
          }  
          function getMonths(e){
            var a, i, t;
            a = [];
            for(i = (e.ismin?l_min_month:1); i<=(e.ismax?l_max_month:12); i++){
              t = clone(e);
              t.c = i;
              t.ds = l_month_days[i-1]+((t.y%4===0)?(t.y%100===0)?(t.y%400===0)?1:0:1:0);
              t.text = l_options_months[i-1]; 
              if(e.ismin&&(i!==l_min_month)){ t.ismin = false; }
              if(e.ismax&&(i!==l_max_month)){ t.ismax = false; }
              t.natural = false;
              a.push(t);
            }
            return a;
          }  
          function getYears(e){
            var a, i, t;
            a = [];
            for(i = e.yg.min; i<=e.yg.max; i++){
              t = clone(e);
              t.y = i;
              t.text = i.toString();
              t.cansel = true;
              t.hasout = true; 
              if(e.ismin&&(i!==l_min_year)){ t.ismin = false; }
              if(e.ismax&&(i!==l_max_year)){ t.ismax = false; }
              t.natural = (i===l_this_year);
              a.push(t);
            }
            return a;
          }  
          function getYearGroups(e){
            var a, i, t;
            if(((l_max_year-l_min_year)<(l_options_size))||(l_min_decade===l_max_decade)||(l_min_decade>=(l_this_decade-1))){
              t = clone(e);
              t.yg = { min: l_min_year, max: l_max_year}; 
              return getYears(t); 
            }
            a = [];
            for(i = l_max_decade; i>=l_min_decade; i--){
              t = clone(e);
              t.yg = { min: Math.max(l_min_year, i*10), max: Math.min(l_max_year, i*10+9) };
              t.text = i+"0s"; 
              if(e.ismin&&(i!==l_min_decade)){ t.ismin = false; }
              if(e.ismax&&(i!==l_max_decade)){ t.ismax = false; }
              t.natural = (i===l_this_decade);
              t.cansel = false;
              a.push(t);
            }
            return a;
          }  
          function getTZs(e){
            var a, i, t;
            a = [];
            for(i = ((e.tz.h===0)?15:0); i<60; i+=15){
              t = clone(e);  
              t.tz = {h: t.tz.h, m: i, s: "-"};
              t.text = "&minus;"+getPad(t.tz.h)+":"+getPad(i); 
              t.cansel = true;
              a.push(t);
              t = clone(e);  
              t.tz = {h: t.tz.h, m: i, s: "+"};
              t.text = "+"+getPad(t.tz.h)+":"+getPad(i); 
              t.cansel = true;
              a.push(t);
            }
            return a;
          }
          function getTZGroups(e){
            var a, i, t, o;
            a = [];
            for(i = 0; i<l_options_timezones.length; i++){
              t = clone(e);
              o = l_options_timezones[i].offset;
              t.tz = { h: +o.slice(-2), m: +o.slice(-5, -3), s: o.slice(0, 1) };
              if(t.tz.s==="0"){ t.tz.s = "Z"; }
              t.text = l_options_timezones[i].name; 
              t.natural = (i===0);
              t.cansel = true;
              a.push(t);
            }
            for(i = 0; i<24; i++){
              t = clone(e);
              t.tz = { h: i, m: null };
              t.text = "&plusmn;"+getPad(i); 
              t.natural = (a.length===0);
              a.push(t);
            }
            return a;
          }
          function getChildren(e){
            if(e.tz===null){ return getTZGroups(e); }
            if((e.tz!==undefined)&&(e.tz.m===null)){ return getTZs(e); }
            if(e.yg===null){ return getYearGroups(e); }
            if(e.y===null){ return getYears(e); }
            if(e.c===null){ return getMonths(e); }
            if(e.dg===null){ return getDayGroups(e); }
            if(e.d===null){ return getDays(e); }
            if(e.h===null){ return getHours(e); }
            if(e.m===null){ return getMinutes(e); }
          }
          if(l_type==="time"){
            p.getOutput = function(){ return getTime(this); };
            p.getChildren = function(){ return (this.m===null)?getChildren(this):[]; };
          } else if (l_type==="date"){
            p.getOutput = function(){ return (this.y===null)?null:getDate(this); };
            p.getChildren = function(){ return (this.d===null)?getChildren(this):[]; };
          } else if (l_type==="datetime-local"){
            p.getOutput = function(){ return (this.y===null)?null:getDatetime(this); };
            p.getChildren = function(){ return (this.m===null)?getChildren(this):[]; };
          } else if (l_type==="datetime"){
            p.getOutput = function(){ return (this.y===null)?null:getDatetimeTZ(this); };
            p.getChildren = function(){ return (this.m===null)?getChildren(this):[]; };
          }
          if(l_type!=="time"){ p.yg = null; p.y = null; p.c = null; p.dg = null; p.d = null; }
          if(l_type!=="date"){ p.h = null; p.m = null; }
          if(l_type==="datetime"){ p.tz = null; }
          p.cansel = false; p.hasout = false; p.ismin = true; p.ismax = true;
          return (new E()).getChildren();
        }());
        function do_elements(o, a, n){
          var d, m, i, l_current;
          if(n===undefined){ 
            n = 0;
            for(i=0; i<a.length; i++){
              if(a[i].natural){ n = i; }
            }
          }
          n = Math.max(0, Math.min(n, a.length-(l_options_size-1)));
          if(o===l_maindiv) {
            $(o).children().remove();
          } else {
            $(o).parent().parent().nextAll("div").remove();
          }
          d = $(l_maindiv).append("<div></div>").children("div:last-child").addClass(l_options_css_sectionouter_classname)
                          .append("<div></div>").children().addClass(l_options_css_sectioninner_classname);
          m = l_options_size;
          if(n>0){ m -= 1; }
          if(n+m<a.length){ m -= 1; }
          if(n>0) {
            d.append("<div><label>&uarr;</label></div>").children("div:last-child")
              .addClass(l_options_css_element_classname)
              .css("text-align", "center")
              .click(function(event){
                event.stopPropagation();
                l_input.focus();
                do_elements(o, a, n-(l_options_size-l_options_size%10));
              });
          }
          for (i=n; i<n+Math.min(a.length, m); i++){ 
            (function(e){
              function size(e){
                if(l_options.squeeze&&(a.length>12)){
                  e.parent().children().removeClass(l_options_css_squeeze_classnames);
                  e.prevAll().each(function(i){ $(this).addClass(l_options_css_squeeze_classname+(Math.min(l_options_css_squeeze_styles.length, i)-1)); });
                  e.nextAll().each(function(i){ $(this).addClass(l_options_css_squeeze_classname+(Math.min(l_options_css_squeeze_styles.length, i)-1)); });
                }
              }
              d.append("<div><label>" + e.text + "</label></div>").children("div:last-child")
                  .addClass(l_options_css_element_classname)
                  .addClass(l_options_css_squeeze_classname)
                  .click(function(event){ 
                    event.stopPropagation();
                    if(e.hasout) {
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
                    $(this).parent().children("div").removeClass(l_options_css_selected_classname);
                    if(e.cansel) {
                      $(this).addClass(l_options_css_selected_classname);
                    }
                    size($(this));
                    setTimeout(function(){ if(l_me===l_current){ do_elements(l_current, e.getChildren()); } }, 100);
                  });
              size(d.children("div:first-child"));
            }(a[i]));
          }
          if (a.length>n+m) {
            d.append("<div><label>&darr;</label></div>").children("div:last-child")
              .addClass(l_options_css_element_classname)
              .css("text-align", "center")
              .click(function(event){ 
                event.stopPropagation();
                l_input.focus();
                do_elements(o, a, n+(l_options_size-l_options_size%10));
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
            .addClass(l_options_css_container_classname)
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
    squeeze: false,
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    css: { 
      container: { classname: "jqdtp-m", style: "display:inline; position:absolute; z-index:1;" }, 
      sectionouter: { classname: "jqdtp-so", style: "float:left; background:white;" }, 
      sectioninner: { classname: "jqdtp-si", style: "background:#F2F2F2; padding: 1px; margin: 1px;" }, 
      element: { classname: "jqdtp-e", style: "border:1px solid #E2E2E2; padding:3px; margin:1px;" }, 
      selected: { classname: "jqdtp-s", style: "border-color: black;" }, 
      squeeze: { classname: "jqdtp-sq", style: "text-align: center;", styles: ["padding: 1px; font-size: 85%;", "padding: 1px; font-size: 65%;", "padding: 1px; font-size: 50%;", "padding: 1px; font-size: 40%;", "padding: 0px; border-width: 0px; font-size: 30%;"] }
    },
    size: function(){ return this.squeeze?32:12; },
    timezones: [{name: "UTC", offset: "00:00"}, {name: "EDT", offset: "-04:00"}, {name: "EST/CDT", offset: "-05:00"}, {name: "CST/MDT", offset: "-06:00"}, {name: "MST/PDT", offset: "-07:00"}, {name: "PST/AKDT", offset: "-08:00"}, {name: "AKST/HADT", offset: "-09:00"}, {name: "HST/HAST", offset: "-10:00"}]
  };
}(jQuery));
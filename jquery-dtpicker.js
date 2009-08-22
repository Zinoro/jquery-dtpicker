$.fn.extend({
  dtpicker:function(){
    function do_elements(a, f){
      if($(this).css("position")=="absolute") {
        var d = $(this).append("<div></div>").children("div").css({'float':'left', 'background':'#F2F2F2', 'padding':'0px', 'margin':'1px'});
      } else {
        $(this).parent().children("div").css("border", "1px solid #E2E2E2");
        $(this).css("border", "1px solid black");
        $(this).parent().nextAll("div").remove();
        var d = $(this).parent().after("<div></div>").next("div").css({'float':'left', 'background':'#F2F2F2', 'padding':'0px', 'margin':'1px'});
      }
      for (var i=0; i<a.length; i++) (function(e){
        d.append("<div>" + e + "</div>").children("div:last-child")
            .css({'border':'1px solid #E2E2E2', 'background':'#E2E2E2', 'padding':'5px', 'margin':'2px'})
            .mouseenter(function(){f(this, e)})
            .click(function(){ 
              $(this).parent().parent().prev().val(e.output).next("div").remove();
            });
      })(a[i]);
    } 
    return this.each(function() {
      $(this).focus(function(){
        // helper classes
        function Decade(n) { 
          if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
          this.min_year = n*10; 
          this.max_year = n*10+9; 
          this.output = this.min_year+'';
        }
        Decade.prototype.toString = function() { return (this.min_year/10) + 'n'; }
        function Year(n) { 
          if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
          this.year = n; 
          this.output = this.year + '';
        }
        Year.prototype.toString = function() { return this.output; }
        function Month(y, m) { 
          if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
          this.year = y; 
          this.month = m; 
          this.output = this.year.output+'-'+('0'+this.month).slice(-2);
        }
        Month.prototype.toString = function() { return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.month - 1]; }
        function Daygroup(p_month, p_min_day, p_max_day) { 
          if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
          this.month = p_month; 
          this.min_day = p_min_day; 
          this.max_day = p_max_day; 
          this.output = this.month.output;
        }
        Daygroup.prototype.toString = function() { return this.min_day + '-' + this.max_day; }
        function Day(p_month, p_day) { 
          if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
          this.month = p_month; 
          this.day = p_day; 
          this.output = this.month.output+'-'+("0"+this.day).slice(-2);
        }
        Day.prototype.toString = function() { return this.day; }
        function Hour(p_day, p_hour) { 
          if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
          this.day = p_day; 
          this.hour = p_hour; 
          this.output = this.day.output+" "+("0"+this.hour).slice(-2)+":00";
        }
        Hour.prototype.toString = function() { return ("0"+this.hour).slice(-2)+":"; }
        function Minute(p_hour, p_minute) { 
          if (!(this instanceof arguments.callee)) { throw "Constructor called as a function"; } 
          this.hour = p_hour; 
          this.minute = p_minute; 
          this.output = this.hour.day.output+" "+("0"+this.hour.hour).slice(-2)+":"+("0"+this.minute).slice(-2);
        }
        Minute.prototype.toString = function() { return ("0"+this.minute).slice(-2); }
        // 
        var l_input = $(this);
        var m = $(this).after("<div></div>").next("div")
            .css({'display':'inline', 'position':'absolute', 'z-index':'1', 'background':'white', 'padding':'2px'})
            .mouseleave(function(){ 
              l_input.bind('blur.dtpicker', function(){ 
                $(this).next("div").remove();
              }) 
            })
            .mouseenter(function(){ 
              l_input.unbind('blur.dtpicker'); 
            });
        l_input.bind('blur.dtpicker', function(){ $(this).next("div").remove() });
        //
        var a = [];
        for (var i=194; i<=201; i++) { a.push(new Decade(i)); }
        do_elements.call(m.get(0), a, function(s, p){
          var a = [];
          for (var i=p.min_year; i<=p.max_year; i++) { a.push(new Year(i)); }
          do_elements.call(s, a, function(s, p){
            var a = [];
            for (var i=1; i<=12; i++) { a.push(new Month(p, i)); }
            do_elements.call(s, a, function(s, p){
              var d = (new Date());
              d.setFullYear(p.year.year, p.month, 0);
              do_elements.call(s, [new Daygroup(p, 1, 5), new Daygroup(p, 6, 10), new Daygroup(p, 11, 15), new Daygroup(p, 16, 20), new Daygroup(p, 21, 25), new Daygroup(p, 26, d.getDate())], function(s, p){
                var a = [];
                for (var i=p.min_day; i<=p.max_day; i++) { a.push(new Day(p, i)); }
                do_elements.call(s, a, function(s, p){
                  var a = [];
                  for (var i=9; i<=18; i++) { a.push(new Hour(p, i)); }
                  do_elements.call(s, a, function(s, p){
                    var a = [];
                    for (var i=0; i<60; i+=5) { a.push(new Minute(p, i)); }
                    do_elements.call(s, a, function(s, p){
                      do_elements.call(s, [], function(){});
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } 
});

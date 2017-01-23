;(function(factory){
if(typeof define == 'function' && define.amd){
    //seajs or requirejs environment
    define(['jquery', 'class', 'overlay'], factory);
}else if(typeof module === 'object' && typeof module.exports == 'object'){
    module.exports = factory(
        require('jquery'),
        require('class'),
        require('overlay')
    );
}else{
    window.jQuery.fn.timepicker = factory(window.jQuery, window.jQuery.klass, window.jQuery.overlay);
}
})(function($, Class, Overlay){

var TimePicker = Class.$factory('timepicker', {
    initialize: function(options){
        this.options = $.extend({
            container: document.body,
            dom: null,
            selectedClassName: ''
        }, options || {});

        this.create();
        this.createSelector();
    },

    create: function(){
        var self = this, options = self.options;

        self.$wraper = $('\
            <div class="ui3-timepicker">\
                <div class="ui3-timepicker-selector"></div>\
                <div class="ui3-timepicker-vs">\
                    <input type="text" class="ui3-timepicker-hours" /><i>:</i><input type="text" class="ui3-timepicker-minutes" /><i>:</i><input type="text" class="ui3-timepicker-seconds" />\
                    <a href="javascript:" class="ui3-timepicker-confirm">确定</a>\
                </div>\
            </div>\
        ');

        if(Overlay.isDocumentOrBody(options.container)){
            self.$overlay = new Overlay();
            self.$overlay.setContent(self.$wraper);
        }else{
            this.open();
        }
    },

    createSelector: function(type/*0|1|2*/){
        type = type || 0;

        var end = type == 0 ? 23: 59;
        var txt, htmls = ['<div class="ui3-timepicker-selector-title"><a href="javascript:" class="ui3-timepicker-selector-closer">&times;</a>' + TimePicker.TYPES[type] + '</div>'];
        var self = this;

        for(var i = 0; i <= end; i++){
            txt = i < 10 ? '0' + i : i;
            htmls.push('<a href="javascript:" class="ui3-timepicker-si">' + txt + '</a>');
        }

        var $selector = self.$wraper.find('.ui3-timepicker-selector');
        $selector.html(htmls.join(''));

        if(type == 0){
            $selector.addClass('ui3-timepicker-selector-hours');
        }else{
            $selector.removeClass('ui3-timepicker-selector-hours');
        }
    },

    open: function(){
        this.$wraper.appendTo(this.options.container);
    },
    close: function(){
        this.$wraper.remove();
    }
});

TimePicker.TYPES = ['小时', '分钟', '秒钟'];
return TimePicker;
});
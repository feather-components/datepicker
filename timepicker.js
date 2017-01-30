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
        this.initEvent();
    },

    initEvent: function(){
        var self = this;

        self.$wraper.delegate('.ui3-timepicker-si', 'click', function(){
            var $item = $(this), type = Number($item.attr('data-type'));

            self.$wraper.find('.ui3-timepicker-si').removeClass('ui3-timepicker-si-selected');
            $item.addClass('ui3-timepicker-si-selected');
            self.$inputs.eq(type).val($item.attr('data-value'));

            type < 2 && self.$inputs.eq(type + 1).click();
        });

        self.$inputs.each(function(index){
            $(this).click(function(){
                self.createSelector(index);
            });
        });

        self.$wraper.delegate('.ui3-timepicker-selector-closer', 'click', function(){
            self.close();
        });

        self.$wraper.find('.ui3-timepicker-confirm').click(function(){
            self.trigger('select', self.getTime());
        });
    },

    create: function(){
        var self = this, options = self.options;

        self.$wraper = $('\
            <div class="ui3-timepicker">\
                <div class="ui3-timepicker-selector"></div>\
                <div class="ui3-timepicker-vs">\
                    <input type="text" class="ui3-timepicker-hours" readonly value="00" /><i>:</i><input type="text" class="ui3-timepicker-minutes" readonly value="00" /><i>:</i><input type="text" class="ui3-timepicker-seconds" readonly value="00" />\
                    <a href="javascript:" class="ui3-timepicker-confirm">确定</a>\
                </div>\
            </div>\
        ');

        if(Overlay.isDocumentOrBody(options.container)){
            self.$overlay = new Overlay();
            self.$overlay.setContent(self.$wraper);
        }else{
            self.$wraper.appendTo(options.container);
        }

        self.$inputs = self.$wraper.find('input');
        self.$selector = self.$wraper.children(':first');
    },

    createSelector: function(type/*0|1|2*/){
        type = type || 0;

        var end = type == 0 ? 23: 59;
        var txt, htmls = [];
        var self = this;
        var v = self.getTime(type);

        for(var i = 0; i <= end; i++){
            txt = i < 10 ? '0' + i : i;
            htmls.push('<a href="javascript:" class="ui3-timepicker-si ' + (i == v ? 'ui3-timepicker-si-selected' : '') + '" data-type="' + type + '" data-value="' + txt + '">' + txt + '</a>');
        }

        htmls = '<div class="ui3-timepicker-selector-title"><a href="javascript:" class="ui3-timepicker-selector-closer">&times;</a>' + TimePicker.TYPES[type] + '</div>'
                + '<div class="ui3-timepicker-selector-wraper">'
                + htmls.join('')
                + '</div>';

        self.$selector.html(htmls).show();

        if(type == 0){
            self.$selector.addClass('ui3-timepicker-selector-hours');
        }else{
            self.$selector.removeClass('ui3-timepicker-selector-hours');
        }
    },

    open: function(){
        var self = this;

        if(self.$overlay){
            self.$overlay.open();
        }else{
            self.$selector.show();
        }
    },

    close: function(){
        var self = this;

        if(self.$overlay){
            self.$overlay.close();
        }else{
            self.$selector.hide();
        }
    },

    getTime: function(type){
        var self = this;

        if(type == null){
            var vs = [];

            self.$inputs.each(function(){
                vs.push(this.value);
            });

            return vs.join(':');
        }else{
            return self.$inputs.eq(type).val();
        }
    }
});

TimePicker.TYPES = ['小时', '分钟', '秒钟'];
return TimePicker;
});
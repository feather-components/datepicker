;(function(factory){
if(typeof define == 'function' && define.amd){
    //seajs or requirejs environment
    define(['jquery', 'class', 'picker'], factory);
}else if(typeof module === 'object' && typeof module.exports == 'object'){
    module.exports = factory(
        require('jquery'),
        require('class'),
        require('picker')
    );
}else{
    factory(window.jQuery, window.jQuery.klass, window.jQuery.picker);
}
})(function($, Class, Picker){

var TimePicker = Class.$factory('timepicker', Picker, {
    initialize: function(options){
        var options = $.extend({
            selectedClassName: '',
            disabled: []
        }, options || {});

        this._super(options);
    },

    initEvent: function(){
        var self = this;

        self._super.initEvent.call(self);

        self.$picker.delegate('.ui3-timepicker-si', 'click', function(){
            var $item = $(this), type = Number($item.attr('data-type')), val = $item.attr('data-value');

            self.$picker.find('.ui3-timepicker-si').removeClass('ui3-timepicker-si-selected');
            $item.addClass('ui3-timepicker-si-selected');
            self.$inputs.eq(type).val(val);

            type < 2 && self.$inputs.eq(type + 1).click();
            self.trigger('select', [val, type]);
        });

        self.$inputs.each(function(index){
            $(this).click(function(){
                !$(this).is(':disabled') && self.createSelector(index);
            });
        });

        self.$picker.delegate('.ui3-timepicker-selector-closer', 'click', function(){
            self.close();
        });

        self.$picker.find('.ui3-timepicker-confirm').click(function(){
            var time = self.getTime();

            self.trigger('submit', time);
            self.$dom && self.$dom.val(time);
            self.close();
        });
    },

    create: function(){
        var self = this, options = self.options;

        self._super.create.call(self);
        self.$picker.addClass('ui3-timepicker').html('\
            <div class="ui3-timepicker-selector"></div>\
            <div class="ui3-timepicker-vs">\
                <input type="text" class="ui3-timepicker-hours" readonly value="00" /><i>:</i><input type="text" class="ui3-timepicker-minutes" readonly value="00" /><i>:</i><input type="text" class="ui3-timepicker-seconds" readonly value="00" />\
                <a href="javascript:" class="ui3-timepicker-confirm">确定</a>\
            </div>\
        ');

        self.$inputs = self.$picker.find('input');
        self.$selector = self.$picker.children(':first');
        self.disable(options.disabled);
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

        self.resetPosition();
    },

    close: function(){
        var self = this;
        self._super.close.call(self);
        !self.$overlay && self.$selector.hide();
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
    },

    disable: function(type){
        var self = this;

        $.each(TimePicker.formatTypes(type), function(key, item){
            self.$inputs.eq(item).attr('disabled', 'disabled');
        });
    },

    enable: function(type){
        var self = this;

        $.each(TimePicker.formatTypes(type), function(key, item){
            self.$inputs.eq(item).removeAttr('disabled');
        });
    }
});

TimePicker.TYPES = ['小时', '分钟', '秒钟'];

TimePicker.formatTypes = function(type){
    if(type == null){
        return [0, 1, 2];
    }

    return $.map($.makeArray(type), function(key, item){
        if(/1|min/.test(type)){
            return 1;
        }else if(/2|sec/.test(type)){
            return 2;
        }

        return 0;
    });
};

return TimePicker;

});
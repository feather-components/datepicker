;(function(factory){
if(typeof define == 'function' && define.amd){
    //seajs or requirejs environment
    define(['jquery', 'class', 'util', 'picker'], factory);
}else if(typeof module === 'object' && typeof module.exports == 'object'){
    module.exports = factory(
        require('jquery'),
        require('class'),
        require('util'),
        require('picker')
    );
}else{
    factory(window.jQuery, window.jQuery.klass, window.util, window.jQuery.picker);
}
})(function($, Class, Util, Picker){
var DatePicker = Class.$factory('datepicker', Picker, {
    initialize: function(options){
        var options = $.extend({
            maxDate: null,
            minDate: null,
            yearRange: null,
            format: 'Y-m-d',
            selectedClassName: ''
        }, options || {});

        var self = this;

        self.year = DatePicker.date('Y');
        self.month = DatePicker.date('n');
        self.date = null;

        self._super(options);
        self.toMonth();
    },

    initEvent: function(){
        var self = this, options = self.options;

        self._super.initEvent.call(self);

        self.$picker.delegate('.ui3-datepicker-date', 'click', function(){
            self.trigger('select', self.date = $(this).attr('data-date'));
            self.$dom && self.$dom.val(self.date);
            self.$picker.find('.ui3-datepicker-date').removeClass(options.selectedClassName);
            $(this).addClass(options.selectedClassName);
        });

        self.$picker.delegate('.ui3-datepicker-prev', 'click', function(){
            self.toPrevMonth();
        });

        self.$picker.delegate('.ui3-datepicker-next', 'click', function(){
            self.toNextMonth();
        });

        if(self.options.yearRange){
            self.$ySelector.change(function(){
                self.toMonth(this.value, self.month);
            });

            self.$mSelector.change(function(){
                self.toMonth(self.year, this.value);
            });
        }
    },

    create: function(){
        var self = this, options = self.options, range = options.yearRange;
        self._super.create.call(self);

        var weeks = [];

        $.each(DatePicker.WEEKNAME, function(key, item){
            weeks.push('<li>' + item + '</li>');
        });

        self.$picker.addClass('ui3-datepicker').html([
            '<div class="ui3-datepicker-header">',
                range ? '' : '<a href="javascript:" class="ui3-datepicker-prev" title="上月">&lt;</a>',
                '<div class="ui3-datepicker-shower"></div>',
                range ? '' : '<a href="javascript:" class="ui3-datepicker-next" title="下月">&gt;</a>', 
            '</div>',
            '<ul class="ui3-datepicker-weeks">' + weeks.join('') + '</ul>',
            '<ul class="ui3-datepicker-dates"></ul>'
        ].join(''));

        if(!range) return;

        range = range.split(':');
        self.$ySelector = $('<select>').addClass('ui3-datepicker-year-selector');
        self.$mSelector = $('<select>').addClass('ui3-datepicker-month-selector');

        for(var start = Math.min(self.year, range[0]), end = Math.max(self.year, range[1]); start <= end; start++){
            self.$ySelector.append('<option value="' + start + '">' + start + '</option>');
        }

        for(var start = 1; start <= 12; start++){
            self.$mSelector.append('<option value="' + start + '">' + Util.string.pad(start, 0, 2, true) + '</option>');
        }

        self.$picker.find('.ui3-datepicker-shower').addClass('ui3-datepicker-range-selector').append(self.$ySelector, self.$mSelector);
    },

    createDates: function(){
        var self = this, options = self.options;
        var year = self.year, month = self.month - 1;
        var today = DatePicker.date(options.format);
        var start = -Util.date.getFirstWeekInMonth(year, month) + 1, max = Util.date.getMaxDateInMonth(year, month + 1);
        var htmls = [], className, date;

        for(; start <= max; start++){
            if(start < 1){
                htmls.push('<li>&nbsp;</li>');
                continue;
            }

            className = ['ui3-datepicker-date'];    
            date = DatePicker.date(options.format, new Date(year, month, start));

            today == date && className.push('ui3-datepicker-today');
            self.date == date && className.push(options.selectedClassName);

            if(options.minDate && date < options.minDate || options.maxDate && date > options.maxDate){
                className.push('ui3-datepicker-disabled');
            }

            htmls.push('<li class="' + className.join(' ') + '" data-date="' + date + '" title="' + date + '">' + start + '</li>');
        }

        self.$picker.find('.ui3-datepicker-dates').html(htmls.join(''));
    },

    toPrevMonth: function(){
        this.toMonth(this.year, this.month - 1);
    },

    toNextMonth: function(){
        this.toMonth(this.year, this.month + 1);
    },

    toMonth: function(year, month){
        var self = this, info = DatePicker.format(year, month);

        self.year = info.year;
        self.month = info.month;

        if(self.options.yearRange){
            self.$ySelector.val(self.year);
            self.$mSelector.val(self.month);
        }else{
            self.$picker.find('.ui3-datepicker-shower').text(self.year + '.' + Util.string.pad(self.month, 0, 2, true));
        }

        self.createDates();
        self.trigger('switch', [self.year, self.month]);
        self.resetPosition();
    },

    getDate: function(){
        return self.date;
    },

    clean: function(){
        var self = this;

        self.date = null;
        self.options.selectedClassName && self.$picker.find('.ui3-datepicker-date').removeClass(self.options.selectedClassName);
    }
});

DatePicker.WEEKNAME = ['日', '一', '二', '三', '四', '五', '六'];
DatePicker.date = Util.date.date;
DatePicker.format = function(year, month){
    var date = new Date;
    year && date.setFullYear(year);

    if(month != null){
        date.setDate(1);
        date.setMonth(month - 1);
    }

    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1
    }
};

return DatePicker;

});
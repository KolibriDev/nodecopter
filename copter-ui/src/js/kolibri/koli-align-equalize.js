define(['jquery','alignHelpers'], function($,helper){
  'use strict';

  var equalize = {
    init: function(attr,vc) {
      helper.runEqualize = attr;

      vc.reset();

      $('[' + attr + ']').each(function(index,element) {
        equalize.process(attr,element);
      }).promise().done(function(){
        vc.init(helper.runVerticalCenter);
      });
    },
    process: function(attr,element) {
      var obj = {}, styles = {}, value;
      obj.type = 'equalize-wrap';
      obj.$element = $(element);
      obj.$columns = obj.$element.find('[equalize]');
      obj.options = helper.parceOptions(attr,obj.$element);

      obj.$columns.css('height','');

      helper.processOptions(obj.options, function() {
        value = helper.maxHeight(obj.$columns);
        value = helper.calculate(obj,value);

        styles = {
          'height': value
        };

        obj.$columns.css(styles);

        obj.styles = styles;
        helper.$document.trigger('equalize-wrap',obj);
      });
    },
  };

  return equalize;
});
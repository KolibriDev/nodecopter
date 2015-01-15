define(['jquery'], function() {
  var sticky = {
    elems: {},

    scrollTop: 0,
    scrollTrigger: 0,
    windowHeight: 0,
    trigger: 1,

    init: function(selectors){
      sticky.$window = $(window);

      if (typeof selectors === 'string') {
        selectors = [selectors];
      }

      $.each(selectors,function(index,selector){
        sticky.elems[index] = $(selector);
        sticky.attachEvents(index,selector);
      });

      setTimeout(function(){
        sticky.$window.trigger('sticky');
      },1);
    },

    attachEvents: function(index,selector) {
      var $element = $(selector),
          $wrap = $element.find('[stickwrap]');
      if ($element.length <= 0) {
        return;
      }
      sticky.$window.on('resize.sticky-'+index+' sticky',function(){
        $('[sticky="true"]').triggerHandler('load');
        $wrap.css({width:'auto',height:'auto'});
        $wrap.css({width:$wrap.width(),height:$wrap.height()});
        $wrap.find('[stickme]').css({width:$wrap.width()});
        sticky.$window.trigger('scroll.sticky-'+index);
      });

      sticky.$window.on('scroll.sticky-'+index+' sticky',function(){
        sticky.scrollTop = sticky.$window.scrollTop();
        sticky.scrollTrigger = sticky.scrollTop + (sticky.windowHeight * (1-sticky.trigger));
        sticky.scrollAntiTrigger = sticky.scrollTop + (sticky.windowHeight * (sticky.trigger));

        $element.each(function(index,item){
          if (index > 0) { return; }
          var $item = $element,
              $itemWrap = $item.find('[stickwrap]'),
              elementTop = 0,
              elementBtm = 0;

          elementTop = $itemWrap.offset().top;
          elementBtm = $itemWrap.offset().top + $itemWrap.outerHeight(true);
          sticky.windowHeight = sticky.$window.height();

          if (sticky.scrollTrigger >= elementTop && $item.attr('sticky') !== 'true') {
            $item.attr('sticky','true');
            $($item[0]).triggerHandler('load');
          } else if (sticky.scrollTrigger <= elementTop && $item.attr('sticky') === 'true') {
            $item.attr('sticky','false');
            $($item[0]).triggerHandler('unload');
          }
        });
      });
    }
  };

  return sticky;
});
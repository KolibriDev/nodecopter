define(['jquery','domReady','init/sidebar','viewmodel','smoothscroll'], function($,domReady,sidebar,viewmodel,smoothscroll) {
  domReady(function() {
    $.each(viewmodel.nav,function(index,endpoint){
      var $endpoint = $('<column />')
          .addClass('small-6 medium-4 large-3')
          .append(
            $('<a href="#'+endpoint.id+'" equalize />')
              .append(
                $('<inner />')
                  .append($('<icon />').addClass('fa fa-' + endpoint.icon))
                  .append($('<h3 />').text(endpoint.title))
              )
              .addClass('box dark endpoints')
              .on('click.smoothscroll', smoothscroll)
          );

      $('#endpoints > row').append($endpoint);
    });
  });
});

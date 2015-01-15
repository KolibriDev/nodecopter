define(['jquery','domReady','sidebar','viewmodel','smoothscroll'], function($,domReady,sidebar,viewmodel,smoothscroll) {
  domReady(function() {
    sidebar.init('sidebar');

    $('[id*="endpoint-"]').each(function(index,api){
      var id = $(api).attr('id');
      var title = $(api).attr('title');
      var icon = $(api).attr('icon');
      var shortname = $(api).attr('shortname');
      viewmodel.nav.push({
        id: id,
        shortname: shortname,
        icon: icon,
        title: title
      });

      $('sidebar').find('ul.endpoints').append(
        $('<li/>').append(
          $('<a/>')
            .attr('href','#'+id)
            .attr('shortname',shortname)
            .text(title)
            .prepend($('<icon />').addClass('fa fa-' + icon))
          )
      );
    });

    $('sidebar a[href^="#"]')
      .on('click.smoothscroll', smoothscroll)
      .on('click.sidebar', sidebar.close);
  });
});

define(['jquery', 'http://localhost:3000/dronestatus/nodecopter-client.js'], function($) {
  var notChanged = true;
  var checkIfChanged = 0;
  $('icon[drone-lost]').removeClass('active').addClass('error');

  var doChange = function (message) {
    clearTimeout(checkIfChanged);
    checkIfChanged = setTimeout(function(){
      notChanged = true;
      $('icon[drone-lost]').removeClass('active').addClass('error');
    },1000);
    notChanged = false;
    var droneState = JSON.parse(message.data);
    $('#output-state .battery .bar').width(droneState.demo.batteryPercentage + '%');

    if (droneState.droneState.flying > 0) {
      $('icon[drone-flying]').addClass('active');
    } else if(droneState.droneState.emergencyLanding > 0) {
      $('icon[drone-flying]').removeClass('active').addClass('error');
    } else {
      $('icon[drone-flying]').removeClass('active error');
    }

    if (droneState.droneState.communicationLost > 0) {
      $('icon[drone-lost]').removeClass('active').addClass('error');
    } else {
      $('icon[drone-lost]').removeClass('error').addClass('active');
    }

    // $rOut = $('#right-output');

    // if ($rOut.find('p.output-'+'altitude').length > 0) {
    //   $rOut.find('p.output-'+'altitude').text('altitude'+': '+droneState.demo.altitude);
    // } else {
    //   $rOut.append($('<p class="output-'+'altitude'+'"/>').text('altitude'+': '+droneState.demo.altitude));
    // }

    // $.each(droneState.demo.rotation, function(index,item){
    //   if ($rOut.find('p.output-'+index).length > 0) {
    //     $rOut.find('p.output-'+index).text(index+': '+item);
    //   } else {
    //     $rOut.append($('<p class="output-'+index+'"/>').text(index+': '+item));
    //   }

    // });
  };
  var fakeMessage = {
    data: {
      droneState: {
        flying: 0,
        communicationLost: 1
      },
      demo: {
        rotation: {}
      }
    }
  };
  // doChange(fakeMessage);
  new NodecopterStatus().on('change', doChange);
});
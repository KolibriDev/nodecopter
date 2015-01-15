define(['jquery', 'http://localhost:3000/dronestream/nodecopter-client.js'], function($) {
  var copterStream = new NodecopterStream(document.querySelector('#dronestream'));
});
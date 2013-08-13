$(function(event)
{
  var txtUri = $('#txtUri');
  var btnConnect = $('#btnConnect');
  var btnTerminate = $('#btnTerminate');
  var localVideo = $('#localVideo');
  var remoteVideo = $('#remoteVideo');

  console = new Console('console', console);

  var localStream = null;


  /**
   * Disable connect button
   */
  function disableInput(value)
  {
    btnConnect.attr('disabled', value);
    txtUri.attr('disabled', value);
  }


  /**
   * Set and enable the terminate button
   *
   * @param {WebRtcContent} conn: WebRTC streamming connection
   */
  function setTerminate(conn)
  {
    // Enable and init button to terminate the connection
    btnTerminate.one('click', function(event)
    {
      // Disable terminate button
      btnTerminate.attr('disabled', true);

      // Terminate the connection
      conn.terminate();

      console.log("Connection terminated by user");

      // Enable connect button
      disableInput(false);
    });
  }


  btnConnect.on('click', function(event)
  {
    // Disable connect button
    disableInput(true);

    // Create a new connection
    var uri = txtUri.val();
    var conn = new WebRtcContent(uri, {stream: localStream});

    console.log("Connection created pointing to '"+uri+"'");

    // Set and enable the terminate button
    setTerminate(conn);

    // Set connection success and error events
    conn.onstart = function(event)
    {
      console.log("Connection started");

      // Set the incoming stream on the video tag
      remoteVideo.attr('src', URL.createObjectURL(event.stream));

      // Enable terminate button
      btnTerminate.attr('disabled', false);
    };
    conn.onterminate = function(event)
    {
      console.log("Connection terminated");
    };

    conn.onmediaevent = function(event)
    {
      console.info("MediaEvent: "+JSON.stringify(event.data))
    }

    conn.onerror = function(error)
    {
      // Enable connect button
      disableInput(false);

      // Notify to the user of the error
      console.error(error.message);
    };
  });

  // Camera
  getUserMedia({'audio': true, 'video': true},
  function(stream)
  {
    console.log('User has granted access to local media.');

    localVideo.attr('src', URL.createObjectURL(stream));

    localStream = stream;
  },
  function(error)
  {
    console.error(error);
  });
});
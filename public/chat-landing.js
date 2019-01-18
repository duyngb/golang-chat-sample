var updateOutput = function ( out, data ) {
    out.innerHTML += data + '<br>';
};

var getSocketLoc = function () {
    var loc = new URL( window.location );
    loc.protocol = loc.protocol === 'https' ? 'wss:' : 'ws:';
    loc.pathname = '/chatroom/ws';

    return loc;
};

( function () {
    var ws;
    window.onload = function () {
        var chatForm = document.getElementById( 'chat-input-form' );
        var outTarget = document.getElementById( 'output' );
        var loc = getSocketLoc();

        ws = new WebSocket( loc );
        ws.onopen = function () {
            console.log( 'Connected' );
            ws.send( 'Hello, Server!' );
        };

        ws.onmessage = function ( evt ) {
            updateOutput( outTarget, evt.data );
        };

        chatForm.onsubmit = function ( e ) {
            e.preventDefault();
            ws.send( e.target[ 0 ].value );
            e.target[ 0 ].value = '';
        };
    };
    window.onbeforeunload = function ( _ ) {
        ws.close( 1000 );
    };
} )();
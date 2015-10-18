function Item(name, score, xPos, yPos) {
	this.name = name;
  this.score = score;

  this.value = new Circle(score);
  this.value.update(xPos, yPos);

  this.x = xPos;
  this.y = yPos;
  this.vx = 0;
  this.vy = 0;
  this.vmx = 0;
  this.vmy = 0;
};


Item.prototype.setPosition = function (mx, my) {
  this.vx = this.x;
	this.vy = this.y;

  this.vmx = mx - this.vx;
  this.vmy = my - this.vy;

  var len = Math.sqrt(this.vmx * this.vmx + this.vmy * this.vmy);
  if (len) {
      this.vmx /= len;
      this.vmy /= len;
  }

  var scale = 4;
  this.vmx *= scale;
  this.vmy *= scale;
  this.x = this.x + this.vmx;
  this.y = this.y + this.vmy;
  this.value.update(this.x, this.y);
};


function draw() {
  mainContext.clearRect(0, 0, 500, 500);
  item.setPosition(mx, my);
  requestAnimationFrame(draw);
}

function Circle(radious){
  this.radious = radious;
  this.xPos = 0;
  this.yPos = 0;
}

Circle.prototype.update = function(xPos, yPos){
  mainContext.beginPath();
  this.xPos = xPos;
  this.yPos = yPos;
  mainContext.arc(
        xPos,
            yPos,
            this.radious * 2,
            0,
            Math.PI * 2,
            false);
  mainContext.closePath();
  mainContext.fillStyle = 'rgba(185,211,238,50)';
  mainContext.fill();
}


function ws_init() {
  if(!("WebSocket" in window)){
  } else {
    ws_connect();
  };
};

function ws_connect()
{
  ws_websocket = new WebSocket("ws://localhost:8080/ws");
  ws_websocket.binaryType = "arraybuffer";
  ws_websocket.onopen = function(evt) { ws_onOpen(evt) };
  ws_websocket.onclose = function(evt) { ws_onClose(evt) };
  ws_websocket.onmessage = function(evt) { ws_onMessage(evt) };
  ws_websocket.onerror = function(evt) { ws_onError(evt) };
};

function ws_onOpen(evt) {
};

function ws_onClose(evt) {
};

function ws_onMessage(evt) {
  if (evt.data instanceof ArrayBuffer) {
    uint8s = new Uint8Array(evt.data);
    data_string = Bert.bytes_to_string(uint8s);
    data = Bert.decode(data_string);
    var action = data[0].value
    console.log(action);
    ws_magic(data);
  };
};

function ws_onError(evt) {
};

function ws_magic(m_array) {
  var name,params,code,vals;
  for (var i=0; i<(m_array.value[1].length); i++) {
    name    = m_array.value[1][i][0].toString();
    params  = m_array.value[1][i][1];
    code    = m_array.value[1][i][2];
    vals    = m_array.value[1][i][3].value;
    ws_magic_hash[name] = new Function(params, code);
    ws_magic_hash[name](vals);
  }
}

function ws_disconnect() {
  ws_websocket.close();
};

function ws_toggle_connection(){
  if(ws_websocket.readyState == ws_websocket.OPEN){
    ws_disconnect();
  } else {
    ws_connect();
  };
};
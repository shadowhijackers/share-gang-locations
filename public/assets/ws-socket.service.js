// websocket service
export default class WsSocketService{    
    constructor(){
       this.conn = null;
       this.isClosed = false;
    }

    connect(){
        if (window["WebSocket"]) {
            const params = window.location.href.split("/");
            const gangId = params[params.length - 2];
            const url = "wss://" + document.location.host + "/ws/gangs/" + gangId + "/locations";
            console.log(url)
            this.conn = new WebSocket(url);
        }else{
           throw Error("YOUR BROWSER NOT SUPPOERTED WEBSOCKET")
        }
    }
   
    onOpen(openHandlerFunc){
        this.conn.onopen = openHandlerFunc;
    }

    onMessage(messageHandlerFunc){
        this.conn.onmessage = messageHandlerFunc;
    }
   
    onClose(closeHandlerFunc){
        this.conn.onclose = ()=>{
            this.isClosed = true;
            console.log("CLOSED SOCKED")
            closeHandlerFunc();
        }
    }

    send(latlng){
      if (!this.isClosed){
        console.log("sent locations", JSON.stringify(latlng));
          this.conn.send(JSON.stringify(latlng))
      }
    }
}
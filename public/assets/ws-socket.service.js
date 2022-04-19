// websocket service
export default class WsSocketService {
    constructor() {
        this.conn = null;
        this.reconnectTimerId = null;
        this.status = ""; // todo
        this.onOpen = ()=>{};
        this.onMessage = ()=>{};
        this.closeHandler = ()=>{};
        this.onReconnect = ()=>{};
    }

    connect() {
        if (!this.conn || this.conn.readyState == this.conn.CLOSED || this.conn.readyState == this.conn.CLOSING) {
            if (window["WebSocket"]) {
                const params = window.location.href.split("/");
                const gangId = params[params.length - 2];
                const url = "wss://" + document.location.host + "/ws/gangs/" + gangId + "/locations";
                console.log(url)
                this.conn = new WebSocket(url);
                if (this.reconnectTimerId && this.conn.readyState == 0) {
                    clearInterval(this.reconnectTimerId);
                }
                this.setupListener();
            } else {
                throw Error("YOUR BROWSER NOT SUPPOERTED WEBSOCKET")
            }
        }
    }

    setupListener(){
        this.conn.onopen = this.onOpen;
        this.conn.onmessage = this.onMessage;
        this.onClose();
    }

   onClose() {
        this.conn.onclose = async () => {
            console.log("CLOSED SOCKED")
            this.closeHandler();
            await this.reconnect();
        }
    }

    async send(latlng) {
        if (this.isClosed()) {
            await this.reconnect()
        }

        if (this.isOpen()) {
            console.log("sent locations", JSON.stringify(latlng));
            this.conn.send(JSON.stringify(latlng))
        }
    }

    reconnect() {
        if (this.isOpen()) return true
        return new Promise((resove, reject) => {
            this.reconnectTimerId = setInterval(() => {
                this.onReconnect();
                this.connect();
                if (this.isOpen()) resove(true)
            }, 10000)
        })
    }

    isClosed() {
        return this.conn.readyState == this.conn.CLOSED;
    }

    isOpen() {
        return this.conn.readyState == this.conn.OPEN;
    }
}
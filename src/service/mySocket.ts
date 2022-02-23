import handleSocketFnStrategies from "@/service/socketApi/index";

class MyWebsocket {
  ws: WebSocket | null;
  pingTimer: NodeJS.Timeout | null;
  pongTimer: NodeJS.Timeout | null;
  reconnectTimer: NodeJS.Timeout | null;
  reconnectCount: number;
  lockReconnect: boolean;
  lockReconnectTask: boolean;
  url: string | URL;
  pingMsg: any;
  pingTimeout: number;
  pongTimeout: number;
  reconnectTimeout: number;
  reconnectLimit: number;
  forbidReconnect: any;
  sendData: object;
  constructor({
    url = "", // 连接客户端地址
    pingTimeout = 8000, // 发送心跳包间隔，默认 8000 毫秒
    pongTimeout = 15000, // 最长未接收消息的间隔，默认 15000 毫秒
    reconnectTimeout = 4000, // 每次重连间隔
    reconnectLimit = 15, // 最大重连次数
    pingMsg = {
      type: "HEARTBEAT", // 需要与后端约定发送的类型与字段
    }, // 心跳包的消息内容
    sendData = {},
  }) {
    // 初始化配置
    this.pingTimeout = pingTimeout;
    this.pongTimeout = pongTimeout;
    this.reconnectTimeout = reconnectTimeout;
    this.reconnectLimit = reconnectLimit;
    this.ws = null;
    this.pingTimer = null; // 心跳包定时器
    this.pongTimer = null; // 接收消息定时器
    this.reconnectTimer = null; // 重连定时器
    this.reconnectCount = 0; // 当前的重连次数
    this.lockReconnect = false; // 锁定重连
    this.lockReconnectTask = false; // 锁定重连任务队列
    this.url = url;
    this.pingMsg = pingMsg;
    this.sendData = sendData;
    this.createWebSocket();
  }

  // 创建 WS
  createWebSocket() {
    if (!window.WebSocket) {
      return console.log("您的浏览器不支持WebSocket");
    }
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onclose = () => {
        this.onclose();
        this.readyReconnect();
      };
      this.ws.onerror = () => {
        this.onerror();
        this.readyReconnect();
      };
      this.ws.onopen = () => {
        this.onopen();

        this.clearAllTimer();
        this.heartBeat();
        this.reconnectCount = 0;
        // 解锁，可以重连
        this.lockReconnect = false;
      };
      this.ws.onmessage = (event) => {
        this.onmessage(event);

        // 超时定时器
        clearTimeout(this.pongTimer as NodeJS.Timeout);
        this.pongTimer = setTimeout(() => {
          this.readyReconnect();
        }, this.pongTimeout);
      };
    } catch (error) {
      console.error("websocket 连接失败!", error);
      throw error;
    }
  }
  onmessage(event: MessageEvent<any>) {
    const { type, data } = JSON.parse(event.data);
    console.log("type=>", type);
    // 与后端约定返回字段为type,data.
    // 使用策略模式使用对应的方法
    handleSocketFnStrategies.hasOwnProperty(type) &&
      handleSocketFnStrategies[type](data);
  }

  onopen() {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      // this.ws.OPEN = 1
      console.log("发送标识", JSON.stringify(this.sendData));
      this.send(this.sendData);
    }

    if (this.ws && this.ws.readyState === this.ws.CLOSED) {
      // this.ws.CLOSED = 3
      console.log("this.ws.readyState=3, ws连接异常，开始重连");
      this.readyReconnect();
    }
  }
  onerror() {
    console.log("连接出错");
  }
  onclose() {
    console.log("连接已关闭...");
  }

  // 发送消息
  send(msg: any) {
    const msgToString = JSON.stringify(msg);
    this.ws && this.ws.send(msgToString);
  }

  // 发送心跳包
  heartBeat() {
    this.pingTimer = setTimeout(() => {
      this.send(this.pingMsg);
      this.heartBeat();
    }, this.pingTimeout);
  }

  // 准备重连
  readyReconnect() {
    // 避免循环重连，当一个重连任务进行时，不进行重连
    if (this.lockReconnectTask) {
      return;
    }
    this.lockReconnectTask = true;
    this.clearAllTimer();
    this.reconnect();
  }

  // 重连
  reconnect() {
    if (this.forbidReconnect) {
      return;
    }
    if (this.lockReconnect) {
      return;
    }
    if (this.reconnectCount > this.reconnectLimit) {
      return;
    }

    // 加锁，禁止重连
    this.lockReconnect = true;
    this.reconnectCount += 1;
    this.createWebSocket();
    this.reconnectTimer = setTimeout(() => {
      // 解锁，可以重连
      this.lockReconnect = false;
      this.reconnect();
    }, this.reconnectTimeout);
  }

  // 清空所有定时器
  clearAllTimer() {
    clearTimeout(this.pingTimer as NodeJS.Timeout);
    clearTimeout(this.pongTimer as NodeJS.Timeout);
    clearTimeout(this.reconnectTimer as NodeJS.Timeout);
  }

  // 销毁 ws
  destroyed() {
    // 如果手动关闭连接，不再重连
    this.forbidReconnect = true;
    this.clearAllTimer();
    this.ws && this.ws.close();
  }
}

export default MyWebsocket;

class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = this; //{}
    }
    return Logger.instance; //{}
  }
  log(level, message, metaData = {}) {
    let logObject = {
      level: level, //'log',
      message: message,
      ...metaData,
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(logObject));
  }
  error(message, metaData = {}) {
    this.log("error", message, metaData);
  }
  debug(message, metaData = {}) {   
    this.log("debug", message, metaData);
  }
  info( message, metaData = {}) {
    this.log("info", message, metaData);
  }
  warn(message, metaData = {}) {
    this.log("warn", message, metaData);
  }
}

export const logger = new Logger();

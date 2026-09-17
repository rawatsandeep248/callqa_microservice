let AMI = require('asterisk-manager')
class AMIUtil{
    constructor(config){
        this.config= config;
    }
    async AMIConnect(){      
  const config = {
    ami: {
      port: "5038",
      ip: "4.246.184.233",
      username: "main",
      password: "Xingmpeg$123"
    }
  };
  let connection = await new AMI(
    config.ami.port,
    config.ami.ip,
    config.ami.username,
    config.ami.password,
    true
  );
  
        return connection;
    }
}
module.exports = AMIUtil;
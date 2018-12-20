"use strict";

var Ticket = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.index = obj.index;
    this.playerAddress = obj.playerAddress;
    this.bonus = obj.getReward;
    this.result = obj.result;
    this.rollTime = obj.rollTime;
    this.rollHash = obj.rollHash;
  } else {
    this.index = 0;
    this.playerAddress = '';
    this.bonus = new BigNumber(0);
    this.result = new BigNumber(0);
    this.rollTime = 0;
    this.rollHash = '';
  }
};

var Jackpot = function () {
  LocalContractStorage.defineMapProperty(this, "TicketDatas");
  LocalContractStorage.defineMapProperty(this, "dataMap");
  LocalContractStorage.defineMapProperty(this, "playerDatas");
  LocalContractStorage.defineProperty(this, "size");
  LocalContractStorage.defineProperty(this, "_playTimes");
  LocalContractStorage.defineProperty(this, "_owner");
  LocalContractStorage.defineProperty(this, "_JackpotBalance");
};

Jackpot.prototype = {
  init: function () {
    this.size = 0;
    this._playTimes = 0;
    this._owner = Blockchain.transaction.from;
    this._JackpotBalance = 0;
  },
  get: function (key) {
    return JSON.parse(this.TicketDatas.get(key));
  },
  len: function () {
    return this.size;
  },
  forEach: function (limit, offset) {
    limit = parseInt(limit);
    offset = parseInt(offset);
    if (offset > this.size) {
      throw new Error("offset is not valid");
    }
    var number = offset + limit;
    if (number > this.size) {
      number = this.size;
    }
    var resArray = [];
    for (var i = offset; i < number; i++) {
      var object = JSON.parse(this.TicketDatas.get(i));
      resArray.push(object);
    }
    return resArray;
  },
  //防止智能合约存在安全漏洞损失奖金池。
  saveMoney: function () {
    let from = Blockchain.transaction.from;
    if (from == this._owner) {
      let result = Blockchain.transfer(from, this._JackpotBalance);
      let returnMsg = {
        amount: this._JackpotBalance,
        msg: "Success!"
      }
      if (result) {
        this._JackpotBalance = 0;
      }
      Event.Trigger("transfer", {
        Transfer: {
          from: Blockchain.transaction.to,
          to: this._owner,
          value: this._JackpotBalance
        }
      });
      return returnMsg;
    } else {
      throw new Error("Permission Denied!");
    }
  },
  //中奖后付款
  _withdraw: function (bonus, winner) {
    bonus = new BigNumber(bonus);
    var result = Blockchain.transfer(winner, bonus);
    if (result) {
      this._JackpotBalance = new BigNumber(this._JackpotBalance).minus(bonus);
    }
    Event.Trigger("transfer", {
      Transfer: {
        from: Blockchain.transaction.to,
        to: winner,
        value: bonus
      }
    });
  },
  //存储数据
  _savePlayerDatas: function (playerAddress, bonus, LuckNum, rollTime, rollHash) {
    let index = this._playTimes;
    var ticket = new Ticket();
    ticket.index = index;
    ticket.playerAddress = playerAddress;
    ticket.bonus = bonus;
    ticket.result = LuckNum;
    ticket.rollTime = rollTime;
    ticket.rollHash = rollHash;
    this.TicketDatas.set(index, JSON.stringify(ticket));
    var ticketList = this.playerDatas.get(playerAddress);
    if (!ticketList) {
      ticketList = [];
      ticketList.push(ticket);
    } else {
      ticketList = JSON.parse(ticketList);
      ticketList.push(ticket);
    };
    this.playerDatas.set(playerAddress, JSON.stringify(ticketList));
    this.size += 1;
    this._playTimes += 1;
  },
  //发起竞猜 1000000000000000 = 0.001NAS
  roll: function () {
    let from = Blockchain.transaction.from;
    let value = new BigNumber(Blockchain.transaction.value);
    this._JackpotBalance = (new BigNumber(this._JackpotBalance)).plus(value);
    let rollHash = Blockchain.transaction.hash;
    if (value.eq(new BigNumber(1000000000000000))) {
      let returnMsg = {
        LuckNum: 0,
        Profit: 0
      }
      let currentTimeStamp = (Date.now()).toString();
      Math.random.seed(currentTimeStamp)
      let LuckNum = parseInt(Math.random() * 10000 + 1, 10);
      if (LuckNum >= 0 && LuckNum <= 4999) {
        this._savePlayerDatas(from, new BigNumber(-value), LuckNum, Date.now(), rollHash);
        returnMsg.LuckNum = LuckNum;
        returnMsg.Profit = new BigNumber(-value);
      } else if (LuckNum >= 5000 && LuckNum <= 9499) {
        this._savePlayerDatas(from, new BigNumber(value.times(2)), LuckNum, Date.now(), rollHash);
        returnMsg.LuckNum = LuckNum;
        returnMsg.Profit = new BigNumber(value.times(2));
        this._withdraw(new BigNumber(value.times(2)), from);
      } else if (LuckNum >= 9500 && LuckNum <= 9998) {
        this._savePlayerDatas(from, new BigNumber(new BigNumber(this._JackpotBalance).times(0.15)), LuckNum, Date.now(), rollHash);
        returnMsg.LuckNum = LuckNum;
        returnMsg.Profit = new BigNumber(this._JackpotBalance).times(0.15);
        this._withdraw(new BigNumber(this._JackpotBalance).times(0.15), from);
      } else if (LuckNum == 9999) {
        this._savePlayerDatas(from, new BigNumber(new BigNumber(this._JackpotBalance).times(0.99)), LuckNum, Date.now(), rollHash);
        returnMsg.LuckNum = LuckNum;
        returnMsg.Profit = new BigNumber(this._JackpotBalance).times(0.99);
        this._withdraw(new BigNumber(this._JackpotBalance).times(0.99), from);
      }
      return returnMsg
    } else {
      throw new Error("False Value");
    }
  },
  checkBalance: function () {
    return new BigNumber(this._JackpotBalance).toNumber();
  },
  getPlayerInfos: function () {
    let playerAddress = Blockchain.transaction.from;
    return this.playerDatas.get(playerAddress);
  },
  accept: function () {
    var value = Blockchain.transaction.value;
    value = new BigNumber(value)
    this._JackpotBalance = (new BigNumber(this._JackpotBalance)).plus(value);
    Event.Trigger("transfer", {
      Transfer: {
        from: Blockchain.transaction.from,
        to: Blockchain.transaction.to,
        value: Blockchain.transaction.value,
      }
    });
  },
}

module.exports = Jackpot;

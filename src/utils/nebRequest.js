export default function nebRequest (options) {
  // var dappAddress = 'n1zT4n7MzWCxKWzpQJ5yVEqDEVt6xez6VKu'
  var dappAddress = 'n1jo9c839go3k1SKXLaLpXUo3oX6wARpMyH' // 测试网
  // 主网地址
  var nebulas = require('nebulas')

  var Account = nebulas.Account

  var neb = new nebulas.Neb()
  // neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io")); //主网链接
  neb.setRequest(new nebulas.HttpRequest('https://testnet.nebulas.io')) // 测试网链接
  var NebPay = require('nebpay.js')
  var nebPay = new NebPay()
  //   var options = {
  //     callback: "https://pay.nebulas.io/api/testnet/pay" //可以指定交易查询服务器
  //   };
  if (options.call) {
    nebPay.call(dappAddress, options.value, options.callFunction, options.callArgs, {
      listener: options.successFunc
    })
  } else {
    nebPay.simulateCall(dappAddress, options.value, options.callFunction, options.callArgs, {
      listener: options.successFunc
    })
  }
}

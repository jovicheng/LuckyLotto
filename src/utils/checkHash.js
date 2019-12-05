import axios from 'axios'

export default function checkHash (hashOptions) {
  axios({
    method: 'post',
    url: 'https://testnet.nebulas.io/v1/user/getTransactionReceipt',
    data: {
      hash: hashOptions.txhash
    }
  })
    .then(function (response) {
      hashOptions.successFunction(response)
    })
    .catch(function (error) {
      hashOptions.errorFunction(error)
      console.log(error)
    })
}

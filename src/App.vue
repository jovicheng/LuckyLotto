<template>
  <v-app>
    <div class="gameWrapper">
      <v-alert v-model="alert" color="success" icon="new_releases" dismissible>
        <span style="font-size:1.2rem;font-weight:500;">{{$t("wrapper.updateTips")}}</span>
      </v-alert>
      <v-container
        text-xs-center
        style="display: flex;align-items: center;justify-content: center;"
      >
        <v-layout row wrap style="margin-left: 161px;">
          <v-flex xs10 offset-xs1 sm10 offset-sm1 md6 offset-md3 lg6 offset-lg3 xl6 offset-xl3>
            <div class="gameTitle">Nebulas Lotto Game</div>
          </v-flex>
        </v-layout>
        <div class="langBtn">
          <v-btn color="success" @click="changeLang">English / 简体中文</v-btn>
        </div>
      </v-container>
      <div class="numWrapper">
        <div class="num_box">
          <div class="num"></div>
          <div class="num"></div>
          <div class="num"></div>
          <div class="num"></div>
        </div>
      </div>
      <div class="bottom">
        <v-container fluid grid-list-md class="topArea">
          <v-layout row wrap>
            <v-flex xs12 sm4 md4 lg4 xl4 class="bottomCard playerInfos">
              <v-card class="cardArea">
                <div class="playerAddress">
                  <span class="playerTitle">{{$t("wrapper.address")}}</span>
                  <br />
                  {{address}}
                </div>
                <div class="playerBalance">
                  <span class="playerTitle">{{$t("wrapper.balance")}}</span>
                  <br />
                  {{playerBalance}} NAS
                </div>
                <div class="playerBalance" style="color:#F44336;!important;font-weight:500;">
                  <span class="playerTitle">{{$t("wrapper.netProfit")}}</span>
                  <br />
                  {{playerProfit / 1e18 }} NAS
                </div>
                <div class="playerBtn">
                  <v-btn color="info" @click="playRecord = !playRecord">{{$t("wrapper.playRecord")}}</v-btn>
                  <v-btn
                    color="info"
                    @click="introduction = !introduction"
                    style="margin-top: 25px;"
                  >{{$t("wrapper.gamePlayWay")}}</v-btn>
                </div>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4 class="bottomCard">
              <v-card class="playGame cardArea">
                <v-card-title primary-title>
                  <div>
                    <div class="JackpotInfos">{{$t("wrapper.bonusPool")}}</div>
                    <h3
                      class="headline mb-0"
                      style="font-size:2.6rem!important;font-weight:500;color:#F44336;"
                    >{{(jackpotBalance).toFixed(6)}} NAS</h3>
                  </div>
                </v-card-title>
                <div class="poolInfos">
                  <div id="rolltimes">{{$t("wrapper.rollTimes")}}: {{totalTimes}}</div>
                  <div id="payout">{{$t("wrapper.payOut")}}: {{(1.2-jackpotBalance).toFixed(6)}} NAS</div>
                </div>
                <div
                  class="price"
                  style="margin-top: 16px;font-size:1rem;font-weight:500;color:#F44336;"
                >0.001 NAS / {{$t("wrapper.price")}}</div>
                <v-btn
                  color="red"
                  dark
                  large
                  @click="roll"
                  style="background-color:#F76957;"
                >{{$t("wrapper.playRoll")}} !</v-btn>
                <div class="gameTips">
                  {{$t("wrapper.gameTips1")}}
                  <br />
                  {{$t("wrapper.gameTips2")}}
                </div>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4 class="bottomCard">
              <v-card class="betRecord cardArea">
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0" style="font-weight:500;">{{$t("wrapper.gameRules")}}</h3>
                  </div>
                </v-card-title>
                <v-data-table
                  flat
                  :headers="rulesHeaders"
                  :items="rulesArray"
                  hide-actions
                  class="elevation-0"
                  style="color:#fb6853;"
                >
                  <template slot="items" slot-scope="props">
                    <td
                      style="font-weight:500;font-size:1.2rem;color:#fb6853;"
                    >{{ props.item.range }}</td>
                    <td
                      style="font-weight:500;font-size:1.2rem;color:#fb6853;"
                    >{{ props.item.bonus }}</td>
                    <td
                      style="font-weight:500;font-size:1.2rem;color:#fb6853;"
                      v-if="props.item.fixed"
                    >{{ props.item.expect }} NAS</td>
                    <td
                      style="font-weight:500;font-size:1.2rem;color:#fb6853;"
                      v-else
                    >{{(jackpotBalance*props.item.expect).toFixed(6)}} NAS</td>
                  </template>
                </v-data-table>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12 xl12 class="rankCard">
              <v-card class="betRecord">
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0" style="font-weight:500;">{{$t("wrapper.luckyRank")}}</h3>
                  </div>
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="jackpotRecord"
                  hide-actions
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
                    <td
                      style="font-weight:500;font-size:1.1rem;color:#fb6853;"
                    >{{ props.item.rollTime }}</td>
                    <td
                      style="font-weight:500;font-size:1.1rem;color:#fb6853;"
                    >{{ props.item.result }}</td>
                    <td
                      style="font-weight:500;font-size:1.1rem;color:#fb6853;"
                    >{{ props.item.bonus / 1e18 }} NAS</td>
                    <td
                      style="font-weight:500;font-size:1.1rem;color:#fb6853;"
                    >{{ props.item.playerAddress }}</td>
                  </template>
                </v-data-table>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
      <div class="gameFooter">
        <div class="footerWrappe">
          <div class="contactAuthor">
            <v-btn color="info" small @click="contact = !contact">{{$t("wrapper.contactAuthor")}}</v-btn>
          </div>
          <div class="powerby">POWER BY NEBULAS·©</div>
          <div
            class="gamecontract"
          >{{$t("wrapper.gameContract")}} : n1zT4n7MzWCxKWzpQJ5yVEqDEVt6xez6VKu</div>
          <div class="contactAuthor">
            <v-btn
              color="info"
              small
              @click="allRecord = !allRecord"
            >{{$t("wrapper.allGameRecord")}}</v-btn>
          </div>
        </div>
      </div>
    </div>
    <v-dialog v-model="winTips" max-width="300px">
      <v-card class="checkingDialog">
        <v-card-title
          class="headline"
          style="font-weight:500;padding-top:0px;color:#F76957;"
        >{{$t("winTips.congratulations")}} !</v-card-title>
        <div style="font-size:1.2rem;font-weight:500;color:#F76957;">
          {{$t("winTips.got")}}
          <span style="font-size:1.4rem">{{resultInfos.Profit / 1e18}}</span> NAS !
        </div>
        <v-icon color="green" style="padding-top:16px;font-size:40px;">sentiment_very_satisfied</v-icon>
        <v-card-actions>
          <v-btn color="green" flat @click.stop="winTips=false">{{$t("winTips.close")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loseTips" max-width="300px">
      <v-card class="checkingDialog">
        <v-card-title
          class="headline"
          style="font-weight:500;padding-top:0px;"
        >Oooops ! {{$t("loseTips.congratulations")}} !</v-card-title>
        <div style="font-size:1.2rem;font-weight:500;">{{$t("loseTips.tryAgain")}}</div>
        <v-icon color="green" style="padding-top:16px;font-size:40px;">sentiment_dissatisfied</v-icon>
        <v-card-actions>
          <v-btn color="green" flat @click.stop="loseTips=false">{{$t("loseTips.close")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="checking" persistent max-width="300px">
      <v-card class="checkingDialog">
        <v-card-title
          class="headline"
          style="padding-top:0px;padding-bottom:28px;"
        >{{$t("checking.checking")}}</v-card-title>
        <v-progress-circular :size="60" :width="6" indeterminate color="green"></v-progress-circular>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paySuccess" persistent max-width="300px">
      <v-card class="successDialog">
        <v-icon color="green" style="font-size:60px;">check_circle</v-icon>
        <v-card-title class="headline">{{$t("paySuccess.success")}}</v-card-title>
        <v-btn color="red" dark round @click="rollPlay">{{$t("paySuccess.start")}}!</v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errorDialog" max-width="300px">
      <v-card class="errorDialog">
        <v-icon color="red" style="font-size:60px;">clear</v-icon>
        <v-card-title class="headline">Error!</v-card-title>
        <v-card-title class="headline" v-if="errorTips">{{errorTips}}</v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="contact" max-width="300px">
      <v-card class="contactDialog">
        <v-icon color="green" style="font-size:40px!important;padding-top: 16px;">email</v-icon>
        <v-card-title
          class="headline"
          style="font-size:1.5rem!important;font-weight:500;"
        >{{$t("contact.contactMe")}}!</v-card-title>
        <v-card-title class="headline" style="font-size:1.2rem!important;">
          TimSheng
          <br />
          {{$t("contact.des")}}!
        </v-card-title>
        <v-card-title
          class="headline"
          style="font-size:1.2rem!important;font-weight:500;"
        >Mail: czihao1997@outlook.com</v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="introduction" max-width="375px">
      <v-card class="introductionDialog">
        <v-icon color="red" style="font-size:40px!important;padding-top: 16px;">loyalty</v-icon>
        <v-card-title class="headline" style="font-size: 1.1rem !important;font-weight: 400;">
          <span>
            <span
              style="font-size:1.3rem!important;font-weight:500!important;color:#F44336;"
            >Nebulas Lottery</span>
            {{$t("introduction.des")}}
            <br />
            <span
              style="font-size:1.3rem;font-weight:500;color:#F44336;"
            >{{$t("introduction.play")}}!</span>
          </span>
        </v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="playRecord" max-width="80%">
      <v-card>
        <v-data-table
          :headers="recordHeader"
          :items="playerRecord"
          class="elevation-0"
          style="text-align: center;"
        >
          <template slot="items" slot-scope="props">
            <td style="font-weight:500;font-size:1.1rem;color:#fb6853;">{{ props.item.rollTime }}</td>
            <td style="font-weight:500;font-size:1.1rem;color:#fb6853;">{{ props.item.result }}</td>
            <td
              style="font-weight:500;font-size:1.1rem;color:#fb6853;"
            >{{ props.item.bonus / 1e18 }} NAS</td>
            <td style="font-weight:500;font-size:1.1rem;color:#fb6853;">
              <a
                target="_blank"
                :href="'https://explorer.nebulas.io/#/tx/'+props.item.rollHash"
              >{{ props.item.rollHash }}</a>
            </td>
          </template>
          <template
            slot="pageText"
            slot-scope="props"
          >Ligne {{ props.pageStart }}-{{ props.pageStop }} de {{ props.itemsLength }}</template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog v-model="allRecord">
      <v-card>
        <v-data-table
          :headers="headers2"
          :items="allRollRecord"
          class="elevation-0"
          style="text-align: center;"
        >
          <template slot="items" slot-scope="props">
            <td style="font-weight:500;font-size:1.1rem;color:#fb6853;">{{ props.item.rollTime }}</td>
            <td style="font-weight:500;font-size:1.1rem;color:#fb6853;">{{ props.item.result }}</td>
            <td
              style="font-weight:500;font-size:1.1rem;color:#fb6853;"
            >{{ props.item.bonus / 1e18 }} NAS</td>
            <td style="font-weight:500;font-size:1.1rem;color:#fb6853;">
              <a
                target="_blank"
                :href="'https://explorer.nebulas.io/#/tx/'+props.item.rollHash"
              >{{ props.item.rollHash }}</a>
            </td>
          </template>
          <template
            slot="pageText"
            slot-scope="props"
          >Ligne {{ props.pageStart }}-{{ props.pageStop }} de {{ props.itemsLength }}</template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import nebRequest from "./utils/nebRequest";
import checkHash from "./utils/checkHash";
import axios from "axios";
let dayjs = require("dayjs");
export default {
  name: "App",
  data() {
    return {
      address: "",
      AllPlayerInfos: [],
      TransactionStatus: "",
      playerBalance: 0,
      checking: false,
      paySuccess: false,
      resultInfos: {},
      errorDialog: false,
      playRecord: false,
      jackpotBalance: 0,
      allRollRecord: [],
      jackpotRecord: [],
      playerRecord: [],
      winTips: false,
      loseTips: false,
      allRecord: false,
      errorTips: "",
      introduction: false,
      alert: true,
      totalTimes: 0,
      contact: false,
      headers: [
        {
          text: "Time",
          align: "center",
          sortable: false,
          value: "time"
        },
        {
          text: "LuckNum",
          align: "center",
          sortable: false,
          value: "result"
        },
        {
          text: "Bonus",
          align: "center",
          sortable: false,
          value: "bouns"
        },
        {
          text: "Player",
          align: "center",
          sortable: false,
          value: "address"
        }
      ],
      headers2: [
        {
          text: "Time",
          align: "center",
          sortable: false,
          value: "time"
        },
        {
          text: "LuckNum",
          align: "center",
          sortable: false,
          value: "result"
        },
        {
          text: "Bonus",
          align: "center",
          sortable: false,
          value: "bouns"
        },
        {
          text: "txHash",
          align: "center",
          sortable: false,
          value: "rollHash"
        }
      ],
      recordHeader: [
        {
          text: "Time",
          align: "center",
          sortable: false,
          value: "time"
        },
        {
          text: "LuckNum",
          align: "center",
          sortable: false,
          value: "result"
        },
        {
          text: "Bonus",
          align: "center",
          sortable: false,
          value: "bouns"
        },
        {
          text: "txHash",
          align: "center",
          sortable: false,
          value: "txHash"
        }
      ],
      rulesHeaders: [
        {
          text: "LuckNum",
          align: "center",
          sortable: false,
          value: "result"
        },
        {
          text: "Bonus",
          align: "center",
          sortable: false,
          value: "bonus"
        },
        {
          text: "Expect",
          align: "center",
          sortable: false,
          value: "expect"
        }
      ],
      rulesArray: [
        {
          range: "9999",
          bonus: "99% of Bonus Pool NAS",
          fixed: false,
          expect: 0.99
        },
        {
          range: "9998 - 9500",
          bonus: "15% of Bonus Pool NAS",
          fixed: false,
          expect: 0.15
        },
        {
          range: "9499 - 5000",
          bonus: "200% of Ticket NAS",
          fixed: true,
          expect: 0.0002
        },
        {
          range: "4999 - 0",
          bonus: "0",
          fixed: true,
          expect: 0
        }
      ]
    };
  },
  computed: {
    playerProfit() {
      let self = this;
      let playerProfitNum = 0;
      let count = 0;
      if (self.playerRecord) {
        if (self.playerRecord.length > 0) {
          for (let j = 0; j < self.playerRecord.length; j++) {
            self.playerRecord[j].bonus = Number(self.playerRecord[j].bonus);
            if (self.playerRecord[j].bonus > 0) {
              count += 1;
            }
            playerProfitNum += self.playerRecord[j].bonus;
          }
          playerProfitNum -= 0.001 * 1e18 * count;
        }
      }
      return playerProfitNum;
    }
  },
  methods: {
    roll() {
      let self = this;
      let options = {
        call: true,
        callFunction: "roll",
        value: 0.001,
        callArgs: "[]",
        successFunc: function(resp) {
          self.checking = true;
          console.log(resp);
          let hashOptions = {
            txhash: resp.txhash,
            successFunction: function(resp) {
              console.log(resp);
              self.TransactionStatus = resp.data.result.status;
              if (self.TransactionStatus == 2) {
                console.log("Retry····");
                for (var t = Date.now(); Date.now() - t <= 2000; );
                checkHash(hashOptions);
              }
              if (self.TransactionStatus == 1) {
                console.log(resp.data.result);
                console.log(resp.data.result.execute_result);
                self.resultInfos = JSON.parse(resp.data.result.execute_result);
                self.checking = false;
                self.paySuccess = true;
              }
              if (self.TransactionStatus == 0) {
                self.checking = false;
                self.errorDialog = true;
                self.errorTips = JSON.parse(resp.data.result.execute_result);
              }
            },
            errorFunction: function(error) {
              for (var t = Date.now(); Date.now() - t <= 2000; );
              self.errorDialog = true;
              self.checking = false;
            }
          };
          checkHash(hashOptions);
        }
      };
      nebRequest(options);
    },
    getPlayerInfos() {
      let self = this;
      let options = {
        call: false,
        callFunction: "forEach",
        value: 0,
        callArgs: '[" 100 +","+0 "]',
        successFunc: function(resp) {
          console.log(resp);
          self.AllPlayerInfos = JSON.parse(resp.result);
          console.log(self.AllPlayerInfos);
          console.log("goumaichhcs");
        }
      };
      nebRequest(options);
    },
    rollPlay() {
      let self = this;
      console.log(self.resultInfos);
      self.paySuccess = false;
      $(window).scrollTop(0);
      $(".num").css("backgroundPositionY", 0);
      let isBegin = false;
      let numImgHeight = $(".num").outerHeight(true);
      if (isBegin) return false;
      isBegin = true;
      function PrefixInteger(num, length) {
        return (Array(length).join("0") + num).slice(-length);
      }
      let result = self.resultInfos.LuckNum;
      console.log(result);
      result = PrefixInteger(result, 4);
      var num_arr = (result + "").split("");
      $(".num").each(function(index) {
        let innerIndex = index;
        var _num = $(this);
        setTimeout(function() {
          _num.animate(
            {
              backgroundPositionY: numImgHeight * (60 - num_arr[index])
            },
            {
              // duration: 500 + (3 - innerIndex) * 3000,
              duration: 10,
              easing: "easeInOutCirc",
              complete: function() {
                if (index == 0) {
                  self.getJackpotBalance();
                  self.getJackpotRecord();
                  self.getPlayerRecord();
                  self.getPlayerBalance();
                  if (self.resultInfos.Profit > 0) {
                    self.winTips = true;
                  } else if (self.resultInfos.Profit < 0) {
                    self.loseTips = true;
                  }
                  isBegin = false;
                }
              }
            }
          );
        }, 3 - innerIndex * 300);
      });
    },
    getPlayerBalance() {
      let self = this;
      axios({
        method: "post",
        url: "https://testnet.nebulas.io/v1/user/accountstate",
        data: {
          address: self.address
        }
      })
        .then(function(response) {
          console.log(response);
          self.playerBalance = response.data.result.balance / 1e18;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getJackpotBalance() {
      let self = this;
      let options = {
        call: false,
        callFunction: "checkBalance",
        value: 0,
        callArgs: "[]",
        successFunc: function(resp) {
          console.log(resp);
          self.jackpotBalance = JSON.parse(resp.result) / 1e18;
        }
      };
      nebRequest(options);
    },
    getJackpotRecord() {
      let self = this;
      let options = {
        call: false,
        callFunction: "forEach",
        value: 0,
        callArgs: '["' + 50000 + '","' + 0 + '"]',
        successFunc: function(resp) {
          console.log(resp);
          var compare = function(prop) {
            return function(obj1, obj2) {
              var val1 = obj1[prop];
              var val2 = obj2[prop];
              if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
              }
              if (val1 > val2) {
                return -1;
              } else if (val1 < val2) {
                return 1;
              } else {
                return 0;
              }
            };
          };
          console.log(JSON.parse(resp.result));
          self.allRollRecord = JSON.parse(resp.result);
          self.allRollRecord.sort(compare("rollTime"));
          for (let j = 0; j < self.allRollRecord.length; j++) {
            self.allRollRecord[j].rollTime = dayjs(
              dayjs(Number(self.allRollRecord[j].rollTime))
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          self.jackpotRecord = JSON.parse(resp.result);
          console.log(self.jackpotRecord);
          self.totalTimes = self.jackpotRecord.length;
          self.jackpotRecord.sort(compare("bonus"));
          if (self.jackpotRecord.length >= 5) {
            self.jackpotRecord.length = 5;
          }
          for (let j = 0; j < self.jackpotRecord.length; j++) {
            self.jackpotRecord[j].rollTime = dayjs(
              dayjs(Number(self.jackpotRecord[j].rollTime))
            ).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      };
      nebRequest(options);
    },
    getPlayerRecord() {
      let self = this;
      let options = {
        call: false,
        callFunction: "getPlayerInfos",
        value: 0,
        callArgs: "[]",
        successFunc: function(resp) {
          console.log(JSON.parse(JSON.parse(resp.result)));
          var compareTime = function(prop) {
            return function(obj1, obj2) {
              var val1 = obj1[prop];
              var val2 = obj2[prop];
              if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
              }
              if (val1 > val2) {
                return -1;
              } else if (val1 < val2) {
                return 1;
              } else {
                return 0;
              }
            };
          };
          self.playerRecord = JSON.parse(JSON.parse(resp.result));
          self.playerRecord.sort(compareTime("rollTime"));
          for (let j = 0; j < self.playerRecord.length; j++) {
            self.playerRecord[j].rollTime = dayjs(
              dayjs(Number(self.playerRecord[j].rollTime))
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          // self.jackpotRecord = JSON.parse(resp.result)
        }
      };
      nebRequest(options);
    },
    changeLang() {
      if (this.$i18n.locale === "zh-CN") {
        this.$i18n.locale = "en-US";
      } else {
        this.$i18n.locale = "zh-CN";
      }
    }
  },
  beforeMount() {
    let self = this;
    // self.getPlayerInfos()
    self.getJackpotBalance();
    self.getJackpotRecord();
    self.getPlayerRecord();
    window.postMessage(
      {
        target: "contentscript",
        data: {},
        method: "getAccount"
      },
      "*"
    );
    window.addEventListener("message", function(e) {
      if (e.data.data) {
        if (e.data.data.account) {
          self.address = e.data.data.account;
          self.getPlayerBalance();
          self.getJackpotRecord();
          console.log(self.address);
        }
      }
    });
  },
  mounted() {
    let numImgHeight = $(".num").outerHeight(true);
    if (numImgHeight >= 180) {
      $(".num").css("background-size", "auto auto");
    }
  }
};
</script>


<style scoped>
@media screen and (max-width: 480px) {
  .num_box {
    height: 130px !important;
    min-height: 130px !important;
  }
  .JackpotInfos {
    font-weight: 500 !important;
    font-size: 1.4rem !important;
    padding-bottom: 20px !important;
  }
  .gameTips {
    width: 80% !important;
    font-size: 1.2rem !important;
  }
  .gamecontract {
    display: none;
  }
}

@media screen and (max-width: 375px) {
  .rankCard {
    padding-top: 12vh !important;
  }
}

.application {
  font-family: "Quicksand", "PingFang SC", Arial, "Hiragino Sans GB", "Heiti SC",
    STXihei, "Microsoft YaHei", SimHei, "WenQuanYi Micro Hei";
  color: #f9f8fb;
}

.gameWrapper {
  /* background: url(./assets/ball.png) center center repeat #7336f1; */
  background: #fb6853;
  height: 100%;
}

.gameTitle {
  font-size: 3rem;
  color: #fff;
}

.mineInfosWrapper {
  display: flex;
  width: 100%;
  justify-content: space-around;
  position: fixed;
  bottom: 20px;
}
.playerInfosWrapper {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.shopArea {
  width: 80%;
}

.numWrapper {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.num_box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(./assets/num_bg.png) center center no-repeat;
  background-size: 70%;
  /* height: 382px; */
  height: 302px;
  width: 864px;
}

.num {
  background: url(./assets/num1.png) top center repeat-y;
  /* background-size: 100%; */
  background-size: calc(70vw / 6) auto;
  max-width: 110px;
  width: calc(70vw / 6);
  max-height: 180px;
  height: calc(70vw / 6 / 0.6);
  /* margin-right: 16px; */
}

.bottomCard {
  margin-top: 1.5vh;
  height: 100%;
}

.bottom {
  height: 60%;
  padding-bottom: 10vh;
}

.playerInfos {
  text-align: center;
}

.playerAddress {
  padding-top: 2vh;
}

.playGame {
  display: flex;
  /* justify-content: center; */
  flex-direction: column;
  align-items: center;
}

.checkingDialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.successDialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.errorDialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.betRecord {
  text-align: center;
  font-weight: 500;
}

.playerBalance {
  padding-top: 10px;
}

.cardArea {
  height: 330px !important;
}

.playerTitle {
  font-weight: 500;
  font-size: 1.3rem;
}

.JackpotInfos {
  font-weight: 500;
  font-size: 1.6rem;
  padding-bottom: 20px;
}

.gameTips {
  padding-top: 10px;
  text-align: center;
  width: 60%;
  font-size: 1rem;
}

.gameFooter {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 5px;
}

.footerWrappe {
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poolInfos {
  font-size: 1.3rem;
  font-weight: 500;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}

.playerBtn {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.contactDialog {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.introductionDialog {
  font-size: 1.1rem !important;
  font-weight: 400;
  text-align: center;
}
</style>

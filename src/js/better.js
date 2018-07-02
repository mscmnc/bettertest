App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,


  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    App.displayAccountInfo();
    App.initContract2();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            balance2 = web3.fromWei(balance, "ether");
            maths = (Math.round(balance2 * 100)/100).toFixed(2);
            $('#accountBalance').text(maths + " ETH");
          }
        })
      }
    });
  },

  initContract: function() {
    $.getJSON('BetterToken.json', function(betterTokenArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.BetterToken = TruffleContract(betterTokenArtifact);
      // set the provider for our contracts
      App.contracts.BetterToken.setProvider(App.web3Provider);

      App.displayTokenBalance();
      return App.displayTokenBalance();
     });
  },

  initContract2: function() {
    $.getJSON('shortICO.json', function(shortICOArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.shortICO = TruffleContract(shortICOArtifact);
      // set the provider for our contracts
      App.contracts.shortICO.setProvider(App.web3Provider);
      App.amountRaised();
      return App.amountRaised();
      // retrieve the article from the contract
        });
  },

  displayTokenBalance: function() {
     App.contracts.BetterToken.deployed().then(function(instance) {
       betterTokenInstance = instance;
       return betterTokenInstance.balanceOf(App.account);
     }).then(function(result) {
       $('#tokenBalance').text(result);
     }).catch(function(err) {
       console.log(err.message);
     });
   },

   amountRaised: function() {
      App.contracts.shortICO.deployed().then(function(instance) {
        shortICOInstance = instance;
        return shortICOInstance.amountRaised();
      }).then(function(result) {
        result2 = web3.fromWei(result, "ether");
        result3 = (Math.round(result2 * 100)/100).toFixed(2);
        $('#amountRaised').text(result3);
      }).catch(function(err) {
        console.log(err.message);
      });
    },


buyToken: function() {
       var amount = parseInt(document.getElementById("inputAmountBuyToken").value);

       var tokenInstance;
       return App.contracts.BetterToken.deployed().then(function(instance) {
         betterTokenInstance = instance;
         return betterTokenInstance.buy({from: App.account, value: web3.toWei(amount, "ether"), gas: 400000 });
       }).then(function() {
         App.setStatus("BuyToken process is completed!");
       }).catch(function(e) {
         console.log(e);
      });
     },

sendToken: function() {
       var amount = parseInt(document.getElementById("inputAmountSendToken").value);
       var receiver = document.getElementById("inputWalletAddress").value;

       var tokenInstance;
       return App.contracts.BetterToken.deployed().then(function(instance) {
         betterTokenInstance = instance;
         return betterTokenInstance.transfer(receiver, amount, {from: App.account, gas: 400000});
       }).then(function() {
         App.setStatus("Transaction complete!");
       }).catch(function(e) {
         console.log(e);
      });
     },



     donate: function() {
            var amount = parseInt(document.getElementById("inputAmountETH").value);
            
            return App.contracts.shortICO.deployed().then(function(instance) {
              shortICOInstance = instance;
              return shortICOInstance.donate(App.account, {value: web3.toWei(amount, "ether"), gas: 400000 });
            }).then(function() {
              App.setStatus("Donate complete!");
            }).catch(function(e) {
              console.log(e);
           });
          },


}, // app over

$(function() {
  $(window).load(function() {
    App.init();
  });
});

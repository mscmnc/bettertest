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

    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
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
      // listen to events
      App.displayTokenBalance();
      return App.displayTokenBalance();
      // retrieve the article from the contract
        });
  },

  displayTokenBalance: function() {
     App.contracts.BetterToken.deployed().then(function(instance) {
       betterTokenInstance = instance;
       return betterTokenInstance.balanceOf("0x41C564b48bCEf2E787C36b90d608824177027b39");
     }).then(function(result) {
       $('#tokenBalance').text(result);
     }).catch(function(err) {
       console.log(err.message);
     });
   },


/*   updateTokenBalance: function () {
       var tokenInstance;
       TokenContract.deployed().then(function (instance) {
           tokenInstance = instance;
           return tokenInstance.balanceOf.call(account);
       }).then(function (value) {
           console.log(value);
           var balance_element = document.getElementById("balanceTokenInToken");
           balance_element.innerHTML = value.valueOf();
       }).catch(function (e) {
           console.log(e);
           App.setStatus("Error getting balance; see log.");
       });
   },





*/




buyToken: function() {
       var amount = parseInt(document.getElementById("inputAmountBuyToken").value);

       var tokenInstance;
       return App.contracts.BetterToken.deployed().then(function(instance) {
         betterTokenInstance = instance;
         return betterTokenInstance.buy(amount, {from: App.account, gas: 4000000});
       }).then(function() {
         App.setStatus("Transaction complete!");
         App.updateTokenBalance();
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
         return betterTokenInstance.transfer(receiver, amount, {from: App.account, gas: 4000000});
       }).then(function() {
         App.setStatus("Transaction complete!");
         App.updateTokenBalance();
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

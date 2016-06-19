var StateMachine = require('../')
var menu = new StateMachine();

menu.on('>primary', function(a) {
  console.log('old state: ' +  menu.getOldState())
  console.log('pPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPrimary.');
});

menu.on('primary>secondary', function() {
  console.log('State from primary to secondary.');
});
menu.on('secondary>primary', function() {
  console.log('State from secondary to primary.');
});

menu.on('>secondary', function(){
  console.log('secondaryyyyyyyyyyyyyyyyyyyyyyyyyyy');
})
menu.on('secondary>tertiary', function() {
  console.log('State from secondary to tertiary.');
});

menu.on('tertiary>tertiaryOpen', function() {
  console.log('State from tertiary to tertiaryOpen.');
});

menu.on('tertiaryOpen>primary', function() {
  console.log('State from tertiaryOpen to primary.');
});

menu.on('primary>tertiaryOpen', function() {
  console.log('State from primary to tertiaryOpen.');
});

menu.on('secondary>tertiaryOpen', function() {
  console.log('State from secondary to tertiaryOpen.');
});

menu
    .setState('primary', 'zzz')
    .setState('primary', 'zzz')
    .setState('primary', 'zzz')
    .setState('secondary')
    .setState('primary')
    .setState('tertiary')
    .setState('tertiaryOpen')
    .setState('secondary')
    .setState('tertiary')
console.log('current state: ' + menu.getState())
menu
    .setState('primary', 'zzz')
    .setState(null)
console.log('current state: ' + menu.getState())
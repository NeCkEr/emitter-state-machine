var StateMachine = require('../')
var stm = new StateMachine();


stm.on('>foo', function(a) {
  console.log('old state: ' +  stm.getOldState())
  console.log('State changed to FOO.');
});

stm.on('bah>foo', function() {
  console.log('State from BAH to FOO.');
});

stm.on('foo>bah', function() {
  console.log('State from FOO to BAH.');
});

stm.on('foo>', function() {
  console.log('State changed FROM FOO.');
});


// stm.on('change', function(a) {
//   console.log('changed.');
// //  console.log(a);
// });




stm
    .setState('foo')
    .setState('bah')
    .setState('foo')

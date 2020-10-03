/**
 * RDBS のように ID が自動インクリメントされる NeDB になっているか確認
 * 
 * # enumerate
 * $ node tests/nedb.js
 * 
 * # insert
 * $ node tests/nedb.js <name:string>
 * 
 * # update
 * $ node tests/nedb.js <id:number> <name:string>
 * 
 * # remove
 * $ node tets/nedb.js <id:number>
 */
const nedb = require('../@server/lib/nedb')

if (process.argv.length > 3) {
  // update
  nedb('testdata').update({id: parseInt(process.argv[2], 10)}, {$set: {name: process.argv[3]}})
    .then(res => {
      console.log('[updated]', res)
    })
} else if (process.argv.length > 2) {
  const name = process.argv[2]
  const id = parseInt(name)
  if (isNaN(id)) {
    // insert
    nedb('testdata').insert({name}).then(res => {
      console.log('[inserted', res)
    })
  } else {
    // remove
    nedb('testdata').remove({id}).then(res => {
      console.log('[removed]', res)
    })
  }
} else {
  nedb('testdata').find({$sort: {id: 1}}).then(res => {
    console.log(res)
  })
}
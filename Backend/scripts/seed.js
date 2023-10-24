const db = require('../db')

;(async () => {
  try {
    await db('users').insert({ username: 'Admin',password: 'admin', name: 'AdminUser' })
    console.log('Added dummy users!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()

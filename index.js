const { Pool } = require('pg')

const config = {
  user: 'postgres',
  password: '123123123',
  host: 'localhost',
  database: 'banco'
}
  
const pool = new Pool(config)
 
pool.connect((err, client, release) => {
  if(err) {
    console.error('ERROR')
  } else {
    const resultado = "SELECT * FROM cuentas"
    client.query(resultado,(err, results)=>{
      if(err) {
        console.error('ERROR')
      } else {
        console.log(results.rows)
        release()
        pool.end()
      }
    })
  }
})
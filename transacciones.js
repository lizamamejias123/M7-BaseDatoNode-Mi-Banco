const { Pool } = require('pg')
const Cursor = require('pg-cursor')

const config = {
  user: 'postgres',
  password: '123123123',
  host: 'localhost',
  database: 'banco'
}

const pool = new Pool(config)
const [transaccionTipo, cuenta, fecha, descripcion, monto] = process.argv.slice(2)

pool.connect(async(err, cliente, release) => {
  if(err){
    return console.error(err.code)
  }
  if(transaccionTipo === 'nueva_transaccion') {
    await nuevaTransaccion(cliente)
  }
  if(transaccionTipo === 'transacciones') {
    await transacciones(cliente)
  }
  release()
  pool.end()
})
const nuevaTransaccion = async(cliente) => {
  const from = {
    text: 'UPDATE cuentas SET balance = balance - $1 WHERE id = $2',
    values: [monto, cuenta]
  }
  const to = {
    text: 'INSERT INTO transacciones (descripcion, fecha, monto, cuentaID) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [descripcion, fecha, monto, cuenta]
  }
  try {
    await cliente.query('BEGIN')
    await cliente.query(from)
    const result = await cliente.query(to)
    await cliente.query('COMMIT')
    console.log('éxito')
  } catch(error) {
    await cliente.query('ROLLBACK')  
    console.error(error)
  }
}
const transacciones = async(cliente) => {
  const cursor = await cliente.query(new Cursor(`SELECT * FROM transacciones WHERE cuentaId = ${cuenta}`))
  cursor.read(10, (err) => {
    if(err){
      return console.error(err)
    } else {
      console.log(`${cuenta}`)
    }
  })
}
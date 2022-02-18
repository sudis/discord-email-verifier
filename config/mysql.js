const settings = require("../config/settings.json")
const chalk = require("chalk")
const dayjs = require("dayjs");
const mysql = require("mysql2")

const con = (global.con = mysql.createConnection({
  host: settings.mysqlDefs.host,
  user: settings.mysqlDefs.user,
  password: settings.mysqlDefs.password,
  database: settings.mysqlDefs.dbName,
}));

con.connect((err) => {
  if (err) throw err;
  console.log(
    chalk.bgWhite.black(
      `[${dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss")}]`
    ) + chalk.greenBright(` Connected to MySQL database.`)
  );
});

const pool = mysql.createPool({
  host: settings.mysqlDefs.host,
  user: settings.mysqlDefs.user,
  password: settings.mysqlDefs.password,
  database: settings.mysqlDefs.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10
})

module.exports.con = con;
module.exports.pool = pool;

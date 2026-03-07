
const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root",
  database: "ecommerce"
})

app.get("/products",(req,res)=>{
  db.query("SELECT * FROM products",(err,result)=>{
    if(err) throw err
    res.json(result)
  })
})

app.post("/products",(req,res)=>{
  const {name,price,stock}=req.body
  db.query("INSERT INTO products(name,price,stock) VALUES (?,?,?)",
  [name,price,stock],(err)=>{
    if(err) throw err
    res.json({message:"product created"})
  })
})

app.delete("/products/:id",(req,res)=>{
  db.query("DELETE FROM products WHERE id=?",[req.params.id],(err)=>{
    if(err) throw err
    res.json({message:"deleted"})
  })
})

app.listen(5000,()=>console.log("product service running"))

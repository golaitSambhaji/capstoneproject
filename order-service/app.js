
const express=require("express")
const mysql=require("mysql2")
const cors=require("cors")

const app=express()
app.use(express.json())
app.use(cors())

const db=mysql.createConnection({
 host:"mysql",
 user:"root",
 password:"root",
 database:"ecommerce"
})

app.get("/orders",(req,res)=>{
 db.query("SELECT * FROM orders",(err,result)=>{
   if(err) throw err
   res.json(result)
 })
})

app.post("/orders",(req,res)=>{
 const {product_id,quantity}=req.body

 db.query("INSERT INTO orders(product_id,quantity,status) VALUES (?,?,?)",
 [product_id,quantity,"CREATED"],(err)=>{
   if(err) throw err
   res.json({message:"order created"})
 })
})

app.listen(5001,()=>console.log("order service running"))

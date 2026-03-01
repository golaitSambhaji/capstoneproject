
import React,{useEffect,useState} from "react"
import axios from "axios"

function App(){

const [products,setProducts]=useState([])
const [orders,setOrders]=useState([])

const [name,setName]=useState("")
const [price,setPrice]=useState("")
const [stock,setStock]=useState("")

const loadProducts=async()=>{
 const res=await axios.get("http://localhost:5000/products")
 setProducts(res.data)
}

const loadOrders=async()=>{
 const res=await axios.get("http://localhost:5001/orders")
 setOrders(res.data)
}

useEffect(()=>{
 loadProducts()
 loadOrders()
},[])

const addProduct=async()=>{
 await axios.post("http://localhost:5000/products",{name,price,stock})
 loadProducts()
}

const createOrder=async(id)=>{
 await axios.post("http://localhost:5001/orders",{product_id:id,quantity:1})
 loadOrders()
}

return(
<div style={{padding:40}}>
<h2>Ecommerce Platform</h2>

<h3>Add Product</h3>

<input placeholder="name" onChange={e=>setName(e.target.value)}/>
<input placeholder="price" onChange={e=>setPrice(e.target.value)}/>
<input placeholder="stock" onChange={e=>setStock(e.target.value)}/>

<button onClick={addProduct}>Add</button>

<h3>Products</h3>
<ul>
{products.map(p=>(
<li key={p.id}>
{p.name} ₹{p.price} stock:{p.stock}
<button onClick={()=>createOrder(p.id)}>Order</button>
</li>
))}
</ul>

<h3>Orders</h3>
<ul>
{orders.map(o=>(
<li key={o.id}>
Order #{o.id} product:{o.product_id}
</li>
))}
</ul>

</div>
)
}

export default App

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const stripe=require("stripe")('sk_test_51IeJs3IsGe0VEPFzEX1ayUZbX7AgDH6a79yD2kmSg5Oj5xcC77rTBZlsV41TiaNQ6AGbUHYiBGxA9xrOWD1ISTsU00oHvHF68F');

const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwekjxf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const productCollection = client.db("AdidasBD_DB").collection("products");
const addProduct = client.db("AdidasBD_DB").collection("add_products");
const sellerList=client.db("AdidasBD_DB").collection("sellerList");
const orderDetails=client.db("AdidasBD_DB").collection("orderDetails");
const orderAddress=client.db("AdidasBD_DB").collection("orderAddress");
const profileSection=client.db('AdidasBD_DB').collection("profilesection");
const admin=client.db('AdidasBD_DB').collection("admin");
const femaleCollection=client.db('AdidasBD_DB').collection("femaleCollection");
const maleCollection=client.db('AdidasBD_DB').collection("maleCollection");
const MensSneaker=client.db('AdidasBD_DB').collection('MensSneaker')
const MensPant=client.db('AdidasBD_DB').collection('MensPant')
const MensBots=client.db('AdidasBD_DB').collection('MensBots')
const BagCollection=client.db('AdidasBD_DB').collection('Bag')
const CapCollection=client.db('AdidasBD_DB').collection('Cap')
const BottleCollection=client.db('AdidasBD_DB').collection('Bottle')

app.post("/userprofile", async (req, res) => {
  const newUser = req.body;
  const result = await profileSection.insertOne(newUser);
  console.log("added new user", newUser);
  res.send(result);
});
app.get("/userlist", async (req, res) => {
  const email = req.query.email;
 
  const query = { email: email };
  const cursor = profileSection.find(query);
  const user = await cursor.toArray();

  res.send(user);
});
app.get('/orderlistsingle',async (req,res)=>{
  const email = req.query.email;
  
  const query = { email: email };
  const cursor =orderDetails.find(query);
  const orderlist = await cursor.toArray();

  res.send(orderlist);

 })



app.get("/userlists", async (req, res) => {
   const query = {};
  const cursor = profileSection.find(query);
  const users = await cursor.toArray();
  res.send(users);
});



app.get("/products", async (req, res) => {
  const query = {};
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);
  console.log(page, size);
  const cursor = productCollection.find(query);
  const products = await cursor
    .skip(page * size)
    .limit(size)
    .toArray();
  const count = await productCollection.estimatedDocumentCount();
  res.send({ count, products });
});



app.get("/searchproducts", async (req, res) => {
  
  const search=req.query.search;

  const query = {
    $text:{
      $search :search
    }
  }
  console.log(search)
  
  const cursor = productCollection.find(query);
 const products = await cursor.toArray();
 res.send(products);
});

app.post('/admin',async(req,res)=>{

  const newAdmin=req.body;
  const result=await admin.insertOne(newAdmin);
  console.log('added new admin',newAdmin);
  res.send(result);

 })
 app.get('/admin',async(req,res)=>{

  const query={};
  const cursor=admin.find(query);
  const admins=await cursor.toArray();
 // console.log(users);
  res.send(admins);

 })

 app.post('/isAdmin',async(req,res)=>{
  const email=req.body.email;
  admin.find({email:email}).toArray((err,document)=>
  {
   res.send(document.length >0);
  })
  console.log(email)
  
  });

app.post("/addproducts", async (req, res) => {
  const newProduct = req.body;
  const result = await addProduct.insertOne(newProduct);
  console.log("added new product", newProduct);
  res.send(result);
});

app.get("/addproducts", async (req, res) => {
  const email = req.query.email;
 
  const query = { email: email };
  const cursor = addProduct.find(query);
  const products = await cursor.toArray();

  res.send(products);
});
app.get('/addproducts/:id',async(req,res) => {
   const id=req.params.id;
   const query={_id:new  ObjectId(id)};
   const result=await addProduct.findOne(query);
  res.send(result);

 })

app.delete("/addproducts/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await addProduct.deleteOne(query);
  res.send(result);
});

app.delete("/admin/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await admin.deleteOne(query);
  res.send(result);
});

app.delete("/orderdetails/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await orderDetails.deleteOne(query);
  res.send(result);
});

app.delete("/orderlistsingle/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await orderDetails.deleteOne(query);
  res.send(result);
});



app.post("/seller", async (req, res) => {
  const newSeller = req.body;
  const result = await sellerList.insertOne(newSeller);
  console.log("added new seller", newSeller);
  res.send(result);
});

app.get("/sellerlist",async (req,res)=>{
   const query = {};
   const cursor = sellerList.find(query);
  const sellers = await cursor.toArray();
  res.send(sellers);
})


app.post("/productsByIds", async (req, res) => {
  const productCollection = client.db("AdidasBD_DB").collection("products");
  const ids = req.body;
  const objectIds = ids.map((id) => new ObjectId(id));
  const query = { _id: { $in: objectIds } };

  const cursor = productCollection.find(query);
  const products = await cursor.toArray();
  res.send(products);
});



app.post('/orderdetails',async(req,res)=>{
    
  const newOrders=req.body;
  const result=await orderDetails.insertOne(newOrders);
  console.log('added new orderDetails',newOrders);
  res.send(result);

 })

 app.get('/orderdetails',async (req,res)=>{
  const query={};
  const cursor=orderDetails.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })

 app.post('/orderaddress',async(req,res)=>{
    
  const newOrders=req.body;
  const result=await orderAddress.insertOne(newOrders);
  console.log('added new orderAddress',newOrders);
  res.send(result);

 })

 app.get('/orderaddress',async (req,res)=>{
    

  const query={};
  const cursor=orderAddress.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })
 app.get('/femalecollection',async (req,res)=>{
    

  const query={};
  const cursor=femaleCollection.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })
 app.get('/malecollection',async (req,res)=>{
    

  const query={};
  const cursor=maleCollection.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })

 
 app.get('/categories_mansshoes',async (req,res)=>{
  const query={};
  const cursor=MensSneaker.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })
 app.get('/categories_manspants',async (req,res)=>{
  const query={};
  const cursor=MensPant.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })
 app.get('/categories_mansbots',async (req,res)=>{
  const query={};
  const cursor=MensBots.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })
 app.get('/categories_bag',async (req,res)=>{
  const query={};
  const cursor=BagCollection.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })
 app.get('/categories_cap',async (req,res)=>{
  const query={};
  const cursor=CapCollection.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })

 app.get('/categories_bottle',async (req,res)=>{
  const query={};
  const cursor=BottleCollection.find(query);
  const users=await cursor.toArray();
  res.send(users);

 })


























app.get("/", async (req, res) => {
  res.send("coneected");
});

app.listen(port, () => {
  console.log(`running on port: ${port}`);
});

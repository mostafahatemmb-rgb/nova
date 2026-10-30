const U=`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN}`,H={"Content-Type":"application/json","X-Master-Key":process.env.JSONBIN_KEY};
const rec=async()=>(await(await fetch(U+"/latest",{headers:H})).json()).record||{};
module.exports=async(req,res)=>{
if(!process.env.ADMIN_PIN||req.headers["x-pin"]!==process.env.ADMIN_PIN)return res.status(401).json({error:"pin"});
try{if(req.method==="GET")return res.json(await rec());
if(req.method==="POST"){const b=typeof req.body==="string"?JSON.parse(req.body):req.body,x=await fetch(U,{method:"PUT",headers:H,body:JSON.stringify(b)});return res.status(x.ok?200:502).json({ok:x.ok})}
res.status(405).end()}catch(e){res.status(500).json({error:"failed"})}};

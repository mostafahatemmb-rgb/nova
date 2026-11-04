const B="https://api.jsonbin.io/v3/b",U=`${B}/${process.env.JSONBIN_BIN}`,H={"Content-Type":"application/json","X-Master-Key":process.env.JSONBIN_KEY};
const rec=async()=>(await(await fetch(U+"/latest",{headers:H})).json()).record||{};
const put=r=>fetch(U,{method:"PUT",headers:H,body:JSON.stringify(r)});
module.exports=async(req,res)=>{
if(!process.env.ADMIN_PIN||req.headers["x-pin"]!==process.env.ADMIN_PIN)return res.status(401).json({error:"pin"});
res.setHeader("Cache-Control","no-store");
try{if(req.method==="GET")return res.json(await rec());
if(req.method!=="POST")return res.status(405).end();
const b=typeof req.body==="string"?JSON.parse(req.body):req.body||{},op=(req.query&&req.query.op)||"";
if(op==="img"){const d=b.d;if(typeof d!=="string"||!/^data:image\/jpeg;base64,/.test(d)||d.length>140000)return res.status(400).json({error:"bad image"});
const x=await fetch(B,{method:"POST",headers:{...H,"X-Bin-Private":"true","X-Bin-Name":"nova-photo"},body:JSON.stringify({d})});
if(!x.ok)return res.status(502).json({error:"photo storage refused: "+(await x.text()).slice(0,120)});
const j=await x.json();return res.json({id:j.metadata.id})}
if(op==="cfg"){const r=await rec();for(const k of["products","categories","offers","settings"])if(Array.isArray(b[k]))r[k]=b[k];const x=await put(r);return res.status(x.ok?200:502).json({ok:x.ok})}
if(op==="addOrder"){const r=await rec();r.orders=r.orders||[];if(b.order)r.orders.push(b.order);const x=await put(r);return res.status(x.ok?200:502).json({ok:x.ok})}
if(op==="delOrder"){const r=await rec();r.orders=(r.orders||[]).filter(o=>o.id!==b.id);const x=await put(r);return res.status(x.ok?200:502).json({ok:x.ok})}
return res.status(400).json({error:"op"})}catch(e){res.status(500).json({error:"failed"})}};

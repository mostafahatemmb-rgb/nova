const U=`https://api.jsonbin.io/v3/b/`,H={"X-Master-Key":process.env.JSONBIN_KEY};
module.exports=async(req,res)=>{try{const id=String((req.query&&req.query.id)||"");if(!/^[0-9a-f]{24}$/.test(id))return res.status(400).end();
const x=await fetch(U+id+"/latest",{headers:H});if(!x.ok)return res.status(404).end();
const d=((await x.json()).record||{}).d||"";const m=/^data:(image\/jpeg);base64,(.+)$/.exec(d);if(!m)return res.status(404).end();
res.setHeader("Content-Type",m[1]);res.setHeader("Cache-Control","public, max-age=31536000, s-maxage=31536000, immutable");
res.end(Buffer.from(m[2],"base64"))}catch(e){res.status(500).end()}};

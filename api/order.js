const U=`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN}`,H={"Content-Type":"application/json","X-Master-Key":process.env.JSONBIN_KEY};
const rec=async()=>(await(await fetch(U+"/latest",{headers:H})).json()).record||{};
const GOV=["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qalyubia", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharqia", "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"];
module.exports=async(req,res)=>{if(req.method!=="POST")return res.status(405).end();
try{const b=typeof req.body==="string"?JSON.parse(req.body):req.body||{},s=v=>String(v||"").slice(0,200),dg=v=>String(v||"").replace(/\D/g,"");
if(!s(b.name).trim()||!s(b.address).trim()||!GOV.includes(b.gov)||dg(b.phone).length<10||dg(b.phone2).length<10||dg(b.phone)===dg(b.phone2))return res.status(400).json({error:"invalid"});
const r=await rec();r.orders=r.orders||[];
const pm=(r.settings||[]).find(x=>x.key==="payment")||{cod:true},okp=["cod"].concat(pm.insta?["insta"]:[],pm.wallet?["wallet"]:[]),pay=okp.includes(b.pay)?b.pay:"cod",shot=typeof b.shot==="string"&&/^data:image\/[a-z+.-]+;base64,/i.test(b.shot)&&b.shot.length<4e6?b.shot:"";
if(pay!=="cod"&&!shot)return res.status(400).json({error:"screenshot"});
const dpo=(r.settings||[]).find(x=>x.key==="deposit");if(pay==="cod"&&dpo&&dpo.on&&!shot)return res.status(400).json({error:"deposit"});
const sh=(r.settings||[]).find(x=>x.key==="shipping")||{def:50,fees:{}},ship=Number(sh.fees&&sh.fees[b.gov]!=null?sh.fees[b.gov]:sh.def)||0;
const pr=r.products||[],at=Date.now(),oid=s(b.oid)||"o"+at,lines=[];let k=0,sum=0;
for(const i of(b.items||[]).slice(0,30)){const p=pr.find(x=>String(x.id)===String(i.id)),q=Math.max(1,Math.min(50,parseInt(i.q)||1));if(!p)continue;
if(p.soldOut||(p.offSizes||[]).includes(i.size)||(p.offColors||[]).includes(i.color))return res.status(409).json({error:"unavailable",item:p.name});
const o=(r.offers||[]).filter(x=>String(x.pid)===String(p.id)&&x.pct).sort((a,b)=>b.pct-a.pct)[0],t=(o?Math.round(p.price*(1-o.pct/100)):p.price)*q,idx=k++;sum+=t;
lines.push("- "+p.name+(i.color?" ("+s(i.color)+")":"")+(i.size?" "+s(i.size):"")+" x"+q+" = "+t+" EGP");
r.orders.push({id:oid+"_"+idx,oid,at,name:s(b.name),gov:b.gov,address:s(b.address),phone:s(b.phone),phone2:s(b.phone2),item:p.name,qty:q,total:t,cat:p.cat||"",pay,shot:!!shot,color:s(i.color),size:s(i.size),ship:idx==0?ship:0})}
if(!k)return res.status(400).json({error:"empty"});
const w=await fetch(U,{method:"PUT",headers:H,body:JSON.stringify(r)});
const msg="New Nova order\n"+lines.join("\n")+"\n\nProducts: "+sum+" EGP\nShipping: "+ship+" EGP\nTotal: "+(sum+ship)+" EGP\n\nName: "+s(b.name)+"\nGovernorate: "+b.gov+"\nAddress: "+s(b.address)+"\nPhone: "+s(b.phone)+"\nPhone 2: "+s(b.phone2)+"\nPayment: "+({insta:"InstaPay",wallet:pm.walletName||"Digital wallet"}[pay]||"Cash on delivery")+(pay==="cod"&&shot?"\nDeposit: transfer photo sent":"");
let notified=false;
if(process.env.TELEGRAM_BOT_TOKEN&&process.env.TELEGRAM_CHAT_ID){try{const x=await fetch("https://api.telegram.org/bot"+process.env.TELEGRAM_BOT_TOKEN+"/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:process.env.TELEGRAM_CHAT_ID,text:msg})});notified=x.ok}catch(e){}}
if(shot&&process.env.TELEGRAM_BOT_TOKEN&&process.env.TELEGRAM_CHAT_ID){try{const fd=new FormData();fd.append("chat_id",process.env.TELEGRAM_CHAT_ID);fd.append("caption",(pay==="cod"?"Deposit":"Payment")+" screenshot - "+s(b.name)+" - "+(sum+ship)+" EGP");fd.append("photo",new Blob([Buffer.from(shot.split(",")[1],"base64")],{type:"image/jpeg"}),"payment.jpg");await fetch("https://api.telegram.org/bot"+process.env.TELEGRAM_BOT_TOKEN+"/sendPhoto",{method:"POST",body:fd})}catch(e){}}
if(process.env.CALLMEBOT_PHONE&&process.env.CALLMEBOT_KEY){try{const x=await fetch("https://api.callmebot.com/whatsapp.php?phone="+encodeURIComponent(process.env.CALLMEBOT_PHONE)+"&text="+encodeURIComponent(msg)+"&apikey="+encodeURIComponent(process.env.CALLMEBOT_KEY));notified=notified||x.ok}catch(e){}}
if(!w.ok&&!notified)return res.status(502).json({error:"failed"});
res.json({ok:true,notified})}catch(e){res.status(500).json({error:"failed"})}};

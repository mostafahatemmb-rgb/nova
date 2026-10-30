NOVA - setup (5 steps, same idea as Lamma)
1. jsonbin.io: make a free account, create a bin with this content:
   {"products":[],"orders":[],"categories":[]}
   Copy the API key and the Bin ID.
2. GitHub: upload the two folders (store and admin) into a repo, for example mostafabrands.
3. Vercel: New Project, import that repo, set Root Directory to store, Deploy. Do it again for admin (second project).
4. Vercel > each project > Settings > Environment Variables, then Redeploy:
   store project: JSONBIN_KEY, JSONBIN_BIN, WHATSAPP (your number with country code, digits only)
   admin project: JSONBIN_KEY, JSONBIN_BIN, ADMIN_PIN (choose a PIN)
5. Open the admin link, enter the PIN, tap "Load starter catalog", then set prices, categories and photos.
The keys stay on the server, nobody can see them in the page. Orders open in your WhatsApp and are saved to the bin for the sales graph.
Photos: put image files in the store folder (for example store/images/tee.jpg) and type /images/tee.jpg in the admin Photo URL box.

AUTOMATIC WHATSAPP ORDERS (CallMeBot)
With this on, the order reaches your WhatsApp by itself, the customer does not have to press send.
1. On callmebot.com open the WhatsApp page and follow it: you send them one WhatsApp message from your phone and they reply with your API key.
2. In the Vercel store project add two more variables, then Redeploy:
   CALLMEBOT_PHONE = your number with country code (as shown on the callmebot page)
   CALLMEBOT_KEY = the key they sent you
If these are not set, or CallMeBot is down, the store falls back to opening WhatsApp for the customer.

OFFERS AND NOTIFICATION (admin)
Offers tab: pick a product, write the offer text, optionally a % off. It shows above the big NOVA word on the home page and the discounted price is used at checkout.
Notification tab: the message customers must confirm in a pop-up before their order is sent.
Changes appear in the store within about 15 seconds.

PAYMENT (admin > Payment tab)
Cash on delivery, InstaPay and a digital wallet (for example Vodafone Cash). Fill in the InstaPay address and/or wallet number and tap Save; an empty field turns that method off.
The customer picks a method at checkout. For InstaPay or wallet they see the amount and your details, then after ordering a button opens WhatsApp so they can send you the payment screenshot. The order message you receive shows the payment method.
Payments are manual: there is no automatic payment check, so confirm the screenshot before delivering.

SHOP, CHECKOUT AND SHIPPING
Shop shows name and price only. Tapping a product opens its page with color, size and Add to cart. Set each product's colors and sizes (comma separated) in the admin Catalog tab.
Checkout asks: full name, governorate (list of all 27), address, phone, another phone (must be different). Under it the customer sees Products, Shipping and Total.
Admin > Shipping: set the Cairo fee and one fee for all other governorates.
Confirm order: the order is saved and CallMeBot sends the details to the owner's WhatsApp. WhatsApp is not opened on the customer's phone. (Needs CALLMEBOT_PHONE and CALLMEBOT_KEY on the store project.)

ADMIN LAYOUT (3 tabs)
1. Sales: month picker, graph, best sellers, by category, orders list.
2. Notes, offers & payment: checkout notification, offers, payment methods, shipping fees.
3. Products: add a product with price, sizes and colors; each product has its own sizes and colors. Tap a size or color to mark it unavailable, tick Sold out, edit name/price/category/photo any time. Categories are at the bottom.
The store hides Add to cart for sold-out products and disables unavailable sizes and colors; the server also refuses orders for them.

LANGUAGE
The first time someone opens the store or the admin, they choose English or Arabic. It is remembered, and a button at the top changes it later. Arabic switches the whole page to right-to-left. Product names, offer texts and notifications that the owner types are shown exactly as typed, so write them in the language the customers use. The order message CallMeBot sends the owner is always in English.

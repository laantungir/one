

import objFollows from './follows.json' assert {type: 'json'};

//////////////////////////////////////////////////////////////////////
// VARIABLES
//////////////////////////////////////////////////////////////////////

const Now = Math.floor(Date.now() / 1000)
const DayAgo = Now - ( 60 * 60 * 24)
const WeekAgo = Now - ( 60 * 60 * 24 * 7)
const MonthAgo = Now - ( 60 * 60 * 24 * 30)
const YearAgo = Now - ( 60 * 60 * 24 * 365)

// NOSTR variables

const nsecHex = `26bd69f759b4394df0dd34e252bfd0cf2a402a7f9c0987e0c4efa509c477a3a7`
const nsec = `nsec1y67kna6eksu5muxaxn39907seu4yq2nlnsyc0cxya7jsn3rh5wns5ywwqk`

const npubHex = `2f6bb31e5939a3a57f27246fbf16de14357a12c3a931dfc0da0e84012f5f6352`
const npub = `npub19a4mx8je8x362le8y3hm79k7zs6h5ykr4ycalsx6p6zqzt6lvdfqzz2q49`


let objRelaysDefault = {"wss://localhost:443":{"write":true,"read":true}
                    }

// let objRelaysDefault = {"wss://localhost:443":{"write":true,"read":true}}

let objRelays = objRelaysDefault

let arrEventCache = [] // AN ARRAY CACHED EVENTS 
let EventCacheSize = 0 // LAST SIZE OF THE CASHED EVENTS
let PoolFilter = {}
let arrSocket = []  // AN ARRAY TO HOLD THE SOCKETS THAT WE ARE CONNECTED TO

//////////////////////////////////////////////////////////////////////
// DOM VARIABLES
//////////////////////////////////////////////////////////////////////

const divBody = document.getElementById('divBody')
const divTitle = document.getElementById('divTitle')
const divGlobalBox = document.getElementById('divGlobalBox')
const divRelayBox = document.getElementById('divRelayBox')

//////////////////////////////////////////////////////////////////////
// ROUTINES
//////////////////////////////////////////////////////////////////////

const ToggleFullScreen = async () => {

let IsFullScreen = false

if(window.innerHeight/screen.height > 0.90 && window.innerWidth/screen.width > 0.90){
    IsFullScreen = true
}

if (IsFullScreen){
    document.exitFullscreen()

}
else{
    let elem = document.documentElement
    elem.requestFullscreen()
}

}

const GenerateKeys = async () => {
let sk = NostrTools.generatePrivateKey()
let pk = NostrTools.getPublicKey(sk)
let nsec = NostrTools.nip19.nsecEncode(sk)
let npub = NostrTools.nip19.npubEncode(pk)

document.getElementById(`inpSK`).innerText = sk
document.getElementById(`inpPK`).innerText = pk
document.getElementById(`inpSKBech32`).innerText = nsec
document.getElementById(`inpPKBech32`).innerText = npub
}


const ConvertNkeyToHex = async () => {
let Hex = NostrTools.nip19.decode(document.getElementById(`inpN`).value).data
document.getElementById(`HexOut`).value = Hex
}


const NpubToHex = async () => {
let Hex = NostrTools.nip19.decode(document.getElementById(`inpNpub`).innerText).data
document.getElementById(`outHex1`).innerText = Hex
}

const NsecToHex = async () => {
let Hex = NostrTools.nip19.decode(document.getElementById(`inpNsec`).innerText).data
document.getElementById(`outHex2`).innerText = Hex
}

const HexToNpub = async () => {
let hex = document.getElementById(`inpHex`).innerText.trim() 
let nsec = NostrTools.nip19.npubEncode(hex)
document.getElementById(`outNpub`).innerText = nsec
}

const HexToNsec = async () => {
let hex = document.getElementById(`inpHex2`).innerText.trim() 
let nsec = NostrTools.nip19.nsecEncode(hex)
document.getElementById(`outNsec`).innerText = nsec
}



// const LoadDropdownBox = async () => {

//   // LOAD THE DROPDOWN BOX

//   let selUser = document.getElementById(`selUser`)
//   selUser.replaceChildren()
//   let opt = document.createElement(`option`)
//   opt.value = ""
//   opt.innerHTML = ""
//   selUser.appendChild(opt)

//   for (Each of objDB.rows){
//       let opt = document.createElement(`option`)
//       opt.value = Each._id
//       opt.innerHTML = Each.name + ` - ${Each.npub}`
//       selUser.appendChild(opt)
//   }
// }

// const LoadUser = async (UserID) => {
//   console.log("Load User")
//   User_id = UserID
//   console.log(`Loaded user ${User_id}`)
//   let arrRelays = objDB.rows[RowOf_id(User_id)].arrRelays
//   divRelays.innerText =  JSON.stringify(arrRelays) 
// }


const PreloadUser = async () => {


try {
    var Evt0 = await dbEvents.find({
    selector: {'pubkey': hexPub, 'kind': 0, "created_at":{'$gt': null}},
    fields: ['created_at', 'id', 'pubkey', 'content', 'tags', 'created_at'],
    sort: [{"created_at": "desc"}]
    })
} catch (err) {
    console.log(err)
}

try {
    var Evt3 = await dbEvents.find({
    selector: {'pubkey': hexPub, 'kind': 3, "created_at":{'$gt': null}},
    fields: ['created_at', 'id', 'pubkey', 'content', 'tags', 'created_at'],
    sort: [{"created_at": "desc"}]
    })
} catch (err) {
    console.log(err)
}



console.log('Event 0')
console.log(Evt0.docs[0])
console.log()
console.log('Event 3')
console.log(Evt3.docs[0])

// LOAD THE METADATA FIELDS
let objCont = JSON.parse( Evt0.docs[0].content)
console.log(objCont)
inpName.innerHTML =  objCont.name
inpDisplay_Name.innerText =  objCont.display_name
inpPicture.innerText =   objCont.picture
inpBanner.innerText =  objCont.banner
inpWebsite.innerText =  objCont.website
inpAbout.innerText =   objCont.about
inpNIP_5.innerText =  objCont.nip05
inpLnAddr.innerText =  objCont.lud16

//LOAD CONTACT LIST
arrContactList = Evt3.docs[0].tags
divContacts.innerText = JSON.stringify(arrContactList,null,4)
console.log(`Contacts`, arrContactList)

//LOAD RELAYS
objRelays = JSON.parse(Evt3.docs[0].content)
console.log(`Relays`, objRelays)
divRelays.innerText = JSON.stringify(objRelays,null,4)

}


const dteSocialTime  = (timestamp) => {

let dNow  = Math.floor(Date.now()/1000)
let SecAgo = dNow - timestamp
let tStrOut = ``

if (SecAgo < 60){
    tStrOut = `${SecAgo} sec`
}
else if (SecAgo < (60 * 60)){
    tStrOut = `${Math.floor(SecAgo/60)} min`
}
else if (SecAgo < (60 * 60 * 24)){
    tStrOut = `${Math.floor(SecAgo/60/60)} hour`
}
else {
    tStrOut = `${Math.floor(SecAgo/60/60/24)} day`
}

return tStrOut
}



const LoadFeedColumn  = async () => {

divFeedCol.innerHTML = ""


let arrM = await dbEvents.find({
    selector: {'kind': 0},
    fields: ['content','pubkey']
})
// objMeta = JSON.parse(objMeta.docs)
console.log(arrM.docs)

// CREATE A META OBJECT FOR FASTER ACCESSING THIS DATA
let objMeta = {}
for (E of arrM.docs){
    objMeta[E.pubkey] = JSON.parse(E.content)
}
console.log(objMeta)


let  arrEvents = await dbEvents.find({
    selector: {'pubkey': {'$ne': hexPub}, 'kind': 1,"created_at":{'$gt': null} },
    fields: ['content',"created_at",'pubkey'],
    sort: [{"created_at": "asc"}]
})
arrEvents = arrEvents.docs
console.log(arrEvents)


for (Each of arrEvents){
    let Txt = htmlFormatText(Each.content)
    let PostBetween = `<div class=divPostBetween>  </div>`
    let PostHeader =  `<div class=divPostHeader> 
                        <div class="image-cropper">
                        <img class='imgIcon' src='${objMeta[Each.pubkey].picture}'> 
                        </div>
                        ${objMeta[Each.pubkey].display_name}  ${dteSocialTime(Each.created_at)}
                        </div>`
    let PostFooter =  `<div class=divPostFooter>  </div>`
    let Post =        `<div class=divPost>${PostHeader} ${Txt} ${PostFooter}</div>`

    divFeedCol.innerHTML =   Post + divFeedCol.innerHTML
}
}

// POST THIS USERS METADATA
const PostMetadata = async () => {

let objM = {}
objM.name = inpName.innerText
objM.display_name = inpDisplay_Name.innerText
objM.picture = inpPicture.innerText 
objM.banner = inpBanner.innerText
objM.website = inpWebsite.innerText
objM.about = inpAbout.innerText 
objM.nip05 = inpNIP_5.innerText 
objM.lud16 = inpLnAddr.innerText 

PostEvent(hexSec, hexPub, 0, [], objM)
}

// POST EVENT 3
const PostEvent3 = async () => {

strRelays = JSON.stringify( JSON.parse(divRelays.innerText))
arrContactList =JSON.parse(divContacts.innerText) 

PostEvent(hexSec, hexPub, 3, arrContactList, strRelays )
}


// POST TWEET
const PostTweet = async (txtInput) => {
PostEvent (hexSec, hexPub, 1, [], txtInput)
}

// POST A GENERAL EVENT
const PostEvent = async (SecKey, PubKey, Kind, arrTags, strContent, ReceiverPubKey = "") => {

let Event = {}  
Event.pubkey = PubKey
Event.created_at = Math.floor(Date.now() / 1000)
Event.kind = Kind 
Event.tags = arrTags 
Event.content = strContent


Event.id = NostrTools.getEventHash(Event)
Event.sig = NostrTools.getSignature(Event, SecKey)

let arrSub = ["EVENT", Event]
console.log(JSON.stringify(arrSub))
for (const [index, [key, value]] of Object.entries(Object.entries(objRelays))){
arrSocket[index].send(JSON.stringify(arrSub))
}

}


const objCreateEvent = async (PrivateKey, Kind, Content, arrTags=[]) =>{

console.log(PrivateKey)
console.log(Kind)
console.log(Content)
console.log(arrTags)

let event = {
kind: Number(Kind),
created_at: Math.floor(Date.now() / 1000),
tags: arrTags,
content: Content,
pubkey: NostrTools.getPublicKey(PrivateKey)
}

event.id = NostrTools.getEventHash(event)
event.sig = NostrTools.getSignature(event, PrivateKey)

// let ok = validateEvent(event)
// let veryOk = verifySignature(event)

return event
}

const PrintEvents = async () =>{

console.log()
console.log("All Docs")
console.log()

try {
    var result = await dbEvents.allDocs({
    include_docs: true,
    attachments: false
    });
} catch (err) {
    console.log(err);
}

console.log(result.rows)
console.log()

for (Each of result.rows){
    console.log(Each.doc)
}
}









//////////////////////////////////////////////////////////////////////
// WEB SOCKET ROUTINES
//////////////////////////////////////////////////////////////////////

const wsOnOpen = async (event, relay, idxSocket) =>{
    console.log(`[${relay}] Connection established`) 

    SubscribeToEvents(idxSocket)
    // console.log(event)
    // PreloadUser()
}

const wsOnClose = async (event, relay) =>{
    if (event.wasClean) {
        console.log(`[${relay}] Connection closed clean`) 
    } else {
        // console.log(`[${relay}] Connection closed`) 
    }
        // console.log(event)
    }

    const wsOnError = async (error, relay) =>{
    console.log(`[${relay}] ${error}`) 
    console.log()
}

const wsOnMessage = async (event, relay) =>{

    let E = JSON.parse( event.data)[2]

    if( (E === undefined)){return}


    // Message from people I follow
    if (E.kind == 1 && objFollows.includes(["p", E.pubkey])){ 

        // let NewDiv = document.createElement("div")
        // NewDiv.setAttribute("class", "divTweet")
        // NewDiv.innerText = E.content.slice(0,100)
        // divGlobalBox.prepend(NewDiv)
    
        // if (divGlobalBox.childElementCount >= 100){
        //     divGlobalBox.removeChild(divGlobalBox.lastChild);
        // }

        console.log(E)
    }






    // General message
    if (E.kind == 1){ 

        let NewDiv = document.createElement("div")
        NewDiv.setAttribute("class", "divTweet")
        NewDiv.innerText = E.content.slice(0,100)
        divGlobalBox.prepend(NewDiv)
    
        if (divGlobalBox.childElementCount >= 100){
            divGlobalBox.removeChild(divGlobalBox.lastChild);
        }
    }

     // Relay message from WholeEnchilada
    if (E.kind == 11000){
        const Now = Math.floor(Date.now() / 1000)
        let objRel = JSON.parse(E.content)
        divRelayBox.innerHTML = ""
      
        var table = document.createElement("TABLE");
        table.setAttribute("class", "tblRelays")
        for (const [index, [key, value]] of Object.entries(Object.entries(objRel))){

            var row = table.insertRow(index);
            // row.insertCell(0).innerHTML = key.slice(6).trim()
            var Col0 = row.insertCell(0).innerHTML = (value.connected) ? `+` : `-`
            row.insertCell(1).innerHTML = (value.write) ? `+` : `-`
            row.insertCell(2).innerHTML = (value.read)  ? `+` : `-`
            var Col3 = row.insertCell(3)
            Col3.innerHTML = value.events
            Col3.style.textAlign = "right";
            var Col4 = row.insertCell(4)
            Col4.innerHTML =  (value.last_event_time == 0) ? `-` : Math.floor((Now - value.last_event_time)/60 )
            Col4.style.textAlign = "right";
            row.insertCell(5).innerHTML = key.slice(6).trim()

        }
        divRelayBox.appendChild(table)
    }
}



const ConnectToRelays = async () =>{

console.log(Object.keys(objRelays))

for (const [index, [key, value]] of Object.entries(Object.entries(objRelays))){

    console.log(index, key, value)
    arrSocket[index]= new WebSocket(key)

    arrSocket[index].onopen = function(event) {
    wsOnOpen(event, key, index)
    }

    arrSocket[index].onmessage = function(event) {
    wsOnMessage(event,key)
    }

    arrSocket[index].onclose = function(event) {
    wsOnClose(event,key)
    }

    arrSocket[index].onerror = function(error) {
    wsOnError(error,key)
    }
}
}


const SubscribeToEvents = async (idxSocket) =>{

    // let arrFollowing = []
    // for (let Each of arrContactList){
    //     arrFollowing.push(Each[1])
    // }


    let ArrSub = ["REQ", "0", {

        "limit": 10

    }]

        // //SELF POSTS
        // {
        //     "kinds": [0,1,3],
        //     "authors": [hexPub],
        //     "since": MonthAgo
        // }


    console.log(`Subscribing to relay ${idxSocket}  ${arrSocket[idxSocket]}`)
    console.log(JSON.stringify(ArrSub))
    arrSocket[idxSocket].send(JSON.stringify(ArrSub))

}

const OpenPost = async () =>{
divPost.innerHTML = "Hello"
divPost.setAttribute("style","height:300px")

}


const PostKeyDown = async (e) =>{

if (e.key == 'Enter' && e.shiftKey == false){
    PostTweet(divPost.innerText.trim())


    var range = document.createRange();
    range.selectNode(divPost);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    divPost.innerHTML = ""
    divPost.innerText = ""
}
}



//////////////////////////////////////////////////////////////////////
// EVENTS
//////////////////////////////////////////////////////////////////////
divTitle.addEventListener("click", ToggleFullScreen);



//////////////////////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////////////////////
console.log(typeof jsonFollows)
ConnectToRelays()
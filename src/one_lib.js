



/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  CONSTANTS
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
const objMimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "gif": "image/gif",
  "webp": "image/webp",
  "svg": "image/svg+xml",
  "json": "application/json",
  "js": "text/javascript",
  "css": "text/css",
  "ico": "image/x-icon",
  "mp3": "audio/mp3",
  "mjs": "text/javascript"
  }

const arrImageExt = [".apng", ".avif", ".gif", ".jpg", ".jpeg", ".jfif",
  ".pjpeg", ".pjp", ".png", ".svg", ".webp"]



const htmlCenteringWrapper =
`<!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>#title#</title>

    <style>
      .clsMain {
        display: flex;
        justify-content: center;
        align-items: center;
        }
    </style>
  </head>

  <body>
    <div class="clsMain">
      #body#
    </div>
  </body>
</html>`

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  TIME ROUTINES
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000)
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  var year = a.getFullYear()
  var month = months[a.getMonth()]
  var date = a.getDate()
  var hour = pad(a.getHours(),2)
  var min = pad(a.getMinutes(),2)
  var sec = pad(a.getSeconds(),2)
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + '.' + sec
  return time
}

function wait(ms) {
    var start = Date.now(),
        now = start
    while (now - start < ms) {
      now = Date.now()
    }
}

function PythonTimestamp(){
  var ts = (new Date() / 1000).toFixed(0)
  return Number(ts)
}

function JSTimestamp(){
  var ts = (new Date()).toFixed(0)
  return Number(ts)
}

function JSTimestampMidnight(){
  var d = new Date()
  var Day = d.getDate()
  var Month = d.getMonth()+1
  var Year = d.getFullYear()
  var ToDay = new Date(Year + '-' + Month  + '-' + Day)
  // var ts = (ToDay / 1000).toFixed(0) // For seconds
  // console.log('Midnight',Year,Month,Day)
  return Number(ToDay)
}

const DaysBetweenDates = (dteDate1,dteDate2) => {
  let d1 = new Date(dteDate1)
  let d2 = new Date(dteDate2)

  if(d1 instanceof Date && d2 instanceof Date){
    return Math.floor((d2 - d1) / 86400000)
  }
  else {
    return `error`
  }
}

const HoursBetweenDates = (dteDate1,dteDate2) => {
  let d1 = new Date(dteDate1)
  let d2 = new Date(dteDate2)

  if(d1 instanceof Date && d2 instanceof Date){
    return Math.floor((d2 - d1) / 3600000)
  }
  else {
    return `error`
  }
}

Date.prototype.addDays = function(h) {
  this.setTime(this.getTime() + (h*24*60*60*1000));
  return this;
}

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

Date.prototype.addMinutes = function(h) {
  this.setTime(this.getTime() + (h*60*1000));
  return this;
}

Date.prototype.addSeconds = function(h) {
  this.setTime(this.getTime() + (h*1000));
  return this;
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  MATH ROUTINES
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
const hash53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    r1 = 4294967296 * (2097151 & h2) + (h1>>>0)
    return r1.toString(16);
}

// PAD A NUMBER WITH LEADING ZEROES
const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  FILE ROUTINES
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

const arrAllFilesInSubdirectories = async (dir) => {
  // import { resolve } from 'path'
  // import { readdir } from 'fs/promises'

  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? arrAllFilesInSubdirectories(res) : res;
  }));
  return Array.prototype.concat(...files);
}




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  HTML ROUTINES
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// USED TO PROCESS SOCIAL POSTS FROM TEXT TO HTML
const htmlFormatText = (txt) => {

  var rgxURL = /\bhttp?s?:?\S*/ig
  var rgxImg = /(.png|.jpg|.jpeg|.gif|.png|.svg)\b/i

  let arrLinks =  []
  arrLinks =  txt.match(rgxURL)
  
  if (arrLinks){
    for (EachLink of arrLinks){
      if (rgxImg.test(EachLink)){ //it's an image
        txt = txt.replace(EachLink,`<img src="${EachLink}">`)
      }
      else{ //its a hyperlink
        txt = txt.replace(EachLink,`<a href="${EachLink}" target="_blank">${EachLink}</a>`)
      }
    }
  }
  return txt

}

// const strEmbedImageLinks = (text) => {
//   var exp = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i
//     return text.replace(exp,"<img src='$2'/>"); 

// }



const arrImageLinks = async (htmlSearch) => {
  // Return a list of image links from an HTML string

  let setImg = new Set([])
  let linkStart = 0
  let linkEnd = 0
  let strStartTag = "src="
  let strEndTag = '"'

  if (htmlSearch) {

    let strHTML = htmlSearch.replace(/'/g,'"') //replace all single q's w doubles
    linkStart = strHTML.indexOf(strStartTag)

    while(linkStart > 0 ){
      strHTML = strHTML.slice(linkStart + strStartTag.length + 1)
      linkEnd = strHTML.indexOf(strEndTag)
      setImg.add(strHTML.slice(0,linkEnd))
      linkStart = strHTML.indexOf(strStartTag)
    }
  }
  return Array.from(setImg)  //remove duplicates
}


const RemoveTagContent = (strHTML, strStartTag, strEndTag) => {

  while(strHTML.indexOf(strStartTag) > 0 && strHTML.indexOf(strEndTag) > strHTML.indexOf(strStartTag)){
    strHTML = strHTML.slice(0,strHTML.indexOf(strStartTag)) + strHTML.slice(strHTML.indexOf(strEndTag) + strEndTag.length)
  }
  return strHTML
}



// GET THE QUERY STRING FROM THE URL OF A WEB PAGE AND RETURN IT IN AN OBJECT
const objQueryStr = async ()  => {
  let output={}
  if(window.location.search){
  var queryParams = window.location.search.substring(1);
  var listQueries = queryParams.split("&");
    for(var query in listQueries) {
    if (listQueries.hasOwnProperty(query)) {
        var queryPair = listQueries[query].split('=');
        output[queryPair[0]] = decodeURIComponent(queryPair[1] || "");
      }
    }
  }
  return output;
}

const CopyValToClipboard = async (val) =>{
  navigator.clipboard.writeText(val)
}


//SELECT ALL CONTENT WHEN EDITABLE DIV GETS FOCUS
const SelAllContent = async (id) =>{

  var div = document.getElementById(id);
  window.setTimeout(function() {
    var sel, range;
    if (window.getSelection && document.createRange) {
        range = document.createRange();
        range.selectNodeContents(div);
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(div);
        range.select();
    }
}, 10);
}

const ToggleSpellCheck = async () =>{
  SpellCheck = !SpellCheck
  divBody.spellcheck = SpellCheck

  if (SpellCheck){
    document.getElementById("svgCheckPath").setAttribute("stroke","black")
  }
  else{
    document.getElementById("svgCheckPath").setAttribute("stroke","lightgray")
  }
}


const ConvertStringToType = async ( str ) =>{

  if (typeof str == 'undefined'){
    str = ""
  }
  else if (!isNaN(str)){
    str = parseFloat(str)
  }
  else if (str == "true"){
    str = true
  }
  else if (str == "false"){
    str = false
  }
  
  //CHECK FOR ARRAYS
  else if (str.slice(0,1) == '[' && str.slice(-1) == ']'){
    str = JSON.parse(str)
  }

    //CHECK FOR OBJECTS
  else if (str.slice(0,1) == '{' && str.slice(-1) == '}'){
    str = JSON.parse(str)
  }

  //REMOVE LEADING AND TRAILING QUOTES IF IT HAS THEM
  else if (str.slice(0,1) == '"' && str.slice(-1) == '"'){
    str = str.slice(1,-1) 
  }

  return str
}

// MEASURE THE WIDTH OF SOME TEXT
// font = "30px Arial"
const displayTextWidth = async (text, font) => {

  let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
  let context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return metrics.width;
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  DOM ELEMENT CREATION
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////


// CREATE AN SELECT ELEMENT CONTAINING THE FIELDS FROM THE GIVEN DATABASE
const selDBFields = async ( db = objDB, optFirst = "", IncludeSysFields = false) => {
  
  //GET A SET OF ALL THE FIELD NAMES, CHECKING EVERY ROW.
  let setFields = new Set([])

  for (let Each of objDB.rows){
    for (let KeyName of Object.keys(Each))
    try{
      setFields.add(KeyName)
      }
    catch{}
    }

  let arrFld = Array.from(setFields)
  arrFld.sort()

  //REMOVE SYS FIELDS IF REQUESTED
  if (!IncludeSysFields){
    var i = arrFld.length;
    while (i--) {
        if (arrFld[i].slice(0,1) == `_`) {
          arrFld.splice(i, 1);
        }
    }
  }

  //CREATE THE SELECT ELEMENT
  let SelOut = document.createElement(`select`)
  
  //IF THERE IS TO BE A SPECIAL FIRST 'TITLE' OPTION, WITH NO VALUE
  if (optFirst != ""){
    let opt = document.createElement(`option`)
    opt.innerHTML = optFirst
    opt.value = ""
    SelOut.appendChild(opt)
  }

  //ADD ALL THE FIELDS TO THE SELECT ELEMENT
  for (Each of arrFld){
    let opt = document.createElement(`option`)
    opt.value = Each
    opt.innerHTML = Each
    SelOut.appendChild(opt)
  }

  return SelOut
}




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  ENCRYPTION USING window.crypto.subtle
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

/**
 * Encrypts plaintext using AES-GCM with supplied password, for decryption with aesGcmDecrypt().
 *                                                                      (c) Chris Veness MIT Licence
 *
 * @param   {String} plaintext - Plaintext to be encrypted.
 * @param   {String} password - Password to use to encrypt plaintext.
 * @returns {String} Encrypted ciphertext.
 *
 * @example
 *   const ciphertext = await aesGcmEncrypt('my secret text', 'pw');
 *   aesGcmEncrypt('my secret text', 'pw').then(function(ciphertext) { console.log(ciphertext); });
 */
async function aesGcmEncrypt(plaintext, password) {
    const pwUtf8 = new TextEncoder().encode(password);                                 // encode password as UTF-8
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);                      // hash the password

    const iv = crypto.getRandomValues(new Uint8Array(12));                             // get 96-bit random iv
    const ivStr = Array.from(iv).map(b => String.fromCharCode(b)).join('');            // iv as utf-8 string

    const alg = { name: 'AES-GCM', iv: iv };                                           // specify algorithm to use

    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']); // generate key from pw

    const ptUint8 = new TextEncoder().encode(plaintext);                               // encode plaintext as UTF-8
    const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8);                   // encrypt plaintext using key

    const ctArray = Array.from(new Uint8Array(ctBuffer));                              // ciphertext as byte array
    const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join('');             // ciphertext as string

    return btoa(ivStr+ctStr);                                                          // iv+ciphertext base64-encoded
}


/**
 * Decrypts ciphertext encrypted with aesGcmEncrypt() using supplied password.
 *     (c) Chris Veness MIT Licence
 *
 * @param   {String} ciphertext - Ciphertext to be decrypted.
 * @param   {String} password - Password to use to decrypt ciphertext.
 * @returns {String} Decrypted plaintext.
 *
 * @example
 *   const plaintext = await aesGcmDecrypt(ciphertext, 'pw');
 *   aesGcmDecrypt(ciphertext, 'pw').then(function(plaintext) { console.log(plaintext); });
 */
async function aesGcmDecrypt(ciphertext, password) {
    const pwUtf8 = new TextEncoder().encode(password);                                 // encode password as UTF-8
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);                      // hash the password

    const ivStr = atob(ciphertext).slice(0,12);                                        // decode base64 iv
    const iv = new Uint8Array(Array.from(ivStr).map(ch => ch.charCodeAt(0)));          // iv as Uint8Array

    const alg = { name: 'AES-GCM', iv: iv };                                           // specify algorithm to use

    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']); // generate key from pw

    const ctStr = atob(ciphertext).slice(12);                                          // decode base64 ciphertext
    const ctUint8 = new Uint8Array(Array.from(ctStr).map(ch => ch.charCodeAt(0)));     // ciphertext as Uint8Array
    // note: why doesn't ctUint8 = new TextEncoder().encode(ctStr) work?

    try {
        const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8);            // decrypt ciphertext using key
        const plaintext = new TextDecoder().decode(plainBuffer);                       // plaintext from ArrayBuffer
        return plaintext;                                                              // return the plaintext
    } catch (e) {
        return '*** Decrypt failed ***'
    }
}

const CryptoSubtleHash = async (str, HashAlgo, OutputEncoding) => {
  //str is a javascript string (utf16) which gets converted to utf8 
  //HashAlgo can be SHA-1 SHA-256 SHA-384 SHA-512
  //Encoding is the output encoding. Options are: bs02 bs08 bs10 bs16 bs58 bs64 

  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  let hash = await crypto.subtle.digest(HashAlgo, data)
  hash = new Uint32Array(hash)
  hash = await BaseEncodeDecode(hash, OutputEncoding, true)

  return hash
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  OBJECT AND ARRAY ROUTINES
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// FOR AN ARRAY OF OBJECTS, GET THE VALUE OF THE OBJECT THAT HAS A 
// PARTICULAR KEY
// Example
// arrObj =[{"id":"svg01"},{"cx":5},{"cy":5},{"r":4},{"stroke":"black"}]
// Key = "id"
// The function will return "svg01"

const ValInArr = async (arrObj, Key) => {
  console.log(arrObj)
  for (let Ob of arrObj){
    
    if (Object.keys(Ob)[0] == Key){
      return Ob[Object.keys(Ob)[0]]
    }
  }

  return ""
}



/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  SORTING
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// const arrSortOfObjects = (arrObj,PropertyToSortBy, asc = true) => {

//   if (asc){
//     // return arrObj.sort((a, b) => parseFloat(a[PropertyToSortBy]) - parseFloat(b[PropertyToSortBy]));
//     return arrObj.sort((a, b) => a[PropertyToSortBy].toUpperCase() - b[PropertyToSortBy].toUpperCase());
//   }
//   else{
//     return arrObj.sort((a, b) => parseFloat(b[PropertyToSortBy]) - parseFloat(a[PropertyToSortBy]));
//   }
// }

const arrOfObjSort = async (arr, key, asc=true) => {

  //CHECK IF THIS KEY IS NUMERIC OR A STRING. ALSO LOOK FOR UNDEFINED
  let Numeric = true
  for (let Each of arr){
    if (typeof Each[key] != "undefined"){
      if ( isNaN(Each[key]) ){
        Numeric = false
        break
      }
    }
  }

  if (Numeric && asc) {
    arr.sort((a, b) => {
      if (typeof a[key] == "undefined"){
        return -1;
      }
      if (typeof b[key] == "undefined"){
        return 1;
      }
      return a[key] - b[key]
    })
  }

  else if (Numeric && !asc) {
    arr.sort((a, b) => {
      if (typeof a[key] == "undefined"){
        return 1;
      }
      if (typeof b[key] == "undefined"){
        return -1;
      }
      return b[key] - a[key]
    })
  }


  else if (asc) {

    arr.sort((a, b) => {
        if (typeof a[key] == "undefined"){
          return 1;
        }
        if (typeof b[key] == "undefined"){
          return -1;
        }

        let fa = a[key].toLowerCase(),
            fb = b[key].toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
  }

  else {
    arr.sort((a, b) => {
        if (typeof a[key] == "undefined"){
          return -1;
        }
        if (typeof b[key] == "undefined"){
          return 1;
        }

        let fa = a[key].toLowerCase(),
            fb = b[key].toLowerCase();

        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
        return 0;
    })
  }

  return arr
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  UTILITIES
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////



// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
function basex (ALPHABET) {
  if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
  var BASE_MAP = new Uint8Array(256)
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i)
    var xc = x.charCodeAt(0)
    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
    BASE_MAP[xc] = i
  }
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)
  var FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
  var iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up
  function encode (source) {
    if (source instanceof Uint8Array) {
    } else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source)
    }
    if (!(source instanceof Uint8Array)) { throw new TypeError('Expected Uint8Array') }
    if (source.length === 0) { return '' }
        // Skip & count leading zeroes.
    var zeroes = 0
    var length = 0
    var pbegin = 0
    var pend = source.length
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++
      zeroes++
    }
        // Allocate enough space in big-endian base58 representation.
    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
    var b58 = new Uint8Array(size)
        // Process the bytes.
    while (pbegin !== pend) {
      var carry = source[pbegin]
            // Apply "b58 = b58 * 256 + ch".
      var i = 0
      for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
        carry += (256 * b58[it1]) >>> 0
        b58[it1] = (carry % BASE) >>> 0
        carry = (carry / BASE) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      pbegin++
    }
        // Skip leading zeroes in base58 result.
    var it2 = size - length
    while (it2 !== size && b58[it2] === 0) {
      it2++
    }
        // Translate the result into a string.
    var str = LEADER.repeat(zeroes)
    for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]) }
    return str
  }
  function decodeUnsafe (source) {
    if (typeof source !== 'string') { throw new TypeError('Expected String') }
    if (source.length === 0) { return new Uint8Array() }
    var psz = 0
        // Skip and count leading '1's.
    var zeroes = 0
    var length = 0
    while (source[psz] === LEADER) {
      zeroes++
      psz++
    }
        // Allocate enough space in big-endian base256 representation.
    var size = (((source.length - psz) * FACTOR) + 1) >>> 0 // log(58) / log(256), rounded up.
    var b256 = new Uint8Array(size)
        // Process the characters.
    while (source[psz]) {
            // Decode character
      var carry = BASE_MAP[source.charCodeAt(psz)]
            // Invalid character
      if (carry === 255) { return }
      var i = 0
      for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
        carry += (BASE * b256[it3]) >>> 0
        b256[it3] = (carry % 256) >>> 0
        carry = (carry / 256) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      psz++
    }
        // Skip leading zeroes in b256.
    var it4 = size - length
    while (it4 !== size && b256[it4] === 0) {
      it4++
    }
    var vch = new Uint8Array(zeroes + (size - it4))
    var j = zeroes
    while (it4 !== size) {
      vch[j++] = b256[it4++]
    }
    return vch
  }
  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) { return buffer }
    throw new Error('Non-base' + BASE + ' character')
  }
  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}

const BASE02 = `01`
const BASE06 = `123456`
const BASE08 = `01234567`
const BASE10 = `0123456789`
const BASE16 = `0123456789abcdef`
const BASE58 = `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`
                // No 0, I, O, l
const BASE64 = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`

const bs02 = basex(BASE02)
const bs06 = basex(BASE06)
const bs08 = basex(BASE08)
const bs10 = basex(BASE10)
const bs16 = basex(BASE16)
const bs58 = basex(BASE58)
const bs64 = basex(BASE64)

// Examples
// decoded = bs58.decode('5Kd3')

// input must be a Uint8Array, Buffer, or an Array. It returns a string.
// encoded = bs16.encode(decoded))


const BaseEncodeDecode = async (Val, Base, Enc = true) =>{

  //ENCODE
  if (Enc){
    switch (Base) {     
      case `bs02`:                     
        return bs02.encode(Val)

      case `bs06`:                     
        return bs06.encode(Val)

      case `bs08`:                     
        return bs08.encode(Val)

      case `bs10`:                     
        return bs10.encode(Val)

      case `bs16`:                     
        return bs16.encode(Val)

      case `bs58`:                     
        return bs58.encode(Val)

      case `bs64`:                     
        return bs64.encode(Val)

      case `utf8`:                     
      let Dec = new TextDecoder("utf-8")
      return Dec.decode(Val)

    }
  }
  //DECODE
  else {
    switch (Base) {     
      case `bs02`:                     
        return bs02.decode(Val)

      case `bs06`:                     
        return bs06.decode(Val)

      case `bs08`:                     
        return bs08.decode(Val)

      case `bs10`:                     
        return bs10.decode(Val)

      case `bs16`:                     
        return bs16.decode(Val)

      case `bs58`:                     
        return bs58.decode(Val)

      case `bs64`:                     
        return bs64.decode(Val)

      case `utf8`:                     
        let Enc = new TextEncoder()
        return Enc.encode(Val)

    }
  }
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  PAD JSON DB ROUTINES SERVER
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

const objReadJSONFile = async (docPath) =>{
  const data = await fs.promises.readFile(docPath, 'utf8')
  return JSON.parse(data)
}

const objWriteJSONFile = async (docPath, objData) => {
  await fs.promises.writeFile(docPath, JSON.stringify(objData, null, 2))
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  PAD JSON_DB ROUTINES CLIENT
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

const jsonFolderDir = `/json/`


const jsonDefaultDB = { 
"format": {"hash_algo":"sha-256",
"hash_decoding":"utf8",
"hash_encoding":"bs64",
"encryption_algo":"aes-cgm",
"encryption_decoding":"utf8",
"encryption_encoding":"bs64"
},

"owner_digest": "",

"rows": []
}


const arrDBs = async () => {
  const response = await fetch(`/json_db/directory.json`)
  return await response.json()
}


const objLoadDB = async (dbName=dbFilename.split(`.`)[0]) =>{

  //GET THE LIST OF FILES SO WE CAN FIND THE dbFilename THAT MATCHES dbName

  arrDB = await arrDBs()
  arrDB.sort()


  for (Each of arrDB){
    if (Each.name.split(`.`)[0] == dbName && Each.isFile){
      dbFilename = Each.name
    }
  }

  // console.log("dbFilename", dbFilename)
  const response = await fetch(`${jsonFolderDir}${dbFilename}`)
  objDB = await response.json()

  objDB = await objDecryptedJSON(objDB)

  // console.log("objDB", objDB)
  return [objDB, dbFilename]
}




// FIND THE HIGHEST INTEGER IN THE _id FIELD
const numMax_id = async (db=DB) =>{
  let MaxNum = 0
  for (let Row of db.rows){
    if (!isNaN(Row._id)){
      if (Row._id > MaxNum){
        MaxNum = Row._id
      }
    }
  }
  return Number(MaxNum)
}


//RETURN THE ROW OF THE DB GIVEN THE ID
const RowOf_id =(_id) =>{

  let i = objDB.rows.length
  while(i--){
    if (objDB.rows[i]._id == _id){
      return i
      break
    }
  }
  return -1
}




const LoadFields = async () =>{
  //GET ALL THE FIELD NAMES
  let setFields = new Set([])
  let setColNames = new Set(['Del'])
  for (let Each of objDB.rows){
    for (let KeyName of Object.keys(Each))
    try{
      setFields.add(KeyName)
      setColNames.add(KeyName)
      }
    catch{}
    }

  arrFields = Array.from(setFields)
  arrColNames = Array.from(setColNames)


  for(Field of arrFields){
    objFieldWidth[Field] = 0
  }

  let Len = 0
  for(Row of objDB.rows){
    for(Field of arrFields){
      Len = (typeof Row[Field] != "undefined" && Row[Field] !== null) ? Row[Field].toString().length : 9
      if(objFieldWidth[Field] < Len){
        objFieldWidth[Field] = Len
      }
    }
  }

}

const DelDB_id = async (_id) =>{

  let i = objDB.rows.length
  while(i--){
    // console.log(i,_id, objDB.rows[i]._id)
    if (objDB.rows[i]._id == _id){
      objDB.rows.splice(i,1)
      // console.log("removed objDB.rows[i]")
    }
  }
}


const SaveDB = async (db=objDB, CurFilename=dbFilename) =>{
  // console.log("SaveDB",db.rows)
  // console.log(db)

  // console.log("CurFilename", CurFilename)

  arrFilename = CurFilename.split(`.`)

  _rev_old = arrFilename[1] + `.` + arrFilename[2]

  // CHECK FOR DUPLICATE ROW _ID'S

  let arrRowIDs = []
  for (let R of db.rows){
    arrRowIDs.push(R._id)
  }

  // console.log("array of ids", arrRowIDs)
  setRowIDs = new Set(arrRowIDs)

  if (arrRowIDs.length != setRowIDs.size){
    console.log("Can't save DB. Duplicate _id in the rows")
    return
  }


  // Encrypt the file. Use JSON so you don't reference objDB
  objDBEncr = JSON.parse(JSON.stringify(db))
  objDBEncr = await objEncryptedJSON(objDBEncr)



  // CREATE A _rev FOR THE DB 
  // INTEGER - SHA256(of rows)


  _rev = await CryptoSubtleHash(objDBEncr.rows,`SHA-256`,`bs58`)



  let NewFilename = `${arrFilename[0]}.${Number(arrFilename[1]) + 1}.${_rev}.json`

  console.log( `_rev_old`, _rev_old)
  console.log(`NewFilename`, NewFilename)

  let FetchOptions = {
  	method: 'PUT',
  	headers:{
  	'Content-Type':'application/json'
  	},
  	body: JSON.stringify(objDBEncr)
  }

  // let PutURL = jsonDir + DB 
  let PutURL = `${jsonDir}${NewFilename}?_rev=${_rev_old}`
  const response = await fetch(PutURL,FetchOptions)
  let Res = await response.json()
  console.log(`Res`, Res)

  dbFilename = NewFilename
  console.log(dbFilename)
  return NewFilename

}


const SaveNewDB = async (fileName, objNewDB) =>{
  // console.log("SaveNewDB")
  let PutURL = jsonDir + fileName


  // Encrypt the file 
  objNewDB = await objEncryptedJSON(objNewDB)


  let FetchOptions = {
  	method: 'PUT',
  	headers:{
  	'Content-Type':'application/json'
  	},
  	body: JSON.stringify(objNewDB)
  }

  const response = await fetch(PutURL,FetchOptions)
  let Res = await response.json()

}


const objDecryptedJSON = async (objToDecrypt) => {
  // console.log(objToDecrypt)

  // DECRYPT THE ROWS
  if (objToDecrypt.format.encryption_algo == "aes-cgm"){
    strDecrypted = await aesGcmDecrypt(objToDecrypt.rows, Password) 
    objToDecrypt.rows =  JSON.parse(strDecrypted)
  }

  return objToDecrypt

}

const objEncryptedJSON = async (objToEncrypt) => {

  let objOut = {}
  if (objToEncrypt.format.encryption_algo == "aes-cgm"){
    // console.log('Encrypt', JSON.stringify(objToEncrypt.rows))
    objToEncrypt.rows =  await aesGcmEncrypt(JSON.stringify(objToEncrypt.rows), Password) 
  }

  return objToEncrypt
  
}


// CONVERT THE ROWS ELEMENT OF DB INTO TAB DELIMITED FILE
const DbToCsv = async () => {

  let CSV = ''

  //GET THE FIELD HEADERS
  for (Field of arrFields){
      CSV += `"${Field}"\t`
    }
  CSV = CSV.slice(0,-1) + `\r\n`

  //GET THE BODY
  for (Each of objDB.rows){
    for (Field of arrFields){
      switch (typeof Each[Field]) {    
        case `boolean`:                       
          CSV += `${Each[Field]}\t`
          break
        case `object`:                       
          CSV += `${JSON.stringify(Each[Field])}\t`
          break
        case `undefined`:                       
          CSV += `""\t`
          break
        case ``:                       
          CSV += `""\t`
          break
        
        default:                      
          CSV += `"${Each[Field]}"\t`
      }
    }
    CSV = CSV.slice(0,-1) + `\r\n`
  }

  return CSV
  
}

// CONVERT TAB DELIMITED FILE TO AN ARRAY
const CsvToArr = async (CSV) => {

  let arrTmp = []
  let arrFld = []
  let arrCSV = []
  let strTmp = ""

  // let CSV = document.getElementById(CsvData).value
  // console.log(CSV)
  arrCSV = CSV.split(`\n`)

  arrFld = arrCSV[0].split(`\t`)
  arrCSV.splice(0,1)
  arrCSV.pop() // The last row turns out to be empty so pop it.

  console.log(arrCSV)
  console.log(arrCSV.length)

  for (Row of arrCSV){
    strTmp = `{`
    for (i=0; i < arrFld.length; i++){
      strTmp += `${arrFld[i]}:${Row.split(`\t`)[i]},`
    }
    strTmp = strTmp.slice(0,-1) + `}`
    console.log(strTmp)
    console.log(JSON.parse(strTmp))
    arrTmp.push(JSON.parse(strTmp))
  }

  console.log(arrTmp)
  return arrTmp
  
}

// TAKES KEY VALUE PAIR, LOOKS FOR IT'S DATA TYPE, THEN ADDS IT TO AN OBJ
const objAddPair = async (objIn, Key, Val) => {
  // console.log("AddPair-in", Key, Val, typeof Val)
  Val = Val.trim()

  //CONVERT FROM STRING TO ITS PROPER TYPE
  if (typeof Val == 'undefined' || Val == ""){
    Val = ""
  }
  else if (!isNaN(Val)){
    Val = parseFloat(Val)
  }
  else if (Val == "true"){
    Val = true
  }
  else if (Val == "false"){
    Val = false
  }
  
  //CHECK FOR ARRAYS
  else if (Val.slice(0,1) == '[' && Val.slice(-1) == ']'){
    Val = JSON.parse(Val)
  }

  //REMOVE LEADING AND TRAILING QUOTES IF IT HAS THEM
  else if (Val.slice(0,1) == '"' && Val.slice(-1) == '"'){
    Val =Val.slice(1,-1) 
  }


  // console.log("AddPair-out", Key, Val, typeof Val)

  objIn[Key] = Val
  // console.log("AddPair-out obj",objIn[Key])

  return objIn
}




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  SVG
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////


{/* <svg id="SVG-51" viewBox="0 0 10 10" _index="0" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink" >
<line stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="black" stroke-opacity="1" fill="black" fill-opacity="0" x1="5" y1="2" x2="5" y2="8" />
<line stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="black" stroke-opacity="1" fill="black" fill-opacity="0" x1="2" y1="5" x2="8" y2="5" />
</svg>  */}


const svgIcon = async (Type) => {

  // DownArrow, UpArrow, DownCarrot, RightCarrot, X, Play, Pause, Plus,
  // Hamburger, HamburgerV, Circle


  let xmlns = "http://www.w3.org/2000/svg"

  const svgEle = document.createElementNS(xmlns, 'svg')

  svgEle.setAttributeNS(null, 'viewBox', '0 0 10 10')
  svgEle.setAttributeNS(null, 'stroke-width', 2)
  svgEle.setAttributeNS(null, 'stroke-linecap', `round`)
  svgEle.setAttributeNS(null, 'stroke-linejoin', `round`)
  svgEle.setAttributeNS(null, 'fill-opacity', 0)

  
  if(Type == `Plus`){
    const svgLine1 = document.createElementNS(xmlns, 'line')
    svgLine1.setAttributeNS(null, 'x1', 5)
    svgLine1.setAttributeNS(null, 'y1', 2)
    svgLine1.setAttributeNS(null, 'x2', 5)
    svgLine1.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine1)

    const svgLine2 = document.createElementNS(xmlns, 'line')
    svgLine2.setAttributeNS(null, 'x1', 2)
    svgLine2.setAttributeNS(null, 'y1', 5)
    svgLine2.setAttributeNS(null, 'x2', 8)
    svgLine2.setAttributeNS(null, 'y2', 5)
    svgEle.appendChild(svgLine2)

    return svgEle
  }

  if(Type == `X`){
    const svgLine1 = document.createElementNS(xmlns, 'line')
    svgLine1.setAttributeNS(null, 'x1', 2)
    svgLine1.setAttributeNS(null, 'y1', 2)
    svgLine1.setAttributeNS(null, 'x2', 8)
    svgLine1.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine1)

    const svgLine2 = document.createElementNS(xmlns, 'line')
    svgLine2.setAttributeNS(null, 'x1', 8)
    svgLine2.setAttributeNS(null, 'y1', 2)
    svgLine2.setAttributeNS(null, 'x2', 2)
    svgLine2.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine2)

    return svgEle
  }
  
  if(Type == `Minus`){
    const svgLine2 = document.createElementNS(xmlns, 'line')
    svgLine2.setAttributeNS(null, 'x1', 2)
    svgLine2.setAttributeNS(null, 'y1', 5)
    svgLine2.setAttributeNS(null, 'x2', 8)
    svgLine2.setAttributeNS(null, 'y2', 5)
    svgEle.appendChild(svgLine2)

    return svgEle
  }

  if(Type == `Play`){
    const svgPolygon = document.createElementNS(xmlns, 'polygon')
    svgPolygon.setAttributeNS(null, 'points', points="2,8 8,5 2,2 ")
    svgEle.appendChild(svgPolygon)

    return svgEle
  }

  if(Type == `1`){
    const svgLine1 = document.createElementNS(xmlns, 'line')
    svgLine1.setAttributeNS(null, 'x1', 5)
    svgLine1.setAttributeNS(null, 'y1', 2)
    svgLine1.setAttributeNS(null, 'x2', 5)
    svgLine1.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine1)
    return svgEle
  }


  if(Type == `2`){
    const svgLine1 = document.createElementNS(xmlns, 'line')
    svgLine1.setAttributeNS(null, 'x1', 3)
    svgLine1.setAttributeNS(null, 'y1', 2)
    svgLine1.setAttributeNS(null, 'x2', 3)
    svgLine1.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine1)

    const svgLine2 = document.createElementNS(xmlns, 'line')
    svgLine2.setAttributeNS(null, 'x1', 7)
    svgLine2.setAttributeNS(null, 'y1', 2)
    svgLine2.setAttributeNS(null, 'x2', 7)
    svgLine2.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine2)
    return svgEle
  }

  if(Type == `3`){
    const svgLine1 = document.createElementNS(xmlns, 'line')
    svgLine1.setAttributeNS(null, 'x1', 2)
    svgLine1.setAttributeNS(null, 'y1', 2)
    svgLine1.setAttributeNS(null, 'x2', 2)
    svgLine1.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine1)

    const svgLine2 = document.createElementNS(xmlns, 'line')
    svgLine2.setAttributeNS(null, 'x1', 5)
    svgLine2.setAttributeNS(null, 'y1', 2)
    svgLine2.setAttributeNS(null, 'x2', 5)
    svgLine2.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine2)

    const svgLine3 = document.createElementNS(xmlns, 'line')
    svgLine3.setAttributeNS(null, 'x1', 8)
    svgLine3.setAttributeNS(null, 'y1', 2)
    svgLine3.setAttributeNS(null, 'x2', 8)
    svgLine3.setAttributeNS(null, 'y2', 8)
    svgEle.appendChild(svgLine3)
    return svgEle
  }

  if(Type == `carrot_down`){
    const svgPath = document.createElementNS(xmlns, 'path')
    svgPath.setAttributeNS(null, 'd', "M2,2 L5,7 L8,2")
    svgEle.appendChild(svgPath)
    return svgEle
  }

  if(Type == `carrot_right`){
    const svgPath = document.createElementNS(xmlns, 'path')
    svgPath.setAttributeNS(null, 'd', "M2,2 L8,5 L2,8")
    svgEle.appendChild(svgPath)
    return svgEle
  }

  if(Type == `carrot_up`){
    const svgPath = document.createElementNS(xmlns, 'path')
    svgPath.setAttributeNS(null, 'd', "M2,8 L5,2 L8,8")
    svgEle.appendChild(svgPath)
    return svgEle
  }

  if(Type == `carrot_left`){
    const svgPath = document.createElementNS(xmlns, 'path')
    svgPath.setAttributeNS(null, 'd', "M8,2 L2,5 L8,8")
    svgEle.appendChild(svgPath)
    return svgEle
  }

  if(Type == `pencil`){
    const svgPolygon = document.createElementNS(xmlns, 'polygon')
    svgPolygon.setAttributeNS(null, 'points', points="2,8 2,6 6,2 8,4 4,8")
    svgEle.appendChild(svgPolygon)
    return svgEle
  }

  if(Type == `check`){
    const svgPath = document.createElementNS(xmlns, 'path')
    svgPath.setAttributeNS(null, 'd', points="M2,6 L4,8 L8,2")
    svgEle.appendChild(svgPath)
    return svgEle
  }

  if(Type == `arrow_up_right`){
    const svgPath = document.createElementNS(xmlns, 'path')
    svgPath.setAttributeNS(null, 'd', points="M2,8 L8,2 L5,2 L8,2 L8,5")
    svgEle.appendChild(svgPath)
    return svgEle
  }

  if(Type == `box`){
    const svgPath = document.createElementNS(xmlns, 'path')
    svgPath.setAttributeNS(null, 'd', points="M2,2 L8,2 L8,8 L2,8 L2,2 L2,2 L8,2 L8,8 L2,8 L2,2")
    svgEle.appendChild(svgPath)
    return svgEle
  }



}


const htmlFromObjSVG = async (objSVG) => {

  let htmlOut = `<svg `

  // console.log(objSVG.attributes)
  for (let key in objSVG.attributes){
    htmlOut += `${key}="${objSVG.attributes[key]}" `
  }
  htmlOut += xmlSVGTagHeader
  htmlOut += `> \n`

  for (let Ele of objSVG.elements){
    htmlOut += `<${Ele._element_type} `

    // console.log("Ele", Ele)
    for (let key in Ele){
      if (key.slice(0,1) != "_"){
        htmlOut += `${key}="${Ele[key]}" `
      }
      
    }

    htmlOut += `/> \n`
  }

  htmlOut += `</svg> `
  return htmlOut
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  IPFS
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// UTILIZE THE IPFS FUNCTIONALITY OF pad_server.mjs to interact with IPFS
// DOESN'T INTERACT WITH IPFS DIRECTLY

// const GetCID = async (cid) => {
//   let Url = `/ipfs/get?cid=${cid}`
//   const response = await fetch(Url)
//   return response.text()
// }


// const PostIPFSFile = async (filename, data) =>{
//   let Url = `/ipfs/add?pin=true&mfsFilePathName=${filename}&cidVersion=1`
//   const response = await fetch(Url,{method: 'POST', body: data })
  
//   objRes = await response.json()
//   console.log(objRes)
//   return objRes.Hash
// }


// const idIPFS = async (peer="") => {
//   let Url = `/ipfs/id?peer=${peer}`
//   const response = await fetch(Url)
//   return response.text()
// }



/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//  IPFS
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////



//GET A FILE FROM IT'S CID
const getIPFS = async (CID, ipfsGateway = ipfsGatewayLocal) =>{
  let Url = ipfsGateway + `/ipfs/` + CID 
  console.log("fetch " + Url)
  const response = await fetch(Url)
  const data = await response.text()
  return data
}


//SEND DATA DIRECTLY TO THIS FUNCTION, ADD IT TO IPFS GETTING A CID
//AND THEN OPTIONALLY ADD TO MFS 
const addIPFS = async (data, mfsFilePathName = "", Pin = true, cidVersion = 1, ipfsAPI = ipfsAPILocal) => {

  //HASH THE DATA AND GET THE CID
  let Url = ipfsAPI + `/api/v0/add?pin=${Pin}&cid-version=${cidVersion}`
  console.log(Url)
  const form = new FormData()
  form.append('content', data)

  const response = await fetch(Url, {
      method: 'POST',
      body: form
  });

  const Res = await response.json();
  console.log(`Res`, Res)

  //SAVE TO MFS
  if (mfsFilePathName != ""){

    // FIRST REMOVE THE FILE IF IT EXISTS 
    await rmFilesIPFS(mfsFilePathName, false, false, ipfsAPI)

    Url = ipfsAPI + `/api/v0/files/cp?arg=/ipfs/${Res.Hash}&arg=${mfsFilePathName}&parents=true`

    try{
      const response2 = await fetch(Url, {method: 'POST', body: ''})
      const Res2 = await response2
      Res2.Filename = mfsFilePathName
      return Res
    }
    catch(err){
      return `{"response":${err}}`
    }
  }
  else{
    return Res
  }
}




//////////////////////////////////////////////////////////////////////////////
//  BLOCKS
//////////////////////////////////////////////////////////////////////////////
const blockPutIPFS = async ( ipfsAPI = ipfsAPILocal) => {

  let Url = ipfsAPI + `/api/v0/block/put`

  const response = await fetch(Url, {method: 'POST', body: 'This is the body.'})
  const data = await response;
  return data
}

//////////////////////////////////////////////////////////////////////////////
//  FILES AND MFS
//////////////////////////////////////////////////////////////////////////////
//LIST DIRECTORIES
const lsFilesIPFS = async ( dir = `/`, ipfsAPI = ipfsAPILocal) =>{
  let Url = ipfsAPI + `/api/v0/files/ls?arg=${dir}&long=true`
  const response = await fetch(Url, {method: 'POST', body: ''})
  const data = await response.json()
  return data
}

//MAKE DIRECTORY
const mkdirFilesIPFS = async (arg, ipfsAPI = ipfsAPILocal) =>{

  //paths must start with leading slash
  if (arg.slice(0,1) != `/`){
    arg = `/` + arg
  }

  let Url = ipfsAPI + `/api/v0/files/mkdir?arg=${arg}`
  const response = await fetch(Url, {method: 'POST', body: ''})
  const data = await response.text()
  return data
}

//rm
const rmFilesIPFS = async (arg, recursive = false, force = false, ipfsAPI = ipfsAPILocal) =>{

  //paths must start with leading slash
  if (arg.slice(0,1) != `/`){
    arg = `/` + arg
  }

  let Url = ipfsAPI + `/api/v0/files/rm?arg=${arg}&recursive=${recursive}&force=${force}`
  const response = await fetch(Url, {method: 'POST', body: ''})
  const data = await response.text();
  return data
}

//MV
const mvFilesIPFS = async (source, dest, ipfsAPI = ipfsAPILocal) =>{
  let Url = ipfsAPI + `/api/v0/files/mv?arg=${source}&arg=${dest}`
  const response = await fetch(Url, {method: 'POST', body: ''})
  const data = await response.text()
  return data
}

//READ FILE
const readFilesIPFS = async ( ipfsAPI = ipfsAPILocal) =>{
  let Url = ipfsAPI + `/api/v0/files/read`
  const response = await fetch(Url, {method: 'POST', body: ''})
  const data = await response.json()
  return data
}

//COPY THE FILE TO THE MFS
const cpFilesIPFS = async ( CID, FilePathAndName, MkDir = true, ipfsAPI = ipfsAPILocal) =>{
  let Url = ipfsAPI + `/api/v0/files/cp?arg=${CID}&arg=${FilePathAndName}&parents=${MkDir}`
  console.log(Url)
  const response = await fetch(Url, {method: 'POST', body: ''})
  const data = await response.text();
  return data
}


//LIST ALL FILES RECURSIVELY
const lsFilesRecursiveIPFS = async (dir = `/`, ipfsAPI = ipfsAPILocal) =>{

  //CALL THIS FUNCTION RECURSIVELY ON DIRECTORIES
  const getEntries = async (obj, dir) => {

    obj = await lsFilesIPFS(dir, ipfsAPI )
    if (obj.Entries){
      for(let Each of obj.Entries){
        if (Each.Type == 1){ //if it is a directory
          Each.Entries = await getEntries(Each.Entries, dir + `/` + Each.Name)
        }
      }
    }
    return obj
  }

  let objOut = {}
  objOut = await getEntries(objOut, dir)

  return objOut
}

//////////////////////////////////////////////////////////////////////////////
//  PINS
//////////////////////////////////////////////////////////////////////////////
//LIST ALL PINNED OBJECTS
//type can be "direct", "indirect", "recursive", or "all"
const pinsIPFS = async (type = `all`, ipfsAPI = ipfsAPILocal) =>{
  let Url = ipfsAPI + `/api/v0/pin/ls?type=${type}`
  const response = await fetch(Url, {method: 'POST', body: ''});
  const data = await response.json();
  return data
}

//ADD PINNED OBJECTS
const pinaddIPFS = async (CID, ipfsAPI = ipfsAPILocal) =>{
  let Url = ipfsAPI + `/api/v0/pin/add?arg=${CID}`
  const response = await fetch(Url, {method: 'POST', body: ''});
  const data = await response.json();
  return data
}

//remove PINNED OBJECTS
const pinrmIPFS = async (CID, ipfsAPI = ipfsAPILocal) =>{
  let Url = ipfsAPI + `/api/v0/pin/rm?arg=${CID}`
  const response = await fetch(Url, {method: 'POST', body: ''});
  const data = await response.json();
  return data
}

//////////////////////////////////////////////////////////////////////////////
//  IPNS
//////////////////////////////////////////////////////////////////////////////


const keylsIPFS = async (ipfsAPI = ipfsAPILocal) => {
  let Url = ipfsAPI + `/api/v0/key/list?l=true`
  const response = await fetch(Url, {method: 'POST', body: ''});
  const data = await response.json();
  return data
}




const publishIPFS = async (CID, ipfsAPI = ipfsAPILocal) => {
  let Url = ipfsAPI + `/api/v0/name/publish?arg=${CID}`
  const response = await fetch(Url, {method: 'POST', body: ''});
  const data = await response.json();
  return data
}

const resolveIPFS = async (IPNSName, ipfsAPI = ipfsAPILocal) => {
  let Url = ipfsAPI + `/api/v0/name/resolve?arg=${IPNSName}`
  const response = await fetch(Url, {method: 'POST', body: ''});
  const data = await response.json();
  return data
}



//////////////////////////////////////////////////////////////////////////////
//  GENERAL
//////////////////////////////////////////////////////////////////////////////

const idIPFS = async (peer = "", peeridbase = "", ipfsAPI = ipfsAPILocal) => {

  let Url = ipfsAPI + `/api/v0/id`
  if (peer !== ""){
    Url = ipfsAPI + `/api/v0/id?arg=${peer}&peerid-base=${peeridbase}`
  }

  const response = await fetch(Url, { method: 'POST', body: ''})

  const data = await response.json()
  return data
}


const cidFormatV1IPFS = async (cid, ipfsAPI = ipfsAPILocal) => {

  let Url = ipfsAPI + `/api/v0/cid/base32?arg=${cid}`
  console.log(Url)
  const response = await fetch(Url, {method: 'POST', body: ''});
  const data = await response.json();
  return data
}

const ConvertV1IPFS = async (cid, ipfsAPI = ipfsAPILocal) => {

  let Url = ipfsAPI + `/api/v0/cid/format?arg=${cid}&v=1&b=base32`
  const response = await fetch(Url, {method: 'POST', body: ''});
  const data = await response.json();
  return data
}


//////////////////////////////////////////////////////////////////////////////
//  HASHTAGS
//////////////////////////////////////////////////////////////////////////////

//  RETURN ALL THE USED HASHTAGS
const objHashtags = async (db=DB) =>{
  let arrOut = []
  let objOut = {}
  for (let Row of db.rows){
    arrOut = arrOut.concat(Row.hashtags)
  }
  arrOut = [...new Set(arrOut)]
  arrOut.sort()

  for (let H of arrOut){
    objOut[H] = {"Enabled":false}
  }

  return objOut
}

const ToggleHashtags = async (hashtag, row, db=DB) =>{
  
  if (hashtag.slice(0,1) != `#`){
    hashtag = `#${hashtag}`
  }

  //REMOVE HASHTAG
  if (db.rows[row].hashtags.includes(hashtag)) {
    var i = db.rows[row].hashtags.length;
    while (i--) {
      if (db.rows[row].hashtags[i] == hashtag) {
        db.rows[row].hashtags.splice(i, 1);
      }
    }
  }
  //ADD HASHTAG
  else{
    db.rows[row].hashtags.push(hashtag)
  }

}

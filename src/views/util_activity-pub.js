export async function message (uri) {
  let m = {}
  m.uri = uri
  // ActivityPub
  let ty = await solid.data[uri].as$type
  m.type = `${ty}`
  let at = await solid.data[uri].as$attributedTo
  m.attributedTo = `${at}`
  let su = await solid.data[uri].as$summary
  m.summary = `${su}`
  let pu = await solid.data[uri].as$published
  m.published = `${pu}`
  // Solid
  let at_name = await solid.data[`${at}`].vcard$fn || `${at}`.split("/")[2].split('.')[0];
  m.at_name = `${at_name}`
  let ph = await solid.data[`${at}`].vcard$hasPhoto
  m.at_photo = `${ph}` //!= "undefined" ? `${photo}` : "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"
  // tools
  m.delay = delay(`${pu}`)
  m.shortType = localName(`${ty}`)
  // activity
  let li = await solid.data[uri].as$link
  m.link = `${li}`
  return m
}

export async function activity (uri){
  let a = {}
/*  let objects = []
  for await (const object of solid.data[`${li}`].as$object){
    /*   let obj = {}
    obj.uri = `${object}`
    console.log(obj)
 obj.content = await solid.data[obj.uri].as$content*/
  /*  objects = [...objects, `${object}`]
  }
  m.activity.objects = objects*/
  /*  let obj = await solid.data[`${li}`].as$object
  m.activity.object = {}
  m.activity.object.uri = `${obj}`
  let cont = await solid.data[`${obj}`].as$content
  m.activity.object.content = `${cont}`*/

  return a
}

export async function objects (uri){
  let o = []

  return o
}

function localName(strPromise){
  let str = `${strPromise}`
  var ln = str.substring(str.lastIndexOf('#')+1);
  ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
  return ln
}

function delay(published){
  let diff = new Date().getTime() - new Date(published).getTime()
  let minute = 1000 * 60;
  let minutes = Math.floor(diff/minute);
  let heures = Math.floor(minutes/60);
  let jours = Math.floor(heures/24);
  let mois = Math.floor(jours/31);
  let annees = Math.floor(mois/12);
  let duree = ""
  annees > 0 ? duree+= annees+"y" :
  mois > 0 ? duree+= mois+"m" :
  jours > 0 ? duree += jours+"j":
  heures > 0 ? duree += heures+"h":
  minutes > 0 ? duree += minutes+"m":
  duree = diff/1000+ "s";
  return duree
}

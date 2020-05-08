export async function getConfig (webid) {
  console.log("GET CONFIG",webId)

  //return el
}

export async function checkConfig (webId){
  let config = {date: new Date(),

    storage: "undefined",
    pti: "undefined",
    instance: "undefined",
    /*inbox: "undefined",
    acl_inbox: "undefined",
    outbox: "undefined",
    origin: "undefined"
    followers_folder: "undefined",
    acl_followers: "undefined",
    following_folder: "undefined",
    liked: "undefined",
    disliked: "undefined",
    status: "undefined",
    progress: "undefined"*/
  }
  //console.log(webId)
  if(webId != null){
    //  console.log(webId)
    //  let wi = webId == undefined ? solid.data.user : solid.data[webId]
    let wi = solid.data[webId]
    let name = await wi.vcard$fn
    let storage = await wi.storage
    let pti = await wi.publicTypeIndex
    for await (const subject of solid.data[pti].subjects){
      if(pti != `${subject}`){
        if (`${subject}`.endsWith('#Agora')){
          let instance  = await solid.data[`${subject}`].solid$instance
          config.instance = `${instance}`
        }
      }
    }

    config.webId = webId
    config.storage = `${storage}`
    config.name = `${name}`
    config.pti = `${pti}`
  }
  return config
}

export async function setConfig (webId){
  let c = {}
  c.webId = webId
  let sn = await solid.data[webId].vcard$fn || webId.split("/")[2].split('.')[0];
  c.name = `${sn}`
  return c
}

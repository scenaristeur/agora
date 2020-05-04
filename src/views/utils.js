export function log ( text) {
  console.log("FROM common",text)
  //return el
}

export async function conf (webId){
  let c = {}
  c.webId = webId
  let sn = await solid.data[webId].vcard$fn || webId.split("/")[2].split('.')[0];
  c.name = `${sn}`
  return c
}

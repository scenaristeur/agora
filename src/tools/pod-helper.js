import { fetchDocument, createDocument } from 'tripledoc';
import { solid, schema, rdf, rdfs, space, foaf } from 'rdf-namespaces';

let pod = {}
let count = 0

function PodHelper(name,age){
  this.name = name
  this.age = age
  count = count+age
  this.count = count
  this.fileClient = SolidFileClient;
}

PodHelper.prototype.setWebId = function (_webId){
  var module = this
  console.log("UPDATE WEBID", _webId)
  if (_webId == null){
    pod = {}
  }else{
    pod.webId = _webId
    fetchDocument(pod.webId).then(
      doc => {
        //  pod.doc = doc;
        pod.person = doc.getSubject(pod.webId);
        pod.name = pod.person.getString(foaf.name)
        pod.storage = pod.person.getRef(space.storage)
        pod.publicTypeIndexUrl = pod.person.getRef(solid.publicTypeIndex)
      //  console.log("INIT publicTypeIndexUrl",pod.publicTypeIndexUrl)
        fetchDocument(pod.publicTypeIndexUrl).then(
          publicTypeIndex => {
            pod.publicTypeIndex = publicTypeIndex;
            pod.notesListEntry = pod.publicTypeIndex.findSubject(solid.forClass, schema.TextDigitalDocument);
            pod.picsListEntry = pod.publicTypeIndex.findSubject(solid.forClass, schema.MediaObject);

            //  console.log("app.notesListEntry",app.notesListEntry)
            if (pod.notesListEntry === null){
              pod.notesListUrl = module.initialiseNotesList(pod.person, pod.publicTypeIndex)
            }else{
              pod.notesListUrl = pod.notesListEntry.getRef(solid.instance)
              //  console.log("notesListUrl",app.notesListUrl)
            }
            fetchDocument(pod.notesListUrl).then(
              notesList => {
                pod.notesList = notesList;
              //  console.log("pod.notesList",pod.notesList)
                pod.notesUri = notesList.findSubjects(rdf.type, schema.TextDigitalDocument)
            //    console.log("notesUri",pod.notesUri)
              })
              /*
              console.log("pod.picsListEntry",pod.picsListEntry)
              if (pod.picsListEntry === null){
              pod.picsListUrl = this.initialisePicsList(pod.person, pod.publicTypeIndex)
            }else{
            pod.picsListUrl = pod.picsListEntry.getRef(solid.instance)
            console.log("picsListUrl",pod.picsListUrl)
          }
          fetchDocument(pod.picsListUrl).then(
          picsList => {
          pod.picsList = picsList;
          console.log("pod.picsList",pod.picsList)
          pod.picsUri = picsList.findSubjects(rdf.type, schema.TextDigitalDocument)
          console.log("picsUri",pod.picsUri)
        })
        */

      },
      err => {console.log(err)}
    );
  },
  err => {
    console.log(err)
  }
);
}
}






PodHelper.prototype.getWebId= function(){
  return pod.webId
}

PodHelper.prototype.getPod= function(key){
  return pod[key]
}




PodHelper.prototype.checkFootprints = function(webId, footprints){
  console.log(webId, footprints)
  var module = this;
  pod.webId = webId
  if(pod.webId != null){

    fetchDocument(pod.webId).then(
      doc => {
        //  pod.doc = doc;
        pod.person = doc.getSubject(pod.webId);
        pod.storage = pod.person.getRef(space.storage)
        footprints.forEach(function(fp){
          module.checkFolder(pod.storage,fp)
        })

      })
    }
  }

  PodHelper.prototype.checkFolder = function(storage, fp){
    var module = this;
    var folder = storage+fp.path
    pod[fp.name] = {}
    module.fileClient.readFolder(folder).then(
      success => {
        console.log("SUCCES read",success)
        pod[fp.name].folder = folder
        console.log(pod)
      },
      err => {
        console.log("error read",err)
        if (err.startsWith("404")){
          console.log("CREATE")
          module.fileClient.createFolder(folder).then(
            success => {
              console.log("SUCCESs create",success)
              pod[fp.name].folder = folder
              console.log(pod)
            },
            err => {console.log("ERROR create",err)})
          }
        })
      }





      PodHelper.prototype.initialiseNotesList = function(person,typeIndex){
        var module = this;
        if(pod.notesListUrl == null){
          pod.notesListUrl = pod.storage + 'public/notes.ttl';
          module.fileClient.readFolder(pod.storage+"public/Picpost/").then(
            success => {
              console.log("SUCCES read",success)


            },
            err => {

              console.log("error read",err)
              if (err.startsWith("404")){
                console.log("CREATE")
                module.fileClient.createFolder(pod.storage+"public/Picpost/").then(
                  success => {console.log("SUCCESs create",success)},
                  err => {console.log("ERROR create",err)})
                }


              })

              pod.notesList = createDocument(pod.notesListUrl);
              pod.notesList.save();

              // Store a reference to that Document in the public Type Index for `schema:TextDigitalDocument`:
              const typeRegistration = typeIndex.addSubject();
              typeRegistration.addRef(rdf.type, solid.TypeRegistration)
              typeRegistration.addRef(solid.instance, pod.notesList.asRef())
              typeRegistration.addRef(solid.forClass, schema.TextDigitalDocument)
              typeIndex.save([ typeRegistration ]);
            }

            return pod.notesListUrl
          }

          export {PodHelper}

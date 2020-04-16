/* This work is licensed under the W3C Software and Document License
* (http://www.w3.org/Consortium/Legal/2015/copyright-software-and-document).
*/

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    // Get content from the network.
    try {
      return await fetch(event.request);
    } catch (e) {
      // Failure. Just return a 200 page, to satisfy Lighthouse.
      return new Response('You are offline :(', {status: 200});
    }
  })());
});

onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  //  if (event.request.url.startsWith('https://scenaristeur.github.io/agora/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/'));

  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    alert('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};

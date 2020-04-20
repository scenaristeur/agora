# agora

# install
```
git clone https://github.com/scenaristeur/agora.git
cd agora
npm install

```


During install you will certainely get this error about evejs :
```
ERROR in ./src/agents/hello-agent.js
Module not found: Error: Can't resolve 'evejs/dist/eve.custom.js' in 'C:\Users\Smag\Documents\dev\agora\src\agents'
@ ./src/agents/hello-agent.js 2:0-43 6:2-5 8:15-18 12:37-40
@ ./src/views/friends-view.js
@ ./src/index.js
```
so YOU NEED TO BUILD EVEJS

# Build a minimal browser version in dist/eve.custom.js
```
npm install -g browserify
cd node_modules/evejs
browserify custom.js -o dist/eve.custom.js -s eve
```

then cd back to agora & relaunch npm install
```
cd ../..
npm install
```

# Run dev server on http://localhost:9000
```
npm run dev
```

#Build for prod in /dist folder
```
npm run prod
```

# publish to gh & /dist to gh-pages
```
git add .
git commit -m "my modif"
git push && git subtree push --prefix dist origin gh-pages
```


# flow
1- not logged
* show first help,
* show public ?

2- invite to set CONTROL to this app

3- First Login
* check config & update if needed

4- show all app

--------------
1- logged
* get share-target params & show app


# todo
[ ]  review post,post-tabs...
[ ] https://mstdn.fr/web/accounts/146921, https://joinmastodon.org/ , https://fr.mstdn.wiki/Accueil





# navigation & code splitting in lit-html
https://vaadin.com/learn/tutorials/lit-element/navigation-and-code-splitting

# WEB APIS EXAMPLES
# pwa-share
https://github.com/GoogleChrome/samples

https://github.com/GoogleChrome/samples/tree/gh-pages/web-share

https://bugzilla.mozilla.org/buglist.cgi?quicksearch=web+share+target

# web share
https://web.dev/web-share/

# receive-share
https://web.dev/web-share-target/

# file web-share-target
https://paul.kinlan.me/fr/file-web-share-target/
see manifest & sw

# free hossting
https://zeit.co/pricing

# erreur gh-pages

```
 git push origin --delete gh-pages
 git subtree push --prefix dist origin gh-pages
```
# illustrations
https://undraw.co/illustrations

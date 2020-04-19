# agora

# install
```
git clone https://github.com/scenaristeur/agora.git
cd agora
npm install

```
YOU NEED TO BUILD EVEJS

# Build a minimal browser version in dist/eve.custom.js
```
npm install -g browserify
cd node_modules/evejs
browserify custom.js -o dist/eve.custom.js -s eve
```

# Run dev server
```
npm run dev
```

#Build for prod in /dist folder
```
npm run prod
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



# publish to gh
git push && git subtree push --prefix dist origin gh-pages

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

# instagram-birthday-event-demo-app
莉子ちゃんの生誕企画用のデモアプリです. 
React初心者の習作なので色々多めに見てほしい. 

# deploy
masterに`/src`以下, または`.github./workflows/github-pages.yml`に変更があるコミットが積まれるとActionが走って自動でデプロイされる  

https://sioremon.github.io/instagram-birthday-event-demo-app/

# 新しい画像に差し替えるとき
1. 現在の`/src/assets/latest.jpg`を`./src/assets/old_images/`以下に移動させる
2. 新しい画像を`/src/assets/latest.jpg`として保存する
3. コミットして`main`にpushする

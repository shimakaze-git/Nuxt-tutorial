<template>
  <div class="container">
    <div>
      <h1 class="title">
        SignIn
      </h1>
      <h2 class="subtitle">
        名前とパスワードを入力
      </h2>
      <form action="/signin" method="post">
        <div>
          <label>ユーザー名：</label>
          <input type="text" name="username">
        </div>
        <div>
          <label>パスワード：</label>
          <input type="password" name="password">
        </div>
        <div>
          <input type="submit" value="ログイン">
        </div>
      </form>
    </div>
  </div>
</template>

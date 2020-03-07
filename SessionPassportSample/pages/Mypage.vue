<template>
  <div class="container">
    <div>
      <h1 class="title">
        MyPage
      </h1>
      <h2 class="subtitle">
        {{ userName }}
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mypage',
  data () {
    return {
      userName: 'No　Name'
    }
  },
  created () {
    this.$axios
      .$get('/api/mypage/user')
      .then((res) => {
        console.log('res', res)
        this.userName = `こんにちは、${res.name}さん`
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>

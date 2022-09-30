import { users } from '../endpoints.js'
import store from '../store.js'

export default {
  name: 'Login',

  data() {
    return {
      emailInput: '',
      passwordInput: '',
    }
  },

  methods: {
    async handleSubmit() {
      const response = await fetch(users.login(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.emailInput,
          password: this.passwordInput
        })
      })
      if (response.ok) {
        const body = await response.json()
        store.me.id = body.data.id
        store.me.email = body.data.email
        store.me.accessToken = body.data.token
        this.$router.push('/')
      }
    }
  },

  template: `
    <div class="mt-4 container-fluid mw-100" style="width: 400px">
      <h4>Please log in</h4>
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">Email</label>
          <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email" v-model="emailInput">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="passwordInput">
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary" @click.prevent="handleSubmit">Log in</button>
          <router-link to="/signup" class="btn btn-outline-secondary ml-2">Sign up</router-link>
        </div>
      </form>
    </div>
  `
}

import auth0js from 'auth0-js'

const auth0 = new auth0js.WebAuth({
  domain: 'dev-ktsqeuzd.us.auth0.com',
  clientID: 'PQCG74RfeG82t2J8C4JgV4wZ33D2Wrcr',
})
export default auth0

const LoginForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleLogin }) => {

  return(
    <div>
      <h2> Log in to the application </h2>

      <form onSubmit={handleLogin} autoComplete="off">
        <div>
                    Username <input value={username} onChange={handleUsernameChange} />
        </div>

        <div>
                    Password <input type="password" value={password} name="Password" autoComplete="off" onChange={handlePasswordChange} />
        </div>

        <div>
          <button type="submit">Login</button>
        </div>

      </form>
    </div>
  )


}

export default LoginForm
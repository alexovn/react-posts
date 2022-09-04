import React, {useContext} from 'react'
import MyInput from '../Components/UI/Input/MyInput'
import MyButton from '../Components/UI/Button/MyButton'
import { AuthContext } from '../context/context'

function Login() {
  const {isAuth, setIsAuth} = useContext(AuthContext)

  const login = event => {
    event.preventDefault();
    setIsAuth(true);
    localStorage.setItem('auth', 'true');
  }

  return (
    <div>
      <h1>Страница для логина</h1>
      <form onSubmit={login}>
        <MyInput type="text" placeholder='Введите логин' />
        <MyInput type="text" placeholder='Введите пароль' />
        <MyButton>
          Войти
        </MyButton>
      </form>
    </div>
  )
}

export default Login
import React from 'react'
import api from '../../services/api'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [loading, setLoading] = React.useState(false)
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const navigate = useNavigate()

    const HandleSubmit = async (ev) => {
        ev.preventDefault()
        setLoading(true)
        try {
            const response = await api.post("login", {
                username: username, 
                password: password
            })
            Cookies.set('access_token', response.data.access_token)
            navigate('./mapa')
            return response
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <html className="h-full bg-white">
      <body className="h-full"> 
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8  border-solid border-2 border-indigo-600 rounded-md shadow-lg">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                className="mx-auto h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Entre com sua conta
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={HandleSubmit} method="POST">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-left">
                    Usuário
                    </label>
                    <div className="mt-2">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Senha
                    </label>
                    <div className="text-sm">
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Esqueceu a senha?
                        </a>
                    </div>
                    </div>
                    <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    </div>
                </div>

                <div>
                    <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    {loading ? "Carregando..." : "Entrar"}
                    </button>
                </div>
                </form>
                <p className="mt-10 text-center text-sm text-gray-500">
                Não tem uma conta?{' '}
                <a href="/cadastrar" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Cadastre-se grátis
                </a>
                </p>
            </div>
            </div>
            </body>
        </html>
  )
}

export default Login
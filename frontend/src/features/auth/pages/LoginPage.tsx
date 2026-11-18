import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthPageLayout from '../components/AuthPageLayout'

function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [error, setError] = useState('')

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            setError('')
            try {
                await login(value.email, value.password)
                navigate('/categorias', { replace: true })
            } catch (submitError: unknown) {
                setError(submitError instanceof Error
                    ? submitError.message
                    : 'No se pudo iniciar sesión. Verificá tus credenciales.')
            }
        },
    })

    return (
        <AuthPageLayout>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    form.handleSubmit()
                }}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
            >
                <h1 className="mb-2 text-center text-3xl font-bold">
                    Food Store
                </h1>

                <p className="mb-6 text-center text-gray-500">
                    Iniciá sesión para continuar
                </p>

                {error && (
                    <div role="alert" className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form.Field
                    name="email"
                    validators={{
                        onBlur: ({ value }) =>
                            value.trim() ? undefined : 'El email es obligatorio',
                    }}
                >
                    {(field) => (
                        <div className="mb-4">
                            <label htmlFor={field.name} className="mb-2 block font-medium">
                                Email
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                type="email"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                required
                                className="w-full rounded-lg border p-3"
                                placeholder="correo@ejemplo.com"
                                autoComplete="email"
                            />
                            {field.state.meta.errors.map((fieldError) => (
                                <p key={String(fieldError)} className="text-sm text-red-600">
                                    {fieldError}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>

                <form.Field
                    name="password"
                    validators={{
                        onBlur: ({ value }) =>
                            value ? undefined : 'La contraseña es obligatoria',
                    }}
                >
                    {(field) => (
                        <div className="mb-6">
                            <label htmlFor={field.name} className="mb-2 block font-medium">
                                Contraseña
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                required
                                className="w-full rounded-lg border p-3"
                                placeholder="Tu contraseña"
                                autoComplete="current-password"
                            />
                            {field.state.meta.errors.map((fieldError) => (
                                <p key={String(fieldError)} className="text-sm text-red-600">
                                    {fieldError}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>

                <form.Subscribe selector={(state) => state.isSubmitting}>
                    {(isSubmitting) => (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-orange-600 p-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
                        </button>
                    )}
                </form.Subscribe>

                <p className="mt-6 text-center text-sm text-gray-600">
                    ¿No tenés cuenta?{' '}
                    <Link
                        to="/register"
                        className="font-semibold text-orange-600 hover:underline"
                    >
                        Registrate
                    </Link>
                </p>
            </form>
        </AuthPageLayout>
    )
}

export default LoginPage

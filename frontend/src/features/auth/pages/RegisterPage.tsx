import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthPageLayout from '../components/AuthPageLayout'

function RegisterPage() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [error, setError] = useState('')

    const form = useForm({
        defaultValues: {
            nombre: '',
            apellido: '',
            email: '',
            celular: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            setError('')
            try {
                await register({
                    ...value,
                    celular: value.celular || null,
                })
                navigate('/login', { replace: true })
            } catch (submitError: unknown) {
                setError(submitError instanceof Error
                    ? submitError.message
                    : 'No se pudo completar el registro.')
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
                    Crear cuenta
                </h1>

                <p className="mb-6 text-center text-gray-500">
                    Registrate en Food Store
                </p>

                {error && (
                    <div role="alert" className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form.Field
                    name="nombre"
                    validators={{
                        onBlur: ({ value }) =>
                            value.trim() ? undefined : 'El nombre es obligatorio',
                    }}
                >
                    {(field) => (
                        <div className="mb-4">
                            <label htmlFor={field.name} className="mb-2 block font-medium">
                                Nombre
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                type="text"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                required
                                className="w-full rounded-lg border p-3"
                                autoComplete="given-name"
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
                    name="apellido"
                    validators={{
                        onBlur: ({ value }) =>
                            value.trim() ? undefined : 'El apellido es obligatorio',
                    }}
                >
                    {(field) => (
                        <div className="mb-4">
                            <label htmlFor={field.name} className="mb-2 block font-medium">
                                Apellido
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                type="text"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                required
                                className="w-full rounded-lg border p-3"
                                autoComplete="family-name"
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

                <form.Field name="celular">
                    {(field) => (
                        <div className="mb-4">
                            <label htmlFor={field.name} className="mb-2 block font-medium">
                                Celular (opcional)
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                type="tel"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                className="w-full rounded-lg border p-3"
                                autoComplete="tel"
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field
                    name="password"
                    validators={{
                        onBlur: ({ value }) =>
                            value.length >= 8
                                ? undefined
                                : 'La contraseña debe tener al menos 8 caracteres',
                    }}
                >
                    {(field) => (
                        <div className="mb-4">
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
                                minLength={8}
                                className="w-full rounded-lg border p-3"
                                autoComplete="new-password"
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
                            {isSubmitting ? 'Registrando...' : 'Registrarme'}
                        </button>
                    )}
                </form.Subscribe>

                <p className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tenés cuenta?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-orange-600 hover:underline"
                    >
                        Iniciar sesión
                    </Link>
                </p>
            </form>
        </AuthPageLayout>
    )
}

export default RegisterPage

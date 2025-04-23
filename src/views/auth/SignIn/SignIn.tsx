import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Selamat Datang!</h3>
                <p>Masukkan nama pengguna dan kata sandi untuk dapat masuk!</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn

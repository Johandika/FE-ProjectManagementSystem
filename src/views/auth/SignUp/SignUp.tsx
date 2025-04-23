import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Daftar</h3>
                <p>Buat akunmu dengan mengisi form dibawah ini</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp

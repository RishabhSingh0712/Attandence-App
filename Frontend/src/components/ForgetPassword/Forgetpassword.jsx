import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ForgetPassword() {

    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate();

    const forgetPasswordHandler = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:5000/api/user/ForgetPassword", { Email, Password }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const { msg, err, success } = res.data

            if (success) {
                setEmail('')
                setPassword('')
                setAlertMessage("Password successfully changed!");
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after 2 seconds
                }, 2000);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            // Handle error if necessary
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            {/* Alert Message */}
            {alertMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded fixed top-0 left-0 right-0 z-50">
                    <strong className="font-bold">Success! </strong>
                    <span className="block sm:inline">{alertMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setAlertMessage(null)}>
                        <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path fillRule="evenodd" d="M14.348 5.652a.5.5 0 00-.708 0L10 9.293 6.36 5.652a.5.5 0 00-.708.708L9.293 10l-3.64 3.64a.5.5 0 00.708.708L10 10.707l3.64 3.64a.5.5 0 00.708-.708L10.707 10l3.64-3.64a.5.5 0 000-.708z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            )}

            {/* main div  */}
            <div className='bg-gray-100 shadow-md px-10 py-10 rounded-xl'>
                {/* Top Heading  */}
                <div>
                    <h1 className='text-center text-black text-xl mb-4 font-bold'>Forget Password</h1>
                </div>
                {/* Input 1 Email  */}
                <div>
                    <input
                        type="email"
                        name='email'
                        className='bg-[#beb9b1] border border-green-700 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                        placeholder='Enter your email'
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {/* Input 2 Password  */}
                <div>
                    <input
                        type="password"
                        className='bg-[#beb9b1] border border-green-700 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                        placeholder='Enter new password'
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* Button For Login  */}
                <div className='flex justify-center mb-3'>
                    <button
                        className='bg-blue-500 w-full text-white font-bold px-2 py-2 rounded-lg'
                        onClick={forgetPasswordHandler}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword;

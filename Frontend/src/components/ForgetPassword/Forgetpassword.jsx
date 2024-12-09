import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ForgetPassword() {

    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [alertMessage, setAlertMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const navigate = useNavigate();

    const forgetPasswordHandler = async () => {
        try {
            setIsLoading(true); // Set loading to true when the request starts
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
            alert("Please enter a valid email address", error);
            // Handle error if necessary
        } finally {
            setIsLoading(false); // Set loading to false when the request completes
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
                        className='bg-blue-500 w-full text-white font-bold px-2 py-2 rounded-lg relative'
                        onClick={forgetPasswordHandler}>
                        {isLoading && <span className="absolute inset-0 flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12c0-3.042-1.135-5.824-3-7.938l-3 2.647A7.962 7.962 0 0120 12h4zm-6 7.938A7.962 7.962 0 0120 12h-4c0 2.208-.896 4.208-2.344 5.662l3 2.647zM8 4.062C9.344 2.547 11.199 1.5 13.333 1.5v4c-1.6 0-3.036.764-3.98 1.939L8 4.062z"></path>
                            </svg>
                        </span>}
                        <span>{isLoading ? 'Processing...' : 'Done'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword;

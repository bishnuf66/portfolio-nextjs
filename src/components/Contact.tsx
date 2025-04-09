import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import DownloadCVButton from './DownloadCVButton'; // Use the correct case

const Contact = ({ isDarkMode }) => {
    return (
        <div className={`p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <h1 className="text-2xl font-bold mb-4">
                <Typewriter
                    words={['Contact Me']}
                    loop={1}
                    cursor
                    cursorStyle='_'
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                />
            </h1>
            <p className="mb-4">
                Feel free to reach out for collaborations, inquiries, or just to connect. Let's discuss how we can bring your next project to life!
            </p>

            {/* Social Links */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Follow Me</h2>
                <div className="flex space-x-4">
                    <a href="https://github.com/bishnuf66" target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:text-blue-600 `}>
                        Github
                    </a>
                    <a href="https://www.facebook.com/bishnu.bk.315" target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:text-blue-600 `}>
                        Facebook
                    </a>
                    <a href="https://www.linkedin.com/in/bishnu-bk-820b09243/" target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:text-blue-600 `}>
                        LinkedIn
                    </a>
                    {/* Add more social links as needed */}
                </div>
            </div>

            {/* Contact Information */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
                <p>Email: b0677908@gmail.com</p>
            </div>
            <div className='mt-2'>
                <DownloadCVButton/>
            </div>
        </div>
    );
};

export default Contact;

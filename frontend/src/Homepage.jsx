import React, {useState, useEffect} from 'react'
import { IoMdChatbubbles } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './Firebase';
import AIChatPopup from './AIChatPopup';

function Homepage() {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const handleLogout = async() => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('error signing out: ', error);
        }
    };
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        });
        return () => unsubscribe(); 
    }, [navigate]);

  const toggleChat = ()=>{
    setIsChatOpen(!isChatOpen);
  };
  const handleCropRecommendation =() => {
    navigate('/crop-recommendation');
  }
  return (
    <div className='min-h-screen bg-amber-50'>
        {/* Naviagtion */}
        <nav className='bg-white shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16'>
                    <div className="flex items-center">
                        <span className='text-2xl font-bold text-amber-600'>Agriculture</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="#" className='text-gray-700 hover:text-amber-600'>Home</a>
                        
                        <div onClick={()=>navigate("/forum")} className='text-gray-700 hover:text-amber-600'>Forum</div>
                        <a href="#" className='text-gray-700 hover:text-amber-600'>About</a>
                        <a href="#" className='text-gray-700 hover:text-amber-600'>Sevices</a>
                        <a href="#" className='text-gray-700 hover:text-amber-600'>Contact</a>
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Logout
                        </button>
                        ):(
                        <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
                        onClick={() => navigate("/login")}
                        >
                            Log In
                        </button>)}
                    </div>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <div className='bg-gradient-to-b from-amber-100 to-amber-50 py-16'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center'>
                    <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl'>
                       Smart Farming Solutions for small-scale Farmers. 
                    </h1>
                    <p className='mt-3 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 md:max-w-3xl'>
                        Help your crops thrive with data-driven planting schedules and crop rotation strategies.
                    </p>
                    <div className='mt-10'>
                        <button onClick={handleCropRecommendation} className="bg-amber-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-amber-700 shadow-md">
                            Find the right crops
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* who are we? */}
        <section className='py-12 bg-white' id='who-are-we'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <h2 className='text-3xl font-bold text-center text-gray-900 mb-8'>Who are we?</h2>
                <div className='bg-amber-100 rounded-xl p-6 shadow-md'>
                    <p className='text-lg text-gray-700'>
                        Agricultural Website was made with one mission in mind: to support farmers through smart and straightforward technology. We have built an easy-to-use app that gives helpful advice about what crops to grow, the best time to plant, and how to use water in a better way. Even though the app uses AI and modern tools, it is made simple so that any farmer can use it with ease. 
Our goal is to make farming smarter, easier, and sustainable for the future. We focus on creating tools that are practical, reliable, and accessible to those who need them most. Agricultural Website is built for farmers, with farmers, to support them every step of the way.
                    </p>
                </div>
            </div>
        </section>

        {/* what do we do? */}
            {/* - Crop rotation Simulator
                - Smart Crop Planning  
                - Knowledge Sharing    */}

        <section className='py-12 bg-amber-50' id='what-do-we-do'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <h2 className='text-3xl font-bold text-center text-gray-900 mb-8'>What do we do?</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='bg-white rounded-xl p-6 shadow-md hover:shadow-lg transtion-shadow'>
                        <h3 className='text-xl font-semibold text-amber-600 mb-3'>Crop Rotation Simulator</h3>
                        <p className='text-gray-700'>
                            Our app helps farmers choose the right crops to grow by looking at the weather, soil, and market demand. It suggests which crops to plant next so that the land stays healthy and gives better harvests over time.
                        </p>
                    </div>
                    <div className='bg-white rounded-xl p-6 shadow-md hover:shadow-lg transtion-shadow'>
                        <h3 className='text-xl font-semibold text-amber-600 mb-3'>Smart Crop Planning</h3>
                        <p className='text-gray-700'>
                            We give farmers a step-by-step plan to follow for the whole season. This includes when to prepare the land, when to plant, and when to harvest. The goal is to make farming more organized, while saving time, water, and effort.
                        </p>
                    </div>
                    <div className='bg-white rounded-xl p-6 shadow-md hover:shadow-lg transtion-shadow'>
                        <h3 className='text-xl font-semibold text-amber-600 mb-3'>Knowledge Sharing</h3>
                        <p className='text-gray-700'>
                            Farmers can connect with each other, share their own experiences, and learn from others in the community. This helps everyone grow together by learning new methods, solving problems, and getting support when needed.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials */}
        <section className='py-12 bg-white' id="testimonials">
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <h2 className='text-3xl font-bold text-center text-gray-900 mb-8'>Testimonials</h2>
                <div className='relative'>
                    {/* left scroll button */}
                    <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 text-amber-600 hover:bg-amber-50'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {/* content */}
                    <div className='flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory' style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                        <div className='flex-none w-80 mx-2 snap-center'>
                            <div className='bg-amber-50 rounded-xl p-6 shadow-md h-full'>
                                <p className='italic text-gray-700 mb-4'>Website has transformed the way i plan my crops. The scheduling suggestions have increased my yeild by 30% this season!</p>
                                <p className='font-semibold text-amber-600'>Rohan, Small-scale farmer</p>
                            </div>
                        </div>
                        <div className='flex-none w-80 mx-2 snap-center'>
                            <div className='bg-amber-50 rounded-xl p-6 shadow-md h-full'>
                                <p className='italic text-gray-700 mb-4'>Website has transformed the way i plan my crops. The scheduling suggestions have increased my yeild by 30% this season!</p>
                                <p className='font-semibold text-amber-600'>Rohan, Small-scale farmer</p>
                            </div>
                        </div>
                        <div className='flex-none w-80 mx-2 snap-center'>
                            <div className='bg-amber-50 rounded-xl p-6 shadow-md h-full'>
                                <p className='italic text-gray-700 mb-4'>Website has transformed the way i plan my crops. The scheduling suggestions have increased my yeild by 30% this season!</p>
                                <p className='font-semibold text-amber-600'>Rohan, Small-scale farmer</p>
                            </div>
                        </div>
                        <div className='flex-none w-80 mx-2 snap-center'>
                            <div className='bg-amber-50 rounded-xl p-6 shadow-md h-full'>
                                <p className='italic text-gray-700 mb-4'>Website has transformed the way i plan my crops. The scheduling suggestions have increased my yeild by 30% this season!</p>
                                <p className='font-semibold text-amber-600'>Rohan, Small-scale farmer</p>
                            </div>
                        </div>
                        <div className='flex-none w-80 mx-2 snap-center'>
                            <div className='bg-amber-50 rounded-xl p-6 shadow-md h-full'>
                                <p className='italic text-gray-700 mb-4'>Website has transformed the way i plan my crops. The scheduling suggestions have increased my yeild by 30% this season!</p>
                                <p className='font-semibold text-amber-600'>Rohan, Small-scale farmer</p>
                            </div>
                        </div>
                    </div>
                    {/* right scroll button */}
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 text-amber-600 hover:bg-amber-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
        

        {/* Call to action */}
        <section className='py-12 bg-amber-100'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'> Ready to optimize your farm?</h2>
                <p className='text-lg text-gray-700 mb-8'>Join thousands of farmers who are making data-driven decisions with Website.</p>
                <button className='bg-amber-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-amber-700 shadow-md'>
                    Get Started Today
                </button>
            </div>
        </section>

        {/* Chat Support */}

        <div className='fixed bottom-6 right-6 group'>
            <div className='absolute -top-12 right-0 bg-gray-800 text-white px-2 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity'>AI Assistant</div>
            <button className='bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700' onClick={toggleChat}>
                <IoMdChatbubbles size={24}/>
            </button>
        </div>
        <AIChatPopup isOpen={isChatOpen} onClose={()=>setIsChatOpen(false)}/>


        {/* Contact/Footer */}

        <section className='py-12 bg-gray-600 text-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                    <div>
                        <h3 className='text-2xl text-bold'> Agriculture Website </h3>
                        <p className='mb-4'> Revolutionising crop rotation through data-driven tools </p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
                        <ul className='space-y-2'>
                            <li><a href="#" className='text-gray-300 hover:text-white'>Home</a></li>
                            <li><a href="#who-are-we" className='text-gray-300 hover:text-white'>Who are we?</a></li>
                            <li><a href="#what-do-we-do" className='text-gray-300 hover:text-white'>What do we do?</a></li>
                            <li><a href="#testimonials" className='text-gray-300 hover:text-white'>Testimonials</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Services</h3>
                        <ul className='space-y-2'>
                            <li><a href="#" className='text-gray-300 hover:text-white'>Crop planning</a></li>
                            <li><a href="#" className='text-gray-300 hover:text-white'>Knowledge Sharing</a></li>
                            <li><a href="#" className='text-gray-300 hover:text-white'>Data Driven content</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Contact</h3>
                        <ul className='space-y-2'>
                            <li className='text-gray-300 hover:text-white'>Email: tharunmukesh.tm@gmail.com</li>
                            <li className='text-gray-300 hover:text-white'>Phone: 9100423218</li>
                            <li className='text-gray-300 hover:text-white'>Address: </li>
                        </ul>
                    </div>
                </div>
                <div className='mt-8 border-t border-gray-700 pt-6 text-center'>
                    <p className='text-gray-100'>© 2025 Website. All rights reserved</p>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Homepage
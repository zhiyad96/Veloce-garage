import React from 'react';

const About = () => {
    return (
        <div className="pt-25 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            
            <div className="relative bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                            About <span className="text-gray-600">Our Story</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Welcome to veloce Car Accessories — your ultimate destination for high-quality car accessories that combine style, comfort, and performance.
                        </p>
                    </div>
                </div>
            </div>

            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            At Veloce Car Accessories, our mission is to transform every drive into a premium experience.
                            We aim to provide innovative, reliable, and stylish car accessories that enhance both the look and comfort of your vehicle.

                            We believe that every car reflects its owner’s personality — and we’re here to help you express that with confidence.
                            From high-performance upgrades to elegant interior designs, our goal is to make quality car customization accessible to everyone.

                            Driven by passion and powered by trust, we continue to expand our collection with products that combine technology, craftsmanship, and style — ensuring that you and your car are always ready for the road ahead.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-md p-2">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="ml-4 text-base text-gray-700">Enhance Every Drive – To provide premium-quality accessories that make every journey safer, more comfortable, and more stylish.</p>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0  rounded-md p-2">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="ml-4 text-base text-gray-700">Innovate with Purpose – To continuously bring modern, reliable, and tech-driven products that improve your driving experience.</p>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-md p-2">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="ml-4 text-base text-gray-700">Build Trust & Passion – To deliver exceptional value and service that earns the trust of every car enthusiast.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0">
                        <img
                            className="rounded-lg shadow-lg object-cover w-full h-64 sm:h-80 lg:h-96"
                            src="https://jagadambamotors.com/wp-content/uploads/2024/05/jagadamba-banner-image.png"
                            alt="car accessories"
                        />
                    </div>
                </div>

               
                <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 sm:p-12">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-black">50k+</p>
                            <p className="mt-2 text-sm font-medium text-gray-500">Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-black">5⭐</p>
                            <p className="mt-2 text-sm font-medium text-gray-500">Reviews</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-black">24/7</p>
                            <p className="mt-2 text-sm font-medium text-gray-500">Available</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-black">99%</p>
                            <p className="mt-2 text-sm font-medium text-gray-500">Client Satisfaction</p>
                        </div>
                    </div>
                </div>

              
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900">Our Values</h2>
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                title: "Innovation",
                                description: "We constantly push boundaries and explore new possibilities.",
                                icon: "💡"
                            },
                            {
                                title: "Quality",
                                description: "We never compromise on quality and attention to detail.",
                                icon: "⭐"
                            },
                            {
                                title: "Collaboration",
                                description: "We believe great things happen when we work together.",
                                icon: "🤝"
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="text-3xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                                <p className="mt-2 text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
            <div className="bg-gray-600">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                        <span className="block">Ready to get started?</span>
                        <span className="block text-indigo-200">Get in touch with us today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-indigo-50"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
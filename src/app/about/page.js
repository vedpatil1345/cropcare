'use client'

const About = () => {
  return (
    <>
      {/* About Section Header */}
      <div className="mx-auto max-w-7xl text-center mb-8 px-5 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl mb-4">
          About CropCare
        </h2>
        <p className="max-w-2xl mx-auto text-xl text-gray-600">
          CropCare is an AI-powered farming assistant designed to help farmers identify plant diseases and make informed decisions for healthier crop management.
        </p>
      </div>

      {/* Description + Image */}
      <div className="mt-10 mx-auto max-w-7xl grid md:grid-cols-2 gap-10 px-5">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Why CropCare?
          </h3>
          <p className="text-gray-600">
            We built CropCare to bridge the gap between farmers and expert guidance using artificial intelligence. With real-time plant disease detection, expert recommendations, and smart agricultural tips, CropCare is here to support sustainable and efficient farming practices.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Built for farmers with accessibility in mind</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Powered by modern AI and machine learning technologies</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Delivers actionable advice for healthier yields</span>
            </li>
          </ul>
        </div>

        {/* About Image */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            <img
              src="/pic2.png"
              alt="AI Agriculture Support"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Developer Credits */}
      <div className="mx-auto max-w-4xl text-center mt-16 px-5 mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Project Developed By</h3>
        <p className="text-lg text-gray-600">
          Ved Patil, Vishwaa Bhavsar, and Vrutant Mistry
        </p>
      </div>
    </>
  );
};

export default About;

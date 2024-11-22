import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, School, Users, Star, GraduationCap, Clock, Phone, Mail, DollarSign } from 'lucide-react';

const schools = [
  {
    id: 1,
    name: "Cambridge School",
    location: "New Delhi, India",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
    students: "2,500+",
    established: "1931",
    uniforms: {
      boys: {
        summer: ["White Shirt", "Navy Blue Trousers", "Black Shoes", "School Tie"],
        winter: ["Navy Blue Blazer", "Grey Sweater", "White Shirt", "School Tie"],
        sports: ["House T-Shirt", "Track Pants", "White Sports Shoes"]
      },
      girls: {
        summer: ["White Shirt", "Navy Blue Skirt", "White Socks", "Black Shoes"],
        winter: ["Navy Blue Blazer", "Grey Sweater", "White Shirt", "School Tie"],
        sports: ["House T-Shirt", "Track Pants", "White Sports Shoes"]
      }
    },
    uniformPrice: {
      boys: 150,
      girls: 140
    },
    description: "A prestigious institution known for academic excellence and holistic development.",
    website: "https://cambridge.edu",
    rating: 4.8,
    reviews: 320,
    accreditation: "CBSE",
    facilities: ["Smart Classrooms", "Sports Complex", "Science Labs", "Library"],
    timings: "8:00 AM - 2:30 PM",
    contact: {
      phone: "+91 11 2234 5678",
      email: "info@cambridge.edu"
    },
    admissionOpen: true,
    uniformAvailability: "In Stock"
  },
  {
    id: 2,
    name: "Delhi Public School",
    location: "Delhi, India",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
    students: "3,000+",
    established: "1949",
    uniforms: {
      boys: {
        summer: ["White Shirt", "Grey Trousers", "Red Tie"],
        winter: ["Maroon Blazer", "Grey Sweater", "White Shirt"],
        sports: ["Track Suit", "House T-Shirt", "Sports Shoes"]
      },
      girls: {
        summer: ["White Shirt", "Grey Skirt", "Red Tie"],
        winter: ["Maroon Blazer", "Grey Sweater", "White Shirt"],
        sports: ["Track Suit", "House T-Shirt", "Sports Shoes"]
      }
    },
    uniformPrice: {
      boys: 120,
      girls: 110
    },
    description: "One of India's most respected chains of public schools.",
    website: "https://dps.edu",
    rating: 4.7,
    reviews: 450,
    accreditation: "CBSE",
    facilities: ["Digital Labs", "Swimming Pool", "Auditorium", "Sports Fields"],
    timings: "8:00 AM - 2:30 PM",
    contact: {
      phone: "+91 11 2234 5678",
      email: "info@dps.edu"
    },
    admissionOpen: true,
    uniformAvailability: "In Stock"
  },
  {
    id: 3,
    name: "St. Mary's School",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    students: "2,800+",
    established: "1955",
    uniforms: [
      { type: "Summer", items: ["Blue Shirt", "Grey Trousers/Skirt", "School Tie"] },
      { type: "Winter", items: ["Blue Blazer", "School Sweater", "Blue Shirt"] },
      { type: "Sports", items: ["Sports T-Shirt", "Track Pants", "Sports Shoes"] }
    ],
    uniformPrice: {
      boys: 100,
      girls: 90
    },
    description: "Providing quality education with strong moral values since 1955.",
    website: "https://stmarys.edu",
    rating: 4.6,
    reviews: 380,
    accreditation: "ICSE",
    facilities: ["Science Park", "Computer Labs", "Music Room", "Art Studio"],
    timings: "8:00 AM - 2:30 PM",
    contact: {
      phone: "+91 11 2234 5678",
      email: "info@stmarys.edu"
    },
    admissionOpen: true,
    uniformAvailability: "In Stock"
  }
];

const renderUniformSection = (uniforms, uniformPrice) => {
  if (!uniforms || !uniformPrice) {
    return <div>No uniform information available</div>;
  }

  if (Array.isArray(uniforms)) {
    // Handle old structure
    return (
      <div className="space-y-2">
        {uniforms.map((uniform, index) => (
          <div key={index}>
            <h5 className="text-xs font-semibold text-primary-700 mb-1">{uniform.type}</h5>
            <p className="text-sm text-primary-800">{uniform.items.join(", ")}</p>
          </div>
        ))}
      </div>
    );
  }

  // Handle new structure - add safety checks
  if (!uniforms.boys || !uniforms.girls) {
    return <div>Invalid uniform structure</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h5 className="text-sm font-semibold text-primary-700">Boys</h5>
        <span className="text-sm font-bold text-primary-900">${uniformPrice.boys}</span>
      </div>
      <div className="text-sm text-primary-800 space-y-1">
        {uniforms.boys.summer && (
          <p><span className="font-medium">Summer:</span> {uniforms.boys.summer.join(", ")}</p>
        )}
        {uniforms.boys.winter && (
          <p><span className="font-medium">Winter:</span> {uniforms.boys.winter.join(", ")}</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <h5 className="text-sm font-semibold text-primary-700">Girls</h5>
        <span className="text-sm font-bold text-primary-900">${uniformPrice.girls}</span>
      </div>
      <div className="text-sm text-primary-800 space-y-1">
        {uniforms.girls.summer && (
          <p><span className="font-medium">Summer:</span> {uniforms.girls.summer.join(", ")}</p>
        )}
        {uniforms.girls.winter && (
          <p><span className="font-medium">Winter:</span> {uniforms.girls.winter.join(", ")}</p>
        )}
      </div>
    </div>
  );
};

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const locations = ['all', 'delhi', 'mumbai', 'bangalore'];

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || 
                           school.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Hero Section with red and white radiant background */}
      <div className="relative bg-white overflow-hidden mb-12">
        <div className="absolute inset-0">
          {/* Multiple layered gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-100/60 via-white to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-red-200/20 via-transparent to-white" />
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200"
            alt="School Building"
            className="w-full h-full object-cover opacity-5 mix-blend-overlay"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full 
                          bg-gradient-to-r from-red-500 to-red-600 shadow-lg 
                          shadow-red-500/20 mb-8 group hover:scale-105 transition-all duration-300">
              <GraduationCap className="h-5 w-5 text-white group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium text-white">Partner Schools Network</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 sm:text-6xl bg-gradient-to-br from-red-600 to-red-900 
                           bg-clip-text text-transparent drop-shadow-sm">
              Find Your School
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium">
              Explore our network of partner schools and their uniform requirements
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-xl 
                               blur opacity-25 group-hover:opacity-40 transition duration-1000 
                               group-hover:duration-200"></div>
                <input
                  type="text"
                  placeholder="Search schools by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative w-full pl-14 pr-4 py-5 rounded-xl 
                           bg-white shadow-xl border border-red-100
                           focus:border-red-300 focus:ring-2 focus:ring-red-100 
                           text-gray-900 placeholder-gray-400
                           transition-all duration-300"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-red-500" />
                
                {/* Decorative elements */}
                <div className="absolute -right-6 -top-6 h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 
                               rounded-full blur-xl opacity-20"></div>
                <div className="absolute -left-4 -bottom-4 h-10 w-10 bg-gradient-to-br from-red-500 to-red-600 
                               rounded-full blur-xl opacity-20"></div>
              </div>
            </div>
            
            {/* Decorative shapes */}
            <div className="absolute top-10 right-10 h-20 w-20 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 h-32 w-32 bg-red-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-red-50 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Location Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-4">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedLocation === location
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {location.charAt(0).toUpperCase() + location.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Updated Schools Grid with consistent heights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map((school) => (
            <div key={school.id} className="group h-full">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                {/* School Image Section */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={school.image}
                    alt={school.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{school.name}</h3>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {school.location}
                    </div>
                  </div>
                  {school.admissionOpen && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                        Admissions Open
                      </span>
                    </div>
                  )}
                </div>

                {/* Updated School Info with Uniform Requirements */}
                <div className="p-6 space-y-6 flex-grow">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <School className="h-5 w-5 mx-auto mb-1 text-primary-600" />
                      <div className="text-sm font-medium text-gray-900">{school.established}</div>
                      <div className="text-xs text-gray-500">Established</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-primary-600" />
                      <div className="text-sm font-medium text-gray-900">{school.students}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div className="text-center">
                      <Star className="h-5 w-5 mx-auto mb-1 text-primary-600" />
                      <div className="text-sm font-medium text-gray-900">{school.rating}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>

                  {/* Updated Uniform Section with Safe Rendering */}
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-primary-900 mb-3">Uniform Requirements</h4>
                    {renderUniformSection(school.uniforms, school.uniformPrice)}
                    <div className="mt-3 pt-3 border-t border-primary-100">
                      <div className="text-sm font-medium text-primary-900">
                        Status: {school.uniformAvailability}
                      </div>
                    </div>
                  </div>

                  {/* Important Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{school.timings}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{school.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{school.contact.email}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      {school.accreditation}
                    </span>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schools; 
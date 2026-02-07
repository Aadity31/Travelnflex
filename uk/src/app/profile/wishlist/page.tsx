"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Heart, Search, ArrowUpDown, ArrowRight, Star, MapPin, Clock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: _session } = useSession();
  const router = useRouter();

  // Mock wishlist data
  const wishlistItems = [
    {
      id: 1,
      type: "destination",
      name: "Mussoorie",
      location: "Uttarakhand, India",
      rating: 4.7,
      reviews: 1400,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHt908RDU8F-l7ix5GHWoaAi3Tmn9umRjTtj0DX1cZUocPZ4EJwXgWF5BBWzUBqQoIiKGGKk2vt03lEdOB1sA6AaTJWm75pfYO66nYFtKi4Hq6h1kf_fN1zkVN8nmYGjWgGsA3EP27WDHAnGZUFSNVPx5JuuQ9cNoci1vcSwyjFaC-6bIg-aNVABcyACIlqVphxBWO54xEp-ZGHyfftGMJk6MqX76Q6L-Xa25_OJyNZ5ncfenjD95Qu2WwyzGUflippbvQJ4lwGvmM",
      description: "The Queen of Hills, beloved for colonial charm, waterfalls, and scenic viewpoints offering breathtaking vistas.",
    },
    {
      id: 2,
      type: "destination",
      name: "Auli",
      location: "Uttarakhand, India",
      rating: 4.8,
      reviews: 1120,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDETzGH13HD6_YUq4ILQw6NdOQ8oZs1c4dukbU_JJMnZE706AJZUO6wqUZw_YUdgfeMWdXj5dQ5BXjugMPqPTLdI3upFoVu6Na3HpezaEm9O_injZBZNlYTf5VGwuEcN2G0ZxjpESrffxAm4SFnPrTQrd4J0Bgyg3gH1PyDHReVx_DqXohD4znJqo5hD8Gj9Ub4T9z8rrYyWrrymuoMlyx1ESl5LABDYFeU4YSvt1mhXlQc7yTm1K8QG3MwMpLV3SAMSPjze32lJOej",
      description: "A famous hill station in Uttarakhand, known for world-class skiing slopes and panoramic Himalayan views.",
    },
    {
      id: 3,
      type: "destination",
      name: "Yamunotri",
      location: "Uttarakhand, India",
      rating: 4.6,
      reviews: 850,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlaR1PH2C-mUtym4KE8vh_c9ZLcv93adyCVj9cH-Suv53wRiEaZtFimDFxqjjWslJObVotlwMH6Y7nQ2NH4PJRXOl3xEE1t2FR3n7NNXY2U-w6PoQs7pz2TAmX_dI8X2sPZEb6FYfY3ex6YENBM35HSVICgt5AY9uZJJi2ftSoOFFc3_adHgVa4PR5dqVyasykggrdGFewEfu2i9q6hfGtn_Skv_ZEA08QPeJA-bcQ7dmC1rO0YQrPcDx9zUd0a7fibS6OugYRMzG9",
      description: "The sacred source of the River Yamuna and the seat of the Goddess Yamuna. Part of Chota Char Dham.",
    },
    {
      id: 4,
      type: "activity",
      category: "Spiritual",
      name: "Evening Meditation",
      location: "Rishikesh",
      rating: 4.7,
      price: 399,
      originalPrice: 599,
      duration: "1 hr",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Xkink4iYYwL2r9Aw93LYUJcylfjOz8FVSpXC7RgUwnxRHoh5jEdQDMdbhPEYG142OSac_phlnI5hfyAMsTcPYaJ3Ede0TCMcltDMqb_teh7jnbEXdwd88G6lgg-AOEc8rT0FUsrflvjVsPgUr8oSb3CIL8ymcTRvDyEcp-qtpM_8ZhUM9TvAseKxsBjEGpoTPfZ3OL91euwgf3YeMAPAlC8NxkJYaIYXU5BTA1m6pS9ILI7S15I7gq-CEDWCxud30WoGpj2F9Qpr",
      description: "Guided evening meditation by the Ganges for mental peace and spiritual awakening.",
    },
    {
      id: 5,
      type: "activity",
      category: "Trekking",
      name: "Kunjapuri Sunrise Trek",
      location: "Rishikesh",
      rating: 4.7,
      price: 899,
      originalPrice: 1299,
      duration: "4 hrs",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4CGSXrzfBY37ztn9r0cVt6m7uxRX78qyeaxiAcY2MDCMdpGM9EQTHceHhugZOxFvbvYEVexjvzcDCM4ZJ7c3RCfGaPd8saVaCBUclaZHnx080CKYHElX3j_B06U13jK2rLf4jZ7cPYod3-MNJlpQf9gub8F5nF3cmOP-uWDyULwqdA_mquzyqpob_L6L7leuZx8vsw8vsAJz7_CjG5_5NTuHEg2Isvde1eroOLECdbpUx96c1F9XV-hOodA07f6vNhAXcBqhu2iYd",
      description: "Early morning trek for panoramic Himalayan sunrise views from the Kunjapuri temple.",
    },
    {
      id: 6,
      type: "activity",
      category: "Cultural",
      name: "Haridwar Heritage Walk",
      location: "Haridwar",
      rating: 4.5,
      price: 599,
      originalPrice: 899,
      duration: "3 hrs",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFL1RHGumC2L6PMvrA-kTldO7CYCUCpth5D3kiRvfytywwte88P96zN0hpd83KyvmR-RuFcnge7MdW1loiRcUUXH3bqU49JVu2kJbWXgK0NuVXd1zU1dbKEKUBtXHHevxQLxe7w0TnJIW5vRuykzn0JVdW-WS3YF-PwzLzt54KwbiDfFe5oqLAP5_RM9u18IW758gIqNKjr7aQd4bbZAsqiFynxxvSVfmZj9EhkHaMFaGvxVlPBkFqIOX8eLF_T1LZLMhJu5DsqiVW",
      description: "Explore ancient ghats, temples, and stories of Haridwar's rich mythological history.",
    },
  ];

  // Recommendations
  const recommendations = [
    {
      id: 101,
      name: "Yoga Retreat in Rishikesh",
      price: 3999,
      rating: 4.9,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW2T0soxorCsaUdGBTtx3pOVezO5PUJmp1LDJiTH2iK-iKjFQUtsT9mWdsUeoOT1lolaYfcADW63UPaLuRz19Kdtj7lwyHcnBqPFSLL3lJDiAhe6Fk-CyZG2PcBHmtX53-Eo66nZniC46Uwn_hE4-ITQmWPcB5KloavAx_wmGr-7fPlh-2h9x78PTScD2GuqTXcJFn5QMHoctLVsFSDumohKFWj6kxPNn-3RaCm3GqX8SIo12ytSjX-g6dC_8z_k0T6tTDwBf_LY4_",
    },
    {
      id: 102,
      name: "Char Dham Yatra Package",
      price: 12999,
      rating: 4.8,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnJAX5MGgY6D8e-EoKz8-lTvX9NdDBUWIJ6EzyIDAr1nVGicL_SZFDvyR4y_AXNHD-ffA3vioDLRZ5C61qyHrRBfFTU2zSTmE9ktGn48yURRBVw4UntT8SKwEEUIqbEjdj-9eUr3PeUmAIbpDleuJ1VC1uqgojI3fG9UpP1FqRhy4qRsE80vkna7n8Go_t4nG330hHQv3LidyZ69J0i0Fs7x328uH14mgyEXSvMADLrDEMCq9PKo6cUxW3ZO23Pp1WVZcD7OGV61eC",
    },
    {
      id: 103,
      name: "Varanasi Evening Aarti",
      price: 800,
      rating: 4.9,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXZslZWZtpLV-Fgt3CGjsQwefrlGhbGCjTvy1IDYyHEd3sFoDuhuA8wZm-YSoWK0_d9HW4jh7QIIRq7jKknebRSsB72s1wxXzzK4QwhUp8ZSxXbo9ahpqjhQB0tN7G-CLbglxnu7i-uBWyQmpDCubgZy_VGxE1C99B5VbjSXkmHj2j6tRzn-2o5A2ClfRa6QSurXk2ChXczUEmp8pgcibIykEaQx06f_qGd_Z51vyZyFqEBKlnjOlsmZuQAqz4_vORiNwRg53eYN4q",
    },
    {
      id: 104,
      name: "River Rafting Adventure",
      price: 1500,
      rating: 4.7,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCT_-Hd6jcsYlG1GWx6egMgyK9KQneD90DWkNPd75Bxsy3tfPNQ3txrxkfJbCR82PDEtdiVZGVDf6Tl6uS7Q1-ZVGpXPFXpg84EmrcTuy0yFBx-_14m6fHUgKVLzryQKfp6eYqSNUDzwnyp_s2DtS5jIeesVp9uDYn487NRktrpNwDcBTZZX19KUbQcyututi8NJC9M66IK0ZvzUCVdhuxbszG8AyKfmfhcgoIpHtO3WcIcPiEcDBd5IPPyTDdduT3wGxj52ITRVpr5",
    },
  ];

  const filters = [
    { label: "All Items", count: 6 },
    { label: "Destinations", count: 3 },
    { label: "Activities", count: 3 },
    { label: "Price: Low to High", count: null },
    { label: "Top Rated", count: null },
  ];

  const filteredItems = wishlistItems.filter((item) => {
    if (activeFilter === "All Items") return true;
    if (activeFilter === "Destinations") return item.type === "destination";
    if (activeFilter === "Activities") return item.type === "activity";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-2">
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-orange-500 text-sm flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </li>
            <li>
              <span className="text-gray-400 text-sm">/</span>
            </li>
            <li>
              <a href="/profile" className="text-gray-500 hover:text-orange-500 text-sm">
                Profile
              </a>
            </li>
            <li>
              <span className="text-gray-400 text-sm">/</span>
            </li>
            <li>
              <span className="text-orange-500 font-medium text-sm">
                Wishlist
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and organize your saved destinations and adventures.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none w-full shadow-sm text-gray-900"
              placeholder="Search saved items..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-gray-700 hover:border-orange-500 transition-colors shadow-sm text-sm font-medium">
              <Search className="w-4 h-4" />
              Filters
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-gray-700 hover:border-orange-500 transition-colors shadow-sm text-sm font-medium">
              <ArrowUpDown className="w-4 h-4" />
              Sort by: Recently Added
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-gray-200 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setActiveFilter(filter.label)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter.label
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {filter.label}
              {filter.count && ` (${filter.count})`}
            </button>
          ))}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
            >
              <div className="h-48 relative overflow-hidden">
                <Image
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={item.image}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    className="bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  {item.type === "destination" ? (
                    <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-md font-bold shadow-sm">
                      Destination
                    </span>
                  ) : (
                    <span
                      className={`${
                        item.category === "Spiritual"
                          ? "bg-purple-600"
                          : item.category === "Trekking"
                          ? "bg-green-600"
                          : "bg-indigo-600"
                      } text-white text-xs px-2.5 py-1 rounded-md font-bold shadow-sm uppercase tracking-wider`}
                    >
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold line-clamp-1 group-hover:text-orange-500 transition-colors text-gray-900">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs font-bold">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    {item.rating}
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-xs mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.location}
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>

                {"price" in item ? (
                  // Activity card with price
                  <>
                    <div className="flex items-end justify-between mt-auto mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-orange-500">
                          ₹{item.price}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.originalPrice}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2">
                        View Details
                      </button>
                    </div>
                  </>
                ) : (
                  // Destination card with reviews
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {item.reviews}+ Reviews
                    </span>
                    <button className="text-orange-500 hover:text-orange-700 font-semibold text-sm flex items-center gap-1 group-hover:underline">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* You Might Also Like */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              You Might Also Like
            </h2>
            <a
              className="text-orange-500 text-sm font-medium hover:underline flex items-center gap-1"
              href="#"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative rounded-xl overflow-hidden h-40 mb-3 bg-gray-200">
                  <Image
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    src={item.image}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <button className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm hover:bg-white text-white hover:text-red-500 p-1.5 rounded-full transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
                  {item.name}
                </h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-orange-500 font-bold text-sm">
                    ₹{item.price}
                  </p>
                  <div className="flex items-center text-xs text-gray-600">
                    <Star className="w-3 h-3 text-yellow-500 fill-current mr-0.5" />
                    {item.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

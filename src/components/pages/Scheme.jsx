import React from 'react';
import { ExternalLink, FileText, Calendar, Hash } from 'lucide-react'; // Removed Download import

const governmentSchemesData = [
  {
    srNo: 1,
    title: "Agriculture Infrastructure Fund",
    publishDate: "12-06-2024",
    details: [
      { type: "link", text: "Link", href: "http://agriinfra.dac.gov.in/" }
    ]
  },
  {
    srNo: 2,
    title: "PM-Kisan Samman Nidhi",
    publishDate: "28-12-2023",
    details: [
      { type: "link", text: "Link", href: "https://pmkisan.gov.in/" }
    ]
  },
  {
    srNo: 3,
    title: "ATMA",
    publishDate: "04-04-2025",
    details: [
      { type: "link", text: "Link", href: "https://extensionreforms.da.gov.in/DashBoard_Statusatma.aspx" }
    ]
  },
  {
    srNo: 4,
    title: "AGMARKNET",
    publishDate: "14-03-2014",
    details: [
      { type: "link", text: "Link", href: "http://agmarknet.gov.in/PriceAndArrivals/arrivals1.aspx" }
    ]
  },
  {
    srNo: 5,
    title: "Horticulture",
    publishDate: "05-04-2014",
    details: [
      { type: "link", text: "Link", href: "http://midh.gov.in/nhmapplication/feedback/midhKPI.aspx" }
    ]
  },
  {
    srNo: 6,
    title: "Online Pesticide Registration",
    publishDate: "23-09-2009",
    details: [
      // Removed download link
    ]
  },
  {
    srNo: 7,
    title: "Plant Quarantine Clearance",
    publishDate: "05-01-2011",
    details: [
      { type: "link", text: "Link", href: "https://pqms.cgg.gov.in/pqms-angular/home" }
    ]
  },
  {
    srNo: 8,
    title: "DBT in Agriculture",
    publishDate: "12-05-2014",
    details: [
      { type: "link", text: "Link", href: "https://www.dbtdacfw.gov.in/" }
    ]
  },
  {
    srNo: 9,
    title: "Pradhanmantri Krishi Sinchayee Yojana",
    publishDate: "06-05-2016",
    details: [
      { type: "link", text: "Link", href: "https://pmksy.gov.in/mis/frmDashboard.aspx" }
    ]
  },
  {
    srNo: 10,
    title: "Kisan Call Center",
    publishDate: "01-05-2015",
    details: [
      { type: "link", text: "Link", href: "https://mkisan.gov.in/Home/KCCDashboard" }
    ]
  },
  {
    srNo: 11,
    title: "mKisan",
    publishDate: "06-05-2015",
    details: [
      { type: "link", text: "Link", href: "https://mkisan.gov.in/" }
    ]
  },
  {
    srNo: 12,
    title: "Jaivik Kheti",
    publishDate: "18-05-2015",
    details: [
      { type: "link", text: "Link", href: "https://pgsindia-ncof.gov.in/home.aspx" }
    ]
  },
  {
    srNo: 13,
    title: "e-Nam",
    publishDate: "04-10-2016",
    details: [
      { type: "link", text: "Link", href: "https://enam.gov.in/" }
    ]
  },
  {
    srNo: 14,
    title: "Soil Health Card",
    publishDate: "01-09-2016",
    details: [
      { type: "link", text: "Link", href: "https://soilhealth.dac.gov.in/" }
    ]
  },
  {
    srNo: 15,
    title: "Pradhan Mantri Fasal Bima Yojana",
    publishDate: "05-08-2017",
    details: [
      { type: "link", text: "Link", href: "https://pmfby.gov.in/ext/rpt/ssfr_17" }
    ]
  }
];

export default function Schemes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-6">
            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">Official Government Programs</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Government Schemes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore various government schemes and initiatives designed to support farmers and boost agricultural development across India.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <th className="py-4 px-6 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Sr. No
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Scheme Title
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Publish Date
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {governmentSchemesData.map((scheme, index) => (
                    <tr 
                      key={index} 
                      className={`transition-colors hover:bg-green-50 dark:hover:bg-gray-700 ${
                        index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-750'
                      }`}
                    >
                      <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {scheme.srNo}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {scheme.title}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">
                          {scheme.publishDate}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {scheme.details.map((detail, detailIndex) => (
                            <a
                              key={detailIndex}
                              href={detail.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40 text-green-700 dark:text-green-300 text-sm rounded-full transition-colors duration-200"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {detail.text}
                            </a>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="grid gap-6">
            {governmentSchemesData.map((scheme, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 dark:border-gray-700">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{scheme.srNo}</span>
                    </div>
                    <h2 className="text-white font-semibold text-lg flex-1">{scheme.title}</h2>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Published: {scheme.publishDate}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Available Resources:
                    </h3>
                    <div className="space-y-2">
                      {scheme.details.map((detail, detailIndex) => (
                        <a
                          key={detailIndex}
                          href={detail.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-300 rounded-xl transition-colors duration-200 group"
                        >
                          <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">{detail.text}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
              Stay Updated with Latest Schemes
            </h3>
            <p className="text-green-600 dark:text-green-400 max-w-2xl mx-auto">
              Government schemes are regularly updated. Make sure to check the official links for the most current information and application procedures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
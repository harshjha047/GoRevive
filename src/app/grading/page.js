"use client";
import React, { useState } from 'react';

export default function GoReviveGrading() {
  const [activeTab, setActiveTab] = useState('Laptops');

  const tabs = ['Laptops', 'MacBooks', 'Mobile Phones', 'Desktops', 'Monitors'];

  const gradeColumns = [
    { id: 'A', name: 'Grade A', description: 'As good as new', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 'B', name: 'Grade B', description: 'Minimal Sign of Usage', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'C', name: 'Grade C', description: 'Visible usage / Minor issues', badge: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { id: 'D', name: 'Grade D', description: 'Visible usage / Functional issues', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'E', name: 'Grade E', description: 'Dead / Major Lock', badge: 'bg-red-100 text-red-800 border-red-200' },
  ];

  // Exact data mapped from all 5 images provided
  const gradingData = {
    Laptops: [
      {
        category: "Display",
        items: [
          { param: 'Dot (White/Black)', A: 'No', B: 'May/may not have 1-2 dots (1mm)', C: 'May/may not have 1-5 dots (2-5mm)', D: 'Above 5mm', E: 'May or May not have' },
          { param: 'Patch', A: 'No', B: 'No', C: 'No', D: 'May have 1-10 patches (up to 50mm)', E: 'May or May not have' },
          { param: 'Line / Broken', A: 'No', B: 'No', C: 'No', D: 'May or may not be', E: 'May or May not have' },
          { param: 'Flickering / Scratch', A: 'No', B: 'No / May have Minor Scratch', C: 'No / May have Major scratch', D: 'May or may not be / Major scratch', E: 'May or May not have' },
          { param: 'Color Discoloration', A: 'No', B: 'No', C: 'May or may not have', D: 'Yes', E: 'May or May not have' },
          { param: 'Keyboard Impression', A: 'No', B: 'May or may not have minor', C: 'May or may not', D: 'May or may not', E: 'May or May not have' },
        ]
      },
      {
        category: "A/B/C/D Panel (Physical)",
        items: [
          { param: 'Scratch', A: 'No visible scratch from 12" Gap', B: 'Moderate wear from 12" Gap', C: 'May have Hard scratch / Paint peel', D: 'May have Hard scratch / Paint peel', E: 'May have Hard scratch / Paint peel' },
          { param: 'Dent', A: 'No', B: 'May have minor', C: 'May or may not be', D: 'May or may not be', E: 'May or may not have' },
          { param: 'Broken / Crack', A: 'No', B: 'No', C: 'May or may not be', D: 'May or may not be', E: 'May or may not have' },
          { param: 'Screen Rubber', A: 'OK', B: 'May or may not be Ok', C: 'May or may not be Ok', D: 'May or may not be Ok', E: 'May or may not be Ok' },
        ]
      },
      {
        category: "Hardware & Functionality",
        items: [
          { param: 'Battery Health', A: 'Excellent', B: 'Good', C: 'Fair / Missing', D: 'Poor / Missing', E: 'May or may not be Ok' },
          { param: 'Camera / Mic / Speaker', A: 'Working', B: 'Working', C: 'May or may not have Some Issue', D: 'May or may not have Some Issue', E: 'May or may not have Some Issue' },
          { param: 'Keyboard', A: 'Working / No broken keys', B: 'Working / No broken keys', C: 'May have Some Issue / Missing keys', D: 'May or may not be working', E: 'May or may not be working' },
          { param: 'Touchpad / Fingerprint', A: 'Working', B: 'Working', C: 'May or may not have Some Issue', D: 'May or may not have Some Issue', E: 'Not Working / Scratch Marks' },
          { param: 'Ports (USB, HDMI, LAN)', A: 'Working', B: 'Working', C: 'May or may not have Some Issue', D: 'May or may not have Some Issue', E: 'Not Working / Broken' },
          { param: 'Hinge', A: 'Ok', B: 'Ok', C: 'May or may not be loose/broken', D: 'May or may not be loose/broken', E: 'May or may not be loose/broken' },
          { param: 'RAM & Storage', A: 'Working', B: 'Working', C: 'May or may not have Issue', D: 'May or may not be Missing', E: 'Faulty / Missing' },
        ]
      }
    ],
    MacBooks: [
       {
        category: "Display",
        items: [
          { param: 'Dot (White/Black)', A: 'No', B: 'May/may not have 1-2 dots (1mm)', C: 'May/may not have 1-5 dots (2-5mm)', D: 'Above 5mm', E: 'May or May not have' },
          { param: 'Patch', A: 'No', B: 'No', C: 'No', D: 'May have 1-10 patches (up to 50mm)', E: 'May or May not have' },
          { param: 'Line / Broken', A: 'No', B: 'No', C: 'No', D: 'May or may not be', E: 'May or May not have' },
          { param: 'Color Discoloration', A: 'No', B: 'No', C: 'May or may not have', D: 'May or may not have', E: 'May or May not have' },
          { param: 'Keyboard Impression', A: 'No', B: 'May or may not have minor', C: 'May or may not', D: 'May or may not', E: 'May or May not have' },
        ]
      },
      {
        category: "A/B/C/D Panel (Physical)",
        items: [
          { param: 'Scratch', A: 'No visible scratch from 12" Gap', B: 'Moderate wear from 12" Gap', C: 'May have Hard scratch / Paint peel', D: 'May have Hard scratch / Paint peel', E: 'May have Hard scratch / Paint peel' },
          { param: 'Dent / Broken', A: 'No', B: 'May have minor / No broken', C: 'May or may not be', D: 'May or may not be', E: 'May or may not have' },
          { param: 'Screen Rubber', A: 'OK', B: 'May or may not be Ok', C: 'May or may not be Ok', D: 'May or may not be Ok', E: 'May or may not be Ok' },
        ]
      },
      {
        category: "Apple Hardware",
        items: [
          { param: 'Battery Cycle Count', A: 'Normal', B: 'Normal', C: 'May have Service recommendation', D: 'May have Service recommendation', E: 'May or may not be Ok' },
          { param: 'Camera / Mic / Speaker', A: 'Working', B: 'Working', C: 'May or may not be working', D: 'May or may not be working', E: 'May or may not have Some Issue' },
          { param: 'Keyboard', A: 'Working / No broken keys', B: 'Working / No broken keys', C: 'May have Some Issue / Missing keys', D: 'May or may not be working', E: 'May or may not be working' },
          { param: 'Touchpad / Fingerprint', A: 'Working', B: 'Working', C: 'May or may not have Some Issue', D: 'May or may not have Some Issue', E: 'Not Working / Scratch Marks' },
          { param: 'Ports (USB, HDMI, LAN)', A: 'Working', B: 'Working', C: 'May or may not have Some Issue', D: 'May or may not have Some Issue', E: 'Not Working / Broken' },
          { param: 'RAM & Storage', A: 'Working', B: 'Working', C: 'May or may not have Issue', D: 'May or may not be Missing', E: 'Faulty / Missing' },
        ]
      }
    ],
    'Mobile Phones': [
      {
        category: "General Condition",
        items: [
          { param: 'Body', A: 'No Dents / Spots / Scratches', B: 'Minor dent / Scratches', C: 'Major dent / Hard Scratch / Glass Crack / Missing buttons / Loose panels', D: 'Physical defects may or may not be present', E: 'Physical defects may or may not be present' },
          { param: 'Overall Functionality', A: 'No functional defects', B: 'No functional defects', C: 'Minor Functional Defects', D: 'Major Functional Defects', E: 'Not ON / SIM not working' },
          { param: 'iCloud Lock / MDM', A: 'No', B: 'No', C: 'No', D: 'No', E: 'Yes' },
          { param: 'Power ON', A: 'Yes', B: 'Yes', C: 'Yes', D: 'Yes', E: 'No' },
        ]
      },
      {
        category: "Display & Glass",
        items: [
          { param: 'Display Panel', A: 'Ok', B: 'Ok', C: 'Dot', D: 'Patch / Broken', E: 'No On' },
          { param: 'Front Glass', A: 'Ok', B: 'Ok', C: 'Minor scratch', D: 'Major Scratch / Broken', E: 'Broken' },
          { param: 'Back / Side Panel', A: 'Ok', B: 'Ok', C: 'Minor scratch', D: 'Major Scratch / Broken', E: 'Broken' },
        ]
      },
      {
        category: "Hardware Components",
        items: [
          { param: 'Battery Health', A: 'Battery Health >= 90%', B: 'Battery Health >= 80%', C: 'Battery Health >= 75%', D: 'Battery Service', E: 'Not Working' },
          { param: 'Cameras (Front & Back)', A: 'Working', B: 'Working', C: 'Working', D: 'Not working', E: 'Not working' },
          { param: 'Sensors (Face ID, Fingerprint, Proximity)', A: 'Working', B: 'Working', C: 'Might be Not Working', D: 'Not working', E: 'Not working' },
          { param: 'Audio (Speaker, Earpiece, Mic)', A: 'Working', B: 'Working', C: 'Might be Not Working', D: 'Not working', E: 'Not working' },
          { param: 'Connectivity (Cellular, Wi-Fi, Bluetooth)', A: 'Working', B: 'Working', C: 'Might be Not Working', D: 'Not working', E: 'Not working' },
          { param: 'Buttons (Volume, Alert Slider)', A: 'Working', B: 'Working', C: 'Might be Not Working', D: 'Not working', E: 'Not working' },
          { param: 'Charging Port', A: 'Working', B: 'Working', C: 'Might be Not Working', D: 'Not working', E: 'Not working' },
        ]
      }
    ],
    Desktops: [
      {
        category: "Overall Quality Parameter",
        items: [
          { param: 'Condition', A: 'No visible sign of wear from 12" / Functionally OK', B: 'May or may not have signs of wear / Minor Dents / Functionally OK', C: 'Visible wear / Major Dents / Minor Parts Problem', D: 'Visible wear / Major Dents / Physically Broken', E: 'Dead Unit / Major Dents / BIOS Lock / Apple ID Lock' },
        ]
      },
      {
        category: "Cabinet / Front Bezel",
        items: [
          { param: 'Scratch', A: 'No visible scratch from 12" Gap', B: 'Moderate sign of wear and tear from 12" Gap', C: 'Deep scratch', D: 'Deep Scratch', E: 'Deep Scratch' },
          { param: 'Dent', A: 'No', B: 'Minors dents', C: 'Major dents', D: 'Major dents', E: 'Major dents' },
          { param: 'Broken / Crack', A: 'No', B: 'No', C: 'Yes', D: 'Yes', E: 'Yes' },
        ]
      },
      {
        category: "Ports & Hardware",
        items: [
          { param: 'Speaker / Mic', A: 'Working', B: 'Working', C: 'Not Working / Cracked sound', D: 'Not Working / Cracked sound', E: 'Not Working' },
          { param: 'Ports (USB, HDMI, LAN, VGA)', A: 'Working', B: 'Working', C: 'Not Working / Broken', D: 'Not Working / Broken', E: 'Not Working / Broken' },
          { param: 'RAM', A: 'All OK', B: 'All OK', C: 'Faulty', D: 'Faulty / Missing', E: 'Faulty / Missing' },
          { param: 'Storage', A: 'All OK', B: 'All OK', C: 'Minor problem', D: 'Major problems', E: 'Major problems / Missing' },
        ]
      }
    ],
    Monitors: [
       {
        category: "Overall Quality Parameter",
        items: [
          { param: 'Condition', A: 'No visible wear from 12" / Functionally OK', B: 'Visible sign of wear / Minor Dents / Functionally OK', C: 'Visible sign of wear / Major Dents / Minor Parts Problem', D: 'Visible wear / Major Dents / Physically Broken', E: 'Dead Unit / Visible wear / Physically Broken' },
        ]
      },
      {
        category: "Screen",
        items: [
          { param: 'Dot White or Black', A: 'No', B: 'Up to 0-3 dots 1mm', C: '0-5 dots, 2-5mm', D: '0-10 dots, above 5mm', E: '0-20 dots, above 5mm' },
          { param: 'Patch', A: 'No', B: 'No', C: '0-3 patches, upto 10mm', D: '0-10 patches, 0-50mm', E: '0-10 patches, 0-50mm' },
          { param: 'Line / Broken', A: 'No', B: 'No', C: 'No', D: 'Yes', E: 'Yes' },
          { param: 'No Display', A: 'No', B: 'No', C: 'No', D: 'Yes', E: 'Yes' },
          { param: 'Flickering / Color Discoloration', A: 'No', B: 'No', C: 'No / Yes', D: 'Yes', E: 'Yes' },
        ]
      },
      {
        category: "Front / Back / Side / Stand",
        items: [
          { param: 'Scratch', A: 'No visible scratch from 12" Gap', B: 'Moderate sign of wear and tear from 12" Gap', C: 'Deep scratch', D: 'Deep Scratch', E: 'Deep Scratch' },
          { param: 'Dent', A: 'No', B: 'Minors dents', C: 'Major dents', D: 'Major dents', E: 'Major dents' },
          { param: 'Broken / Crack', A: 'No', B: 'No', C: 'Minor Broken / Crack', D: 'Major Broken / Crack', E: 'Major Broken / Crack' },
        ]
      }
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 font-sans">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            GoRevive Grading Parameters
          </h2>
          <p className="text-lg text-slate-500">
            Total transparency across our entire catalog. Select a device category below to see exactly what to expect from every grade tier.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/30 transform scale-105 ring-2 ring-blue-700 ring-offset-2'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* The Matrix Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              
              {/* Table Header */}
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 bg-white p-5 border-b-2 border-slate-200 w-72 shadow-[inset_-1px_0_0_rgba(226,232,240,1)]">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {activeTab} Parameters
                    </span>
                  </th>
                  {gradeColumns.map((grade) => (
                    <th key={grade.id} className="bg-white p-5 border-b-2 border-slate-200 min-w-[180px] align-top">
                      <div className="flex flex-col items-center text-center">
                        <span className={`inline-block px-5 py-2 rounded-full text-sm font-bold border mb-2 ${grade.badge}`}>
                          {grade.name}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {grade.description}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Dynamic Table Body */}
              <tbody className="divide-y divide-slate-100">
                {gradingData[activeTab].map((group, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {/* Category Sub-Header */}
                    <tr className="bg-slate-50/80 border-y border-slate-200">
                      <td colSpan={6} className="sticky left-0 px-6 py-4 shadow-[inset_-1px_0_0_rgba(226,232,240,1)] bg-slate-50/90 backdrop-blur-sm z-10">
                        <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          {group.category}
                        </h3>
                      </td>
                    </tr>

                    {/* Category Items */}
                    {group.items.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                        {/* Fixed first column */}
                        <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/50 p-6 shadow-[inset_-1px_0_0_rgba(226,232,240,1)]">
                          <span className="font-bold text-slate-700 text-sm">{row.param}</span>
                        </td>
                        
                        {/* Grade Data Columns */}
                        {gradeColumns.map((grade) => (
                          <td key={grade.id} className="p-6 text-center border-l border-slate-50/50">
                            <span className={`text-sm leading-relaxed block ${
                                grade.id === 'A' ? 'text-emerald-700 font-semibold' :
                                grade.id === 'E' ? 'text-red-600' :
                                'text-slate-600'
                            }`}>
                              {row[grade.id]}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
              
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
"use client"

import { useState } from 'react'
import { ChevronRightIcon, MapPinIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const provinces = [
  { 
    code: 'EC', 
    name: 'Eastern Cape', 
    icon: '🌊',
    representative: 'Harry Trisos',
    phone: '073 185 2130',
    whatsapp: '27714329190',
    payfastUser: 'Nadine Marshall',
    bio: 'Regional distributor for Eastern Cape, Western Cape, Northern Cape and KwaZulu-Natal with extensive experience in health supplements.'
  },
  { 
    code: 'FS', 
    name: 'Free State', 
    icon: '🌾',
    representative: 'Riegal Du Toit',
    phone: '071 432 9190',
    whatsapp: '27714329190',
    payfastUser: 'Nadine Marshall',
    bio: 'Experienced health product specialist serving Free State, Gauteng, North West and Limpopo communities.'
  },
  { 
    code: 'GP', 
    name: 'Gauteng', 
    icon: '🏙️',
    representative: 'Riegal Du Toit',
    phone: '071 432 9190',
    whatsapp: '27714329190',
    payfastUser: 'Nadine Marshall',
    bio: 'Leading wellness consultant in Gauteng, Free State, North West and Limpopo with expertise in gut health and natural supplements.'
  },
  { 
    code: 'KZN', 
    name: 'KwaZulu-Natal', 
    icon: '🏖️',
    representative: 'Harry Trisos',
    phone: '073 185 2130',
    whatsapp: '27714329190',
    payfastUser: 'Nadine Marshall',
    bio: 'KZN regional manager also covering Western Cape, Eastern Cape and Northern Cape, specializing in natural health products.'
  },
  { 
    code: 'LP', 
    name: 'Limpopo', 
    icon: '🌳',
    representative: 'Riegal Du Toit',
    phone: '071 432 9190',
    whatsapp: '27714329190',
    payfastUser: 'Nadine Marshall',
    bio: 'Local health advocate in Limpopo, Gauteng, Free State and North West with deep knowledge of wellness approaches.'
  },
  { 
    code: 'MP', 
    name: 'Mpumalanga', 
    icon: '⛰️',
    representative: 'Nadine Marshall',
    phone: '081 890 9814',
    whatsapp: '27818909814',
    payfastUser: 'Nadine Marshall',
    bio: 'Mpumalanga distributor with years of experience in health supplements and customer care excellence.'
  },
  { 
    code: 'NC', 
    name: 'Northern Cape', 
    icon: '🏜️',
    representative: 'Harry Trisos',
    phone: '073 185 2130',
    whatsapp: '27714329190',
    payfastUser: 'Nadine Marshall',
    bio: 'Northern Cape wellness specialist also covering Western Cape, Eastern Cape and KwaZulu-Natal regions.'
  },
  { 
    code: 'NW', 
    name: 'North West', 
    icon: '🌿',
    representative: 'Riegal Du Toit',
    phone: '071 432 9190',
    whatsapp: '27714329190',
    payfastUser: 'Nadine Marshall',
    bio: 'North West regional coordinator also serving Gauteng, Free State and Limpopo with expertise in natural health solutions.'
  },
  { 
    code: 'WC', 
    name: 'Western Cape', 
    icon: '🍷',
    representative: 'Harry Trisos',
    phone: '073 185 2130',
    whatsapp: '27714329190',
    payfastUser: 'Nadine Marshall',
    bio: 'Western Cape health consultant also covering Eastern Cape, Northern Cape and KwaZulu-Natal with extensive gut health experience.'
  }
]

interface ProvinceSelectorProps {
  value: string
  onChange: (value: string) => void
}

export const ProvinceSelector = ({ value, onChange }: ProvinceSelectorProps) => {
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false)
  const selectedProvince = provinces.find(p => p.name === value)

  const handleSelect = (provinceName: string) => {
    onChange(provinceName)
    setIsMainDropdownOpen(false) // Close main dropdown after selection
  }

  const openWhatsApp = (whatsappNumber: string, provinceName: string) => {
    const message = encodeURIComponent(`Hi! I'm interested in ordering Eubiosis for delivery to ${provinceName}. Can you help me with the bank transfer details?`)
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="w-full">
      {/* Main Dropdown Trigger */}
      <button
        onClick={() => setIsMainDropdownOpen(!isMainDropdownOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:border-accent"
      >
        <div className="flex items-center gap-3">
          <MapPinIcon className="w-4 h-4 text-gray-500" />
          <span className={selectedProvince ? "text-gray-900" : "text-gray-500"}>
            {selectedProvince ? (
              <span className="flex items-center gap-2">
                <span>{selectedProvince.icon}</span>
                {selectedProvince.name}
              </span>
            ) : (
              "Your delivery location"
            )}
          </span>
        </div>
        <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${isMainDropdownOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Dropdown Content */}
      {isMainDropdownOpen && (
        <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-900">Select your delivery location</h4>
            <p className="text-xs text-gray-500 mt-1">Choose your province to see representative details</p>
          </div>
          
          <ul className="flex w-full flex-col gap-1 p-2">
        {provinces.map(province => (
          <Collapsible key={province.code} asChild>
            <li className="flex flex-col gap-2">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{province.icon}</span>
                  <span className="font-medium text-gray-900">{province.name}</span>
                  {value === province.name && (
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  )}
                </div>
                <ChevronRightIcon className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-90" />
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-gray-900">{province.representative}</h5>
                      <p className="text-sm text-gray-600">{province.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelect(province.name)
                        }}
                        className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        Select Location
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openWhatsApp(province.whatsapp, province.name)
                        }}
                        className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-1"
                      >
                        <MessageCircleIcon className="w-3 h-3" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{province.bio}</p>
                  
                  {/* Payment Options Prompt */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">💡 Payment Options:</p>
                    <p className="text-xs text-blue-700">
                      <strong>Option 1:</strong> Connect via WhatsApp above to discuss EFT payment and cheaper delivery options with your representative.
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      <strong>Option 2:</strong> Continue below to pay instantly with FastPay (card payment).
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </li>
          </Collapsible>
        ))}
          </ul>
        </div>
      )}
      
      {value && (
        <div className="mt-2 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <p className="text-sm text-accent font-medium">
            ✓ Selected: {value}
          </p>
        </div>
      )}
    </div>
  )
}
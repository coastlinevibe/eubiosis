"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  items: {
    id: string
    label: string
    onClick?: () => void
    badge?: string
  }[]
  activeItem?: string
}

export default function MobileNav({ items, activeItem }: MobileNavProps) {
  const [active, setActive] = React.useState<string>(activeItem || items[0]?.id || "")

  React.useEffect(() => {
    if (activeItem) {
      setActive(activeItem)
    }
  }, [activeItem])

  const getActiveIndex = () => {
    const index = items.findIndex(item => item.id === active)
    return index >= 0 ? index : 0
  }

  const getBorderPosition = () => {
    const index = getActiveIndex()
    // Calculate position based on 3 items evenly distributed
    const itemWidth = 100 / items.length
    return `calc(${itemWidth * index}% + ${itemWidth / 2}% - 20px)`
  }

  const handleClick = (item: typeof items[0]) => {
    setActive(item.id)
    item.onClick?.()
  }

  return (
    <nav className="relative h-[70px] w-full bg-white rounded-t-[11px] shadow-lg border-t border-gray-200">
      {/* Border effect indicator */}
      <div 
        className="absolute w-10 h-2 bg-[#8bccc2] rounded-b-[18px] top-0 transition-all duration-700"
        style={{ 
          left: getBorderPosition(),
          filter: "drop-shadow(0px 5px 5px rgba(139, 204, 194, 0.5))"
        }}
      />
      
      <ul className="flex justify-between h-full p-0 m-0">
        {items.map((item) => {
          const isActive = active === item.id
          
          return (
            <li
              key={item.id}
              onClick={() => handleClick(item)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors duration-500 relative",
                "text-sm font-semibold",
                isActive ? "text-[#8bccc2]" : "text-gray-500"
              )}
            >
              {/* Icons */}
              {item.id === "home" && (
                <svg
                  className={cn(
                    "w-8 h-8 mb-1 transition-all duration-500",
                    isActive ? "fill-[#8bccc2]" : "fill-white"
                  )}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z"
                    className={cn(
                      "transition-all duration-500",
                      isActive ? "stroke-[#78b4aa] stroke-[0.5]" : "stroke-gray-500 stroke-[1.5]"
                    )}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 17.99V14.99"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              
              {item.id === "shop" && (
                <svg
                  className={cn(
                    "w-8 h-8 mb-1 transition-all duration-500",
                    isActive ? "fill-[#8bccc2]" : "fill-white"
                  )}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 7.67001V6.70001C7.5 4.45001 9.31 2.24001 11.56 2.03001C14.24 1.77001 16.5 3.88001 16.5 6.51001V7.89001"
                    className={cn(
                      "transition-all duration-500",
                      isActive ? "stroke-[#78b4aa] stroke-[0.5]" : "stroke-gray-500 stroke-[1.5]"
                    )}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.00001 22H15C19.02 22 19.74 20.39 19.95 18.43L20.7 12.43C20.97 9.99001 20.27 8.00001 16 8.00001H8.00001C3.73001 8.00001 3.03001 9.99001 3.30001 12.43L4.05001 18.43C4.26001 20.39 4.98001 22 9.00001 22Z"
                    className={cn(
                      "transition-all duration-500",
                      isActive ? "stroke-[#78b4aa] stroke-[0.5]" : "stroke-gray-500 stroke-[1.5]"
                    )}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.4955 12H15.5045"
                    className={cn(
                      "transition-all duration-500",
                      isActive ? "stroke-[#78b4aa]" : "stroke-gray-500"
                    )}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.49451 12H8.50349"
                    className={cn(
                      "transition-all duration-500",
                      isActive ? "stroke-[#78b4aa]" : "stroke-gray-500"
                    )}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              
              {item.id === "cart" && (
                <div className="relative">
                  <svg
                    className={cn(
                      "w-8 h-8 mb-1 transition-all duration-500",
                      isActive ? "fill-[#8bccc2]" : "fill-white"
                    )}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                      className={cn(
                        "transition-all duration-500",
                        isActive ? "stroke-[#78b4aa] stroke-[0.5]" : "stroke-gray-500 stroke-[1.5]"
                      )}
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                      className={cn(
                        "transition-all duration-500",
                        isActive ? "stroke-[#78b4aa] stroke-[0.5]" : "stroke-gray-500 stroke-[1.5]"
                      )}
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                      className={cn(
                        "transition-all duration-500",
                        isActive ? "stroke-[#78b4aa] stroke-[0.5]" : "stroke-gray-500 stroke-[1.5]"
                      )}
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 8H21"
                      className={cn(
                        "transition-all duration-500",
                        isActive ? "stroke-[#78b4aa] stroke-[0.5]" : "stroke-gray-500 stroke-[1.5]"
                      )}
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              
              <p className="text-xs mt-1">{item.label}</p>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

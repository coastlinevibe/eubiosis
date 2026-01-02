'use client'

export default function VisitorCounter() {
  const counterHTML = `
    <a href='http://www.freevisitorcounters.com'>www.Freevisitorcounters.com</a>
    <script type='text/javascript' src='https://www.freevisitorcounters.com/auth.php?id=6a366a2b8572c5ead32f6bddd9d1e000b56d9971'></script>
    <script type="text/javascript" src="https://www.freevisitorcounters.com/en/home/counter/1469322/t/1"></script>
  `

  return (
    <div className="visitor-counter-container">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Site Visitor Counter</h2>
        <p className="text-gray-600 mb-6">
          Track the number of visitors to our site
        </p>
        
        {/* Exact implementation as provided */}
        <div 
          className="flex justify-center flex-col items-center"
          dangerouslySetInnerHTML={{ __html: counterHTML }}
        />
      </div>
    </div>
  )
}
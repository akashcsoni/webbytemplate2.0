import Link from "next/link"

export default function MegaMenu({ category, menuData = [] }) {
  // First, try to find the category in the provided menuData
  const findMenuData = () => {
    if (!menuData || !menuData.length) return null

    // Find the category in the main menu data
    const menuItem = menuData.find(
      (item) =>
        item.name === category ||
        (item.label && item.label.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and") === category),
    )

    if (!menuItem || !menuItem.menu) return null

    return (
      <div className="mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {menuItem.menu.map((section) => (
            <div key={section.id}>
              <h3 className="text-lg font-semibold mb-4">{section.label}</h3>
              <ul className="space-y-2">
                {section.sub_menu &&
                  section.sub_menu.map((item) => (
                    <li key={item.id}>
                      <div className="flex items-center">
                        <Link href={item.slug || "#"} className="text-gray-600 hover:text-blue-600 text-sm">
                          {item.label}
                        </Link>
                        {item.tag && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">{item.tag}</span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>  
          ))}
        </div>
      </div>
    )
  }

  // Try to use the dynamic menu first
  const dynamicMenu = findMenuData()
  if (dynamicMenu) return dynamicMenu

  // For other categories, return a placeholder
  return (
    <div className="mx-auto py-6 px-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Menu for {category} is coming soon</h3>
        <p className="text-gray-600">Please check back later for more options.</p>
      </div>
    </div>
  )
}

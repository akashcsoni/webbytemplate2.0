const URL = "https://studio.webbytemplate.com"
const STRAPI_URL = `${URL}/api`
const SITE_URL = 'https://www.webbytemplate.com' || "https://www.webbytemplate.com"
const NO_AVTAR_IMAGE = `/images/no-image.svg`
const NO_FOUND_PRODUCT_GRID_IMAGE = `/placeholder.svg?height=270&width=230`
const TRACKING_API_URL = "https://studio.webbytemplate.com/api/trackings"
const IP_API_URL = "https://api.ipify.org/?format=json"

const themeConfig = {
    TOKEN: "351d729c74cd7250f908c476b3adb5aaa21452f3f5d327d40fb7f3027074a774a581f2047b5ee50c7a3a6f53bb3ce5a283ff175ad09ee139cabcdadadfa4393cccfb6b08938b7679709e84980149390178bf6c09566c1882d5b552ccb5a7864dedb428ad0a7c3e50cc586ab2bf3aa99ddf7996e697d6816b5dc07dda1dcb24d4",
    CATEGORY_API_ROUTE: 'categories',
    SITE_URL: SITE_URL
}

export { URL,SITE_URL, STRAPI_URL, themeConfig, NO_AVTAR_IMAGE, NO_FOUND_PRODUCT_GRID_IMAGE, TRACKING_API_URL ,IP_API_URL};
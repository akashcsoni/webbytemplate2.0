// Regular expressions for phone validation
const usPhonePattern = /^\d{10}$/;
const caPhonePattern = /^\d{10}$/;
const ukPhonePattern = /^\d{10,11}$/;
const inPhonePattern = /^\d{10}$/;
const auPhonePattern = /^\d{9,10}$/;
const dePhonePattern = /^\d{10,11}$/;
const frPhonePattern = /^\d{9,10}$/;
const jpPhonePattern = /^\d{10,11}$/;
const cnPhonePattern = /^\d{11}$/;
const brPhonePattern = /^\d{10,11}$/;
const globalPhonePattern = /^\d{7,15}$/;

export const countries = [
    {
        name: "United States",
        code: "US",
        flag: "https://flagcdn.com/w40/us.png",
        dialCode: "+1",
        phoneLength: [10],
        phonePattern: usPhonePattern,
        states: [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
            "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
            "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
            "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
            "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
            "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
            "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
            "District of Columbia", "American Samoa", "Guam", "Northern Mariana Islands", "Puerto Rico",
            "United States Minor Outlying Islands", "U.S. Virgin Islands"
        ]
    },
    {
        name: "Canada",
        code: "CA",
        flag: "https://flagcdn.com/w40/ca.png",
        dialCode: "+1",
        phoneLength: [10],
        phonePattern: caPhonePattern,
        states: [
            "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
            "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
            "Quebec", "Saskatchewan", "Yukon"
        ]
    },
    {
        name: "United Kingdom",
        code: "GB",
        flag: "https://flagcdn.com/w40/gb.png",
        dialCode: "+44",
        phoneLength: [10, 11],
        phonePattern: ukPhonePattern,
        states: [
            "England", "Northern Ireland", "Scotland", "Wales",
            "Bedfordshire", "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire",
            "Cheshire", "Cornwall", "Cumbria", "Derbyshire", "Devon", "Dorset", "Durham",
            "East Sussex", "Essex", "Gloucestershire", "Greater London", "Greater Manchester",
            "Hampshire", "Hertfordshire", "Kent", "Lancashire", "Leicestershire", "Lincolnshire",
            "Merseyside", "Norfolk", "North Yorkshire", "Northamptonshire", "Nottinghamshire",
            "Oxfordshire", "Shropshire", "Somerset", "South Yorkshire", "Staffordshire", "Suffolk",
            "Surrey", "Tyne and Wear", "Warwickshire", "West Midlands", "West Sussex", "West Yorkshire",
            "Wiltshire", "Worcestershire"
        ]
    },
    {
        name: "India",
        code: "IN",
        flag: "https://flagcdn.com/w40/in.png",
        dialCode: "+91",
        phoneLength: [10],
        phonePattern: inPhonePattern,
        states: [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
            "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
            "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
            "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
            "Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
            "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
        ]
    },
    {
        name: "Australia",
        code: "AU",
        flag: "https://flagcdn.com/w40/au.png",
        dialCode: "+61",
        phoneLength: [9, 10],
        phonePattern: auPhonePattern,
        states: [
            "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland",
            "South Australia", "Tasmania", "Victoria", "Western Australia"
        ]
    },
    {
        name: "Germany",
        code: "DE",
        flag: "https://flagcdn.com/w40/de.png",
        dialCode: "+49",
        phoneLength: [10, 11],
        phonePattern: dePhonePattern,
        states: [
            "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse",
            "Lower Saxony", "Mecklenburg-Western Pomerania", "North Rhine-Westphalia", "Rhineland-Palatinate",
            "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
        ]
    },
    {
        name: "France",
        code: "FR",
        flag: "https://flagcdn.com/w40/fr.png",
        dialCode: "+33",
        phoneLength: [9, 10],
        phonePattern: frPhonePattern,
        states: [
            "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica",
            "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie",
            "Pays de la Loire", "Provence-Alpes-Côte d'Azur", "Guadeloupe", "Martinique", "French Guiana",
            "Réunion", "Mayotte"
        ]
    },
    {
        name: "Japan",
        code: "JP",
        flag: "https://flagcdn.com/w40/jp.png",
        dialCode: "+81",
        phoneLength: [10, 11],
        phonePattern: jpPhonePattern,
        states: [
            "Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima", "Ibaraki",
            "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa", "Niigata", "Toyama", "Ishikawa",
            "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto",
            "Osaka", "Hyogo", "Nara", "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima",
            "Yamaguchi", "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki",
            "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"
        ]
    },
    {
        name: "China",
        code: "CN",
        flag: "https://flagcdn.com/w40/cn.png",
        dialCode: "+86",
        phoneLength: [11],
        phonePattern: cnPhonePattern,
        states: [
            "Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou",
            "Hainan", "Hebei", "Heilongjiang", "Henan", "Hong Kong", "Hubei", "Hunan", "Inner Mongolia",
            "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Macau", "Ningxia", "Qinghai", "Shaanxi",
            "Shandong", "Shanghai", "Shanxi", "Sichuan", "Taiwan", "Tianjin", "Tibet", "Xinjiang",
            "Yunnan", "Zhejiang"
        ]
    },
    {
        name: "Brazil",
        code: "BR",
        flag: "https://flagcdn.com/w40/br.png",
        dialCode: "+55",
        phoneLength: [10, 11],
        phonePattern: brPhonePattern,
        states: [
            "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo",
            "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba",
            "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul",
            "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
        ]
    },
    {
        name: "Mexico",
        code: "MX",
        flag: "https://flagcdn.com/w40/mx.png",
        dialCode: "+52",
        phoneLength: [10],
        phonePattern: globalPhonePattern,
        states: [
            "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
            "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México",
            "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
            "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán",
            "Zacatecas"
        ]
    },
    {
        name: "Italy",
        code: "IT",
        flag: "https://flagcdn.com/w40/it.png",
        dialCode: "+39",
        phoneLength: [9, 10],
        phonePattern: globalPhonePattern,
        states: [
            "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli Venezia Giulia",
            "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna",
            "Sicilia", "Toscana", "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
        ]
    },
    {
        name: "Spain",
        code: "ES",
        flag: "https://flagcdn.com/w40/es.png",
        dialCode: "+34",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands",
            "Cantabria", "Castile and León", "Castilla-La Mancha", "Catalonia", "Extremadura", "Galicia",
            "La Rioja", "Community of Madrid", "Region of Murcia", "Navarre", "Valencian Community",
            "Ceuta", "Melilla"
        ]
    },
    {
        name: "South Korea",
        code: "KR",
        flag: "https://flagcdn.com/w40/kr.png",
        dialCode: "+82",
        phoneLength: [9, 10],
        phonePattern: globalPhonePattern,
        states: [
            "Seoul", "Busan", "Daegu", "Incheon", "Gwangju", "Daejeon", "Ulsan", "Sejong", "Gyeonggi",
            "Gangwon", "North Chungcheong", "South Chungcheong", "North Jeolla", "South Jeolla",
            "North Gyeongsang", "South Gyeongsang", "Jeju"
        ]
    },
    {
        name: "Singapore",
        code: "SG",
        flag: "https://flagcdn.com/w40/sg.png",
        dialCode: "+65",
        phoneLength: [8],
        phonePattern: globalPhonePattern,
        states: ["Central Region", "East Region", "North Region", "North-East Region", "West Region"]
    },
    {
        name: "Malaysia",
        code: "MY",
        flag: "https://flagcdn.com/w40/my.png",
        dialCode: "+60",
        phoneLength: [9, 10],
        phonePattern: globalPhonePattern,
        states: [
            "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis",
            "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu", "Kuala Lumpur", "Labuan",
            "Putrajaya"
        ]
    },
    {
        name: "Indonesia",
        code: "ID",
        flag: "https://flagcdn.com/w40/id.png",
        dialCode: "+62",
        phoneLength: [10, 11, 12],
        phonePattern: globalPhonePattern,
        states: [
            "Aceh", "Bali", "Bangka Belitung Islands", "Banten", "Bengkulu", "Central Java",
            "Central Kalimantan", "Central Sulawesi", "East Java", "East Kalimantan", "East Nusa Tenggara",
            "Gorontalo", "Jakarta", "Jambi", "Lampung", "Maluku", "North Kalimantan", "North Maluku",
            "North Sulawesi", "North Sumatra", "Papua", "Riau", "Riau Islands", "South Kalimantan",
            "South Sulawesi", "South Sumatra", "Southeast Sulawesi", "West Java", "West Kalimantan",
            "West Nusa Tenggara", "West Papua", "West Sulawesi", "West Sumatra", "Yogyakarta"
        ]
    },
    {
        name: "South Africa",
        code: "ZA",
        flag: "https://flagcdn.com/w40/za.png",
        dialCode: "+27",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga",
            "North West", "Northern Cape", "Western Cape"
        ]
    },
    {
        name: "New Zealand",
        code: "NZ",
        flag: "https://flagcdn.com/w40/nz.png",
        dialCode: "+64",
        phoneLength: [9, 10],
        phonePattern: globalPhonePattern,
        states: [
            "Auckland", "Bay of Plenty", "Canterbury", "Gisborne", "Hawke's Bay", "Manawatu-Whanganui",
            "Marlborough", "Nelson", "Northland", "Otago", "Southland", "Taranaki", "Tasman",
            "Waikato", "Wellington", "West Coast", "Chatham Islands Territory"
        ]
    },
    {
        name: "Russia",
        code: "RU",
        flag: "https://flagcdn.com/w40/ru.png",
        dialCode: "+7",
        phoneLength: [10, 11],
        phonePattern: globalPhonePattern,
        states: [
            "Adygea", "Altai Krai", "Altai Republic", "Amur Oblast", "Arkhangelsk Oblast", "Astrakhan Oblast",
            "Bashkortostan", "Belgorod Oblast", "Bryansk Oblast", "Buryatia", "Chechen Republic", "Chelyabinsk Oblast",
            "Chukotka Autonomous Okrug", "Chuvashia", "Dagestan", "Ingushetia", "Irkutsk Oblast", "Ivanovo Oblast",
            "Jewish Autonomous Oblast", "Kabardino-Balkaria", "Kaliningrad Oblast", "Kalmykia", "Kaluga Oblast",
            "Kamchatka Krai", "Karachay-Cherkessia", "Karelia", "Kemerovo Oblast", "Khabarovsk Krai", "Khakassia",
            "Khanty-Mansi Autonomous Okrug", "Kirov Oblast", "Komi", "Kostroma Oblast", "Krasnodar Krai",
            "Krasnoyarsk Krai", "Kurgan Oblast", "Kursk Oblast", "Leningrad Oblast", "Lipetsk Oblast", "Magadan Oblast",
            "Mari El", "Mordovia", "Moscow", "Moscow Oblast", "Murmansk Oblast", "Nenets Autonomous Okrug",
            "Nizhny Novgorod Oblast", "North Ossetia-Alania", "Novgorod Oblast", "Novosibirsk Oblast", "Omsk Oblast",
            "Orenburg Oblast", "Oryol Oblast", "Penza Oblast", "Perm Krai", "Primorsky Krai", "Pskov Oblast",
            "Rostov Oblast", "Ryazan Oblast", "Saint Petersburg", "Sakha Republic", "Sakhalin Oblast", "Samara Oblast",
            "Saratov Oblast", "Sevastopol", "Smolensk Oblast", "Stavropol Krai", "Sverdlovsk Oblast", "Tambov Oblast",
            "Tatarstan", "Tomsk Oblast", "Tula Oblast", "Tuva", "Tver Oblast", "Tyumen Oblast", "Udmurtia",
            "Ulyanovsk Oblast", "Vladimir Oblast", "Volgograd Oblast", "Vologda Oblast", "Voronezh Oblast",
            "Yamalo-Nenets Autonomous Okrug", "Yaroslavl Oblast", "Zabaykalsky Krai"
        ]
    },
    {
        name: "Netherlands",
        code: "NL",
        flag: "https://flagcdn.com/w40/nl.png",
        dialCode: "+31",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant",
            "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"
        ]
    },
    {
        name: "Belgium",
        code: "BE",
        flag: "https://flagcdn.com/w40/be.png",
        dialCode: "+32",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Antwerp", "Brussels-Capital Region", "East Flanders", "Flemish Brabant", "Hainaut",
            "Liège", "Limburg", "Luxembourg", "Namur", "Walloon Brabant", "West Flanders"
        ]
    },
    {
        name: "Switzerland",
        code: "CH",
        flag: "https://flagcdn.com/w40/ch.png",
        dialCode: "+41",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", "Basel-Stadt",
            "Bern", "Fribourg", "Geneva", "Glarus", "Graubünden", "Jura", "Lucerne", "Neuchâtel",
            "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau",
            "Ticino", "Uri", "Valais", "Vaud", "Zug", "Zurich"
        ]
    },
    {
        name: "Austria",
        code: "AT",
        flag: "https://flagcdn.com/w40/at.png",
        dialCode: "+43",
        phoneLength: [10, 11],
        phonePattern: globalPhonePattern,
        states: [
            "Burgenland", "Carinthia", "Lower Austria", "Upper Austria", "Salzburg", "Styria",
            "Tyrol", "Vorarlberg", "Vienna"
        ]
    },
    {
        name: "Sweden",
        code: "SE",
        flag: "https://flagcdn.com/w40/se.png",
        dialCode: "+46",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Blekinge", "Dalarna", "Gävleborg", "Gotland", "Halland", "Jämtland", "Jönköping",
            "Kalmar", "Kronoberg", "Norrbotten", "Örebro", "Östergötland", "Skåne", "Södermanland",
            "Stockholm", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland",
            "Västra Götaland"
        ]
    },
    {
        name: "Norway",
        code: "NO",
        flag: "https://flagcdn.com/w40/no.png",
        dialCode: "+47",
        phoneLength: [8],
        phonePattern: globalPhonePattern,
        states: [
            "Agder", "Innlandet", "Møre og Romsdal", "Nordland", "Oslo", "Rogaland", "Troms og Finnmark",
            "Trøndelag", "Vestfold og Telemark", "Vestland", "Viken"
        ]
    },
    {
        name: "Denmark",
        code: "DK",
        flag: "https://flagcdn.com/w40/dk.png",
        dialCode: "+45",
        phoneLength: [8],
        phonePattern: globalPhonePattern,
        states: [
            "Capital Region", "Central Denmark Region", "North Denmark Region", "Region Zealand",
            "Region of Southern Denmark"
        ]
    },
    {
        name: "Finland",
        code: "FI",
        flag: "https://flagcdn.com/w40/fi.png",
        dialCode: "+358",
        phoneLength: [9, 10],
        phonePattern: globalPhonePattern,
        states: [
            "Åland", "Central Finland", "Central Ostrobothnia", "Finland Proper", "Kainuu", "Kanta-Häme",
            "Karelia", "Kymenlaakso", "Lapland", "North Karelia", "Northern Ostrobothnia", "Northern Savonia",
            "Ostrobothnia", "Päijät-Häme", "Pirkanmaa", "Satakunta", "South Karelia", "Southern Ostrobothnia",
            "Southern Savonia", "Tavastia Proper", "Uusimaa"
        ]
    },
    {
        name: "Poland",
        code: "PL",
        flag: "https://flagcdn.com/w40/pl.png",
        dialCode: "+48",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Greater Poland", "Kuyavian-Pomeranian", "Lesser Poland", "Lodz", "Lower Silesian", "Lublin",
            "Lubusz", "Masovian", "Opole", "Podlaskie", "Pomeranian", "Silesian", "Subcarpathian",
            "Swietokrzyskie", "Warmian-Masurian", "West Pomeranian"
        ]
    },
    {
        name: "Czech Republic",
        code: "CZ",
        flag: "https://flagcdn.com/w40/cz.png",
        dialCode: "+420",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Central Bohemian Region", "Hradec Králové Region", "Karlovy Vary Region", "Liberec Region",
            "Moravian-Silesian Region", "Olomouc Region", "Pardubice Region", "Plzeň Region",
            "Prague", "South Bohemian Region", "South Moravian Region", "Ústí nad Labem Region",
            "Vysočina Region", "Zlín Region"
        ]
    },
    {
        name: "Hungary",
        code: "HU",
        flag: "https://flagcdn.com/w40/hu.png",
        dialCode: "+36",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Bács-Kiskun", "Baranya", "Békés", "Borsod-Abaúj-Zemplén", "Budapest", "Csongrád-Csanád",
            "Fejér", "Győr-Moson-Sopron", "Hajdú-Bihar", "Heves", "Jász-Nagykun-Szolnok", "Komárom-Esztergom",
            "Nógrád", "Pest", "Somogy", "Szabolcs-Szatmár-Bereg", "Tolna", "Vas", "Veszprém", "Zala"
        ]
    },
    {
        name: "Portugal",
        code: "PT",
        flag: "https://flagcdn.com/w40/pt.png",
        dialCode: "+351",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro",
            "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo",
            "Vila Real", "Viseu", "Azores", "Madeira"
        ]
    },
    {
        name: "Greece",
        code: "GR",
        flag: "https://flagcdn.com/w40/gr.png",
        dialCode: "+30",
        phoneLength: [10],
        phonePattern: globalPhonePattern,
        states: [
            "Attica", "Central Greece", "Central Macedonia", "Crete", "Eastern Macedonia and Thrace",
            "Epirus", "Ionian Islands", "North Aegean", "Peloponnese", "South Aegean", "Thessaly",
            "Western Greece", "Western Macedonia"
        ]
    },
    {
        name: "Turkey",
        code: "TR",
        flag: "https://flagcdn.com/w40/tr.png",
        dialCode: "+90",
        phoneLength: [10],
        phonePattern: globalPhonePattern,
        states: [
            "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
            "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
            "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
            "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
            "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Iğdır", "Isparta", "Istanbul",
            "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale",
            "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
            "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize",
            "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ",
            "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
        ]
    },
    {
        name: "Israel",
        code: "IL",
        flag: "https://flagcdn.com/w40/il.png",
        dialCode: "+972",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Central District", "Haifa District", "Jerusalem District", "Northern District",
            "Southern District", "Tel Aviv District"
        ]
    },
    {
        name: "United Arab Emirates",
        code: "AE",
        flag: "https://flagcdn.com/w40/ae.png",
        dialCode: "+971",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain"
        ]
    },
    {
        name: "Saudi Arabia",
        code: "SA",
        flag: "https://flagcdn.com/w40/sa.png",
        dialCode: "+966",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Al Bahah", "Al Jawf", "Al Madinah", "Al Qassim", "Ar Riyad", "Ash Sharqiyah", "Asir",
            "Ha'il", "Jazan", "Makkah", "Najran", "Northern Borders", "Tabuk"
        ]
    },
    {
        name: "Egypt",
        code: "EG",
        flag: "https://flagcdn.com/w40/eg.png",
        dialCode: "+20",
        phoneLength: [10],
        phonePattern: globalPhonePattern,
        states: [
            "Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta",
            "Faiyum", "Gharbia", "Giza", "Ismailia", "Kafr el-Sheikh", "Luxor", "Matruh", "Minya",
            "Monufia", "New Valley", "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea",
            "Sharqia", "Sohag", "South Sinai", "Suez"
        ]
    },
    {
        name: "Nigeria",
        code: "NG",
        flag: "https://flagcdn.com/w40/ng.png",
        dialCode: "+234",
        phoneLength: [10],
        phonePattern: globalPhonePattern,
        states: [
            "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
            "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory",
            "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
            "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
            "Sokoto", "Taraba", "Yobe", "Zamfara"
        ]
    },
    {
        name: "Kenya",
        code: "KE",
        flag: "https://flagcdn.com/w40/ke.png",
        dialCode: "+254",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay",
            "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
            "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
            "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
            "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
            "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
        ]
    },
    {
        name: "Ghana",
        code: "GH",
        flag: "https://flagcdn.com/w40/gh.png",
        dialCode: "+233",
        phoneLength: [9],
        phonePattern: globalPhonePattern,
        states: [
            "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra",
            "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta",
            "Western", "Western North"
        ]
    }
];

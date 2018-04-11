import api from './'
const { database } = api

export default () => {
    const branchesRef = database.ref('branches')
    const categoriesRef = database.ref('categories')
    const productsRef = database.ref('products')

    const configRef = database.ref('config')

    const defaultConfig = {
        reinitialize_all: true,
        reinitialize_branches: true,
        reinitialize_products: true
    }

    const postUpdateConfig = {
        reinitialize_all: false,
        reinitialize_branches: false,
        reinitialize_products: false
    }

    const populateBranches = () => branches.forEach(branch => branchesRef.push(branch))
    const populateProducts = () => {
        categories.forEach(category => {
            const categoryRef = categoriesRef.push({ name: category.name })

            products
                .filter(product => product.categoryId === category.id)
                .forEach(product => {
                    product.categoryId = categoryRef.key
                    productsRef.push(product)
                })
        })
    }

    configRef.once('value', snapshot => {
        const config = snapshot.val() || defaultConfig

        if (config.reinitialize_all || config.reinitialize_branches) {
            populateBranches()
        }

        if (config.reinitialize_all || config.reinitialize_products) {
            populateProducts()
        }

        configRef.set(postUpdateConfig)
    })
}

export const branches = [
    {
        name: 'España',
        location: {
            address: 'España Boulevard, 873 M.F. Jhocson, Sampaloc, Manila',
            lat: 14.607905,
            long: 120.991088
        }
    },
    {
        name: 'Tutuban',
        location: {
            address: 'Unit M1-BB150, Tutuban Center Mall, Recto Ave, Tondo 48 Zone 4, Manila, 1012 Metro Manila',
            lat: 14.607026,
            long: 120.973130
        }
    },
    {
        name: 'Shaw Blvd.',
        location: {
            address: 'Shaw, Mandaluyong, Metro Manila',
            lat: 14.584490,
            long: 121.049764
        }
    }
]

export const categories = [
    { id: 1, name: 'Pizza' },
    { id: 2, name: 'Chicken & Pasta' },
    { id: 3, name: 'Appetizers & Desserts' },
    { id: 4, name: 'Beverages' }
]

export const products = [
    {
        categoryId: 1,
        name: 'Extravaganzza',
        description: `Here's what Domino's is famous for!`,
        image_url: '"https://hotels.ng/guides/wp-content/uploads/2017/08/domino1.jpg"',
        price: 209
    },
    {
        categoryId: 1,
        name: 'Kalamata Tomato',
        description: 'Taste the delicious Greek Pizza!',
        image_url: 'https://pbs.twimg.com/media/CAnt9R-WUAAsohE.jpg:large',
        price: 189
    },
    {
        categoryId: 1,
        name: 'Chicken BBQ Sausage',
        description: 'Delectably made with flavorful ingredients.',
        image_url: 'https://assets3.thrillist.com/v1/image/1170916/size/tmg-facebook_social.jpg',
        price: 209
    },
    {
        categoryId: 2,
        name: 'Creamy Alfredo Spaghetti',
        description: 'Enjoy our own version of the creamy goodness of Pasta Alfredo made with rich sauce and topped with mushrooms and shredded cheddar cheese.',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE_l6nxmcEBxjGdc_eAwA7U8GCcY0PDF9Oc_a1ucz14hfKyeFt',
        price: 139
    },
    {
        categoryId: 2,
        name: 'Meaty Bolognese Spaghetti',
        description: 'Relish the taste of our all-time favorite meaty spaghetti, for kids and adults alike.',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiAVHikF-2oLM9cwtDFpNhbsLRy0VVjW6lcilv6JCYFpPBMuc9',
        price: 139
    },
    {
        categoryId: 2,
        name: 'Cheesy Baked Macaroni',
        description: 'Oven baked macaroni, blended with our special red sauce topped with melted mozarella and cheddar cheese.',
        image_url: 'https://www.inspiredtaste.net/wp-content/uploads/2013/05/Homemade-Macaroni-and-Cheese-Recipe-4_1200.jpg',
        price: 139
    },
    {
        categoryId: 3,
        name: 'Marbled Cookie Brownie (2pcs)',
        description: 'A warm and chewy blend of butterscotch cookie and fudge brownie - now available in 2 pcs.',
        image_url: 'https://www.dominospizza.ph/uploads/files/products/sides%20desserts/Marbled-Cookie-Brownie-2pcs-250px-v2.png',
        price: 49
    },
    {
        categoryId: 3,
        name: 'Specialty Chicken - Aloha Barbecue',
        description: 'Breaded, bite-sized tender chicken breast drizzled with BBQ Sauce, then topped with Mozzarella Cheese, and Pineapple Chunks.',
        image_url: 'https://www.dominospizza.ph/uploads/files/products/sides%20desserts/Aloha-Barbecue-for-website-250px.png',
        price: 129
    },
    {
        categoryId: 3,
        name: 'Potato Wedges With BBQ Dip',
        description: 'Enjoy our golden, oven-baked potato wedges with our barbecue dip! Pair it with your pizza as a side dish or enjoy it as a snack.',
        image_url: 'https://www.dominospizza.ph/uploads/files/products/sides%20desserts/Potato-Wedges.png',
        price: 99
    },
    {
        categoryId: 4,
        name: 'Coke 1.5L',
        description: 'Coke 1.5L',
        image_url: 'https://www.dominospizza.ph/uploads/files/products/beverages/Coca-Cola-Bottle_15.jpg',
        price: 95
    },
    {
        categoryId: 4,
        name: 'Minute Maid Fresh',
        description: '250ml',
        image_url: 'https://www.dominospizza.ph/uploads/files/products/beverages/MMFresh.jpg',
        price: 29
    },
    {
        categoryId: 4,
        name: 'Domino\'s Bottled Water',
        description: '500ml',
        image_url: 'https://www.dominospizza.ph/uploads/files/products/beverages/dominos-water.jpg',
        price: 29
    }
]

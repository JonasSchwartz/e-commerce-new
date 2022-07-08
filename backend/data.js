import bcrypt from "bcryptjs"

const data = {
    users: [
           {
            name:'Jonas',
            email:'admin@test.se',
            password: bcrypt.hashSync('123456'),
            isAdmin:true
           },
           {
            name:'Hanna',
            email:'hanna@test.se',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
           },
         


    ],
    products: [
        {
            
            name: "Nike Slim Shirt",
            slug: "Nike-Slim-Shirt",
            category: "Shirts",
            image: "/images/p1.jpg", 
            price: 120,
            countInStock: 1,
            brand: "Nike",
            rating: 5,
            numReviews: 16,
            description:"High Quality Shirt"
        },

        {
            
            name: "Nike fit Shirt",
            slug: "Nike-fit-Shirt",
            category: "Shirts",
            image: "/images/p2.jpg",
            price:250,
            countInStock: 2,
            brand: "Nike",
            rating: 4.2,
            numReviews: 24,
            description:"High Quality Shirt"
        },

        {
            
            name: "Nike slim pants",
            slug: "Nike-Slim-Pants",
            category: "Pants",
            image: "/images/p3.jpg",
            price:250,
            countInStock: 20,
            brand: "Nike",
            rating: 4.8,
            numReviews: 110,
            description:"High Quality Pants"
        },

        {
            
            name: "Nike fit pants",
            slug: "Nike-fit-Pants",
            category: "Pants",
            image: "/images/p4.jpg",
            price:250,
            countInStock: 20,
            brand: "Nike",
            rating: 4.0,
            numReviews: 43,
            description:"High Quality Pants"
        },
        {
            
            name: "Nike Shirt Blue",
            slug: "Nike-Shirt-Blue",
            category: "Shirts",
            image: "/images/p5.jpg",
            price:250,
            countInStock: 20,
            brand: "Nike",
            rating: 1,
            numReviews: 43,
            description:"High Quality Shirt"
        },

        {
            
            name: "Nike Shirt Grey Hoodie",
            slug: "Nike-Shirt-Grey-Hoodie",
            category: "Shirts",
            image: "/images/p6.jpg",
            price:140,
            countInStock: 10,
            brand: "Nike",
            rating: 4.5,
            numReviews: 4,
            description:"High Quality hoodie from Nike"
        },

        {
            
            name: "Nike Jacket Orange ",
            slug: "Nike-Jacket-Orange",
            category: "Pants",
            image: "/images/p7.jpg",
            price:250,
            countInStock: 20,
            brand: "Nike",
            rating: 3.5,
            numReviews: 12,
            description:"High Quality jacket from Nike"
        },
        {
            
            name: "Nike jacket Green",
            slug: "Nike-Jacket-Green",
            category: "Jackets",
            image: "/images/p8.jpg",
            price:250,
            countInStock: 10,
            brand: "Nike",
            rating: 5,
            numReviews: 1,
            description:"High Quality Pants"
        },

    ]
}

export default data
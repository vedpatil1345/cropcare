// // File: app/api/community/posts/route.js
// import { NextResponse } from 'next/server'

// // Mock database - replace with your actual database
// let posts = [
//   {
//     id: 1,
//     title: "Organic pest control methods that actually work",
//     content: "I've been experimenting with natural pest control methods...",
//     author: "FarmerJohn",
//     authorId: "user_123",
//     authorReputation: 892,
//     category: "Pest Control",
//     postType: "experience",
//     upvotes: 45,
//     downvotes: 2,
//     comments: 12,
//     createdAt: "2024-03-15T10:30:00Z",
//     updatedAt: "2024-03-15T10:30:00Z",
//     tags: ["organic", "tomatoes", "pest-control", "neem-oil", "companion-planting"],
//     edited: false
//   },
//   {
//     id: 2,
//     title: "Best time to plant corn in midwest?",
//     content: "I'm planning to plant corn this season. What's the optimal timing for midwest regions?",
//     author: "NewFarmer2024",
//     authorId: "user_456",
//     authorReputation: 45,
//     category: "Seeds & Planting",
//     postType: "question",
//     upvotes: 12,
//     downvotes: 0,
//     comments: 8,
//     createdAt: "2024-03-14T14:20:00Z",
//     updatedAt: "2024-03-14T14:20:00Z",
//     tags: ["corn", "planting", "midwest", "timing"],
//     edited: false
//   },
//   {
//     id: 3,
//     title: "DIY compost bin setup for small farms",
//     content: "Sharing my experience building a cost-effective compost bin using pallets...",
//     author: "GreenThumb22",
//     authorId: "user_789",
//     authorReputation: 320,
//     category: "Composting",
//     postType: "tutorial",
//     upvotes: 28,
//     downvotes: 1,
//     comments: 15,
//     createdAt: "2024-03-16T09:15:00Z",
//     updatedAt: "2024-03-16T12:45:00Z",
//     tags: ["compost", "diy", "sustainability", "small-farm", "recycling"],
//     edited: true
//   },
//   {
//     id: 4,
//     title: "How to improve soil drainage?",
//     content: "My fields get waterlogged after heavy rain. Any tips for improving drainage?",
//     author: "MuddyBoots",
//     authorId: "user_101",
//     authorReputation: 150,
//     category: "Soil Management",
//     postType: "question",
//     upvotes: 19,
//     downvotes: 3,
//     comments: 10,
//     createdAt: "2024-03-13T16:40:00Z",
//     updatedAt: "2024-03-13T16:40:00Z",
//     tags: ["soil", "drainage", "water-management", "farming"],
//     edited: false
//   },
//   {
//     id: 5,
//     title: "Success with vertical gardening for herbs",
//     content: "Tried vertical gardening for basil and cilantro this year, and the results are amazing...",
//     author: "UrbanGrower",
//     authorId: "user_234",
//     authorReputation: 510,
//     category: "Gardening",
//     postType: "experience",
//     upvotes: 35,
//     downvotes: 0,
//     comments: 20,
//     createdAt: "2024-03-17T11:00:00Z",
//     updatedAt: "2024-03-17T11:00:00Z",
//     tags: ["vertical-gardening", "herbs", "basil", "cilantro", "urban-farming"],
//     edited: false
//   },
//   {
//     id: 6,
//     title: "Choosing the right irrigation system for small plots",
//     content: "I've been researching drip vs. sprinkler systems for my 2-acre farm. Here's what I found...",
//     author: "WaterWise",
//     authorId: "user_567",
//     authorReputation: 275,
//     category: "Irrigation",
//     postType: "experience",
//     upvotes: 22,
//     downvotes: 1,
//     comments: 9,
//     createdAt: "2024-03-18T08:25:00Z",
//     updatedAt: "2024-03-18T08:25:00Z",
//     tags: ["irrigation", "drip-irrigation", "sprinkler", "water-efficiency"],
//     edited: false
//   },
//   {
//     id: 7,
//     title: "What cover crops work best for clay soil?",
//     content: "Struggling with heavy clay soil on my farm. Any recommendations for cover crops to improve it?",
//     author: "ClayCrusader",
//     authorId: "user_890",
//     authorReputation: 95,
//     category: "Soil Management",
//     postType: "question",
//     upvotes: 15,
//     downvotes: 0,
//     comments: 7,
//     createdAt: "2024-03-19T13:10:00Z",
//     updatedAt: "2024-03-19T13:10:00Z",
//     tags: ["cover-crops", "clay-soil", "soil-health", "farming"],
//     edited: false
//   },
//   {
//     id: 8,
//     title: "Guide to starting a backyard chicken coop",
//     content: "Started raising chickens last year and learned a lot. Here's a beginner's guide to setting up a coop...",
//     author: "ChickenLady",
//     authorId: "user_345",
//     authorReputation: 620,
//     category: "Livestock",
//     postType: "tutorial",
//     upvotes: 50,
//     downvotes: 2,
//     comments: 25,
//     createdAt: "2024-03-20T15:45:00Z",
//     updatedAt: "2024-03-21T09:30:00Z",
//     tags: ["chickens", "backyard-farming", "coop-design", "livestock"],
//     edited: true
//   },
//   {
//     id: 9,
//     title: "Dealing with powdery mildew on squash plants",
//     content: "My squash plants are getting hit hard by powdery mildew. Any organic solutions that work?",
//     author: "SquashSaver",
//     authorId: "user_678",
//     authorReputation: 180,
//     category: "Pest Control",
//     postType: "question",
//     upvotes: 10,
//     downvotes: 1,
//     comments: 6,
//     createdAt: "2024-03-22T10:05:00Z",
//     updatedAt: "2024-03-22T10:05:00Z",
//     tags: ["powdery-mildew", "squash", "organic", "pest-control"],
//     edited: false
//   },
//   {
//     id: 10,
//     title: "Tips for growing strawberries in raised beds",
//     content: "Raised beds worked wonders for my strawberries this season. Sharing my setup and tips...",
//     author: "BerryGrower",
//     authorId: "user_901",
//     authorReputation: 400,
//     category: "Gardening",
//     postType: "experience",
//     upvotes: 30,
//     downvotes: 0,
//     comments: 18,
//     createdAt: "2024-03-23T12:00:00Z",
//     updatedAt: "2024-03-23T12:00:00Z",
//     tags: ["strawberries", "raised-beds", "gardening", "fruit"],
//     edited: false
//   },
//   {
//     id: 11,
//     title: "Natural fertilizers for vegetable gardens",
//     content: "Switched to homemade fertilizers last year and saw great results on my veggies...",
//     author: "EcoFarmer",
//     authorId: "user_112",
//     authorReputation: 350,
//     category: "Fertilizers",
//     postType: "experience",
//     upvotes: 25,
//     downvotes: 1,
//     comments: 14,
//     createdAt: "2024-03-24T14:30:00Z",
//     updatedAt: "2024-03-24T14:30:00Z",
//     tags: ["natural-fertilizers", "vegetables", "organic-farming", "compost-tea"],
//     edited: false
//   },
//   {
//     id: 12,
//     title: "Best practices for crop rotation?",
//     content: "New to farming and need advice on effective crop rotation strategies for a 5-acre plot.",
//     author: "RotationRookie",
//     authorId: "user_334",
//     authorReputation: 60,
//     category: "Crop Management",
//     postType: "question",
//     upvotes: 18,
//     downvotes: 0,
//     comments: 11,
//     createdAt: "2024-03-25T09:50:00Z",
//     updatedAt: "2024-03-25T09:50:00Z",
//     tags: ["crop-rotation", "soil-health", "farming-practices"],
//     edited: false
//   },
//   {
//     id: 13,
//     title: "Building a simple greenhouse from scratch",
//     content: "Step-by-step guide to constructing an affordable greenhouse using PVC and plastic sheeting...",
//     author: "GreenhouseGuru",
//     authorId: "user_556",
//     authorReputation: 480,
//     category: "Structures",
//     postType: "tutorial",
//     upvotes: 40,
//     downvotes: 2,
//     comments: 22,
//     createdAt: "2024-03-26T11:20:00Z",
//     updatedAt: "2024-03-27T08:15:00Z",
//     tags: ["greenhouse", "diy", "structures", "protected-crops"],
//     edited: true
//   },
//   {
//     id: 14,
//     title: "Identifying and treating root rot in potatoes",
//     content: "My potato crop is showing signs of root rot. How to diagnose and fix it?",
//     author: "PotatoPro",
//     authorId: "user_778",
//     authorReputation: 210,
//     category: "Pest Control",
//     postType: "question",
//     upvotes: 14,
//     downvotes: 1,
//     comments: 8,
//     createdAt: "2024-03-28T13:40:00Z",
//     updatedAt: "2024-03-28T13:40:00Z",
//     tags: ["root-rot", "potatoes", "plant-diseases", "treatment"],
//     edited: false
//   },
//   {
//     id: 15,
//     title: "Harvesting and storing garlic successfully",
//     content: "Learned some key tips for harvesting garlic at the right time and storing it for months...",
//     author: "GarlicGuy",
//     authorId: "user_990",
//     authorReputation: 290,
//     category: "Harvesting",
//     postType: "experience",
//     upvotes: 27,
//     downvotes: 0,
//     comments: 16,
//     createdAt: "2024-03-29T10:10:00Z",
//     updatedAt: "2024-03-29T10:10:00Z",
//     tags: ["garlic", "harvesting", "storage", "crops"],
//     edited: false
//   }
// ]

// let nextPostId = 16

// // GET - Fetch all posts
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const category = searchParams.get('category')
//     const postType = searchParams.get('postType')
//     const sortBy = searchParams.get('sortBy') || 'recent'
//     const page = parseInt(searchParams.get('page')) || 1
//     const limit = parseInt(searchParams.get('limit')) || 10

//     let filteredPosts = [...posts]

//     // Filter by category
//     if (category && category !== 'all') {
//       filteredPosts = filteredPosts.filter(post => post.category === category)
//     }

//     // Filter by post type
//     if (postType && postType !== 'all') {
//       filteredPosts = filteredPosts.filter(post => post.postType === postType)
//     }

//     // Sort posts
//     switch (sortBy) {
//       case 'popular':
//         filteredPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
//         break
//       case 'recent':
//       default:
//         filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         break
//     }

//     // Pagination
//     const startIndex = (page - 1) * limit
//     const endIndex = startIndex + limit
//     const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

//     return NextResponse.json({
//       posts: paginatedPosts,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(filteredPosts.length / limit),
//         totalPosts: filteredPosts.length,
//         hasMore: endIndex < filteredPosts.length
//       }
//     })
//   } catch (error) {
//     console.error('Error fetching posts:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch posts' },
//       { status: 500 }
//     )
//   }
// }

// // POST - Create new post
// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { title, content, category, tags, postType, authorId, author } = body

//     // Validation
//     if (!title || !content || !category || !postType || !authorId || !author) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     // Create new post
//     const newPost = {
//       id: nextPostId++,
//       title: title.trim(),
//       content: content.trim(),
//       author,
//       authorId,
//       authorReputation: 0, // You might want to fetch this from user data
//       category,
//       postType,
//       upvotes: 0,
//       downvotes: 0,
//       comments: 0,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
//       edited: false
//     }

//     posts.unshift(newPost)

//     return NextResponse.json(newPost, { status: 201 })
//   } catch (error) {
//     console.error('Error creating post:', error)
//     return NextResponse.json(
//       { error: 'Failed to create post' },
//       { status: 500 }
//     )
//   }
// }

// File: app/api/community/posts/route.js
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Path to the JSON file
const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'app','assests','posts.json')

// Helper function to read posts from JSON file
async function readPostsFromFile() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading posts file:', error)
    // Return default data if file doesn't exist
    return {
      posts: [],
      nextPostId: 1
    }
  }
}

// Helper function to write posts to JSON file
async function writePostsToFile(data) {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(DATA_FILE_PATH)
    await fs.mkdir(dataDir, { recursive: true })
    
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing posts file:', error)
    throw error
  }
}

// GET - Fetch all posts
export async function GET(request) {
  try {
    const data = await readPostsFromFile()
    const { posts } = data
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const postType = searchParams.get('postType')
    const sortBy = searchParams.get('sortBy') || 'recent'
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    let filteredPosts = [...posts]

    // Filter by category
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category)
    }

    // Filter by post type
    if (postType && postType !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.postType === postType)
    }

    // Sort posts
    switch (sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
        break
      case 'recent':
      default:
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalPosts: filteredPosts.length,
        hasMore: endIndex < filteredPosts.length
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Create new post
export async function POST(request) {
  try {
    const body = await request.json()
    const { title, content, category, tags, postType, authorId, author } = body

    // Validation
    if (!title || !content || !category || !postType || !authorId || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Read current data
    const data = await readPostsFromFile()
    
    // Create new post
    const newPost = {
      id: data.nextPostId,
      title: title.trim(),
      content: content.trim(),
      author,
      authorId,
      authorReputation: 0, // You might want to fetch this from user data
      category,
      postType,
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      edited: false
    }

    // Add new post to the beginning of the array
    data.posts.unshift(newPost)
    data.nextPostId += 1

    // Save to file
    await writePostsToFile(data)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
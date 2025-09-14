// File: app/community/components/CommentSection.js
'use client'
import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react'

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      content: "Great post! I've had similar success with neem oil. One tip: add a drop of dish soap to help it stick to leaves better.",
      author: "OrganicGrower",
      upvotes: 12,
      downvotes: 0,
      createdAt: "2024-03-15T11:15:00Z",
      replies: [
        {
          id: 2,
          content: "That's a great tip! What ratio of soap do you use?",
          author: "FarmerJohn",
          upvotes: 3,
          downvotes: 0,
          createdAt: "2024-03-15T11:30:00Z"
        }
      ]
    },
    {
      id: 3,
      content: "Have you tried beneficial nematodes for soil pests? They work great alongside these methods.",
      author: "SoilExpert",
      upvotes: 8,
      downvotes: 1,
      createdAt: "2024-03-15T12:45:00Z",
      replies: []
    }
  ])    }
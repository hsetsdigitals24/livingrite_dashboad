// "use client"

// import Link from "next/link"
// import React from "react"

// export default function BlogCard({ post }: { post: { slug: string; title: string; excerpt: string; date: string; image?: string } }) {
//   console.log("Rendering BlogCard with post:", post) // Debug log to check post data
//   return (
//     <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
//       <Link href={`/blog/${post.slug}`} className="block">
//         <div className="h-44 bg-gray-100 w-full overflow-hidden">
//           {post.image ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
//           )}
//         </div>

//         <div className="p-5">
//           <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
//           <p className="text-sm text-slate-600 mb-3">{post.excerpt}</p>
//           <div className="text-xs text-slate-500">{post.date}</div>
//         </div>
//       </Link>
//     </article>
//   )
// }

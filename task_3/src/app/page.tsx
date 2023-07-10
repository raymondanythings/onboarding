import { getAllPosts } from "@/lib/post";
import Link from "next/link";
export default async function Home() {
  const posts = await getAllPosts();
  return (
    <main className="flex flex-col space-y-4">
      {posts.map((post) => (
        <Link
          href={post.fileName}
          className="border p-2 rounded-md shadow-md"
          key={post.fileName}
        >
          <h1 className="font-bold text-lg">{post.data.title}</h1>
          <p className="text-gray-300 text-sm">{post.data.description}</p>
          <p className="text-gray-300 text-xs">{post.data.date}</p>
        </Link>
      ))}
    </main>
  );
}

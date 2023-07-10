import Post from "@/components/Post";
import { getAllPosts, getPostByFileName } from "@/lib/post";
import Link from "next/link";

interface PostProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.fileName,
  }));
}

export default async function PostPage({ params: { slug } }: PostProps) {
  const post = await getPostByFileName(slug);

  return (
    <main>
      <nav className="my-4">
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
      </nav>
      <div className="my-4">
        <h1>{post.data.title}</h1>
        <p className="text-gray-300 text-sm">{post.data.description}</p>
        <p className="text-gray-300 text-xs">{post.data.date}</p>
      </div>
      <Post content={post.content} />
    </main>
  );
}
